
import React, { useState, useRef, useEffect } from 'react';
import { AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface DockProps {
  openApps: AppType[];
  onOpenApp: (type: AppType) => void;
  activeAppType: AppType | null;
  isVisible: boolean;
  onDragStart?: (type: AppType, x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
}

const Dock: React.FC<DockProps> = ({ 
  openApps, 
  onOpenApp, 
  activeAppType, 
  isVisible,
  onDragStart,
  onDragMove,
  onDragEnd
}) => {
  const [activePress, setActivePress] = useState<AppType | null>(null);
  const longPressTimer = useRef<any>(null);

  const allApps = [
    AppType.NOTES,
    AppType.BROWSER,
    AppType.FILES,
    AppType.AI_ASSISTANT,
    AppType.CALENDAR,
    AppType.BILIBILI,
    AppType.ALIPAY,
    AppType.SETTINGS
  ];

  const handlePointerDown = (e: React.PointerEvent, type: AppType) => {
    const x = e.clientX;
    const y = e.clientY;

    setActivePress(type);
    longPressTimer.current = setTimeout(() => {
      if (onDragStart) {
        onDragStart(type, x, y);
        if (window.navigator.vibrate) window.navigator.vibrate(50);
      }
      setActivePress(null);
    }, 500);
  };

  const handlePointerUp = (e: React.PointerEvent, type: AppType) => {
    if (activePress === type) {
      clearTimer();
      onOpenApp(type);
    }
    setActivePress(null);
  };

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div 
      className={`h-24 shrink-0 flex items-center justify-center pointer-events-none pb-6 transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0'
      }`}
    >
      <div className="bg-white/70 backdrop-blur-3xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-3 flex items-end gap-3 pointer-events-auto">
        {allApps.map((type) => {
          const config = APP_CONFIG[type];
          const isActive = activeAppType === type;
          const isOpen = openApps.includes(type);

          return (
            <button
              key={type}
              onPointerDown={(e) => handlePointerDown(e, type)}
              onPointerUp={(e) => handlePointerUp(e, type)}
              onPointerLeave={() => {
                if (activePress === type) {
                  clearTimer();
                  setActivePress(null);
                }
              }}
              className={`relative group transition-all duration-300 touch-none select-none outline-none hover:-translate-y-2 active:scale-90`}
            >
              <div className={`${config.color} w-14 h-14 rounded-[1.25rem] shadow-sm border ${config.border} flex items-center justify-center transition-all duration-300 group-hover:shadow-xl overflow-hidden`}>
                {config.icon}
              </div>
              
              {isOpen && (
                <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600 w-4' : 'bg-slate-400'} transition-all duration-300`} />
              )}
              
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest backdrop-blur-md border border-white/10">
                {type}
              </div>
            </button>
          );
        })}
        
        <div className="w-[1px] h-10 bg-slate-300/40 mx-1 self-center" />
        
        <div className="flex items-center justify-center w-14 h-14 bg-slate-200/30 border border-slate-200/50 rounded-[1.25rem] group transition-colors">
           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse mx-0.5" />
           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s] mx-0.5" />
           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s] mx-0.5" />
        </div>
      </div>
    </div>
  );
};

export default Dock;
