
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading, List, ListOrdered } from "lucide-react";

const toolbarButton =
  "p-2 rounded-md hover:bg-indigo-100 transition-colors duration-150 flex items-center justify-center text-indigo-600";

export default function NoteEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
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

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line
  }, [content]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl p-6 mt-8">
      <div className="flex gap-2 mb-4 bg-white rounded-lg shadow-sm px-2 py-1">
        {actions.map((action, idx) => (
          <button
            key={action.label}
            className={`${toolbarButton} ${
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
      <EditorContent editor={editor} />
    </div>
  );
}