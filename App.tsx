
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SystemBar from './components/SystemBar';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import { AppInstance, AppType, WindowState } from './types';
import { APP_CONFIG } from './constants';
import { Plus } from 'lucide-react';

interface DragIconState {
  type: AppType;
  x: number;
  y: number;
  isOverFloatingZone: boolean;
  isOverLeftZone: boolean;
  isOverRightZone: boolean;
  isOverDivider: boolean;
  isLeftIntentConfirmed?: boolean;
  isRightIntentConfirmed?: boolean;
}

interface SnappingState {
  type: AppType;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetState: WindowState | 'split-divider';
}

const App: React.FC = () => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const touchStartY = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [splitRatios, setSplitRatios] = useState<[number, number]>([0.5, 0.66]);
  const [resizingDividerIndex, setResizingDividerIndex] = useState<number | null>(null);

  const [dragIcon, setDragIcon] = useState<DragIconState | null>(null);
  const [snapping, setSnapping] = useState<SnappingState | null>(null);
  const intentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDragPos = useRef({ x: 0, y: 0 });

  // Handle detection of "hanging" / hovering in place
  const checkHoverIntent = useCallback((x: number, y: number, screenWidth: number, screenHeight: number) => {
    if (!dragIcon) return;

    const dist = Math.sqrt(Math.pow(x - lastDragPos.current.x, 2) + Math.pow(y - lastDragPos.current.y, 2));
    lastDragPos.current = { x, y };

    if (dist < 10) {
      if (!intentTimer.current) {
        intentTimer.current = setTimeout(() => {
          // Identify Zone at hover location
          const isOverFloating = x > screenWidth - 256 && y < 256;
          
          if (isOverFloating) {
            setDragIcon(prev => prev ? { 
              ...prev, x, y, 
              isOverFloatingZone: true, 
              isLeftIntentConfirmed: false, 
              isRightIntentConfirmed: false,
              isOverLeftZone: false,
              isOverRightZone: false
            } : null);
          } else {
            const isLeft = x < screenWidth / 2;
            setDragIcon(prev => {
              if (!prev) return null;
              if (window.navigator.vibrate) window.navigator.vibrate(30);
              return {
                ...prev,
                isLeftIntentConfirmed: isLeft,
                isRightIntentConfirmed: !isLeft,
                isOverLeftZone: isLeft,
                isOverRightZone: !isLeft,
                isOverFloatingZone: false
              };
            });
          }
        }, 500);
      }
    } else {
      // Clear intent if moving significantly
      if (intentTimer.current) {
        clearTimeout(intentTimer.current);
        intentTimer.current = null;
      }
      setDragIcon(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          x, 
          y, 
          isOverFloatingZone: false,
          isLeftIntentConfirmed: false,
          isRightIntentConfirmed: false,
          isOverLeftZone: false,
          isOverRightZone: false
        };
      });
    }
  }, [dragIcon]);

  // Prevent scrolling on mobile when dragging
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (dragIcon || resizingDividerIndex !== null || snapping) {
        e.preventDefault();
      }
    };

    if (dragIcon || resizingDividerIndex !== null || snapping) {
      window.addEventListener('touchmove', preventDefault, { passive: false });
    }
    return () => window.removeEventListener('touchmove', preventDefault);
  }, [dragIcon, resizingDividerIndex, snapping]);

  const splitApps = useMemo(() => 
    apps.filter(a => a.state.startsWith('split-')),
    [apps]
  );

  const isDualSplit = useMemo(() => {
    const left = apps.find(a => a.state === 'split-left');
    const right = apps.find(a => a.state === 'split-right');
    return !!(left && right && splitApps.length === 2);
  }, [apps, splitApps]);

  const isTSplit = useMemo(() => {
    const left = apps.find(a => a.state === 'split-left');
    const rightT = apps.find(a => a.state === 'split-right-top');
    const rightB = apps.find(a => a.state === 'split-right-bottom');
    return !!(left && rightT && rightB && splitApps.length === 3);
  }, [apps, splitApps]);

  const isTripleSplit = useMemo(() => splitApps.length === 3, [splitApps]);
  const isQuadSplit = useMemo(() => splitApps.length === 4, [splitApps]);

  const hasBackgroundApp = useMemo(() => 
    apps.some(a => a.state === 'maximized' || a.state.startsWith('split-')),
    [apps]
  );

  const openApp = useCallback((type: AppType, forceState?: WindowState | 'split-divider') => {
    const existingApp = apps.find(a => a.type === type);
    const newZIndex = zIndexCounter + 1;
    const screenWidth = window.innerWidth;

    if (forceState === 'split-divider') {
      const leftApp = apps.find(a => a.state === 'split-left');
      const rightApp = apps.find(a => a.state === 'split-right');
      const rightT = apps.find(a => a.state === 'split-right-top');
      const rightB = apps.find(a => a.state === 'split-right-bottom');

      if (leftApp && rightApp) {
        setApps(prev => {
          let updated = prev.map(a => {
            if (a.id === rightApp.id) return { ...a, state: 'split-right-top' as WindowState };
            return a;
          });
          const newId = existingApp?.id || Math.random().toString(36).substr(2, 9);
          const newAppInstance = {
            id: newId,
            type,
            title: type,
            state: 'split-right-bottom' as WindowState,
            zIndex: newZIndex,
            position: { x: 0, y: 0 },
            size: { width: '50%', height: '50%' }
          };
          if (existingApp) return updated.map(a => a.id === existingApp.id ? newAppInstance : a);
          return [...updated, newAppInstance];
        });
        setSplitRatios([0.5, 0.66]);
      } 
      else if (leftApp && rightT && rightB) {
        setApps(prev => {
          let updated = prev.map(a => {
            if (a.id === leftApp.id) return { ...a, state: 'split-left-top' as WindowState };
            return a;
          });
          const newId = existingApp?.id || Math.random().toString(36).substr(2, 9);
          const newAppInstance = {
            id: newId,
            type,
            title: type,
            state: 'split-left-bottom' as WindowState,
            zIndex: newZIndex,
            position: { x: 0, y: 0 },
            size: { width: '50%', height: '50%' }
          };
          if (existingApp) return updated.map(a => a.id === existingApp.id ? newAppInstance : a);
          return [...updated, newAppInstance];
        });
        setSplitRatios([0.5, 0.66]);
      }
      setActiveAppId(existingApp?.id || 'new-app-temp-id');
      setZIndexCounter(newZIndex);
      return;
    }

    if (forceState === 'split-left' || forceState === 'split-right') {
      const leftApp = apps.find(a => a.state === 'split-left');
      const rightApp = apps.find(a => a.state === 'split-right');
      const maximizedApp = apps.find(a => a.state === 'maximized');
      setApps(prev => {
        let updatedApps = [...prev];
        if (maximizedApp) {
          updatedApps = updatedApps.map(a => 
            a.id === maximizedApp.id 
              ? { ...a, state: forceState === 'split-left' ? 'split-right' : 'split-left' as WindowState } 
              : a
          );
          setSplitRatios([0.5, 0.66]);
        } 
        else if (isDualSplit && leftApp && rightApp) {
          if (forceState === 'split-left') {
            updatedApps = updatedApps.map(a => a.id === leftApp.id ? { ...a, state: 'split-middle' as WindowState } : a);
          } else {
            updatedApps = updatedApps.map(a => a.id === rightApp.id ? { ...a, state: 'split-middle' as WindowState } : a);
          }
          setSplitRatios([0.33, 0.66]);
        }
        else if (isTripleSplit && !isTSplit) {
          const splitStates: WindowState[] = ['split-left', 'split-middle', 'split-right'];
          const currentSplitApps = prev.filter(a => splitStates.includes(a.state));
          
          const isExistingInSplit = existingApp && currentSplitApps.some(a => a.id === existingApp.id);
          
          if (currentSplitApps.length === 3 && !isExistingInSplit) {
            const oldest = currentSplitApps[0];
            const others = currentSplitApps.slice(1);
            
            // Move the oldest app to sidebar instead of minimizing
            const sidebarState = forceState === 'split-left' ? 'split-sidebar-right' : 'split-sidebar-left' as WindowState;
            updatedApps = updatedApps.map(a => 
              a.id === oldest.id ? { ...a, state: sidebarState } : a
            );
            
            // Shift remaining apps
            if (forceState === 'split-left') {
              updatedApps = updatedApps.map(a => {
                if (a.id === others[0].id) return { ...a, state: 'split-middle' as WindowState };
                if (a.id === others[1].id) return { ...a, state: 'split-right' as WindowState };
                return a;
              });
            } else if (forceState === 'split-right') {
              updatedApps = updatedApps.map(a => {
                if (a.id === others[0].id) return { ...a, state: 'split-left' as WindowState };
                if (a.id === others[1].id) return { ...a, state: 'split-middle' as WindowState };
                return a;
              });
            }
            // If we have sidebar + 3 apps, it's 3 apps in the main area.
            setSplitRatios([0.33, 0.66]);
          }
        }
        const newId = existingApp?.id || Math.random().toString(36).substr(2, 9);
        const appToAddOrUpdate = {
          id: newId,
          type,
          title: type,
          state: forceState as WindowState,
          zIndex: newZIndex,
          position: { x: 0, y: 0 },
          size: { width: '33%', height: '100%' }
        };
        if (existingApp) return updatedApps.map(a => a.id === existingApp.id ? appToAddOrUpdate : a);
        return [...updatedApps, appToAddOrUpdate];
      });
      setActiveAppId(existingApp?.id || 'new-app-temp-id');
      setZIndexCounter(newZIndex);
      return;
    }

    if (existingApp) {
      setApps(prev => prev.map(a => 
        a.id === existingApp.id ? { 
          ...a, 
          state: (forceState as WindowState) || 'maximized', 
          zIndex: newZIndex,
          size: forceState === 'floating' ? { width: 360, height: 600 } : { width: '100%', height: '100%' },
          position: forceState === 'floating' ? { x: screenWidth - 360 - 16, y: 16 } : { x: 0, y: 0 }
        } : a
      ));
      setActiveAppId(existingApp.id);
      setZIndexCounter(newZIndex);
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newState: WindowState = (forceState as WindowState) || 'maximized';
    const newApp: AppInstance = {
      id: newId,
      type,
      title: type,
      state: newState,
      zIndex: newZIndex,
      position: newState === 'floating' ? { x: screenWidth - 360 - 16, y: 16 } : { x: 0, y: 0 },
      size: newState === 'floating' ? { width: 360, height: 600 } : { width: '100%', height: '100%' }
    };
    setApps(prev => [...prev, newApp]);
    setActiveAppId(newId);
    setZIndexCounter(newZIndex);
  }, [apps, zIndexCounter, isDualSplit, isTSplit, isQuadSplit]);

  const closeApp = useCallback((id: string) => {
    setApps(prev => {
      const closingApp = prev.find(a => a.id === id);
      if (!closingApp) return prev;

      const filteredApps = prev.filter(a => a.id !== id);
      const splitBefore = prev.filter(a => a.state.startsWith('split-'));
      
      if (closingApp.state.startsWith('split-')) {
        const remainingSplits = filteredApps.filter(a => a.state.startsWith('split-'));
        
        if (splitBefore.length === 4) {
          return filteredApps.map(a => {
            if (closingApp.state === 'split-left-top' && a.state === 'split-left-bottom') return { ...a, state: 'split-left' as WindowState };
            if (closingApp.state === 'split-left-bottom' && a.state === 'split-left-top') return { ...a, state: 'split-left' as WindowState };
            if (closingApp.state === 'split-right-top' && a.state === 'split-right-bottom') return { ...a, state: 'split-right' as WindowState };
            if (closingApp.state === 'split-right-bottom' && a.state === 'split-right-top') return { ...a, state: 'split-right' as WindowState };
            return a;
          });
        }

        if (remainingSplits.length === 2) {
          const wasTripleVertical = prev.some(a => a.state === 'split-middle');
          if (wasTripleVertical) {
            setSplitRatios([0.5, 0.66]);
            return filteredApps.map(a => {
              if (a.state === 'split-middle') {
                const newState = closingApp.state === 'split-left' ? 'split-left' : 'split-right';
                return { ...a, state: newState as WindowState };
              }
              return a;
            });
          }

          const wasRightTSplit = prev.some(a => a.state === 'split-right-top');
          if (wasRightTSplit) {
            setSplitRatios([0.5, 0.66]);
            if (closingApp.state === 'split-left') {
              return filteredApps.map(a => {
                if (a.state === 'split-right-top') return { ...a, state: 'split-left' as WindowState };
                if (a.state === 'split-right-bottom') return { ...a, state: 'split-right' as WindowState };
                return a;
              });
            }
            return filteredApps.map(a => {
              if (a.state === 'split-right-top' || a.state === 'split-right-bottom') return { ...a, state: 'split-right' as WindowState };
              return a;
            });
          }

          const wasLeftTSplit = prev.some(a => a.state === 'split-left-top');
          if (wasLeftTSplit) {
            setSplitRatios([0.5, 0.66]);
            if (closingApp.state === 'split-right') {
                return filteredApps.map(a => {
                    if (a.state === 'split-left-top') return { ...a, state: 'split-left' as WindowState };
                    if (a.state === 'split-left-bottom') return { ...a, state: 'split-right' as WindowState };
                    return a;
                });
            }
            return filteredApps.map(a => {
                if (a.state === 'split-left-top' || a.state === 'split-left-bottom') return { ...a, state: 'split-left' as WindowState };
                return a;
            });
          }
        }
        
        if (remainingSplits.length === 1) {
          return filteredApps.map(a => a.id === remainingSplits[0].id ? { ...a, state: 'maximized' as WindowState } : a);
        }
      }
      return filteredApps;
    });
    if (activeAppId === id) setActiveAppId(null);
  }, [activeAppId]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingAppId) {
      const app = apps.find(a => a.id === draggingAppId);
      if (app && app.state === 'floating') {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const dockHeight = 160; 
        
        // Window Size
        const winW = 320;
        const winH = 550;
        
        // Constraints (Safe Area)
        const minX = 16;
        const minY = 16;
        const maxX = screenWidth - winW - 16;
        const maxY = screenHeight - winH - 80; // Margin from bottom/dock area
        
        const safeX = Math.min(Math.max(minX, x), maxX);
        const safeY = Math.min(Math.max(minY, y), maxY);
        
        setApps(prev => prev.map(a => a.id === draggingAppId ? { ...a, position: { x: safeX, y: safeY } } : a));
      }
      return;
    }

    if (dragIcon) {
      const x = e.clientX;
      const y = e.clientY;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const dividerX = splitRatios[0] * screenWidth;
      const isOverDiv = (isDualSplit || isTSplit) && Math.abs(x - dividerX) < 40 && y > 100 && y < window.innerHeight - 100;

      if (isOverDiv && !dragIcon.isOverDivider && window.navigator.vibrate) {
        window.navigator.vibrate(20);
      }

      // If over divider, we handle it immediately as it's a specific drop target
      if (isOverDiv) {
        if (intentTimer.current) {
          clearTimeout(intentTimer.current);
          intentTimer.current = null;
        }
        setDragIcon(prev => prev ? { 
          ...prev, 
          x, y, 
          isOverDivider: true, 
          isOverFloatingZone: false,
          isLeftIntentConfirmed: false,
          isRightIntentConfirmed: false,
          isOverLeftZone: false,
          isOverRightZone: false
        } : null);
      } else {
        // Use the smart hover intent detection for everything else
        checkHoverIntent(x, y, screenWidth, screenHeight);
      }
    }

    if (resizingDividerIndex !== null) {
      const workingWidth = window.innerWidth - lOffset - rOffset;
      const newRatio = (e.clientX - lOffset) / workingWidth;
      setSplitRatios(prev => {
        const next = [...prev] as [number, number];
        next[resizingDividerIndex] = newRatio;
        if (resizingDividerIndex === 0) next[0] = Math.min(Math.max(next[0], 0.1), isTripleSplit ? next[1] - 0.1 : 0.9);
        else next[1] = Math.max(Math.min(next[1], 0.9), next[0] + 0.1);
        return next;
      });
    }
  };

  const handlePointerUpGlobal = () => {
    setDraggingAppId(null);
    if (intentTimer.current) {
      clearTimeout(intentTimer.current);
      intentTimer.current = null;
    }

    if (dragIcon) {
      const { type, x, y, isLeftIntentConfirmed, isRightIntentConfirmed, isOverFloatingZone, isOverDivider } = dragIcon;
      
      if (isOverDivider) {
        openApp(type, 'split-divider');
        setDragIcon(null);
      } else if (isLeftIntentConfirmed) {
        setSnapping({
          type,
          startX: x,
          startY: y,
          targetX: 0,
          targetY: window.innerHeight / 2,
          targetState: 'split-left'
        });
        setDragIcon(null);
      } else if (isRightIntentConfirmed) {
        setSnapping({
          type,
          startX: x,
          startY: y,
          targetX: window.innerWidth,
          targetY: window.innerHeight / 2,
          targetState: 'split-right'
        });
        setDragIcon(null);
      } else if (isOverFloatingZone) {
        setSnapping({
          type,
          startX: x,
          startY: y,
          targetX: window.innerWidth - 180 - 16, // Near the center of the 360-wide floating window target x-center
          targetY: 300, // Roughly where the floating window top-half center would be
          targetState: 'floating'
        });
        setDragIcon(null);
      } else {
        setDragIcon(null);
      }
    }
    setResizingDividerIndex(null);
  };

  const hasSidebarLeft = useMemo(() => apps.some(a => a.state === 'split-sidebar-left'), [apps]);
  const hasSidebarRight = useMemo(() => apps.some(a => a.state === 'split-sidebar-right'), [apps]);
  const sidebarWidth = 60;
  const lOffset = hasSidebarLeft ? sidebarWidth : 0;
  const rOffset = hasSidebarRight ? sidebarWidth : 0;

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden relative border-[12px] border-slate-900 rounded-[3rem] shadow-2xl select-none"
      onPointerUp={handlePointerUpGlobal}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUpGlobal}
      style={{ touchAction: 'none' }}
    >
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        <SystemBar />
        <Desktop 
          apps={apps}
          activeAppId={activeAppId}
          onCloseApp={closeApp}
          onMinimizeApp={(id) => setApps(prev => prev.map(a => a.id === id ? { ...a, state: 'minimized' } : a))}
          onMaximize={() => {}}
          onFocusApp={(id) => { 
            setZIndexCounter(z => z + 1); 
            setApps(prev => prev.map(a => a.id === id ? { ...a, zIndex: zIndexCounter + 1 } : a)); 
            setActiveAppId(id);
            setIsDockVisible(false); // Hide dock when focusing wallpaper
          }}
          onOpenApp={openApp}
          splitRatios={splitRatios}
          onClickWallpaper={() => setIsDockVisible(false)}
          onDragAppStart={(id, x, y) => {
            const app = apps.find(a => a.id === id);
            if (app && app.state === 'floating') {
              setDraggingAppId(id);
              setDragOffset({ x: x - app.position.x, y: y - app.position.y });
              setZIndexCounter(z => z + 1);
              setApps(prev => prev.map(a => a.id === id ? { ...a, zIndex: zIndexCounter + 1 } : a));
              setActiveAppId(id);
            }
          }}
        />
      </div>

      <Dock 
        openApps={apps.map(a => a.type)}
        onOpenApp={openApp}
        activeAppType={apps.find(a => a.id === activeAppId)?.type || null}
        isVisible={isDockVisible}
        onDragStart={(type, x, y) => setDragIcon({ type, x, y, isOverFloatingZone: false, isOverLeftZone: false, isOverRightZone: false, isOverDivider: false })}
        onVisibilityChange={setIsDockVisible}
      />

      {/* Home Indicator / Trigger Zone (Invisible) */}
      {!isDockVisible && (
        <div 
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 h-12 z-[90] flex items-center justify-center group cursor-pointer"
          onMouseEnter={() => setIsDockVisible(true)}
          onClick={() => setIsDockVisible(true)}
          onPointerDown={(e) => { touchStartY.current = e.clientY; }}
          onPointerUp={(e) => {
            if (touchStartY.current !== null) {
              const deltaY = touchStartY.current - e.clientY;
              if (deltaY > 15) setIsDockVisible(true); // Small upward swipe
            }
            touchStartY.current = null;
          }}
        >
        </div>
      )}

      {splitApps.length >= 2 && (
        <>
          <div 
            className="absolute top-0 bottom-0 z-[100] group cursor-col-resize flex items-center justify-center pointer-events-auto bg-transparent hover:bg-slate-500/5 transition-colors"
            style={{ 
              left: `calc(${lOffset}px + ${splitRatios[0]} * (100% - ${lOffset + rOffset}px))`, 
              width: '16px', 
              transform: 'translateX(-50%)', 
              touchAction: 'none' 
            }}
            onPointerDown={(e) => { e.stopPropagation(); setResizingDividerIndex(0); }}
          >
            <div className={`w-1 h-12 rounded-full bg-slate-300 transition-all duration-300 group-hover:bg-slate-400 group-hover:h-24 ${resizingDividerIndex === 0 ? 'bg-slate-600 h-32 w-1.5 shadow-lg' : ''}`} />
          </div>
          {isTripleSplit && !isTSplit && !isQuadSplit && (
            <div 
              className="absolute top-0 bottom-0 z-[100] group cursor-col-resize flex items-center justify-center pointer-events-auto bg-transparent hover:bg-slate-500/5 transition-colors"
              style={{ 
                left: `calc(${lOffset}px + ${splitRatios[1]} * (100% - ${lOffset + rOffset}px))`, 
                width: '16px', 
                transform: 'translateX(-50%)', 
                touchAction: 'none' 
              }}
              onPointerDown={(e) => { e.stopPropagation(); setResizingDividerIndex(1); }}
            >
              <div className={`w-1 h-12 rounded-full bg-slate-300 transition-all duration-300 group-hover:bg-slate-400 group-hover:h-24 ${resizingDividerIndex === 1 ? 'bg-slate-600 h-32 w-1.5 shadow-lg' : ''}`} />
            </div>
          )}
          {(isTSplit || isQuadSplit || splitApps.some(a => a.state.startsWith('split-left-'))) && (
            <div 
                className="absolute z-[100] group flex items-center justify-center bg-transparent hover:bg-slate-500/5 transition-colors" 
                style={{ 
                    top: '50%', 
                    height: '16px',
                    width: isQuadSplit ? '100%' : (splitApps.some(a => a.state.startsWith('split-left-')) ? `calc(${splitRatios[0]} * (100% - ${lOffset + rOffset}px))` : `calc(${1-splitRatios[0]} * (100% - ${lOffset + rOffset}px))`),
                    left: isQuadSplit ? '50%' : (splitApps.some(a => a.state.startsWith('split-left-')) ? `calc(${lOffset}px + ${splitRatios[0]/2} * (100% - ${lOffset + rOffset}px))` : `calc(${lOffset}px + (${splitRatios[0]} + (1 - splitRatios[0]) / 2) * (100% - ${lOffset + rOffset}px))`),
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div className="w-12 h-1 rounded-full bg-slate-300 transition-all duration-300 group-hover:bg-slate-400 group-hover:w-24" />
            </div>
          )}
        </>
      )}

      {dragIcon && (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
          {/* Floating Zone Indicator (Top-Right 1/4 Circle) */}
          {hasBackgroundApp && (
            <div 
              className={`absolute right-0 top-0 w-64 h-64 transition-all duration-500 rounded-bl-full flex items-center justify-center ${dragIcon.isOverFloatingZone ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ 
                background: 'rgba(251, 113, 154, 0.1)',
                borderLeft: '2px dashed rgba(251, 113, 154, 0.3)',
                borderBottom: '2px dashed rgba(251, 113, 154, 0.3)',
                backdropFilter: 'blur(12px)',
                transformOrigin: 'top right'
              }}
            >
              <div className="text-center pt-4 pl-8">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/30">
                  <Plus className="text-white" size={20} />
                </div>
                <p className="text-rose-600 font-black text-base leading-tight uppercase tracking-tighter">松手开启小窗</p>
                <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Floating Window</p>
              </div>
            </div>
          )}

          {dragIcon.isOverDivider && (
            <div className="absolute flex items-center justify-center px-4 py-2 bg-rose-500/90 text-white rounded-full text-xs font-bold shadow-xl animate-bounce" style={{ left: dragIcon.x + 20, top: dragIcon.y - 40 }}>
              {isTSplit ? '拖拽至此四分屏' : '拖拽至此三分屏'}
            </div>
          )}
          {hasBackgroundApp && !dragIcon.isOverDivider && (
            <>
              <div 
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-4/5 transition-all duration-500 rounded-r-[100%] flex flex-col items-center justify-center ${dragIcon.isOverLeftZone ? 'w-[160px]' : 'w-0'}`} 
                style={{ 
                  background: dragIcon.isLeftIntentConfirmed ? 'radial-gradient(ellipse at left, rgba(251, 113, 154, 0.4) 0%, transparent 80%)' : 'radial-gradient(ellipse at left, rgba(251, 113, 154, 0.1) 0%, transparent 80%)',
                  borderRight: dragIcon.isLeftIntentConfirmed ? '3px dashed rgba(251, 113, 154, 0.4)' : 'none'
                }}
              >
                <div className={`transition-all duration-300 transform ${dragIcon.isLeftIntentConfirmed ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-x-4'}`}>
                  <p className="text-rose-600 font-black text-lg vertical-text">吸附至左侧分屏</p>
                </div>
              </div>

              <div 
                className={`absolute right-0 top-1/2 -translate-y-1/2 h-4/5 transition-all duration-500 rounded-l-[100%] flex flex-col items-center justify-center ${dragIcon.isOverRightZone ? 'w-[160px]' : 'w-0'}`} 
                style={{ 
                  background: dragIcon.isRightIntentConfirmed ? 'radial-gradient(ellipse at right, rgba(251, 113, 154, 0.4) 0%, transparent 80%)' : 'radial-gradient(ellipse at right, rgba(251, 113, 154, 0.1) 0%, transparent 80%)',
                  borderLeft: dragIcon.isRightIntentConfirmed ? '3px dashed rgba(251, 113, 154, 0.4)' : 'none'
                }}
              >
                <div className={`transition-all duration-300 transform ${dragIcon.isRightIntentConfirmed ? 'opacity-100 scale-100' : 'opacity-0 scale-90 -translate-x-4'}`}>
                  <p className="text-rose-600 font-black text-lg vertical-text">吸附至右侧分屏</p>
                </div>
              </div>
            </>
          )}

          <div className="absolute pointer-events-none transition-transform duration-75" style={{ left: dragIcon.x, top: dragIcon.y, transform: 'translate(-50%, -50%) scale(1.1)', zIndex: 9999 }}>
             <div className={`${APP_CONFIG[dragIcon.type].color} w-14 h-14 rounded-2xl shadow-2xl border flex items-center justify-center overflow-hidden`}>
                {APP_CONFIG[dragIcon.type].icon}
             </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {snapping && (
          <motion.div
            initial={{ left: snapping.startX, top: snapping.startY, scale: 1.1, opacity: 1 }}
            animate={{ left: snapping.targetX, top: snapping.targetY, scale: 0.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onAnimationComplete={() => {
              openApp(snapping.type, snapping.targetState as WindowState | 'split-divider');
              setSnapping(null);
            }}
            className="absolute pointer-events-none z-[300]"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
             <div className={`${APP_CONFIG[snapping.type].color} w-14 h-14 rounded-2xl shadow-2xl border flex items-center justify-center overflow-hidden`}>
                {APP_CONFIG[snapping.type].icon}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.vertical-text { writing-mode: vertical-rl; text-orientation: mixed; letter-spacing: 0.15em; }`}</style>
    </div>
  );
};

export default App;
