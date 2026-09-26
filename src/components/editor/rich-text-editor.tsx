"use client";

import { useEffect, useRef, useState } from "react";
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
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const fonts = [
  { labelKey: "fontDefault", value: "" },
  { labelKey: "fontInter", value: "Inter, sans-serif" },
  { labelKey: "fontVazir", value: "Vazirmatn, sans-serif" },
  { labelKey: "fontSerif", value: "Georgia, serif" },
  { labelKey: "fontMono", value: "ui-monospace, monospace" },
] as const;

function ToolButton({
  editor,
  label,
  active,
  onClick,
}: {
  editor: Editor;
  label: string;
  active?: boolean;
  onClick: (editor: Editor) => void;
}) {
  return (
    <Button type="button" size="sm" variant={active ? "default" : "outline"} onClick={() => onClick(editor)}>
      {label}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const t = useTranslations("editor");
  const lastHtml = useRef(value);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder: t("placeholder") }),
    ],
    content: value,
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      lastHtml.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (lastHtml.current === value) return;
    editor.commands.setContent(value || "", false);
    lastHtml.current = value;
  }, [editor, value]);

  if (!editor) return <div className="min-h-48 rounded-md border bg-background" />;

  function applyLink() {
    if (!editor) return;
    if (!linkUrl.trim()) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
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
    <div className="rounded-md border bg-background">
      <div className="flex flex-wrap gap-1 border-b p-2">
        <ToolButton editor={editor} label={t("bold")} active={editor.isActive("bold")} onClick={(current) => current.chain().focus().toggleBold().run()} />
        <ToolButton editor={editor} label={t("italic")} active={editor.isActive("italic")} onClick={(current) => current.chain().focus().toggleItalic().run()} />
        <ToolButton editor={editor} label={t("underline")} active={editor.isActive("underline")} onClick={(current) => current.chain().focus().toggleUnderline().run()} />
        <ToolButton editor={editor} label={t("strike")} active={editor.isActive("strike")} onClick={(current) => current.chain().focus().toggleStrike().run()} />
        <ToolButton editor={editor} label={t("heading")} active={editor.isActive("heading", { level: 2 })} onClick={(current) => current.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolButton editor={editor} label={t("bulletList")} active={editor.isActive("bulletList")} onClick={(current) => current.chain().focus().toggleBulletList().run()} />
        <ToolButton editor={editor} label={t("orderedList")} active={editor.isActive("orderedList")} onClick={(current) => current.chain().focus().toggleOrderedList().run()} />
        <ToolButton editor={editor} label={t("quote")} active={editor.isActive("blockquote")} onClick={(current) => current.chain().focus().toggleBlockquote().run()} />
        <ToolButton editor={editor} label={t("code")} active={editor.isActive("code")} onClick={(current) => current.chain().focus().toggleCode().run()} />
        <ToolButton
          editor={editor}
          label={t("link")}
          active={editor.isActive("link")}
          onClick={(current) => {
            setLinkUrl(current.getAttributes("link").href ?? "");
            setLinkOpen(true);
          }}
        />
        <ToolButton editor={editor} label={t("image")} onClick={() => setImageOpen(true)} />
        <ToolButton editor={editor} label={t("alignLeft")} onClick={(current) => current.chain().focus().setTextAlign("left").run()} />
        <ToolButton editor={editor} label={t("alignCenter")} onClick={(current) => current.chain().focus().setTextAlign("center").run()} />
        <ToolButton editor={editor} label={t("alignRight")} onClick={(current) => current.chain().focus().setTextAlign("right").run()} />
        <ToolButton editor={editor} label={t("undo")} onClick={(current) => current.chain().focus().undo().run()} />
        <ToolButton editor={editor} label={t("redo")} onClick={(current) => current.chain().focus().redo().run()} />
        <label className="inline-flex items-center gap-1 rounded-md border px-2 text-xs">
          {t("color")}
          <input
            aria-label={t("color")}
            type="color"
            className="h-6 w-6 border-0 bg-transparent"
            onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
          />
        </label>
        <label className="inline-flex items-center gap-1 rounded-md border px-2 text-xs">
          {t("highlight")}
          <input
            aria-label={t("highlight")}
            type="color"
            className="h-6 w-6 border-0 bg-transparent"
            onChange={(event) => editor.chain().focus().setHighlight({ color: event.target.value }).run()}
          />
        </label>
        <label className="inline-flex items-center gap-1 text-xs">
          <span className="sr-only">{t("font")}</span>
          <select
            aria-label={t("font")}
            className="h-8 rounded-md border bg-background px-2"
            value={editor.getAttributes("textStyle").fontFamily ?? ""}
            onChange={(event) => {
              const family = event.target.value;
              if (!family) editor.chain().focus().unsetFontFamily().run();
              else editor.chain().focus().setFontFamily(family).run();
            }}
          >
            {fonts.map((font) => (
              <option key={font.labelKey} value={font.value}>
                {t(font.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <EditorContent editor={editor} className="prose min-h-48 max-w-none p-4" />
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
            <Input
              id="image-file"
              type="file"
              accept="image/*"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
