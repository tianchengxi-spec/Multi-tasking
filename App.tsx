
import React, { useState, useCallback, useMemo, useRef } from 'react';
import SystemBar from './components/SystemBar';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import { AppInstance, AppType, WindowState } from './types';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isDockVisible, setIsDockVisible] = useState(true);
  
  // Gesture tracking
  const touchStartY = useRef<number | null>(null);
  const swipeThreshold = 50; // pixels

  const openApp = useCallback((type: AppType) => {
    // Check if app already open
    const existingApp = apps.find(a => a.type === type);
    if (existingApp) {
      // If app exists, force it to maximized and bring to front
      const newZIndex = zIndexCounter + 1;
      setApps(prev => prev.map(a => 
        a.id === existingApp.id ? { ...a, state: 'maximized', zIndex: newZIndex } : a
      ));
      setActiveAppId(existingApp.id);
      setZIndexCounter(newZIndex);
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newZIndex = zIndexCounter + 1;
    
    // Launch logic: Default to maximized for tablet-like experience
    const newApp: AppInstance = {
      id: newId,
      type,
      title: type,
      state: 'maximized', // Changed from 'floating' to 'maximized'
      zIndex: newZIndex,
      position: { x: 0, y: 0 },
      size: { width: '100%', height: '100%' }
    };

    setApps(prev => [...prev, newApp]);
    setActiveAppId(newId);
    setZIndexCounter(newZIndex);
  }, [apps, zIndexCounter]);

  const closeApp = useCallback((id: string) => {
    setApps(prev => prev.filter(a => a.id !== id));
    if (activeAppId === id) setActiveAppId(null);
  }, [activeAppId]);

  const focusApp = useCallback((id: string) => {
    setApps(prev => prev.map(a => 
      a.id === id ? { ...a, zIndex: zIndexCounter + 1 } : a
    ));
    setActiveAppId(id);
    setZIndexCounter(prev => prev + 1);
  }, [zIndexCounter]);

  const minimizeApp = useCallback((id: string) => {
    setApps(prev => prev.map(a => 
      a.id === id ? { ...a, state: 'minimized' } : a
    ));
    setActiveAppId(null);
  }, []);

  const restoreApp = useCallback((id: string) => {
    // When restoring, we also default to maximized now
    const newZIndex = zIndexCounter + 1;
    setApps(prev => prev.map(a => 
      a.id === id ? { ...a, state: 'maximized', zIndex: newZIndex } : a
    ));
    setActiveAppId(id);
    setZIndexCounter(newZIndex);
  }, [zIndexCounter]);

  const maximizeApp = useCallback((id: string) => {
    setApps(prev => prev.map(a => 
      a.id === id ? { ...a, state: a.state === 'maximized' ? 'floating' : 'maximized' } : a
    ));
    focusApp(id);
  }, [focusApp]);

  // Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartY.current = clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartY.current === null) return;
    
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = clientY - touchStartY.current;

    // Swipe Up (Negative DeltaY)
    if (deltaY < -swipeThreshold) {
      setIsDockVisible(true);
    } 
    // Swipe Down (Positive DeltaY)
    else if (deltaY > swipeThreshold) {
      setIsDockVisible(false);
    }

    touchStartY.current = null;
  };

  const openAppsTypes = useMemo(() => apps.map(a => a.type), [apps]);
  const activeAppType = useMemo(() => apps.find(a => a.id === activeAppId)?.type || null, [apps, activeAppId]);

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden relative border-[12px] border-slate-900 rounded-[3rem] shadow-2xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      {/* Simulation Screen Container */}
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
        />
        
        <Dock 
          openApps={openAppsTypes}
          onOpenApp={openApp}
          activeAppType={activeAppType}
          isVisible={isDockVisible}
        />
      </div>

      {/* Home Bar / Gesture Indicator (Always visible at the very bottom) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-800/10 rounded-full z-[100] pointer-events-none"></div>

      {/* Decorative Tablet Elements */}
      <div className="absolute top-1/2 -left-3 w-1.5 h-12 bg-slate-700 rounded-full -translate-y-16"></div>
      <div className="absolute top-1/2 -left-3 w-1.5 h-12 bg-slate-700 rounded-full -translate-y-2"></div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rounded-full z-[100]"></div>
    </div>
  );
};

export default App;
