
import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Home, Search, Lock } from 'lucide-react';

const BrowserApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronLeft size={18} /></button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronRight size={18} /></button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><RotateCcw size={18} /></button>
        </div>
        <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-4 py-1.5 border border-slate-200">
          <Lock size={12} className="text-emerald-500 mr-2" />
          <span className="text-sm text-slate-600 truncate">https://nexus-design.io/research/multitasking</span>
        </div>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Search size={18} /></button>
           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Home size={18} /></button>
        </div>
      </div>

      {/* Web Content Placeholder */}
      <div className="flex-1 overflow-auto bg-white m-4 rounded-2xl border border-slate-200 shadow-sm p-12">
        <div className="max-w-3xl mx-auto">
          <div className="h-12 w-48 bg-slate-100 rounded-lg mb-8"></div>
          <div className="space-y-6">
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-4/5 bg-slate-50 rounded"></div>
            
            <div className="grid grid-cols-2 gap-8 my-12">
              <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">Image Placeholder</div>
              <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">Video Placeholder</div>
            </div>
            
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
