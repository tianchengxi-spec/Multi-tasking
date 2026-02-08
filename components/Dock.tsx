
import React, { useState, useRef, useEffect } from 'react';
import { AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface DockProps {
  openApps: AppType[];
  onOpenApp: (type: AppType) => void;
  activeAppType: AppType | null;
  isVisible: boolean;
}

interface DragState {
  type: AppType;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isReturning: boolean;
}

const Dock: React.FC<DockProps> = ({ openApps, onOpenApp, activeAppType, isVisible }) => {
  const [draggingApp, setDraggingApp] = useState<DragState | null>(null);
  const [isLongPressed, setIsLongPressed] = useState(false);
  
  const longPressTimer = useRef<any>(null);
  const pointerIdRef = useRef<number | null>(null);

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

  useEffect(() => {
    const handleGlobalMove = (e: PointerEvent) => {
      if (draggingApp && isLongPressed && !draggingApp.isReturning) {
        setDraggingApp(prev => prev ? { 
          ...prev, 
          currentX: e.clientX, 
          currentY: e.clientY 
        } : null);
      }
    };

    const handleGlobalUp = (e: PointerEvent) => {
      if (draggingApp && isLongPressed) {
        setIsLongPressed(false);
        setDraggingApp(prev => prev ? { 
          ...prev, 
          currentX: prev.startX, 
          currentY: prev.startY, 
          isReturning: true 
        } : null);

        setTimeout(() => {
          setDraggingApp(null);
          pointerIdRef.current = null;
        }, 500);
      } else {
        clearTimer();
      }
    };

    if (isLongPressed) {
      window.addEventListener('pointermove', handleGlobalMove);
      window.addEventListener('pointerup', handleGlobalUp);
    }

    return () => {
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('pointerup', handleGlobalUp);
    };
  }, [isLongPressed, draggingApp]);

  const handlePointerDown = (e: React.PointerEvent, type: AppType) => {
    if (draggingApp?.isReturning) return;
    const x = e.clientX;
    const y = e.clientY;
    pointerIdRef.current = e.pointerId;

    longPressTimer.current = setTimeout(() => {
      setIsLongPressed(true);
      setDraggingApp({
        type,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        isReturning: false
      });
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 500);
  };

  const handlePointerUp = (e: React.PointerEvent, type: AppType) => {
    if (!isLongPressed && !draggingApp?.isReturning) {
      clearTimer();
      onOpenApp(type);
    }
  };

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const getDragStyle = (type: AppType): React.CSSProperties => {
    if (draggingApp?.type !== type) return {};

    const dx = draggingApp.currentX - draggingApp.startX;
    const dy = draggingApp.currentY - draggingApp.startY;
    const isReturning = draggingApp.isReturning;
    
    // Dynamic shadow based on app brand
    const shadowColor = type === AppType.XIAOHONGSHU ? 'rgba(255, 36, 66, 0.4)' : (type === AppType.ALIPAY ? 'rgba(0, 159, 232, 0.4)' : 'rgba(0, 0, 0, 0.4)');

    return {
      transform: `translate(${dx}px, ${dy}px) scale(${isReturning ? 1 : 1.25})`,
      zIndex: 9999,
      opacity: isReturning ? 1 : 0.98,
      transition: isLongPressed ? 'none' : 'transform 0.5s cubic-bezier(0.3, 1.5, 0.6, 1), opacity 0.3s ease',
      filter: isReturning ? 'none' : `drop-shadow(0 40px 60px ${shadowColor})`,
      pointerEvents: 'none',
      position: 'relative'
    };
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
          const isThisDragging = draggingApp?.type === type;

          return (
            <button
              key={type}
              onPointerDown={(e) => handlePointerDown(e, type)}
              onPointerUp={(e) => handlePointerUp(e, type)}
              onPointerLeave={() => !isLongPressed && clearTimer()}
              onPointerCancel={clearTimer}
              style={getDragStyle(type)}
              className={`relative group transition-all duration-300 touch-none select-none outline-none ${
                !isThisDragging ? 'hover:-translate-y-2 active:scale-90' : ''
              }`}
            >
              <div className={`${config.color} w-14 h-14 rounded-[1.25rem] shadow-sm border ${config.border} flex items-center justify-center transition-all duration-300 group-hover:shadow-xl overflow-hidden`}>
                {config.icon}
              </div>
              
              {isOpen && !isThisDragging && (
                <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600 w-4' : 'bg-slate-400'} transition-all duration-300`} />
              )}
              
              {!isThisDragging && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest backdrop-blur-md border border-white/10">
                  {type}
                </div>
              )}
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