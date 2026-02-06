import React, { useState } from 'react';
import { X, Minus, Maximize2, Move } from 'lucide-react';
import { AppInstance, WindowState, AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface AppWindowProps {
  app: AppInstance;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}

const AppWindow: React.FC<AppWindowProps> = ({ 
  app, 
  isActive, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  children 
}) => {
  const config = APP_CONFIG[app.type];
  
  const getWindowStateClasses = () => {
    switch (app.state) {
      case 'maximized':
        return 'inset-0 w-full h-full rounded-none z-50';
      case 'split-left':
        return 'left-0 top-0 w-1/2 h-full rounded-none border-r z-40';
      case 'split-right':
        return 'right-0 top-0 w-1/2 h-full rounded-none border-l z-40';
      default:
        return 'rounded-2xl shadow-2xl border bg-white overflow-hidden';
    }
  };

  const style: React.CSSProperties = app.state === 'floating' ? {
    position: 'absolute',
    left: app.position.x,
    top: app.position.y,
    width: app.size.width,
    height: app.size.height,
    zIndex: app.zIndex,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } : {
    position: 'absolute',
    zIndex: app.zIndex,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div 
      style={style}
      className={`${getWindowStateClasses()} flex flex-col bg-white/95 backdrop-blur-md border-slate-200 select-none ${isActive ? 'ring-2 ring-blue-500/30' : ''}`}
      onClick={() => onFocus(app.id)}
    >
      {/* Title Bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-slate-100 bg-slate-50/50 cursor-default shrink-0">
        <div className="flex items-center gap-3">
          <div className={`${config.color} p-1 rounded-lg`}>
            {/* Fix: Explicitly typed ReactElement as <any> to resolve TS error where 'size' property was not found in Partial<unknown> */}
            {React.cloneElement(config.icon as React.ReactElement<any>, { size: 16 })}
          </div>
          <span className="font-semibold text-slate-700 text-sm">{app.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(app.id); }}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-600"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(app.id); }}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-600"
          >
            <Maximize2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(app.id); }}
            className="p-1.5 hover:bg-rose-100 rounded-md transition-colors text-slate-400 hover:text-rose-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>
    </div>
  );
};

export default AppWindow;