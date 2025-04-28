
import React from "react";
import { Note } from "../App";
import { Trash2, FileText } from "lucide-react";
import clsx from "clsx";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 select-none py-12">
        <FileText size={40} />
        <p className="mt-2">No notes yet</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {notes.map((note) => (
        <li
          key={note.id}
          className={clsx(
            "group flex items-center justify-between px-5 py-4 cursor-pointer transition bg-white hover:bg-indigo-50",
            selectedNoteId === note.id && "bg-indigo-100"
          )}
          onClick={() => onSelectNote(note.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 truncate">
              {note.title || "Untitled"}
            </div>
            <div className="text-xs text-gray-500 truncate mt-1">
              {note.content.replace(/<[^>]+>/g, "").slice(0, 60) || "No content"}
            </div>
          </div>
          <button
            className="ml-3 p-2 rounded hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
            aria-label="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}