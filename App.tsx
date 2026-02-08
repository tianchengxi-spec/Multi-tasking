
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import SystemBar from './components/SystemBar';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import { AppInstance, AppType, WindowState } from './types';
import { APP_CONFIG } from './constants';

interface DragIconState {
  type: AppType;
  x: number;
  y: number;
  isOverTopRightZone: boolean;
  isOverLeftZone: boolean;
  isOverRightZone: boolean;
  isLocked: boolean;
}

const App: React.FC = () => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isDockVisible, setIsDockVisible] = useState(true);
  
  // Split Screen Resizing State
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [isResizingSplit, setIsResizingSplit] = useState(false);

  // Dragging interaction state
  const [dragIcon, setDragIcon] = useState<DragIconState | null>(null);
  const hotZoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gesture tracking
  const touchStartY = useRef<number | null>(null);
  const swipeThreshold = 50;

  // Determine if there is a background app to "interact" with
  const hasBackgroundApp = useMemo(() => 
    apps.some(a => a.state === 'maximized' || a.state === 'split-left' || a.state === 'split-right'),
    [apps]
  );

  // Check if we are currently in dual-split mode
  const isDualSplit = useMemo(() => {
    const splitLeft = apps.find(a => a.state === 'split-left');
    const splitRight = apps.find(a => a.state === 'split-right');
    return !!(splitLeft && splitRight);
  }, [apps]);

  const openApp = useCallback((type: AppType, forceState?: WindowState) => {
    const existingApp = apps.find(a => a.type === type);
    const newZIndex = zIndexCounter + 1;
    const screenWidth = window.innerWidth;

    if (forceState === 'split-left' || forceState === 'split-right') {
      const maximizedApp = apps.find(a => a.state === 'maximized' || (forceState === 'split-left' ? a.state === 'split-right' : a.state === 'split-left'));
      
      setApps(prev => {
        let updatedApps = prev.map(a => {
          if (maximizedApp && a.id === maximizedApp.id) {
            return { ...a, state: forceState === 'split-left' ? 'split-right' : 'split-left' as WindowState };
          }
          return a;
        });

        const newId = existingApp?.id || Math.random().toString(36).substr(2, 9);
        const appToAddOrUpdate = {
          id: newId,
          type,
          title: type,
          state: forceState,
          zIndex: newZIndex,
          position: { x: 0, y: 0 },
          size: { width: '50%', height: '100%' }
        };

        if (existingApp) {
          return updatedApps.map(a => a.id === existingApp.id ? appToAddOrUpdate : a);
        } else {
          return [...updatedApps, appToAddOrUpdate];
        }
      });
      
      // Reset ratio when starting fresh split
      setSplitRatio(0.5);
      setActiveAppId(existingApp?.id || 'new-app-temp-id');
      setZIndexCounter(newZIndex);
      return;
    }

    if (existingApp) {
      setApps(prev => prev.map(a => 
        a.id === existingApp.id ? { 
          ...a, 
          state: forceState || 'maximized', 
          zIndex: newZIndex,
          size: forceState === 'floating' ? { width: 380, height: 640 } : { width: '100%', height: '100%' },
          position: forceState === 'floating' ? { x: screenWidth - 420, y: 80 } : { x: 0, y: 0 }
        } : a
      ));
      setActiveAppId(existingApp.id);
      setZIndexCounter(newZIndex);
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newState: WindowState = forceState || 'maximized';
    
    const newApp: AppInstance = {
      id: newId,
      type,
      title: type,
      state: newState,
      zIndex: newZIndex,
      position: newState === 'floating' ? { x: screenWidth - 420, y: 80 } : { x: 0, y: 0 },
      size: newState === 'floating' ? { width: 380, height: 640 } : { width: '100%', height: '100%' }
    };

    setApps(prev => [...prev, newApp]);
    setActiveAppId(newId);
    setZIndexCounter(newZIndex);
  }, [apps, zIndexCounter]);

  const closeApp = useCallback((id: string) => {
    setApps(prev => {
      const closingApp = prev.find(a => a.id === id);
      const filteredApps = prev.filter(a => a.id !== id);

      if (closingApp && (closingApp.state === 'split-left' || closingApp.state === 'split-right')) {
        const remainingSplitApp = filteredApps.find(a => a.state === 'split-left' || a.state === 'split-right');
        if (remainingSplitApp) {
          return filteredApps.map(a => 
            a.id === remainingSplitApp.id 
              ? { ...a, state: 'maximized' as WindowState, size: { width: '100%', height: '100%' } } 
              : a
          );
        }
      }
      return filteredApps;
    });
    if (activeAppId === id) setActiveAppId(null);
  }, [activeAppId]);

  const focusApp = useCallback((id: string) => {
    const newZIndex = zIndexCounter + 1;
    setApps(prev => prev.map(a => a.id === id ? { ...a, zIndex: newZIndex } : a));
    setActiveAppId(id);
    setZIndexCounter(newZIndex);
  }, [zIndexCounter]);

  const minimizeApp = useCallback((id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, state: 'minimized' } : a));
    setActiveAppId(null);
  }, []);

  const maximizeApp = useCallback((id: string) => {
    setApps(prev => prev.map(a => 
      a.id === id ? { ...a, state: a.state === 'maximized' ? 'floating' : 'maximized' } : a
    ));
    focusApp(id);
  }, [focusApp]);

  const handleDockDragStart = (type: AppType, x: number, y: number) => {
    setDragIcon({ type, x, y, isOverTopRightZone: false, isOverLeftZone: false, isOverRightZone: false, isLocked: false });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Handle Dock Dragging
    if (dragIcon) {
      const screenWidth = window.innerWidth;
      const x = e.clientX;
      const y = e.clientY;
      const isOverTR = hasBackgroundApp && x > screenWidth - 250 && y < 250;
      const isOverLeft = hasBackgroundApp && x < 120;
      const isOverRight = hasBackgroundApp && x > screenWidth - 120 && !isOverTR;
      
      setDragIcon(prev => {
        if (!prev) return null;
        if (isOverTR && !prev.isOverTopRightZone) {
          hotZoneTimer.current = setTimeout(() => {
            setDragIcon(d => d ? { ...d, isLocked: true } : null);
            if (window.navigator.vibrate) window.navigator.vibrate([10, 30, 10]);
          }, 2000);
        } else if (!isOverTR && prev.isOverTopRightZone) {
          if (hotZoneTimer.current) {
            clearTimeout(hotZoneTimer.current);
            hotZoneTimer.current = null;
          }
        }
        return { ...prev, x, y, isOverTopRightZone: isOverTR, isOverLeftZone: isOverLeft, isOverRightZone: isOverRight };
      });
    }

    // 2. Handle Split Resize
    if (isResizingSplit) {
      const newRatio = e.clientX / window.innerWidth;
      setSplitRatio(Math.min(Math.max(newRatio, 0.2), 0.8));
    }
  };

  const handlePointerUpGlobal = () => {
    if (dragIcon) {
      if (dragIcon.isLocked && dragIcon.isOverTopRightZone) {
        openApp(dragIcon.type, 'floating');
      } else if (dragIcon.isOverLeftZone) {
        openApp(dragIcon.type, 'split-left');
      } else if (dragIcon.isOverRightZone) {
        openApp(dragIcon.type, 'split-right');
      }
      if (hotZoneTimer.current) {
        clearTimeout(hotZoneTimer.current);
        hotZoneTimer.current = null;
      }
      setDragIcon(null);
    }
    setIsResizingSplit(false);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragIcon || isResizingSplit) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartY.current = clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartY.current === null || isResizingSplit) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = clientY - touchStartY.current;
    if (deltaY < -swipeThreshold) setIsDockVisible(true);
    else if (deltaY > swipeThreshold) setIsDockVisible(false);
    touchStartY.current = null;
  };

  const openAppsTypes = useMemo(() => apps.map(a => a.type), [apps]);
  const activeAppType = useMemo(() => apps.find(a => a.id === activeAppId)?.type || null, [apps, activeAppId]);

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden relative border-[12px] border-slate-900 rounded-[3rem] shadow-2xl select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handlePointerUpGlobal}
      onMouseMove={handleMouseMove}
      onMouseLeave={handlePointerUpGlobal}
      onPointerUp={handlePointerUpGlobal}
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        <SystemBar />
        <Desktop 
          apps={apps}
          activeAppId={activeAppId}
          onCloseApp={closeApp}
          onMinimizeApp={minimizeApp}
          onMaximizeApp={maximizeApp}
          onFocusApp={focusApp}
          onOpenApp={openApp}
          splitRatio={splitRatio}
        />
        <Dock 
          openApps={openAppsTypes}
          onOpenApp={openApp}
          activeAppType={activeAppType}
          isVisible={isDockVisible}
          onDragStart={handleDockDragStart}
        />
      </div>

      {/* Split Resizer Bar */}
      {isDualSplit && (
        <div 
          className="absolute top-0 bottom-0 z-[100] group cursor-col-resize flex items-center justify-center pointer-events-auto"
          style={{ left: `${splitRatio * 100}%`, width: '20px', transform: 'translateX(-50%)' }}
          onMouseDown={(e) => { e.stopPropagation(); setIsResizingSplit(true); }}
        >
          <div className={`w-1.5 h-16 rounded-full bg-slate-800/80 shadow-lg transition-all duration-300 group-hover:scale-y-125 group-hover:w-2 ${isResizingSplit ? 'scale-y-150 w-2.5 bg-slate-900' : ''}`} />
          {/* Invisible larger hit area */}
          <div className="absolute inset-0 w-10" />
        </div>
      )}

      {/* Interaction Layers (Hot Zones) */}
      {dragIcon && (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
          {hasBackgroundApp && (
            <>
              <div 
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-3/5 transition-all duration-500 rounded-r-[100%]
                  ${dragIcon.isOverLeftZone ? 'w-[140px] opacity-100' : 'w-[80px] opacity-60'}`}
                style={{ background: 'radial-gradient(ellipse at left, rgba(251, 113, 154, 0.3) 0%, transparent 80%)' }}
              >
                <p className={`absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 font-bold text-sm vertical-text transition-all ${dragIcon.isOverLeftZone ? 'scale-110 opacity-100' : 'opacity-40'}`}>向左甩分屏</p>
              </div>

              <div 
                className={`absolute right-0 top-1/2 -translate-y-1/2 h-3/5 transition-all duration-500 rounded-l-[100%]
                  ${dragIcon.isOverRightZone ? 'w-[140px] opacity-100' : 'w-[80px] opacity-60'}`}
                style={{ background: 'radial-gradient(ellipse at right, rgba(251, 113, 154, 0.3) 0%, transparent 80%)' }}
              >
                <p className={`absolute right-4 top-1/2 -translate-y-1/2 text-rose-600 font-bold text-sm vertical-text transition-all ${dragIcon.isOverRightZone ? 'scale-110 opacity-100' : 'opacity-40'}`}>向右甩分屏</p>
              </div>

              <div className={`absolute top-0 right-0 w-72 h-72 transition-all duration-500 flex items-center justify-center ${dragIcon.isOverTopRightZone ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-56 h-56 rounded-bl-[4rem] flex flex-col items-center justify-center transition-all duration-300 ${dragIcon.isOverTopRightZone ? (dragIcon.isLocked ? 'bg-rose-400/30 shadow-2xl shadow-rose-200/50 scale-105' : 'bg-rose-300/20') : 'bg-rose-200/10'}`}>
                  <div className="text-center">
                    <p className={`text-rose-600 font-bold text-base mb-1 transition-opacity ${dragIcon.isOverTopRightZone ? 'opacity-100' : 'opacity-40'}`}>拖拽至右上角</p>
                    <p className={`text-rose-500 font-medium text-sm transition-opacity ${dragIcon.isOverTopRightZone ? 'opacity-100' : 'opacity-40'}`}>小窗</p>
                  </div>
                  {dragIcon.isOverTopRightZone && !dragIcon.isLocked && (
                    <div className="mt-3 w-24 h-1 bg-rose-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 animate-[loading_2s_linear_forwards]" style={{ width: '100%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div 
            className="absolute pointer-events-none transition-transform duration-75 ease-out"
            style={{ 
              left: dragIcon.x, 
              top: dragIcon.y, 
              transform: `translate(-50%, -50%) scale(${dragIcon.isLocked ? 0.7 : 1.1})`,
              zIndex: 9999
            }}
          >
             <div className={`${APP_CONFIG[dragIcon.type].color} w-14 h-14 rounded-2xl shadow-2xl border ${APP_CONFIG[dragIcon.type].border} flex items-center justify-center overflow-hidden`}>
                {APP_CONFIG[dragIcon.type].icon}
             </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-800/10 rounded-full z-[100] pointer-events-none"></div>
      <div className="absolute top-1/2 -left-3 w-1.5 h-12 bg-slate-700 rounded-full -translate-y-16"></div>
      <div className="absolute top-1/2 -left-3 w-1.5 h-12 bg-slate-700 rounded-full -translate-y-2"></div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rounded-full z-[100]"></div>

      <style>{`
        @keyframes loading { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; letter-spacing: 0.15em; }
      `}</style>
    </div>
  );
};

export default App;
