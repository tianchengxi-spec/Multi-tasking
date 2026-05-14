import React from 'react';
import { Play, LucideIcon } from 'lucide-react';

interface ScheduleWidgetProps {
  title?: string;
  subtitle?: string;
  icons?: LucideIcon[];
  onStartStudy?: () => void;
  accentColor?: string;
}

const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ 
  title = "英语六级", 
  subtitle = "距考试 25 天", 
  icons = [], 
  onStartStudy,
  accentColor = "#0873FF"
}) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center group hover:bg-white/60 transition-all duration-500 cursor-default w-full">
      {/* Main Content Area */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          {icons.map((Icon, idx) => (
            <div 
              key={idx}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white shadow-lg ${idx > 0 ? '-ml-4' : 'z-10'} ${
                idx === 0 ? 'bg-indigo-50 text-indigo-500' : 
                idx === 1 ? 'bg-amber-50 text-amber-500' : 
                'bg-emerald-50 text-emerald-500'
              }`}
              style={{ zIndex: icons.length - idx }}
            >
              <Icon size={18} />
            </div>
          ))}
          {icons.length === 0 && (
            <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-white shadow-lg">
              <Play size={18} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-slate-900 font-bold text-[15px] tracking-tight truncate">{title}</h3>
            <p className="text-slate-500 text-[11px] font-bold mt-0.5" style={{ color: title === '英语六级' ? '#e11d48' : undefined }}>{subtitle}</p>
          </div>
          <button 
            onClick={onStartStudy}
            className="shrink-0 flex items-center gap-2 text-white px-5 py-2.5 rounded-full shadow-lg transition-all hover:scale-[1.05] active:scale-95"
            style={{ backgroundColor: accentColor, boxShadow: `0 10px 15px -3px ${accentColor}33` }}
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
