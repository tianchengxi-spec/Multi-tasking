
import React, { useMemo } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
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
  hasSidebarRight = false
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
      default:
        return 'rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border-slate-200/50 bg-white overflow-hidden ring-1 ring-slate-900/5';
    }
  };

  const style: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: app.zIndex,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (app.state === 'floating') {
      return {
        ...baseStyle,
        left: app.position.x,
        top: app.position.y,
        width: app.size.width,
        height: app.size.height,
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
        transition: 'none',
      };
    } else if (app.state === 'split-left-top') {
      return {
        ...baseStyle,
        left: lOffset,
        top: 0,
        height: '50%',
        width: `calc(${splitRatios[0]} * ${workingWidth})`,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        transition: 'none',
      };
    } else if (app.state === 'split-left-bottom') {
      return {
        ...baseStyle,
        left: lOffset,
        top: '50%',
        height: '50%',
        width: `calc(${splitRatios[0]} * ${workingWidth})`,
        transition: 'none',
      };
    } else if (app.state === 'split-middle') {
      return {
        ...baseStyle,
        left: `calc(${lOffset}px + ${splitRatios[0]} * ${workingWidth})`,
        width: `calc((${(splitRatios[1] - splitRatios[0])}) * ${workingWidth})`,
        transition: 'none',
      };
    } else if (app.state === 'split-right') {
      const startRatio = isTripleVertical ? splitRatios[1] : splitRatios[0];
      return {
        ...baseStyle,
        right: rOffset,
        left: 'auto',
        width: `calc(${1 - startRatio} * ${workingWidth})`,
        transition: 'none',
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
        transition: 'none',
      };
    } else if (app.state === 'split-right-bottom') {
      return {
        ...baseStyle,
        right: rOffset,
        left: 'auto',
        top: '50%',
        height: '50%',
        width: `calc(${1 - splitRatios[0]} * ${workingWidth})`,
        transition: 'none',
      };
    }

    return baseStyle;
  }, [app.state, app.zIndex, app.position, app.size, splitRatios, isTripleVertical, hasSidebarLeft, hasSidebarRight]);

  const isSidebar = app.state === 'split-sidebar-left' || app.state === 'split-sidebar-right';

  return (
    <div 
      style={style}
      className={`${getWindowStateClasses()} flex flex-col bg-white/95 backdrop-blur-md border-slate-200 select-none ${isActive ? 'ring-2 ring-blue-500/30' : ''}`}
      onClick={() => onFocus(app.id)}
    >
      <div className={`h-12 flex items-center ${isSidebar ? 'justify-center px-0' : 'justify-between px-4'} border-b border-slate-100 bg-slate-50/50 cursor-default shrink-0`}>
        <div className={`flex items-center ${isSidebar ? 'flex-col gap-1' : 'gap-3'}`}>
          <div className={`${config.color} p-1 rounded-lg`}>
            {React.cloneElement(config.icon as React.ReactElement<any>, { size: isSidebar ? 24 : 16 })}
          </div>
          {!isSidebar && <span className="font-semibold text-slate-700 text-sm truncate max-w-[120px]">{app.title}</span>}
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
    </div>
  );
};

export default AppWindow;
