
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
}

const App: React.FC = () => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const touchStartY = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Desktop Mode vs Immersive Mode logic
  const hasOpenApps = apps.filter(a => a.state !== 'minimized').length > 0;

  useEffect(() => {
    // If no apps exist at all, we are in pure desktop mode -> Force dock visible
    if (apps.length === 0) {
      setIsDockVisible(true);
    }
  }, [apps.length]);

  useEffect(() => {
    // When transitioning into immersive mode (first app opened), hide dock
    if (hasOpenApps) {
      // Logic could be added here if we wanted to auto-hide on every task switch, 
      // but keeping it simple as per user request to prioritize manual control in apps.
    }
  }, [hasOpenApps]);

  const [splitRatios, setSplitRatios] = useState<[number, number]>([0.5, 0.66]);
  const [resizingDividerIndex, setResizingDividerIndex] = useState<number | null>(null);

  const [dragIcon, setDragIcon] = useState<DragIconState | null>(null);
  const [activeTriggerZone, setActiveTriggerZone] = useState<'left' | 'right' | 'floating' | 'divider' | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prevent scrolling on mobile when dragging
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (dragIcon || resizingDividerIndex !== null) {
        e.preventDefault();
      }
    };

    if (dragIcon || resizingDividerIndex !== null) {
      window.addEventListener('touchmove', preventDefault, { passive: false });
    }
    return () => window.removeEventListener('touchmove', preventDefault);
  }, [dragIcon, resizingDividerIndex]);

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

  const isFourGridFull = useMemo(() => {
    const quadTileStates: WindowState[] = ['split-left-top', 'split-left-bottom', 'split-right-top', 'split-right-bottom'];
    const quadApps = apps.filter(a => quadTileStates.includes(a.state));
    return quadApps.length === 4;
  }, [apps]);

  useEffect(() => {
    console.log('四宫格形态已满：', isFourGridFull);
  }, [isFourGridFull]);

  const hasBackgroundApp = useMemo(() => 
    apps.some(a => a.state === 'maximized' || a.state.startsWith('split-')),
    [apps]
  );

  const openApp = useCallback((type: AppType, forceState?: WindowState | 'split-divider') => {
    const existingApp = apps.find(a => a.type === type);
    const newZIndex = zIndexCounter + 1;
    const screenWidth = window.innerWidth;

    // Quad-tile Detection & Replacement Logic
    const quadTileStates: WindowState[] = ['split-left-top', 'split-left-bottom', 'split-right-top', 'split-right-bottom'];
    const quadAppsInField = apps.filter(a => quadTileStates.includes(a.state));
    
    // Trigger replacement if in quad-tile and opening a 5th app (or moving one into the tile area)
    if (quadAppsInField.length === 4 && !forceState && (!existingApp || !quadTileStates.includes(existingApp.state))) {
      const victim = [...quadAppsInField].sort((a, b) => a.zIndex - b.zIndex)[0];
      const targetState = victim.state;
      
      setApps(prev => {
        let updated = prev.map(a => {
          if (a.id === victim.id) {
            return { 
              ...a, 
              state: 'floating-icon' as WindowState,
              zIndex: newZIndex - 1,
              position: { x: window.innerWidth - 280 - 40, y: 40 },
              size: { width: 280, height: 480 }
            };
          }
          return a;
        });

        const newId = existingApp?.id || Math.random().toString(36).substr(2, 9);
        const newAppInstance: AppInstance = {
          id: newId,
          type,
          title: type,
          state: targetState,
          zIndex: newZIndex,
          position: { x: 0, y: 0 },
          size: { width: '50%', height: '50%' }
        };

        if (existingApp) {
          return updated.map(a => a.id === existingApp.id ? newAppInstance : a);
        }
        return [...updated, newAppInstance];
      });

      setActiveAppId(existingApp?.id || 'new-app-temp-id');
      setZIndexCounter(newZIndex + 1);
      return;
    }

    if (forceState === 'split-divider') {
      const leftApp = apps.find(a => a.state === 'split-left');
      const rightApp = apps.find(a => a.state === 'split-right');
      const rightT = apps.find(a => a.state === 'split-right-top');
      const rightB = apps.find(a => a.state === 'split-right-bottom');

      // Quad-tile Replacement Logic if dropping on divider
      const quadTileStates: WindowState[] = ['split-left-top', 'split-left-bottom', 'split-right-top', 'split-right-bottom'];
      const quadAppsInField = apps.filter(a => quadTileStates.includes(a.state));

      if (quadAppsInField.length === 4) {
        const victim = [...quadAppsInField].sort((a, b) => a.zIndex - b.zIndex)[0];
        const targetState = victim.state;
        
        setApps(prev => {
          let updated = prev.map(a => {
            if (a.id === victim.id) {
              return { 
                ...a, 
                state: 'floating-icon' as WindowState,
                zIndex: newZIndex - 1,
                position: { x: window.innerWidth - 280 - 40, y: 40 },
                size: { width: 280, height: 480 }
              };
            }
            return a;
          });

          const newId = existingApp?.id || Math.random().toString(36).substr(2, 9);
          const newAppInstance: AppInstance = {
            id: newId,
            type,
            title: APP_CONFIG[type].title,
            state: targetState,
            zIndex: newZIndex,
            position: { x: 0, y: 0 },
            size: { width: '50%', height: '50%' }
          };

          if (existingApp) {
            return updated.map(a => a.id === existingApp.id ? newAppInstance : a);
          }
          return [...updated, newAppInstance];
        });

        setActiveAppId(existingApp?.id || 'new-app-temp-id');
        setZIndexCounter(newZIndex + 1);
        return;
      }

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

      let filteredApps = prev.filter(a => a.id !== id);
      const splitAfter = filteredApps.filter(a => a.state.startsWith('split-') && a.state !== 'split-sidebar-left' && a.state !== 'split-sidebar-right');
      const sidebarsAfter = filteredApps.filter(a => a.state === 'split-sidebar-left' || a.state === 'split-sidebar-right');
      const floatingIcons = filteredApps.filter(a => a.state === 'floating-icon');

      // 1. If we have a floating icon and closed a split window, restore the icon first
      if (closingApp.state.startsWith('split-') && floatingIcons.length > 0) {
        const iconToRestore = floatingIcons[0];
        return filteredApps.map(a => 
          a.id === iconToRestore.id 
            ? { ...a, state: closingApp.state as WindowState } 
            : a
        );
      }

      // 2. If we have a sidebar app and a main split closed, promote the sidebar
      if (closingApp.state.startsWith('split-') && !closingApp.state.includes('sidebar') && sidebarsAfter.length > 0) {
        const sidebarToPromote = sidebarsAfter[0];
        return filteredApps.map(a => 
          a.id === sidebarToPromote.id 
            ? { ...a, state: closingApp.state as WindowState } 
            : a
        );
      }

      // 3. Normal Layout Reflow Hierarchy
      if (closingApp.state.startsWith('split-')) {
        const count = splitAfter.length;

        if (count === 3) {
          // Reflow to 3 equal columns
          const states: WindowState[] = ['split-left', 'split-middle', 'split-right'];
          setSplitRatios([0.33, 0.66]);
          let i = 0;
          return filteredApps.map(a => {
            if (a.state.startsWith('split-') && !a.state.includes('sidebar')) {
              return { ...a, state: states[i++] };
            }
            return a;
          });
        }
        
        if (count === 2) {
          // Reflow to 2 columns (Dual Split)
          const states: WindowState[] = ['split-left', 'split-right'];
          setSplitRatios([0.5, 0.66]);
          let i = 0;
          return filteredApps.map(a => {
            if (a.state.startsWith('split-') && !a.state.includes('sidebar')) {
              return { ...a, state: states[i++] };
            }
            return a;
          });
        }

        if (count === 1) {
          // Reflow to maximized
          return filteredApps.map(a => {
            if (a.id === splitAfter[0].id) {
              return { ...a, state: 'maximized' as WindowState };
            }
            return a;
          });
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
      
      // 1. Physical Zoning Logic
      const leftBoundary = screenWidth * 0.3;
      const rightBoundary = screenWidth * 0.7;
      
      // Floating Zone Priority (Top-Right 250x250)
      const isFloating = hasBackgroundApp && x > screenWidth - 250 && y < 250;
      
      // Divider Sensitivity
      const dividerX = splitRatios[0] * screenWidth;
      const isDiv = (isDualSplit || isTSplit || isFourGridFull) && Math.abs(x - dividerX) < 40 && y > 100 && y < screenHeight - 100;

      // Basic Overlaps
      const isOverL = !isFloating && !isDiv && hasBackgroundApp && x < leftBoundary;
      const isOverR = !isFloating && !isDiv && hasBackgroundApp && x > rightBoundary;

      // Determine current hovered zone (Raw)
      const currentHoveredZone = isFloating ? 'floating' : (isDiv ? 'divider' : (isOverL ? 'left' : (isOverR ? 'right' : null)));

      // 2. Hover Intent Mechanism (350ms delay)
      if (currentHoveredZone !== activeTriggerZone) {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        
        if (currentHoveredZone) {
          hoverTimerRef.current = setTimeout(() => {
            setActiveTriggerZone(currentHoveredZone as any);
            if (currentHoveredZone === 'divider' && window.navigator.vibrate) {
              window.navigator.vibrate(20);
            }
          }, 350);
        } else {
          setActiveTriggerZone(null);
        }
      }

      setDragIcon(prev => prev ? { 
        ...prev, x, y, 
        isOverFloatingZone: isFloating, 
        isOverLeftZone: isOverL, 
        isOverRightZone: isOverR, 
        isOverDivider: isDiv 
      } : null);
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
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setDraggingAppId(null);
    if (dragIcon) {
      // 3. Drop to Execute: Only if zone is verified (active)
      if (activeTriggerZone === 'divider') openApp(dragIcon.type, 'split-divider');
      else if (activeTriggerZone === 'left') openApp(dragIcon.type, 'split-left');
      else if (activeTriggerZone === 'right') openApp(dragIcon.type, 'split-right');
      else if (activeTriggerZone === 'floating') openApp(dragIcon.type, 'floating');
      
      setDragIcon(null);
      setActiveTriggerZone(null);
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
            setApps(prev => prev.map(a => {
              if (a.id === id) {
                const newState = a.state === 'floating-icon' ? 'floating' : a.state;
                return { ...a, state: newState as WindowState, zIndex: zIndexCounter + 1 };
              }
              return a;
            })); 
            setActiveAppId(id);
            if (hasOpenApps) setIsDockVisible(false); 
          }}
          onOpenApp={openApp}
          splitRatios={splitRatios}
          onClickWallpaper={() => {
            if (hasOpenApps) setIsDockVisible(false);
          }}
          isResizing={resizingDividerIndex !== null}
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
              className={`absolute top-0 bottom-0 z-[100] group cursor-col-resize flex items-center justify-center pointer-events-auto bg-transparent hover:bg-slate-500/5 transition-colors ${activeTriggerZone === 'divider' ? 'bg-rose-500/10 border-x border-rose-500/20' : ''}`}
              style={{ 
                left: `calc(${lOffset}px + ${splitRatios[0]} * (100% - ${lOffset + rOffset}px))`, 
                width: '16px', 
                transform: 'translateX(-50%)', 
                touchAction: 'none' 
              }}
              onPointerDown={(e) => { e.stopPropagation(); setResizingDividerIndex(0); }}
            >
              <div className={`w-1 h-12 rounded-full bg-slate-300 transition-all duration-300 group-hover:bg-slate-400 group-hover:h-24 ${resizingDividerIndex === 0 ? 'bg-slate-600 h-32 w-1.5 shadow-lg' : ''} ${activeTriggerZone === 'divider' ? 'bg-rose-500 h-40 w-1.5 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : ''}`} />
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
              className={`absolute right-0 top-0 w-64 h-64 transition-all duration-500 rounded-bl-full flex items-center justify-center ${activeTriggerZone === 'floating' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-12 -translate-y-12'}`}
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

          {activeTriggerZone === 'divider' && (
            <div className="absolute flex items-center justify-center px-4 py-2 bg-rose-500 text-white rounded-full text-xs font-bold shadow-2xl animate-bounce whitespace-nowrap z-[210] border border-white/20" style={{ left: dragIcon.x + 20, top: dragIcon.y - 60 }}>
              {isFourGridFull ? '替换新任务' : (isTSplit ? '释放以开启四分屏' : '释放以开启三分屏')}
            </div>
          )}
          {hasBackgroundApp && activeTriggerZone !== 'divider' && (
            <>
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-3/5 transition-all duration-500 rounded-r-[100%] ${activeTriggerZone === 'left' ? 'w-[140px] opacity-100' : 'w-[80px] opacity-0'}`} style={{ background: 'radial-gradient(ellipse at left, rgba(251, 113, 154, 0.3) 0%, transparent 80%)' }}>
                <p className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 font-bold text-sm vertical-text">吸附至左侧</p>
              </div>
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-3/5 transition-all duration-500 rounded-l-[100%] ${activeTriggerZone === 'right' ? 'w-[140px] opacity-100' : 'w-[80px] opacity-0'}`} style={{ background: 'radial-gradient(ellipse at right, rgba(251, 113, 154, 0.3) 0%, transparent 80%)' }}>
                <p className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600 font-bold text-sm vertical-text">吸附至右侧</p>
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
      <style>{`.vertical-text { writing-mode: vertical-rl; text-orientation: mixed; letter-spacing: 0.15em; }`}</style>
    </div>
  );
};

export default App;
