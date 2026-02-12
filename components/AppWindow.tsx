
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
}

const AppWindow: React.FC<AppWindowProps> = ({ 
  app, 
  isActive, 
  onClose, 
  onMinimize, 
  onFocus,
  children,
  splitRatios,
  isTripleVertical = false
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
        return 'top-0 h-full rounded-none border-x z-40 shadow-none';
      default:
        return 'rounded-2xl shadow-2xl border bg-white overflow-hidden';
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
    
    // Split Screen Logic
    if (app.state === 'split-left') {
      return {
        ...baseStyle,
        left: 0,
        width: `${splitRatios[0] * 100}%`,
        transition: 'none',
      };
    } else if (app.state === 'split-left-top') {
      return {
        ...baseStyle,
        left: 0,
        top: 0,
        height: '50%',
        width: `${splitRatios[0] * 100}%`,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        transition: 'none',
      };
    } else if (app.state === 'split-left-bottom') {
      return {
        ...baseStyle,
        left: 0,
        top: '50%',
        height: '50%',
        width: `${splitRatios[0] * 100}%`,
        transition: 'none',
      };
    } else if (app.state === 'split-middle') {
      return {
        ...baseStyle,
        left: `${splitRatios[0] * 100}%`,
        width: `${(splitRatios[1] - splitRatios[0]) * 100}%`,
        transition: 'none',
      };
    } else if (app.state === 'split-right') {
      // Logic: If there is a middle app, right starts at ratios[1]. 
      // If there is NO middle app (dual split), right starts at ratios[0].
      const startPoint = isTripleVertical ? splitRatios[1] : splitRatios[0];
      return {
        ...baseStyle,
        right: 0,
        left: 'auto',
        width: `${(1 - startPoint) * 100}%`,
        transition: 'none',
      };
    } else if (app.state === 'split-right-top') {
      return {
        ...baseStyle,
        right: 0,
        left: 'auto',
        top: 0,
        height: '50%',
        width: `${(1 - splitRatios[0]) * 100}%`,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        transition: 'none',
      };
    } else if (app.state === 'split-right-bottom') {
      return {
        ...baseStyle,
        right: 0,
        left: 'auto',
        top: '50%',
        height: '50%',
        width: `${(1 - splitRatios[0]) * 100}%`,
        transition: 'none',
      };
    }

    return baseStyle;
  }, [app.state, app.zIndex, app.position, app.size, splitRatios, isTripleVertical]);

  return (
    <div 
      style={style}
      className={`${getWindowStateClasses()} flex flex-col bg-white/95 backdrop-blur-md border-slate-200 select-none ${isActive ? 'ring-2 ring-blue-500/30' : ''}`}
      onClick={() => onFocus(app.id)}
    >
      <div className="h-12 flex items-center justify-between px-4 border-b border-slate-100 bg-slate-50/50 cursor-default shrink-0">
        <div className="flex items-center gap-3">
          <div className={`${config.color} p-1 rounded-lg`}>
            {React.cloneElement(config.icon as React.ReactElement<any>, { size: 16 })}
          </div>
          <span className="font-semibold text-slate-700 text-sm truncate max-w-[120px]">{app.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onClose(app.id); }} className="p-1.5 hover:bg-rose-100 rounded-md transition-colors text-slate-400 hover:text-rose-600">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>
    </div>
  );
};

export default AppWindow;
