
import React from 'react';
import { AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface DockProps {
  openApps: AppType[];
  onOpenApp: (type: AppType) => void;
  activeAppType: AppType | null;
  isVisible: boolean;
}

const Dock: React.FC<DockProps> = ({ openApps, onOpenApp, activeAppType, isVisible }) => {
  const allApps = [
    AppType.NOTES,
    AppType.BROWSER,
    AppType.FILES,
    AppType.AI_ASSISTANT,
    AppType.CALENDAR,
    AppType.BILIBILI,
    AppType.SETTINGS
  ];

  return (
    <div 
      className={`h-20 shrink-0 flex items-center justify-center pointer-events-none pb-4 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-2.5 flex items-end gap-2.5 pointer-events-auto transition-transform active:scale-95">
        {allApps.map((type) => {
          const config = APP_CONFIG[type];
          const isActive = activeAppType === type;
          const isOpen = openApps.includes(type);

          return (
            <button
              key={type}
              onClick={() => onOpenApp(type)}
              className="relative group transition-all duration-300 transform hover:-translate-y-2 active:scale-90"
            >
              <div className={`${config.color} p-3 rounded-2xl shadow-sm border ${config.border} flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-200`}>
                {config.icon}
              </div>
              
              {/* Active Indicator */}
              {isOpen && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600 w-4 rounded-full' : 'bg-slate-400'} transition-all`} />
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
                {type}
              </div>
            </button>
          );
        })}
        
        <div className="w-[1px] h-8 bg-slate-200/50 mx-1 self-center" />
        
        {/* Placeholder for recent/suggested apps */}
        <div className="flex gap-2.5">
           <div className="w-12 h-12 bg-slate-100/50 border border-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Dock;
