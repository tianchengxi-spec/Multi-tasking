
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

import OnboardingModal from './components/OnboardingModal';
import CreateBoardPanel from './components/CreateBoardPanel';
import ControlCenter from './components/ControlCenter';
import ToolRingController from './components/ToolRingController';
import TaskSwitcher from './components/TaskSwitcher';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isTaskSwitcherOpen, setIsTaskSwitcherOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
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

  const [swappingAppId, setSwappingAppId] = useState<string | null>(null);
  const [swappingOverId, setSwappingOverId] = useState<string | null>(null);
  const [swapIconPos, setSwapIconPos] = useState({ x: 0, y: 0 });

  const [savedCombinations, setSavedCombinations] = useState<TaskCombination[]>([
    {
      id: 'default-toolring',
      name: '快捷工具环',
      apps: [
        { type: AppType.AI_ASSISTANT },
        { type: AppType.CALCULATOR },
        { type: AppType.DICTIONARY },
        { type: AppType.CALENDAR },
        { type: AppType.WHITEBOARD }
      ],
      mode: 'toolring',
      color: 'blue'
    }
  ]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [saveButtonPos, setSaveButtonPos] = useState({ x: 0, y: 0 });
  const saveButtonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click tracking for onboarding
  const [clickCount, setClickCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  const handleWallpaperClick = () => {
    if (hasOpenApps) {
      setIsDockVisible(false);
    }
    setShowSaveButton(false);

    const now = Date.now();
    if (now - lastClickTimeRef.current < 500) {
      const newCount = clickCount + 1;
      if (newCount >= 4) {
        setShowOnboarding(true);
        setClickCount(0);
      } else {
        setClickCount(newCount);
      }
    } else {
      setClickCount(1);
    }
    lastClickTimeRef.current = now;
  };

  // Prevent scrolling on mobile when dragging
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (dragIcon || resizingDividerIndex !== null || showSaveButton) {
        e.preventDefault();
      }
    };

    if (dragIcon || resizingDividerIndex !== null || showSaveButton) {
      window.addEventListener('touchmove', preventDefault, { passive: false });
    }
    return () => window.removeEventListener('touchmove', preventDefault);
  }, [dragIcon, resizingDividerIndex, showSaveButton]);

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
              position: { x: window.innerWidth - 270 - 40, y: 40 },
              size: { width: 270, height: 450 }
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
                position: { x: window.innerWidth - 270 - 40, y: 40 },
                size: { width: 270, height: 450 }
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
          size: forceState === 'floating' ? { width: 270, height: 450 } : { width: '100%', height: '100%' },
          position: forceState === 'floating' ? { x: screenWidth - 270 - 16, y: 16 } : { x: 0, y: 0 }
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
      position: newState === 'floating' ? { x: screenWidth - 270 - 16, y: 16 } : { x: 0, y: 0 },
      size: newState === 'floating' ? { width: 270, height: 450 } : { width: '100%', height: '100%' }
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
    if (swappingAppId) {
      const x = e.clientX;
      const y = e.clientY;
      setSwapIconPos({ x, y });
      
      // Basic hit testing for split windows
      const screenWidth = window.innerWidth;
      const workingWidth = screenWidth - lOffset - rOffset;
      const leftBoundary = lOffset + splitRatios[0] * workingWidth;
      const rightBoundary = lOffset + splitRatios[1] * workingWidth;
      
      const targetApp = apps.find(a => {
        if (a.id === swappingAppId || a.state === 'minimized') return false;
        
        if (x < leftBoundary) {
          return a.state === 'split-left' || a.state === 'split-left-top' || a.state === 'split-left-bottom';
        } else if (isTripleSplit && x < rightBoundary) {
          return a.state === 'split-middle';
        } else {
          return a.state === 'split-right' || a.state === 'split-right-top' || a.state === 'split-right-bottom';
        }
      });
      
      setSwappingOverId(targetApp?.id || null);
      return;
    }

    // Top-right pull down detector
    if (touchStartY.current !== null && !dragIcon && !draggingAppId && !resizingDividerIndex) {
      const deltaY = e.clientY - touchStartY.current;
      if (deltaY > 50 && touchStartY.current < 60 && e.clientX > window.innerWidth * 0.7) {
        setIsControlCenterOpen(true);
        touchStartY.current = null;
      }
    }

    if (draggingAppId) {
      const app = apps.find(a => a.id === draggingAppId);
      if (app && app.state === 'floating') {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Window Size
        const winW = 270;
        const winH = 450;
        
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
    touchStartY.current = null;
    if (swappingAppId) {
      if (swappingOverId) {
        setApps(prev => {
          const app1 = prev.find(a => a.id === swappingAppId);
          const app2 = prev.find(a => a.id === swappingOverId);
          if (app1 && app2) {
             const state1 = app1.state;
             const state2 = app2.state;
             return prev.map(a => {
               if (a.id === swappingAppId) return { ...a, state: state2 };
               if (a.id === swappingOverId) return { ...a, state: state1 };
               return a;
             });
          }
          return prev;
        });
      }
      setSwappingAppId(null);
      setSwappingOverId(null);
    }
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

  const togglePin = useCallback((id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  }, []);

  const toggleTopmost = useCallback((id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, isTopmost: !a.isTopmost } : a));
  }, []);

  const hasSidebarLeft = useMemo(() => apps.some(a => a.state === 'split-sidebar-left'), [apps]);
  const hasSidebarRight = useMemo(() => apps.some(a => a.state === 'split-sidebar-right'), [apps]);
  const sidebarWidth = 60;
  const lOffset = hasSidebarLeft ? sidebarWidth : 0;
  const rOffset = hasSidebarRight ? sidebarWidth : 0;

  const shouldUseDarkIcons = useMemo(() => {
    return apps.some(app => {
      if (app.state === 'minimized' || app.state === 'floating-icon') return false;
      if (app.state === 'maximized') return true;
      if (app.state.startsWith('split-')) {
        // Exclude bottom split states as they don't cover the top status bar area
        if (app.state === 'split-left-bottom' || app.state === 'split-right-bottom') return false;
        return true;
      }
      if (app.state === 'floating') {
        // If a floating window is at the very top (y < 40), switch to dark icons
        return app.position.y < 40;
      }
      return false;
    });
  }, [apps]);

  const startStudy = useCallback(() => {
    const newZIndex = zIndexCounter + 2;
    const driveId = Math.random().toString(36).substr(2, 9);
    const notesId = Math.random().toString(36).substr(2, 9);

    const driveApp: AppInstance = {
      id: driveId,
      type: AppType.CLOUD_DRIVE,
      title: AppType.CLOUD_DRIVE,
      state: 'split-left',
      zIndex: newZIndex - 1,
      position: { x: 0, y: 0 },
      size: { width: '60%', height: '100%' }
    };

    const notesApp: AppInstance = {
      id: notesId,
      type: AppType.NOTES,
      title: AppType.NOTES,
      state: 'split-right',
      zIndex: newZIndex,
      position: { x: 0, y: 0 },
      size: { width: '40%', height: '100%' },
      initialData: { noteId: '4' }
    };

    setApps(prev => {
      const others = prev.filter(a => a.type !== AppType.CLOUD_DRIVE && a.type !== AppType.NOTES).map(a => ({...a, state: 'minimized' as WindowState}));
      return [...others, driveApp, notesApp];
    });

    setSplitRatios([0.6, 0.66]);
    setActiveAppId(notesId);
    setZIndexCounter(newZIndex + 1);
    setIsDockVisible(false);
  }, [zIndexCounter]);

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden relative border-[12px] border-slate-900 rounded-[3rem] shadow-2xl select-none"
      onPointerUp={handlePointerUpGlobal}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUpGlobal}
      style={{ touchAction: 'none' }}
    >
      {/* Global Background Wallpaper */}
      <img 
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=100&w=3840" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-[-1]"
        alt="Wallpaper"
        referrerPolicy="no-referrer"
      />

      {/* Glassmorphism/Overlay Layer */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none z-[-1]" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[-1]" style={{ backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="flex-1 flex flex-col overflow-hidden relative" onPointerDown={(e) => { touchStartY.current = e.clientY; }}>
        <div className="absolute top-0 w-full z-50">
          <SystemBar isDark={shouldUseDarkIcons} />
        </div>
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
          onClickWallpaper={handleWallpaperClick}
          isResizing={resizingDividerIndex !== null}
          swappingAppId={swappingAppId}
          swappingOverId={swappingOverId}
          onDragAppStart={(id, x, y) => {
            const app = apps.find(a => a.id === id);
            if (!app) return;
            
            if (app.isPinned) return; // Prevent movement if pinned

            if (app.state === 'floating') {
              setDraggingAppId(id);
              setDragOffset({ x: x - app.position.x, y: y - app.position.y });
              setZIndexCounter(z => z + 1);
              setApps(prev => prev.map(a => a.id === id ? { ...a, zIndex: zIndexCounter + 1 } : a));
              setActiveAppId(id);
            } else if (app.state.startsWith('split-')) {
              setSwappingAppId(id);
              setSwapIconPos({ x, y });
              setZIndexCounter(z => z + 1);
              setApps(prev => prev.map(a => a.id === id ? { ...a, zIndex: zIndexCounter + 1 } : a));
              setActiveAppId(id);
            }
          }}
          onStartStudy={startStudy}
          onOpenCreator={() => setIsCreatorOpen(true)}
          onTogglePin={togglePin}
          onToggleTopmost={toggleTopmost}
        />
      </div>

      <ControlCenter 
        isOpen={isControlCenterOpen} 
        onClose={() => setIsControlCenterOpen(false)} 
      />

      <ToolRingController 
        combinations={savedCombinations}
        onRestore={(combo) => {
          setApps(prev => {
            const minimized = prev.map(a => ({ ...a, state: 'minimized' as WindowState }));
            const newApps = [...minimized];
            combo.apps.forEach((appData, index) => {
              const existingIdx = newApps.findIndex(a => a.type === appData.type);
              const newId = Math.random().toString(36).substr(2, 9);
              if (existingIdx !== -1) {
                newApps[existingIdx] = { ...newApps[existingIdx], state: 'maximized' as WindowState, zIndex: zIndexCounter + 10 + index };
              } else {
                newApps.push({
                  id: newId,
                  type: appData.type,
                  title: appData.type,
                  state: 'maximized' as WindowState,
                  zIndex: zIndexCounter + 10 + index,
                  position: { x: 0, y: 0 },
                  size: { width: '100%', height: '100%' }
                });
              }
            });
            return newApps;
          });
          setZIndexCounter(prev => prev + 20);
          setIsDockVisible(false);
        }}
        onOpenSingleApp={(type) => openApp(type, 'floating')}
      />

      <TaskSwitcher 
        isOpen={isTaskSwitcherOpen}
        onClose={() => setIsTaskSwitcherOpen(false)}
        combinations={savedCombinations}
        currentApps={apps.filter(a => a.state !== 'minimized' && a.state !== 'floating-icon')}
        onRestore={(combo) => {
          setApps(prev => {
            const minimized = prev.map(a => ({ ...a, state: 'minimized' as WindowState }));
            const newApps = [...minimized];
            combo.apps.forEach((appData, index) => {
              const existingIdx = newApps.findIndex(a => a.type === appData.type);
              if (existingIdx !== -1) {
                newApps[existingIdx] = { ...newApps[existingIdx], state: appData.state || 'maximized' as WindowState, zIndex: zIndexCounter + 10 + index };
              } else {
                const newId = Math.random().toString(36).substr(2, 9);
                newApps.push({
                  id: newId,
                  type: appData.type,
                  title: appData.type,
                  state: appData.state || 'maximized' as WindowState,
                  zIndex: zIndexCounter + 10 + index,
                  position: { x: 0, y: 0 },
                  size: { width: '100%', height: '100%' }
                });
              }
            });
            return newApps;
          });
          setZIndexCounter(prev => prev + 20);
          setIsTaskSwitcherOpen(false);
        }}
        onClearTasks={() => {
          setApps(prev => prev.map(a => ({ ...a, state: 'minimized' as WindowState })));
          setIsTaskSwitcherOpen(false);
        }}
      />

      {/* Swipe Triggers for Task Switcher (Bottom Corners) */}
      {(apps.some(a => a.state.startsWith('split-') || a.state === 'maximized')) && !isTaskSwitcherOpen && (
        <>
          <div 
            className="absolute bottom-0 left-0 w-24 h-12 z-[2500] cursor-n-resize group"
            onPointerDown={(e) => {
              const startY = e.clientY;
              const handleMove = (moveEvent: PointerEvent) => {
                if (startY - moveEvent.clientY > 50) {
                  setIsTaskSwitcherOpen(true);
                  window.removeEventListener('pointermove', handleMove);
                }
              };
              window.addEventListener('pointermove', handleMove);
              window.addEventListener('pointerup', () => window.removeEventListener('pointermove', handleMove), { once: true });
            }}
          >
            <div className="absolute bottom-1 left-4 w-8 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />
          </div>
          <div 
            className="absolute bottom-0 right-0 w-24 h-12 z-[2500] cursor-n-resize group"
            onPointerDown={(e) => {
              const startY = e.clientY;
              const handleMove = (moveEvent: PointerEvent) => {
                if (startY - moveEvent.clientY > 50) {
                  setIsTaskSwitcherOpen(true);
                  window.removeEventListener('pointermove', handleMove);
                }
              };
              window.addEventListener('pointermove', handleMove);
              window.addEventListener('pointerup', () => window.removeEventListener('pointermove', handleMove), { once: true });
            }}
          >
            <div className="absolute bottom-1 right-4 w-8 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />
          </div>
        </>
      )}

      <Dock 
        openApps={apps.map(a => a.type)}
        onOpenApp={openApp}
        activeAppType={apps.find(a => a.id === activeAppId)?.type || null}
        isVisible={isDockVisible}
        onDragStart={(type, x, y) => setDragIcon({ type, x, y, isOverFloatingZone: false, isOverLeftZone: false, isOverRightZone: false, isOverDivider: false })}
        onVisibilityChange={setIsDockVisible}
        savedCombinations={savedCombinations}
        onRestoreCombination={(combo) => {
          setApps(prev => {
            // Minimize current apps
            const minimized = prev.map(a => ({ ...a, state: 'minimized' as WindowState }));
            
            // Add or Restore apps from combo
            const newApps = [...minimized];
            combo.apps.forEach((appData, index) => {
              const existingIdx = newApps.findIndex(a => a.type === appData.type);
              const newApp: AppInstance = {
                id: Math.random().toString(36).substr(2, 9),
                type: appData.type,
                title: appData.type,
                state: appData.state,
                zIndex: 10 + index,
                position: { x: 0, y: 0 },
                size: { width: '100%', height: '100%' }
              };
              if (existingIdx !== -1) {
                newApps[existingIdx] = { ...newApps[existingIdx], state: appData.state, zIndex: 10 + index };
              } else {
                newApps.push(newApp);
              }
            });
            return newApps;
          });
          
          if (combo.splitRatios) {
            setSplitRatios(combo.splitRatios);
          } else {
            if (combo.apps.length === 2) setSplitRatios([0.5, 0.66]);
            if (combo.apps.length === 3) setSplitRatios([0.33, 0.66]);
          }
          
          setIsDockVisible(false);
        }}
        onRemoveCombination={(id) => setSavedCombinations(prev => prev.filter(c => c.id !== id))}
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
              onPointerDown={(e) => { 
                e.stopPropagation(); 
                setResizingDividerIndex(0); 
                const { clientX, clientY } = e;
                if (saveButtonTimerRef.current) clearTimeout(saveButtonTimerRef.current);
                saveButtonTimerRef.current = setTimeout(() => {
                  setShowSaveButton(true);
                  setSaveButtonPos({ x: clientX, y: clientY - 80 });
                  if (window.navigator.vibrate) window.navigator.vibrate(50);
                }, 600);
              }}
              onPointerUp={() => { if (saveButtonTimerRef.current) clearTimeout(saveButtonTimerRef.current); }}
              onPointerMove={(e) => {
                if (resizingDividerIndex === 0 && saveButtonTimerRef.current) {
                   clearTimeout(saveButtonTimerRef.current);
                   saveButtonTimerRef.current = null;
                }
              }}
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

      {swappingAppId && (
        <div 
          className="absolute pointer-events-none z-[9999] transition-transform duration-75"
          style={{ left: swapIconPos.x, top: swapIconPos.y, transform: 'translate(-50%, -50%) scale(1.1)' }}
        >
          {(() => {
            const app = apps.find(a => a.id === swappingAppId);
            if (!app) return null;
            const config = APP_CONFIG[app.type];
            return (
              <div className={`${config.color} w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center border-2 border-white/50 backdrop-blur-md`}>
                {React.cloneElement(config.icon as React.ReactElement<any>, { size: 32 })}
              </div>
            );
          })()}
        </div>
      )}

      {dragIcon && (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
          {/* Floating Zone Indicator (Top-Right 1/4 Circle) */}
          {hasBackgroundApp && (
            <div 
              className={`absolute right-0 top-0 w-64 h-64 transition-all duration-500 rounded-bl-full flex items-center justify-center ${activeTriggerZone === 'floating' ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-12 -translate-y-12'}`}
              style={{ 
                background: 'radial-gradient(circle at 70% 30%, rgba(8, 115, 255, 0.25) 0%, transparent 75%)',
                backdropFilter: 'blur(16px)',
                transformOrigin: 'top right'
              }}
            >
              <div className="text-center pt-4 pl-8">
                <p className="text-blue-600 font-bold text-sm leading-tight uppercase tracking-tighter">松手开启小窗</p>
              </div>
            </div>
          )}

          {activeTriggerZone === 'divider' && (
            <div className="absolute flex items-center justify-center px-4 py-2 bg-[#0873FF]/25 text-blue-900 rounded-full text-xs font-bold shadow-2xl animate-bounce whitespace-nowrap z-[210] border border-blue-200/50" style={{ left: dragIcon.x + 20, top: dragIcon.y - 60 }}>
              {isFourGridFull ? '替换新任务' : (isTSplit ? '释放以开启四分屏' : '释放以开启三分屏')}
            </div>
          )}
          {hasBackgroundApp && activeTriggerZone !== 'divider' && (
            <>
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-3/5 transition-all duration-500 rounded-r-[100%] ${activeTriggerZone === 'left' ? 'w-[140px] opacity-100' : 'w-[80px] opacity-0'}`} style={{ background: 'radial-gradient(ellipse at left, rgba(8, 115, 255, 0.25) 0%, transparent 80%)' }}>
                <p className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-sm vertical-text">吸附至左侧</p>
              </div>
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-3/5 transition-all duration-500 rounded-l-[100%] ${activeTriggerZone === 'right' ? 'w-[140px] opacity-100' : 'w-[80px] opacity-0'}`} style={{ background: 'radial-gradient(ellipse at right, rgba(8, 115, 255, 0.25) 0%, transparent 80%)' }}>
                <p className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-sm vertical-text">吸附至右侧</p>
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

      {showSaveButton && (
        <div 
          className="absolute z-[200] flex items-center justify-center animate-in fade-in zoom-in duration-300"
          style={{ left: saveButtonPos.x, top: saveButtonPos.y, transform: 'translateX(-50%)' }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const splitApps = apps.filter(a => a.state.startsWith('split-'));
              if (splitApps.length >= 2) {
                const newCombo: TaskCombination = {
                  id: Math.random().toString(36).substr(2, 9),
                  apps: splitApps.map(a => ({ type: a.type, state: a.state })),
                  splitRatios: [...splitRatios],
                  timestamp: Date.now()
                };
                setSavedCombinations(prev => [...prev, newCombo]);
                setShowSaveButton(false);
                if (window.navigator.vibrate) window.navigator.vibrate([10, 30, 20]);
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-xl border border-white/50 text-slate-800 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:bg-white transition-all active:scale-95 group overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Plus size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-sm">保存当前任务组合</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          {/* Connector triangle */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 backdrop-blur-xl border-r border-b border-white/50 rotate-45" />
        </div>
      )}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        onConfirm={() => setShowOnboarding(false)} 
      />

      <CreateBoardPanel 
        isOpen={isCreatorOpen} 
        onClose={() => setIsCreatorOpen(false)} 
        onDeploy={(data) => {
          const newCombo: TaskCombination = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.title,
            mode: data.mode,
            color: data.color,
            apps: data.apps.map((type, i) => {
              let state: WindowState = 'maximized';
              if (data.mode === 'board') {
                if (data.apps.length === 2) state = i === 0 ? 'split-left' : 'split-right';
                else if (data.apps.length === 3) {
                   if (i === 0) state = 'split-left';
                   else if (i === 1) state = 'split-right-top';
                   else state = 'split-right-bottom';
                }
                else if (data.apps.length >= 4) {
                   if (i === 0) state = 'split-left-top';
                   else if (i === 1) state = 'split-left-bottom';
                   else if (i === 2) state = 'split-right-top';
                   else state = 'split-right-bottom';
                }
              } else {
                // Toolrings are minimized by default in the dock/panel, or we can just save them
                state = 'minimized';
              }
              return { type, state };
            }),
            splitRatios: data.apps.length === 3 && data.mode === 'board' ? [0.5, 0.66] : [0.5, 0.66],
            timestamp: Date.now()
          };
          setSavedCombinations(prev => [...prev, newCombo]);
        }}
      />
      
      <style>{`.vertical-text { writing-mode: vertical-rl; text-orientation: mixed; letter-spacing: 0.15em; }`}</style>
    </div>
  );
};

export default App;
