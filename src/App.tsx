
import React, { useState, useEffect } from "react";
import { Menu, Plus, Search, Folder, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { NoteEditor } from "./components/NoteEditor";
import { Sidebar } from "./components/Sidebar";
import { NotesList } from "./components/NotesList";
import "./index.css";

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface FolderType {
  id: string;
  name: string;
}

const DEFAULT_FOLDERS: FolderType[] = [
  { id: "all", name: "All Notes" },
  { id: "ideas", name: "Ideas" },
  { id: "work", name: "Work" },
  { id: "personal", name: "Personal" },
];

function getInitialNotes(): Note[] {
  const saved = localStorage.getItem("notes");
  if (saved) return JSON.parse(saved);
  return [];
}

function getInitialFolders(): FolderType[] {
  const saved = localStorage.getItem("folders");
  if (saved) return JSON.parse(saved);
  return DEFAULT_FOLDERS;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>(getInitialNotes());
  const [folders, setFolders] = useState<FolderType[]>(getInitialFolders());
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  const filteredNotes = notes
    .filter((n) =>
      selectedFolder === "all" ? true : n.folder === selectedFolder
    )
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  function handleCreateNote() {
    const id = Date.now().toString();
    const newNote: Note = {
      id,
      title: "Untitled",
      content: "",
      folder: selectedFolder === "all" ? null : selectedFolder,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(id);
  }

  function handleUpdateNote(updated: Note) {
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? { ...updated, updatedAt: Date.now() } : n))
    );
  }

  function handleDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  }

  function handleSelectNote(id: string) {
    setSelectedNoteId(id);
  }

  function handleAddFolder(name: string) {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setFolders([...folders, { id, name }]);
  }

  function handleSelectFolder(id: string) {
    setSelectedFolder(id);
    setSelectedNoteId(null);
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] font-sans">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={handleSelectFolder}
        onAddFolder={handleAddFolder}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={sidebarOpen ? "flex-1 ml-0 md:ml-64 transition-all" : "flex-1"}>
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                className="p-2 rounded hover:bg-gray-100 transition"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 select-none">
              Creative Notes
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
              <input
                className="pl-8 pr-3 py-2 rounded bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition w-48"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition flex items-center gap-1"
              onClick={handleCreateNote}
            >
              <Plus size={18} /> New Note
            </button>
          </div>
        </header>
        <main className="flex flex-col md:flex-row h-[calc(100vh-72px)]">
          {/* Notes List */}
          <div className="w-full md:w-1/3 xl:w-1/4 border-r bg-white/70 overflow-y-auto transition-all">
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
          {/* Note Editor */}
          <div className="flex-1 bg-white/90 p-6 overflow-y-auto transition-all">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onChange={handleUpdateNote}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
                <FileText size={48} />
                <p className="mt-4 text-lg">Select or create a note to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}