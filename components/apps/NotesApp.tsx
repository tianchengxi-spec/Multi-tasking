
import React, { useState } from 'react';
import { Plus, Search, Tag, MoreVertical } from 'lucide-react';

const NotesApp: React.FC = () => {
  const [notes] = useState([
    { id: '1', title: 'Interaction Design Thesis', preview: 'Focus on multi-modal feedback loops in tablet environments...', date: '2m ago' },
    { id: '2', title: 'Shopping List', preview: 'Apples, Milk, Bread, New Stylus, Paperwhite display...', date: '1h ago' },
    { id: '3', title: 'Meeting Notes: Nexus OS', preview: 'The multi-tasking experience should feel fluid and frictionless...', date: 'Yesterday' },
  ]);

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">My Notes</h2>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="p-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full bg-slate-100 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            {notes.map(note => (
              <div key={note.id} className="p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm text-slate-800 truncate">{note.title}</h3>
                  <span className="text-[10px] text-slate-400 shrink-0">{note.date}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{note.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Editor Placeholder */}
      <div className="flex-1 flex flex-col p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">Research</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">Thesis</span>
          </div>
          <MoreVertical className="text-slate-400 cursor-pointer" size={18} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-6">Interaction Design Thesis</h1>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>This research explores the intersection of <strong>haptic feedback</strong> and <strong>gestural multi-tasking</strong> on large-format tablets.</p>
          <p>Current limitations in iPadOS and Android tablets often stem from a "phone-first" legacy. Nexus OS aims to break this by treating the screen as a fluid canvas where apps can be rearranged and resized based on user flow rather than strict grids.</p>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm border-l-4 border-l-blue-400">
            "The screen is not a container, it is a workspace." - Prototype Principle #1
          </div>
          <p>Key observations from the initial user study (n=12):</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users prefer horizontal split over vertical for research.</li>
            <li>Drag-and-drop between apps is the most requested feature.</li>
            <li>Visual depth (shadows, layers) helps reduce cognitive load.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
