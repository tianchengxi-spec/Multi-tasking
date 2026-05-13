import React from 'react';
import { Target, Cloud, FileText, Play } from 'lucide-react';

interface ScheduleWidgetProps {
  onStartStudy?: () => void;
}

const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ onStartStudy }) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center group hover:bg-white/60 transition-all duration-500 cursor-default max-w-[340px]">
      {/* Main Content Area */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          <div className="w-9 h-9 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center border border-white shadow-lg shadow-indigo-200 z-10">
            <Cloud size={18} />
          </div>
          <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-white shadow-lg shadow-amber-200 -ml-4 z-0">
            <FileText size={18} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-[15px] tracking-tight truncate">英语六级</h3>
            <p className="text-rose-600 text-[11px] font-bold mt-0.5">距考试 25 天</p>
          </div>
          <button 
            onClick={onStartStudy}
            className="shrink-0 flex items-center gap-2 bg-[#0873FF] hover:bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.05] active:scale-95"
          >
            <Play size={10} fill="currentColor" />
            <span className="text-[12px] font-black uppercase tracking-wide">开始学习</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleWidget;
