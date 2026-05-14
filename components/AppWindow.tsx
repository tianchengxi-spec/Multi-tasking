
import React, { useMemo } from 'react';
import { X, Minus, Maximize2, Pin, ArrowUpToLine } from 'lucide-react';
import { motion } from 'motion/react';
import { AppInstance, WindowState, AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface AppWindowProps {
  app: AppInstance;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
  splitRatios: [number, number];
  isTripleVertical?: boolean;
  hasSidebarLeft?: boolean;
  hasSidebarRight?: boolean;
  onDragStart?: (id: string, x: number, y: number) => void;
  isResizing?: boolean;
  isSwapping?: boolean;
  isSwappingOver?: boolean;
  onTogglePin?: () => void;
  onToggleTopmost?: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ 
  app, 
  isActive, 
  onClose, 
  onMinimize, 
  onFocus,
  children,
  splitRatios,
  isTripleVertical = false,
  hasSidebarLeft = false,
  hasSidebarRight = false,
  onDragStart,
  isResizing = false,
  isSwapping = false,
  isSwappingOver = false,
  onTogglePin,
  onToggleTopmost
}) => {
  const config = APP_CONFIG[app.type];
  
  const getWindowStateClasses = () => {
    switch (app.state) {
      case 'maximized':
        return 'inset-0 w-full h-full rounded-none z-50 shadow-none';
      case 'split-left':
      case 'split-middle':
      case 'split-right':
      case 'split-left-top':
      case 'split-left-bottom':
      case 'split-right-top':
      case 'split-right-bottom':
      case 'split-sidebar-left':
      case 'split-sidebar-right':
        return 'top-0 h-full rounded-none border-x z-40 shadow-none';
      case 'floating':
        return 'rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-200 bg-white overflow-hidden ring-1 ring-slate-900/5 max-h-[calc(100vh-100px)]';
      case 'floating-icon':
        return 'rounded-2xl shadow-xl border border-slate-200 overflow-hidden cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200';
      default:
        return 'rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border-slate-200/50 bg-white overflow-hidden ring-1 ring-slate-900/5';
    }
  };

  const style: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: (app.isTopmost || app.isPinned) ? 10000 + app.zIndex : (app.state === 'floating-icon' ? 2000 + app.zIndex : (app.state === 'floating' ? 1000 + app.zIndex : app.zIndex)),
      transition: (isResizing || isSwapping) ? 'none' : 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: isSwapping ? 0.4 : 1,
    };

    if (app.state === 'floating' || app.state === 'floating-icon') {
      return {
        ...baseStyle,
        left: app.state === 'floating-icon' ? window.innerWidth - 80 : app.position.x,
        top: app.state === 'floating-icon' ? 40 : app.position.y,
        width: app.state === 'floating-icon' ? 56 : app.size.width,
        height: app.state === 'floating-icon' ? 56 : app.size.height,
        background: app.state === 'floating-icon' ? 'transparent' : undefined,
        border: app.state === 'floating-icon' ? 'none' : undefined,
        boxShadow: app.state === 'floating-icon' ? 'none' : undefined,
      };
    } 
    
    if (app.state === 'split-sidebar-left') {
      return {
        ...baseStyle,
        left: 0,
        width: '60px',
        background: 'rgba(241, 245, 249, 0.95)',
        zIndex: 100,
      };
    }

    if (app.state === 'split-sidebar-right') {
      return {
        ...baseStyle,
        right: 0,
        left: 'auto',
        width: '60px',
        background: 'rgba(241, 245, 249, 0.95)',
        zIndex: 100,
      };
    }
    
    // Split Screen Logic
    const sidebarWidth = 60;
    const lOffset = hasSidebarLeft ? sidebarWidth : 0;
    const rOffset = hasSidebarRight ? sidebarWidth : 0;
    const workingWidth = `calc(100% - ${lOffset + rOffset}px)`;
    
    if (app.state === 'split-left') {
      return {
        ...baseStyle,
        left: lOffset,
        width: `calc(${splitRatios[0]} * ${workingWidth})`,
      };
    } else if (app.state === 'split-left-top') {
      return {
        ...baseStyle,
        left: lOffset,
        top: 0,
        height: '50%',
        width: `calc(${splitRatios[0]} * ${workingWidth})`,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      };
    } else if (app.state === 'split-left-bottom') {
      return {
        ...baseStyle,
        left: lOffset,
        top: '50%',
        height: '50%',
        width: `calc(${splitRatios[0]} * ${workingWidth})`,
      };
    } else if (app.state === 'split-middle') {
      return {
        ...baseStyle,
        left: `calc(${lOffset}px + ${splitRatios[0]} * ${workingWidth})`,
        width: `calc((${(splitRatios[1] - splitRatios[0])}) * ${workingWidth})`,
      };
    } else if (app.state === 'split-right') {
      const startRatio = isTripleVertical ? splitRatios[1] : splitRatios[0];
      return {
        ...baseStyle,
        right: rOffset,
        left: 'auto',
        width: `calc(${1 - startRatio} * ${workingWidth})`,
      };
    } else if (app.state === 'split-right-top') {
      return {
        ...baseStyle,
        right: rOffset,
        left: 'auto',
        top: 0,
        height: '50%',
        width: `calc(${1 - splitRatios[0]} * ${workingWidth})`,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      };
    } else if (app.state === 'split-right-bottom') {
      return {
        ...baseStyle,
        right: rOffset,
        left: 'auto',
        top: '50%',
        height: '50%',
        width: `calc(${1 - splitRatios[0]} * ${workingWidth})`,
      };
    }

    return baseStyle;
  }, [app.state, app.zIndex, app.position, app.size, splitRatios, isTripleVertical, hasSidebarLeft, hasSidebarRight]);

  const isSidebar = app.state === 'split-sidebar-left' || app.state === 'split-sidebar-right';
  const isIconOnly = app.state === 'floating-icon';

  return (
    <motion.div 
      initial={
        app.state.startsWith('split-left') ? { opacity: 0, x: -20, scale: 0.95 } :
        app.state.startsWith('split-right') ? { opacity: 0, x: 20, scale: 0.95 } :
        { opacity: 0, scale: 0.98 }
      }
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
      style={style}
      className={`${getWindowStateClasses()} flex flex-col bg-white/95 backdrop-blur-md border-slate-200 select-none ${isActive && !isIconOnly ? 'ring-2 ring-blue-500/30' : ''}`}
      onClick={() => onFocus(app.id)}
    >
      {!isSidebar && isSwappingOver && (
        <div className="absolute inset-0 bg-white/40 border-[6px] border-white/60 z-[1000] pointer-events-none rounded-none animate-pulse flex items-center justify-center">
           <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-xl border border-white/50">
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">放手以调换位置</span>
           </div>
        </div>
      )}
      {isIconOnly ? (
        <div className="w-full h-full flex items-center justify-center p-2">
           <div className={`${config.color} w-full h-full rounded-xl shadow-lg flex items-center justify-center text-white`}>
              {React.cloneElement(config.icon as React.ReactElement<any>, { size: 28 })}
           </div>
        </div>
      ) : (
        <>
          <div 
            className={`${isSidebar ? 'min-h-[48px] pt-0' : (app.state === 'floating' || app.state.startsWith('split-') ? (app.state.includes('bottom') || app.state === 'floating' ? 'min-h-[40px] pt-0' : 'min-h-[64px] pt-6') : 'min-h-[88px] pt-10')} flex items-center ${isSidebar ? 'justify-center px-0' : 'justify-between px-4'} border-b border-slate-100 bg-slate-50/50 cursor-grab active:cursor-grabbing shrink-0`}
            onPointerDown={(e) => {
              if (onDragStart) {
                onDragStart(app.id, e.clientX, e.clientY);
              }
            }}
          >
            <div className={`flex items-center ${isSidebar ? 'flex-col gap-1' : 'gap-3'}`}>
              <div className={`${config.color} p-1 rounded-lg`}>
                {React.cloneElement(config.icon as React.ReactElement<any>, { size: isSidebar ? 24 : 16 })}
              </div>
              {!isSidebar && <span className="font-semibold text-slate-700 text-sm truncate max-w-[120px]">{app.title}</span>}
              {!isSidebar && app.state === 'floating' && (
                <div className="flex items-center gap-1.5 ml-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }} 
                    className={`p-1 rounded-md transition-all ${app.isPinned ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-200'}`}
                    title="钉起 (固定位置)"
                  >
                    <Pin size={12} className={app.isPinned ? 'fill-current' : ''} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleTopmost?.(); }} 
                    className={`p-1 rounded-md transition-all ${app.isTopmost ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-slate-200'}`}
                    title="挂起 (置顶显示)"
                  >
                    <ArrowUpToLine size={12} />
                  </button>
                </div>
              )}
            </div>
            {!isSidebar && (
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); onClose(app.id); }} className="p-1.5 hover:bg-rose-100 rounded-md transition-colors text-slate-400 hover:text-rose-600">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div className={`flex-1 overflow-auto bg-white ${isSidebar ? 'hidden' : ''}`}>
            {children}
          </div>
          {isSidebar && (
            <div className="flex-1 flex flex-col items-center py-4 bg-slate-50/30">
               <div className="w-1 h-32 bg-slate-200 rounded-full mb-4" />
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AppWindow;
