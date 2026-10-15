"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code,
  Highlighter,
  ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  TextQuote,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FontSize, LineHeight, ParagraphIndent } from "~/components/editor/extensions";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/utils/cn";

const fonts = [
  { labelKey: "fontDefault", value: "" },
  { labelKey: "fontInter", value: "var(--font-inter), sans-serif" },
  { labelKey: "fontVazir", value: "var(--font-vazir), sans-serif" },
  { labelKey: "fontArial", value: "Arial, Helvetica, sans-serif" },
  { labelKey: "fontTimes", value: "\"Times New Roman\", Times, serif" },
  { labelKey: "fontSerif", value: "Georgia, serif" },
  { labelKey: "fontMono", value: "ui-monospace, monospace" },
] as const;

const fontSizes = ["10px", "11px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"];

const textColors = ["#111827", "#1d4ed8", "#b91c1c", "#15803d", "#a16207", "#7c3aed", "#0f766e"];
const highlightColors = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#fbcfe8", "#e5e7eb"];

const lineHeights = [
  { labelKey: "lineDefault", value: "" },
  { labelKey: "lineSingle", value: "1" },
  { labelKey: "line115", value: "1.15" },
  { labelKey: "line15", value: "1.5" },
  { labelKey: "lineDouble", value: "2" },
] as const;

function keepSelection(event: React.MouseEvent) {
  event.preventDefault();
}

function IconButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? "default" : "ghost"}
      className="h-8 w-8"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={keepSelection}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function RibbonDivider() {
  return <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden />;
}

function activeStyle(editor: Editor) {
  if (editor.isActive("heading", { level: 1 })) return "h1";
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  return "p";
}

function applyStyle(editor: Editor, style: string) {
  const chain = editor.chain().focus();
  if (style === "h1") chain.setHeading({ level: 1 }).run();
  else if (style === "h2") chain.setHeading({ level: 2 }).run();
  else if (style === "h3") chain.setHeading({ level: 3 }).run();
  else chain.setParagraph().run();
}

function indent(editor: Editor) {
  if (editor.isActive("taskItem")) {
    editor.chain().focus().sinkListItem("taskItem").run();
    return;
  }
  if (editor.isActive("listItem")) {
    editor.chain().focus().sinkListItem("listItem").run();
    return;
  }
  editor.chain().focus().increaseIndent().run();
}

function outdent(editor: Editor) {
  if (editor.isActive("taskItem")) {
    editor.chain().focus().liftListItem("taskItem").run();
    return;
  }
  if (editor.isActive("listItem")) {
    editor.chain().focus().liftListItem("listItem").run();
    return;
  }
  editor.chain().focus().decreaseIndent().run();
}

