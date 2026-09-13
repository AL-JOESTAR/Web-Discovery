"use client";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

type Props = {
  initialContent?: string;
  onChangeHtml: (html: string) => void;
  onChangeJson: (json: string) => void;
};

export function RichTextEditor({
  initialContent,
  onChangeHtml,
  onChangeJson,
}: Props) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [htmlSource, setHtmlSource] = useState(initialContent || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExt.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-stone min-h-[300px] max-w-none focus:outline-none p-4",
      },
    },
    onUpdate({ editor }) {
      onChangeHtml(editor.getHTML());
      onChangeJson(JSON.stringify(editor.getJSON()));
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const ed = editor;

  function toggleMode() {
    if (mode === "visual") {
      setHtmlSource(ed.getHTML() || "");
      setMode("html");
    } else {
      ed.commands.setContent(htmlSource || "");
      setMode("visual");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-300 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-stone-50 px-3 py-2">
        {mode === "visual" && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="Bold"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="Italic"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="Underline"
            >
              <span className="underline">U</span>
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-stone-300" />
            {[1, 2, 3].map((level) => (
              <ToolbarButton
                key={level}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 })
                    .run()
                }
                active={editor.isActive("heading", { level })}
                title={`Heading ${level}`}
              >
                H{level}
              </ToolbarButton>
            ))}
            <div className="mx-1 h-5 w-px bg-stone-300" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet List"
            >
              •
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Ordered List"
            >
              1.
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="Quote"
            >
              &ldquo;
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
              title="Code Block"
            >
              &lt;/&gt;
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-stone-300" />
            <ToolbarButton
              onClick={() => {
                const url = window.prompt("URL:");
                if (url)
                  editor
                    .chain()
                    .focus()
                    .setLink({ href: url })
                    .run();
              }}
              active={editor.isActive("link")}
              title="Link"
            >
              🔗
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const url = window.prompt("URL gambar:");
                if (url)
                  editor.chain().focus().setImage({ src: url }).run();
              }}
              title="Image"
            >
              🖼
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-stone-300" />
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              ―
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHardBreak().run()}
              title="Hard Break"
            >
              ↵
            </ToolbarButton>
          </>
        )}
        <div className="ml-auto">
          <ToolbarButton
            onClick={toggleMode}
            active={mode === "html"}
            title="HTML Source Mode"
          >
            <span className="font-mono text-xs">{`< >`}</span>
          </ToolbarButton>
        </div>
      </div>
      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={htmlSource}
          onChange={(e) => {
            setHtmlSource(e.target.value);
            onChangeHtml(e.target.value);
          }}
          spellCheck={false}
          className="block w-full min-h-[300px] resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-stone-800 focus:outline-none"
          placeholder="<h2>Judul</h2><p>Konten paragraf...</p>"
        />
      )}
    </div>
  );
}

function ToolbarButton({
  onClick,
  active = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded text-sm transition-colors ${
        active
          ? "bg-accent/10 text-accent"
          : "text-stone-500 hover:bg-stone-200 hover:text-stone-800"
      }`}
    >
      {children}
    </button>
  );
}