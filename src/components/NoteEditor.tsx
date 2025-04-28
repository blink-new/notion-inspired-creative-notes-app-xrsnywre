
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading, List, ListOrdered } from "lucide-react";
import { Note } from "../App";

interface NoteEditorProps {
  note: Note;
  onChange: (updated: Note) => void;
}

export default function NoteEditor({ note, onChange }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    onUpdate: ({ editor }) => {
      onChange({
        ...note,
        content: editor.getHTML(),
      });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-indigo max-w-none min-h-[300px] bg-white rounded-lg p-4 shadow-inner focus:outline-none transition-all duration-200",
      },
    },
  });

  // Toolbar actions
  const actions = [
    {
      icon: <Bold size={18} />,
      label: "Bold",
      onClick: () => editor?.chain().focus().toggleBold().run(),
      isActive: () => editor?.isActive("bold"),
    },
    {
      icon: <Italic size={18} />,
      label: "Italic",
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      isActive: () => editor?.isActive("italic"),
    },
    {
      icon: <Heading size={18} />,
      label: "Heading",
      onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor?.isActive("heading", { level: 2 }),
    },
    {
      icon: <List size={18} />,
      label: "Bullet List",
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: () => editor?.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={18} />,
      label: "Ordered List",
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: () => editor?.isActive("orderedList"),
    },
  ];

  // Keep title in sync with note prop
  useEffect(() => {
    setTitle(note.title);
    // eslint-disable-next-line
  }, [note.id]);

  // Keep editor content in sync with note prop
  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content);
    }
    // eslint-disable-next-line
  }, [note.id, note.content]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    onChange({
      ...note,
      title: e.target.value,
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl p-8 mt-8 border border-indigo-100">
      <input
        className="w-full text-3xl font-bold bg-transparent outline-none border-b-2 border-indigo-100 focus:border-indigo-400 transition mb-6 px-2 py-2 placeholder-gray-400"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled"
        maxLength={100}
        spellCheck={true}
        autoFocus
      />
      <div className="flex gap-2 mb-6 bg-white rounded-lg shadow px-3 py-2 border border-indigo-100">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`p-2 rounded-md hover:bg-indigo-100 transition-colors duration-150 flex items-center justify-center text-indigo-600 ${
              action.isActive?.() ? "bg-indigo-200 text-indigo-800" : ""
            }`}
            onClick={action.onClick}
            aria-label={action.label}
            type="button"
            tabIndex={0}
          >
            {action.icon}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-inner border border-indigo-50 transition-all duration-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}