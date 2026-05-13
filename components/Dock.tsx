
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppType, TaskCombination } from '../types';
import { APP_CONFIG } from '../constants';

interface DockProps {
  openApps: AppType[];
  onOpenApp: (type: AppType, forceState?: any) => void;
  activeAppType: AppType | null;
  isVisible: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  onDragStart?: (type: AppType, x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  savedCombinations: TaskCombination[];
  onRestoreCombination: (combo: TaskCombination) => void;
  onRemoveCombination: (id: string) => void;
}

interface TaskCombinationItemProps {
  combo: TaskCombination;
  onRestoreCombination: (combo: TaskCombination) => void;
  onRemoveCombination: (id: string) => void;
}

const TaskCombinationItem: React.FC<TaskCombinationItemProps> = ({ combo, onRestoreCombination, onRemoveCombination }) => {
  const [isAwakened, setIsAwakened] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number, y: number } | null>(null);

  const startPress = (e: React.PointerEvent) => {
    const { clientX, clientY } = e;
    startPosRef.current = { x: clientX, y: clientY };
    setIsAwakened(false);
    setDragPos({ x: 0, y: 0 });

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      setIsAwakened(true);
      if (window.navigator.vibrate) window.navigator.vibrate(100);
    }, 600);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPosRef.current) return;
    
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    if (isAwakened) {
      setDragPos({ x: deltaX, y: deltaY });
    } else if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 10) {
      // Cancel long press if moved too much before awakening
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const cancelPress = (e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isAwakened) {
      // Check if dragged out of dock (upwards)
      if (dragPos.y < -100) {
        onRemoveCombination(combo.id);
      } else {
        // Snap back
        setIsAwakened(false);
        setDragPos({ x: 0, y: 0 });
      }
    } else if (startPosRef.current) {
      // Short press: restore
      onRestoreCombination(combo);
    }
    
    startPosRef.current = null;
  };

  return (
    <motion.div
      layout
      onPointerDown={startPress}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      animate={{ 
        x: dragPos.x, 
        y: dragPos.y, 
        scale: isAwakened ? 1.1 : 1,
        rotate: isAwakened ? [0, -1, 1, -1, 0] : 0
      }}
      transition={isAwakened && dragPos.x === 0 && dragPos.y === 0 ? {
        rotate: { repeat: Infinity, duration: 0.2 },
        scale: { duration: 0.2 }
      } : { type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative group transition-shadow duration-300 touch-none select-none outline-none z-[10] ${isAwakened ? 'z-[200]' : ''}`}
    >
       <div className={`w-14 h-14 bg-white/40 backdrop-blur-md rounded-[1.25rem] border ${isAwakened ? 'border-rose-400' : 'border-white/40'} overflow-hidden relative p-1.5 shadow-sm group-hover:shadow-xl transition-all`}>
          <div className={`w-full h-full grid ${combo.apps.length > 2 ? 'grid-cols-2 grid-rows-2' : (combo.apps.length === 2 ? 'grid-cols-2 grid-rows-1' : 'grid-cols-1')} gap-0.5 rounded-lg overflow-hidden`}>
             {combo.apps.map((app, i) => (
               <div key={i} className={`flex items-center justify-center ${APP_CONFIG[app.type].color} bg-opacity-40`}>
                  {React.cloneElement(APP_CONFIG[app.type].icon as React.ReactElement, { size: combo.apps.length > 2 ? 12 : 20 })}
               </div>
             ))}
          </div>
          {isAwakened && dragPos.y < -60 && (
            <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center animate-pulse">
               <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </div>
          )}
       </div>
       {!isAwakened && (
         <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-widest backdrop-blur-md border border-white/10 whitespace-nowrap">
            任务组合
         </div>
       )}
    </motion.div>
  );
};

const Dock: React.FC<DockProps> = ({ 
  openApps, 
  onOpenApp, 
  activeAppType, 
  isVisible,
  onVisibilityChange,
  onDragStart,
  onDragMove,
  onDragEnd,
  savedCombinations,
  onRestoreCombination,
  onRemoveCombination
}) => {
  const [activePress, setActivePress] = useState<AppType | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const pinchStartDist = useRef<number | null>(null);
  const pinchApps = useRef<AppType[]>([]);
  const longPressTimer = useRef<any>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeStartY = useRef<number | null>(null);

  const startHideTimer = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (openApps.length > 0) {
      hideTimer.current = setTimeout(() => {
        onVisibilityChange?.(false);
      }, 1500); 
    }
  };

  const stopHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const handlePointerDownGlobal = (e: React.PointerEvent) => {
    swipeStartY.current = e.clientY;
  };

  const handlePointerMoveGlobal = (e: React.PointerEvent) => {
    if (swipeStartY.current !== null && openApps.length > 0) {
      const deltaY = e.clientY - swipeStartY.current;
      if (deltaY > 40) { // Swipe Down
        onVisibilityChange?.(false);
        swipeStartY.current = null;
      }
    }
  };

  const allApps = [
    AppType.NOTES,
    AppType.BROWSER,
    AppType.FILES,
    AppType.AI_ASSISTANT,
    AppType.CALENDAR,
    AppType.CALCULATOR,
    AppType.WHITEBOARD,
    AppType.CLOUD_DRIVE,
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

  const getDistance = (t1: React.Touch, t2: React.Touch) => {
    return Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2));
  };

  const getAppAtPoint = (x: number, y: number): AppType | null => {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      const type = el.getAttribute('data-app-type');
      if (type) return type as AppType;
    }
    return null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      pinchStartDist.current = dist;

      // Identify apps under fingers
      const app1 = getAppAtPoint(e.touches[0].clientX, e.touches[0].clientY);
      const app2 = getAppAtPoint(e.touches[1].clientX, e.touches[1].clientY);
      
      if (app1 && app2 && app1 !== app2) {
        pinchApps.current = [app1, app2];
      } else {
        pinchApps.current = [];
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null && pinchApps.current.length === 2) {
      const currentDist = getDistance(e.touches[0], e.touches[1]);
      const diff = pinchStartDist.current - currentDist;

      if (diff > 50) { // Pinch detected (shrinking)
        const [app1, app2] = pinchApps.current;
        setToast(`组合：${app1} + ${app2}`);
        
        // Execute Merge
        onOpenApp(app1, 'split-left');
        onOpenApp(app2, 'split-right');
        
        // Cleanup & Feedback
        pinchStartDist.current = null; 
        pinchApps.current = [];
        onVisibilityChange?.(false);
        
        if (window.navigator.vibrate) window.navigator.vibrate([30, 50, 30]);
        setTimeout(() => setToast(null), 2000);
      }
    }
  };

  const handleTouchEnd = () => {
    pinchStartDist.current = null;
    pinchApps.current = [];
  };

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 h-32 flex items-center justify-center pointer-events-none pb-8 transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] z-[150] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
      }`}
      onMouseEnter={stopHideTimer}
      onMouseLeave={startHideTimer}
      onPointerDown={handlePointerDownGlobal}
      onPointerMove={handlePointerMoveGlobal}
    >
      <div 
        className="bg-white/70 backdrop-blur-3xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.75rem] p-3 flex items-end gap-3 pointer-events-auto relative"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {toast && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-rose-500 text-white rounded-2xl shadow-lg text-xs font-bold whitespace-nowrap animate-bounce z-50">
            {toast}
          </div>
        )}
        {allApps.map((type) => {
          const config = APP_CONFIG[type];
          const isActive = activeAppType === type;
          const isOpen = openApps.includes(type);

          return (
            <button
              key={type}
              data-app-type={type}
              onPointerDown={(e) => handlePointerDown(e, type)}
              onPointerUp={(e) => handlePointerUp(e, type)}
              onPointerLeave={() => {
                if (activePress === type) {
                  clearTimer();
                  setActivePress(null);
                }
              }}
              className={`relative group transition-all duration-300 touch-none select-none outline-none hover:-translate-y-2 active:scale-90`}
              style={{ touchAction: 'none' }}
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
        
        {savedCombinations.map((combo) => (
          <TaskCombinationItem 
            key={combo.id}
            combo={combo}
            onRestoreCombination={onRestoreCombination}
            onRemoveCombination={onRemoveCombination}
          />
        ))}
        
        {savedCombinations.length === 0 && (
          <div className="flex items-center justify-center w-14 h-14 bg-slate-200/30 border border-slate-200/50 rounded-[1.25rem] group transition-colors">
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse mx-0.5" />
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s] mx-0.5" />
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s] mx-0.5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dock;