function ColorMenu({
  label,
  swatches,
  onPick,
  onClear,
  children,
}: {
  label: string;
  swatches: string[];
  onPick: (color: string) => void;
  onClear: () => void;
  children: ReactNode;
}) {
  const t = useTranslations("editor");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  return (
    <div className="relative" ref={root}>
      <IconButton label={label} active={open} onClick={() => setOpen((current) => !current)}>
        {children}
      </IconButton>
      {open ? (
        <div className="absolute start-0 top-9 z-20 w-44 rounded-md border bg-background p-2 shadow-md">
          <div className="grid grid-cols-7 gap-1">
            {swatches.map((color) => (
              <button
                key={color}
                type="button"
                className="h-5 w-5 rounded-sm border"
                style={{ backgroundColor: color }}
                aria-label={color}
                onMouseDown={keepSelection}
                onClick={() => {
                  onPick(color);
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <label className="mt-2 flex items-center justify-between gap-2 text-xs">
            {t("customColor")}
            <input
              aria-label={t("customColor")}
              type="color"
              className="h-6 w-8 border-0 bg-transparent"
              onChange={(event) => onPick(event.target.value)}
            />
          </label>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-1 w-full"
            onMouseDown={keepSelection}
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            {t("remove")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  dir = "ltr",
  placeholder,
  compact = false,
}: {
  value: string;
  onChange: (html: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  compact?: boolean;
}) {
  const t = useTranslations("editor");
  const lastHtml = useRef(value);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [direction, setDirection] = useState<"ltr" | "rtl">(dir);
  const prompt = placeholder ?? t("placeholder");

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LineHeight,
      ParagraphIndent,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: prompt }),
    ],
    content: value,
    editorProps: {
      attributes: {
        dir,
        class: "prose max-w-none",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      lastHtml.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    setDirection(dir);
  }, [dir]);

  useEffect(() => {
    editor?.view.dom.setAttribute("dir", direction);
  }, [editor, direction]);

  useEffect(() => {
    if (!editor) return;
    if (lastHtml.current === value) return;
    editor.commands.setContent(value || "", false);
    lastHtml.current = value;
  }, [editor, value]);

  if (!editor) {
    return <div className={cn("word-editor rounded-md border bg-muted/40", compact ? "min-h-40" : "min-h-72")} />;
  }

  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const fontFamily = String(editor.getAttributes("textStyle").fontFamily ?? "");
  const fontSize = String(editor.getAttributes("textStyle").fontSize ?? "");
  const lineHeight = String(
    editor.getAttributes("paragraph").lineHeight || editor.getAttributes("heading").lineHeight || "",
  );

  function applyLink() {
    if (!linkUrl.trim()) editor?.chain().focus().unsetLink().run();
    else editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    setLinkOpen(false);
  }

  function applyImage() {
    if (!editor || !imageUrl.trim()) return;
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    setImageUrl("");
    setImageOpen(false);
  }

  function onFile(file: File | undefined) {
    if (!editor || !file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result ?? "");
      if (src) editor.chain().focus().setImage({ src }).run();
      setImageOpen(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="word-editor overflow-hidden rounded-md border bg-muted/40 shadow-sm" data-compact={compact ? "" : undefined}>
      <div className="space-y-1 border-b bg-background px-2 py-2">
        <div className="flex flex-wrap items-center gap-0.5">
          <IconButton label={t("undo")} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("redo")} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </IconButton>
          <RibbonDivider />
          <Select value={activeStyle(editor)} onValueChange={(style) => applyStyle(editor, style)}>
            <SelectTrigger aria-label={t("style")} className="h-8 w-32 px-2 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">{t("styleParagraph")}</SelectItem>
              <SelectItem value="h1">{t("styleHeading1")}</SelectItem>
              <SelectItem value="h2">{t("styleHeading2")}</SelectItem>
              <SelectItem value="h3">{t("styleHeading3")}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={fontFamily || "default"}
            onValueChange={(family) => {
              if (family === "default") editor.chain().focus().unsetFontFamily().run();
              else editor.chain().focus().setFontFamily(family).run();
            }}
          >
            <SelectTrigger aria-label={t("font")} className="h-8 w-36 px-2 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font.labelKey} value={font.value || "default"}>
                  {t(font.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={fontSize || "default"}
            onValueChange={(size) => {
              if (size === "default") editor.chain().focus().unsetFontSize().run();
              else editor.chain().focus().setFontSize(size).run();
            }}
          >
            <SelectTrigger aria-label={t("fontSize")} className="h-8 w-20 px-2 text-xs">
              <SelectValue placeholder={t("fontSize")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t("fontDefault")}</SelectItem>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size.replace("px", "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <RibbonDivider />
          <IconButton label={t("bold")} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("italic")} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("underline")}
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("strike")} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("subscript")}
            active={editor.isActive("subscript")}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <SubscriptIcon className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("superscript")}
            active={editor.isActive("superscript")}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <SuperscriptIcon className="h-4 w-4" />
          </IconButton>
          <ColorMenu
            label={t("color")}
            swatches={textColors}
            onPick={(color) => editor.chain().focus().setColor(color).run()}
            onClear={() => editor.chain().focus().unsetColor().run()}
          >
            <Baseline className="h-4 w-4" />
          </ColorMenu>
          <ColorMenu
            label={t("highlight")}
            swatches={highlightColors}
            onPick={(color) => editor.chain().focus().setHighlight({ color }).run()}
            onClear={() => editor.chain().focus().unsetHighlight().run()}
          >
            <Highlighter className="h-4 w-4" />
          </ColorMenu>
          <IconButton
            label={t("clear")}
            onClick={() => editor.chain().focus().unsetAllMarks().unsetFontSize().clearNodes().run()}
          >
            <RemoveFormatting className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="flex flex-wrap items-center gap-0.5">
          <IconButton
            label={t("alignLeft")}
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("alignCenter")}
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("alignRight")}
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("alignJustify")}
            active={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify className="h-4 w-4" />
          </IconButton>
          <RibbonDivider />
          <IconButton
            label={t("bulletList")}
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("orderedList")}
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("taskList")}
            active={editor.isActive("taskList")}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListChecks className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("outdent")} onClick={() => outdent(editor)}>
            {direction === "rtl" ? <IndentIncrease className="h-4 w-4" /> : <IndentDecrease className="h-4 w-4" />}
          </IconButton>
          <IconButton label={t("indent")} onClick={() => indent(editor)}>
            {direction === "rtl" ? <IndentDecrease className="h-4 w-4" /> : <IndentIncrease className="h-4 w-4" />}
          </IconButton>
          <Select
            value={lineHeight || "default"}
            onValueChange={(next) => {
              if (next === "default") editor.chain().focus().unsetLineHeight().run();
              else editor.chain().focus().setLineHeight(next).run();
            }}
          >
            <SelectTrigger aria-label={t("lineHeight")} className="h-8 w-28 px-2 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineHeights.map((item) => (
                <SelectItem key={item.labelKey} value={item.value || "default"}>
                  {t(item.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <RibbonDivider />
          <IconButton
            label={t("quote")}
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <TextQuote className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("code")} active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("codeBlock")}
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <SquareCode className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("link")}
            active={editor.isActive("link")}
            onClick={() => {
              setLinkUrl(editor.getAttributes("link").href ?? "");
              setLinkOpen(true);
            }}
          >
            <Link2 className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("image")} onClick={() => setImageOpen(true)}>
            <ImageIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label={t("rule")} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={t("table")}
            active={editor.isActive("table")}
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <TableIcon className="h-4 w-4" />
          </IconButton>
          <RibbonDivider />
          <Button
            type="button"
            size="sm"
            variant={direction === "ltr" ? "default" : "outline"}
            onMouseDown={keepSelection}
            onClick={() => setDirection("ltr")}
          >
            {t("ltr")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={direction === "rtl" ? "default" : "outline"}
            onMouseDown={keepSelection}
            onClick={() => setDirection("rtl")}
          >
            {t("rtl")}
          </Button>
        </div>
        {editor.isActive("table") ? (
          <div className="flex flex-wrap items-center gap-1 border-t pt-1">
            <Button type="button" size="sm" variant="outline" onMouseDown={keepSelection} onClick={() => editor.chain().focus().addRowAfter().run()}>
              {t("addRow")}
            </Button>
            <Button type="button" size="sm" variant="outline" onMouseDown={keepSelection} onClick={() => editor.chain().focus().addColumnAfter().run()}>
              {t("addColumn")}
            </Button>
            <Button type="button" size="sm" variant="outline" onMouseDown={keepSelection} onClick={() => editor.chain().focus().deleteRow().run()}>
              {t("deleteRow")}
            </Button>
            <Button type="button" size="sm" variant="outline" onMouseDown={keepSelection} onClick={() => editor.chain().focus().deleteColumn().run()}>
              {t("deleteColumn")}
            </Button>
            <Button type="button" size="sm" variant="outline" onMouseDown={keepSelection} onClick={() => editor.chain().focus().deleteTable().run()}>
              {t("deleteTable")}
            </Button>
          </div>
        ) : null}
      </div>
      <div className={cn("overflow-auto px-3 py-4", compact ? "max-h-80" : "max-h-[36rem]")}>
        <div className={cn("mx-auto bg-background shadow-md", direction === "rtl" ? "font-vazir" : "font-inter")}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-background px-3 py-1 text-xs text-muted-foreground">
        <span>{t("wordCount", { count: words })}</span>
        <span>{t("characterCount", { count: text.length })}</span>
      </div>
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("link")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="link-url">{t("url")}</Label>
            <Input id="link-url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} />
            <div className="flex gap-2">
              <Button type="button" onClick={applyLink}>
                {t("apply")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setLinkOpen(false);
                }}
              >
                {t("remove")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("image")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="image-url">{t("url")}</Label>
            <Input id="image-url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
            <Button type="button" onClick={applyImage}>
              {t("apply")}
            </Button>
            <Label htmlFor="image-file">{t("upload")}</Label>
            <Input id="image-file" type="file" accept="image/*" onChange={(event) => onFile(event.target.files?.[0])} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
