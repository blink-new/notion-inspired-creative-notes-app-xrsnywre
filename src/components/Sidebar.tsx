
import React, { useState } from "react";
import { Folder, Plus, ChevronLeft } from "lucide-react";
import { FolderType } from "../App";
import clsx from "clsx";

interface SidebarProps {
  open: boolean;
  folders: FolderType[];
  selectedFolder: string;
  onSelectFolder: (id: string) => void;
  onAddFolder: (name: string) => void;
  onClose: () => void;
}

export function Sidebar({
  open,
  folders,
  selectedFolder,
  onSelectFolder,
  onAddFolder,
  onClose,
}: SidebarProps) {
  const [adding, setAdding] = useState(false);
  const [folderName, setFolderName] = useState("");

  function handleAdd() {
    if (folderName.trim()) {
      onAddFolder(folderName.trim());
      setFolderName("");
      setAdding(false);
    }
  }

  return (
    <aside
      className={clsx(
        "fixed md:static z-20 left-0 top-0 h-full w-64 bg-white shadow-lg border-r transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
      style={{ minWidth: 256 }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b bg-white/90">
        <span className="font-bold text-lg text-indigo-700 tracking-wide select-none">
          Folders
        </span>
        <button
          className="p-2 rounded hover:bg-gray-100 transition md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-2 py-4">
        {folders.map((folder) => (
          <button
            key={folder.id}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded text-left transition font-medium",
              selectedFolder === folder.id
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100 text-gray-700"
            )}
            onClick={() => onSelectFolder(folder.id)}
          >
            <Folder size={18} className="opacity-70" />
            {folder.name}
          </button>
        ))}
      </nav>
      <div className="px-4 py-3 border-t bg-white/80">
        {adding ? (
          <div className="flex gap-2">
            <input
              className="flex-1 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setAdding(false);
              }}
              autoFocus
            />
            <button
              className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition"
            onClick={() => setAdding(true)}
          >
            <Plus size={18} /> Add Folder
          </button>
        )}
      </div>
    </aside>
  );
}