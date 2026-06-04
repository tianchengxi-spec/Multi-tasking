
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskCombination, AppType, WindowState } from '../types';
import { APP_CONFIG } from '../constants';
import { X } from 'lucide-react';

interface ToolRingControllerProps {
  combinations: TaskCombination[];
  onRestore: (combo: TaskCombination) => void;
  onOpenSingleApp: (type: AppType, state?: WindowState) => void;
}

const ToolRingController: React.FC<ToolRingControllerProps> = ({ combinations, onRestore, onOpenSingleApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toolRings = combinations.filter(c => c.mode === 'toolring');
  
  // We only show the ring if it's been awakened via double click
  const lastRing = toolRings[toolRings.length - 1];

  useEffect(() => {
    let lastTapTime = 0;

    const handleActivation = (clientX: number, clientY: number, target: HTMLElement, isTouch: boolean, e?: Event) => {
      // Top-right corner region (96px width and 96px height)
      const hotZoneWidth = 96;
      const hotZoneHeight = 96;
      const isTopRight = clientX > window.innerWidth - hotZoneWidth && clientY < hotZoneHeight;
      
      if (isTopRight) {
        // 1. Guard against unmounted button click race conditions using a global lock timestamp
        const lastWindowAction = (window as any).__lastWindowActionTime || 0;
        const now = Date.now();
        if (now - lastWindowAction < 800) {
          return;
        }

        // 2. Ensure target itself isn't interactive (closest checks for button, forms, etc.)
        const isInteractive = target.closest('button') || 
                            target.closest('a') || 
                            target.closest('input') || 
                            target.closest('select') || 
                            target.closest('textarea') || 
                            target.getAttribute('role') === 'button';
        
        if (!isInteractive && toolRings.length > 0) {
          if (e && isTouch) {
            e.preventDefault();
            e.stopPropagation();
          }
          setIsOpen(true);
          if (window.navigator.vibrate) window.navigator.vibrate(100);
        }
      }
    };

    const handleGlobalDblClick = (e: MouseEvent) => {
      handleActivation(e.clientX, e.clientY, e.target as HTMLElement, false);
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;
      
      if (now - lastTapTime < DOUBLE_TAP_DELAY) {
        const touch = e.changedTouches[0];
        handleActivation(touch.clientX, touch.clientY, e.target as HTMLElement, true, e);
      }
      
      lastTapTime = now;
    };

    window.addEventListener('dblclick', handleGlobalDblClick, true);
    window.addEventListener('touchend', handleGlobalTouchEnd, { capture: true, passive: false });
    
    return () => {
      window.removeEventListener('dblclick', handleGlobalDblClick, true);
      window.removeEventListener('touchend', handleGlobalTouchEnd, true);
    };
  }, [toolRings.length]);

  if (toolRings.length === 0) return null;

  return (
    <>
      {/* Hidden Hot Zone in Top Right Corner (visual layout decorator, non-blocking) */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 z-[50000] pointer-events-none flex items-start justify-end p-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/0" />
      </div>

      <AnimatePresence>
        {isOpen && lastRing && (
          <div className="absolute inset-0 z-[2100] pointer-events-none">
            {/* Localized Gradient Blur - Masked to be soft-edged */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-auto"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at calc(100% - 90px) 110px, black 0%, transparent 60%)',
                maskImage: 'radial-gradient(circle at calc(100% - 90px) 110px, black 0%, transparent 60%)',
                backdropFilter: 'blur(32px)',
              }}
              onClick={() => setIsOpen(false)}
            />

            {/* The Wheel */}
            <motion.div
              initial={{ x: 60, y: -60, opacity: 0 }}
              animate={{ x: -20, y: 20, opacity: 1 }}
              exit={{ x: 60, y: -60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-[180px] h-[180px] flex items-center justify-center pointer-events-none"
            >
              {/* Outer Circular Base */}
              <div className="absolute inset-0 bg-white/50 rounded-full border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0873FF 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              </div>

              {/* Inner Decorative Ring */}
              <div className="absolute inset-10 bg-white/20 rounded-full border border-white/10 shadow-inner" />

              {/* Close Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded-full border border-white flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all active:scale-95 pointer-events-auto"
              >
                <X size={12} />
              </button>

              {/* Center Blue Pointer UI */}
              <div 
                onClick={() => {
                  onRestore(lastRing);
                  setIsOpen(false);
                }}
                className="relative w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 border border-slate-100 pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="absolute inset-1 bg-slate-50 rounded-full border border-slate-100 shadow-inner" />
                <motion.div 
                  className="relative w-6 h-6 flex items-center justify-center"
                >
                  <div 
                    className="absolute top-0.5 w-3 h-5 bg-blue-500 shadow-lg shadow-blue-500/40" 
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '2px' }} 
                  />
                  <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm z-10" />
                </motion.div>
              </div>

              {/* Apps Orbiting */}
              {lastRing.apps.map((app, i) => {
                const angle = (i / lastRing.apps.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 60; 
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const config = APP_CONFIG[app.type];

                return (
                  <motion.div
                    key={`${app.type}-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        x, 
                        y,
                        transition: { delay: i * 0.05 + 0.1, type: 'spring' }
                    }}
                    className="absolute z-20 pointer-events-auto"
                  >
                    <button
                        onClick={() => {
                            onOpenSingleApp(app.type, 'floating');
                            setIsOpen(false);
                        }}
                        className="relative group flex flex-col items-center"
                    >
                        {/* Glass Socket */}
                        <div className="absolute inset-0 scale-[1.3] bg-white/70 rounded-full border border-white/50 -z-10 group-hover:scale-[1.5] transition-transform" />
                        
                        <div className={`w-9 h-9 ${config.color} rounded-full flex items-center justify-center border border-white shadow-lg relative transition-transform group-hover:scale-110`}>
                            {React.cloneElement(config.icon as React.ReactElement, { size: 16 })}
                        </div>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ToolRingController;
