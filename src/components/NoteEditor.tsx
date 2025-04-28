
import React, { useEffect, useRef, useState } from "react";
import { Note } from "../App";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading, List, ListOrdered, Save } from "lucide-react";
import clsx from "clsx";

interface NoteEditorProps {
  note: Note;
  onChange: (note: Note) => void;
}

export function NoteEditor({ note, onChange }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    onUpdate: ({ editor }) => {
      onChange({ ...note, content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[300px] outline-none px-0 py-2 text-gray-800 bg-transparent",
      },
    },
  });

  // Update editor content if note changes
  useEffect(() => {
    setTitle(note.title);
    if (editor && editor.getHTML() !== note.content) {
      editor.commands.setContent(note.content || "");
    }
    // eslint-disable-next-line
  }, [note.id]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    onChange({ ...note, title: e.target.value });
  }

  // Formatting actions
  function format(action: string) {
    if (!editor) return;
    switch (action) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "heading":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      default:
        break;
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <input
        className="w-full text-2xl font-bold mb-2 px-2 py-1 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        value={title}
        onChange={handleTitleChange}
        placeholder="Title"
        maxLength={80}
      />
      <div className="flex items-center gap-2 mb-3">
        <button
          className={clsx(
            "p-2 rounded hover:bg-indigo-100 transition",
            editor?.isActive("bold") && "bg-indigo-200"
          )}
          onClick={() => format("bold")}
          type="button"
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          className={clsx(
            "p-2 rounded hover:bg-indigo-100 transition",
            editor?.isActive("italic") && "bg-indigo-200"
          )}
          onClick={() => format("italic")}
          type="button"
          aria-label="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          className={clsx(
            "p-2 rounded hover:bg-indigo-100 transition",
            editor?.isActive("heading", { level: 2 }) && "bg-indigo-200"
          )}
          onClick={() => format("heading")}
          type="button"
          aria-label="Heading"
        >
          <Heading size={18} />
        </button>
        <button
          className={clsx(
            "p-2 rounded hover:bg-indigo-100 transition",
            editor?.isActive("bulletList") && "bg-indigo-200"
          )}
          onClick={() => format("bulletList")}
          type="button"
          aria-label="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          className={clsx(
            "p-2 rounded hover:bg-indigo-100 transition",
            editor?.isActive("orderedList") && "bg-indigo-200"
          )}
          onClick={() => format("orderedList")}
          type="button"
          aria-label="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      <div className="rounded border bg-white shadow-sm px-3 py-2 min-h-[300px] transition">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}