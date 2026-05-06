
import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Home, Search, Lock } from 'lucide-react';
import { WindowState } from '../../types';

interface BrowserAppProps {
  state?: WindowState;
}

const BrowserApp: React.FC<BrowserAppProps> = ({ state }) => {
  const isSplit = state?.startsWith('split-') && state !== 'split-sidebar-left' && state !== 'split-sidebar-right';

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronLeft size={18} /></button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronRight size={18} /></button>
          {!isSplit && <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><RotateCcw size={18} /></button>}
        </div>
        
        {!isSplit && (
          <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-4 py-1.5 border border-slate-200">
            <Lock size={12} className="text-emerald-500 mr-2" />
            <span className="text-sm text-slate-600 truncate">https://nexus-research.org/papers/spatial-memory-multitasking-2026</span>
          </div>
        )}

        {isSplit && <div className="flex-1" />}

        <div className="flex gap-2">
           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Search size={18} /></button>
           {!isSplit && <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Home size={18} /></button>}
        </div>
      </div>

      {/* Web Content Area */}
      <div className="flex-1 overflow-auto bg-[#FDFDFD] m-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto py-16 px-12 md:px-20 font-serif text-slate-900 leading-relaxed">
          {/* Header */}
          <div className="mb-12 border-b border-slate-100 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
              Spatial Memory and Cognitive Load in High-Performance Multitasking Operating Systems
            </h1>
            <div className="flex flex-col gap-2 text-slate-500">
              <p className="text-lg font-medium text-slate-600">
                Dr. Alex Chen, Dr. Sarah Miller
              </p>
              <p className="text-sm italic">
                Nexus UI Research Group, Department of Human-Computer Interaction
              </p>
              <p className="text-xs uppercase tracking-widest mt-2 border-t border-slate-50 pt-3">
                Published May 2026 • Research Article No. 412
              </p>
            </div>
          </div>

          {/* Abstract */}
          <div className="mb-12 bg-slate-50/50 p-8 rounded-3xl border border-slate-100 italic">
            <h2 className="font-sans font-black text-xs uppercase tracking-[0.2em] mb-4 text-slate-400">Abstract</h2>
            <p className="text-slate-700">
              As modern operating systems evolve to support increasingly complex multitasking paradigms, the burden on user cognitive internal state management has intensified. This paper investigates the role of spatial memory in mitigating context-switching fatigue. Through a longitudinal study of 1,200 participants across diverse workflow environments, we demonstrate that persistent spatial positioning of interface artifacts reduces cognitive load by approximately 24%. Our findings suggest that current design trends favoring extreme minimalism and dynamic layout reflow may inadvertently impair productivity by disrupting established spatial mappings.
            </p>
          </div>

          {/* Introduction */}
          <div className="space-y-8">
            <section>
              <h2 className="font-sans font-bold text-xl mb-4 flex items-center gap-3">
                <span className="text-slate-300 font-mono text-sm leading-none">01.</span> Introduction
              </h2>
              <p className="mb-4">
                The evolution of the desktop metaphor has been characterized by a struggle between functional density and visual clarity. In the early era of computing, the "desktop" was a literal translation of physical space, where documents and windows maintained fixed coordinates. As screen resolutions and processing power increased, the paradigm shifted toward liquid, high-frequency layouts that prioritize immediate visibility over long-term spatial stability.
              </p>
              <p>
                However, recent psychological research suggests that the human visual cortex is highly optimized for spatial navigation. When a user interacts with a multitasking interface, they do not merely "read" the icons; they navigate a landscape. Disrupting this landscape through forced animations or unpredictable UI reflow triggers a "re-indexing" phase in the brain, which consumes significant neural resources and leads to measurable performance degradation over time.
              </p>
            </section>

            <section>
              <h2 className="font-sans font-bold text-xl mb-4 flex items-center gap-3">
                <span className="text-slate-300 font-mono text-sm leading-none">02.</span> Cognitive Load Theory
              </h2>
              <p className="mb-4">
                Cognitive load theory (CLT) provides a framework for understanding how information is processed and retained. In the context of OS design, we identify three types of load: intrinsic, extraneous, and germane. Extranous load—the effort spent navigating the interface rather than performing the task—is the primary target of our spatial optimization research.
              </p>
              <p>
                Our experiments utilize electroencephalography (EEG) to measure real-time neural engagement during window-dragging tasks. Preliminary results indicate a sharp spike in frontal lobe activity when windows move to unexpected locations, suggesting a "broken expectations" penalty that accumulates as the session duration increases.
              </p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-300 text-xs font-mono uppercase tracking-widest">End of Preview Fragment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
