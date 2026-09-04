"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { useEffect } from "react";

export function ProjectEditor({ name = "content", initial = "" }: { name?: string; initial?: string }) {
  const editor = useEditor({ extensions: [StarterKit, TextStyle, Color, Image, Link.configure({ openOnClick: false })], content: initial, immediatelyRender: false });
  useEffect(() => { if (!editor) return; const form = editor.view.dom.closest("form"); const sync = () => { const input = form?.querySelector(`input[name="${name}"]`) as HTMLInputElement | null; if (input) input.value = editor.getHTML(); }; editor.on("update", sync); sync(); return () => { editor.off("update", sync); }; }, [editor, name]);
  if (!editor) return <div className="min-h-48 rounded-lg border p-3" />;
  const promptLink = () => { const url = window.prompt("URL"); if (url) editor.chain().focus().setLink({ href: url }).run(); };
  const promptImage = () => { const url = window.prompt("Image URL"); if (url) editor.chain().focus().setImage({ src: url }).run(); };
  return <div className="rounded-lg border bg-white"><div className="flex flex-wrap gap-1 border-b p-2 text-sm"><button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded border px-2">B</button><button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded border px-2 italic">I</button><button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded border px-2">• List</button><button type="button" onClick={promptLink} className="rounded border px-2">Link</button><button type="button" onClick={promptImage} className="rounded border px-2">Image</button><label className="rounded border px-2">Color <input aria-label="Text color" type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} /></label></div><EditorContent editor={editor} className="prose min-h-48 max-w-none p-4 focus:outline-none" /><input type="hidden" name={name} defaultValue={initial} /></div>;
}
