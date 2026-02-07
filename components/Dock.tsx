
import React, { useState, useRef } from 'react';
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
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const allApps = [
    AppType.NOTES,
    AppType.BROWSER,
    AppType.FILES,
    AppType.AI_ASSISTANT,
    AppType.CALENDAR,
    AppType.BILIBILI,
    AppType.SETTINGS
  ];

  const handlePointerDown = (e: React.PointerEvent, type: AppType) => {
    // If we're already returning an app, ignore new interactions
    if (draggingApp?.isReturning) return;

    const x = e.clientX;
    const y = e.clientY;
    startPosRef.current = { x, y };

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
      // Haptic feedback
      if (window.navigator.vibrate) window.navigator.vibrate(40);
    }, 500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!longPressTimer.current && !draggingApp) return;
    
    const x = e.clientX;
    const y = e.clientY;

    if (draggingApp && !draggingApp.isReturning) {
      setDraggingApp(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
    } else if (startPosRef.current) {
      const dx = x - startPosRef.current.x;
      const dy = y - startPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If pointer moves significantly before long press, cancel it
      if (distance > 15) {
        clearTimer();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent, type: AppType) => {
    const wasLongPressed = isLongPressed;
    clearTimer();

    if (wasLongPressed && draggingApp) {
      // Start return animation
      setIsLongPressed(false);
      setDraggingApp(prev => prev ? { 
        ...prev, 
        currentX: prev.startX, 
        currentY: prev.startY, 
        isReturning: true 
      } : null);

      // Clean up after animation finishes (500ms)
      setTimeout(() => {
        setDraggingApp(null);
      }, 500);
    } else if (!draggingApp?.isReturning) {
      // Regular click
      onOpenApp(type);
    }
  };

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    startPosRef.current = null;
  };

  const getDragStyle = (type: AppType): React.CSSProperties => {
    if (draggingApp?.type !== type) return {};

    const offsetX = draggingApp.currentX - draggingApp.startX;
    const offsetY = draggingApp.currentY - draggingApp.startY;
    const isReturning = draggingApp.isReturning;

    return {
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${isReturning ? 1 : 1.18})`,
      zIndex: 1000,
      opacity: isReturning ? 1 : 0.9,
      // No transition while actively dragging for 1:1 response, but smooth transition for return
      transition: isLongPressed ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease',
      filter: isReturning ? 'none' : 'drop-shadow(0 30px 40px rgb(0 0 0 / 0.3))',
      pointerEvents: 'none' // Allow pointer events to pass through to container
    };
  };

  return (
    <div 
      className={`h-20 shrink-0 flex items-center justify-center pointer-events-none pb-4 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
      onPointerMove={handlePointerMove}
    >
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-2.5 flex items-end gap-2.5 pointer-events-auto">
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
              style={getDragStyle(type)}
              className={`relative group transition-all duration-300 touch-none select-none ${
                !isThisDragging ? 'hover:-translate-y-2 active:scale-90' : ''
              }`}
            >
              <div className={`${config.color} p-3 rounded-2xl shadow-sm border ${config.border} flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-200`}>
                {config.icon}
              </div>
              
              {/* Active Indicator */}
              {isOpen && !isThisDragging && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600 w-4 rounded-full' : 'bg-slate-400'} transition-all`} />
              )}
              
              {/* Tooltip - hidden during drag */}
              {!isThisDragging && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
                  {type}
                </div>
              )}
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
