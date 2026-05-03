import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const ScheduleWidget: React.FC = () => {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:bg-white/60 transition-all duration-500 cursor-default">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
          <Clock className="text-white" size={28} />
        </div>
        <div>
          <h3 className="text-slate-900 font-bold text-lg tracking-tight">下一节课：设计心理学</h3>
          <div className="flex items-center gap-3 mt-1.5 text-slate-500 text-sm font-medium">
            <span className="flex items-center gap-1">
              <Clock size={14} className="opacity-60" />
              下午 14:00
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="flex items-center gap-1">
              <MapPin size={14} className="opacity-60" />
              教四-302
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-rose-600 font-black text-xl tabular-nums tracking-tighter">2h 15m</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">距上课时间</p>
      </div>
    </div>
  );
};

export default ScheduleWidget;
