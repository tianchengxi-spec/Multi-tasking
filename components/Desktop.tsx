
import React from 'react';
import AppWindow from './AppWindow';
import { AppInstance, AppType } from '../types';
import GeminiApp from './apps/GeminiApp';
import NotesApp from './apps/NotesApp';
import BrowserApp from './apps/BrowserApp';
import FilesApp from './apps/FilesApp';
import DesktopClock from './DesktopClock';
import { APP_CONFIG } from '../constants';

interface DesktopProps {
  apps: AppInstance[];
  activeAppId: string | null;
  onCloseApp: (id: string) => void;
  onMinimizeApp: (id: string) => void;
  onMaximizeApp: (id: string) => void;
  onFocusApp: (id: string) => void;
  onOpenApp: (type: AppType) => void;
  splitRatio: number;
}

const Desktop: React.FC<DesktopProps> = ({ 
  apps, 
  activeAppId, 
  onCloseApp, 
  onMinimizeApp, 
  onMaximizeApp, 
  onFocusApp,
  onOpenApp,
  splitRatio
}) => {
  const renderAppContent = (app: AppInstance) => {
    switch (app.type) {
      case AppType.NOTES: return <NotesApp />;
      case AppType.BROWSER: return <BrowserApp />;
      case AppType.AI_ASSISTANT: return <GeminiApp apps={apps} />;
      case AppType.FILES: return <FilesApp />;
      default: return <div className="p-8 text-slate-400 italic text-sm">此应用目前正处于原型开发阶段。</div>;
    }
  };

  return (
    <div className="relative flex-1 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <DesktopClock />

      <div className="absolute top-40 left-12 grid grid-cols-4 gap-x-12 gap-y-10 z-0">
        <button onClick={() => onOpenApp(AppType.NOTES)} className="group flex flex-col items-center w-20 mt-[10px] hover:scale-105 transition-transform active:scale-95 outline-none">
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-xl transition-all">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M79.9888 18.0375V61.9625C79.9888 71.9262 71.9285 80 61.9564 80H18.0324C8.07155 80 0 71.915 0 61.9625V18.0375C0 8.08499 8.08273 0 18.0324 0H61.9452C71.9285 0 79.9888 8.08499 79.9888 18.0375Z" fill="#F5EDA9"/>
              <path d="M80 18.0375V20.4529H0.0111694V18.0375C0.0111694 8.08499 8.0939 0 18.0436 0H61.9564C71.9396 0 80 8.08499 80 18.0375Z" fill="#FFD143"/>
              <path d="M0 38.6357H79.9888V40H0V38.6357ZM0 58.194H79.9888V59.5583H0V58.194Z" fill="#C2C2C7"/>
            </svg>
          </div>
          <span className="text-[11px] font-bold text-slate-700 px-1 py-0.5 mt-[10px] text-center whitespace-nowrap group-hover:text-slate-900 transition-colors">备忘录</span>
        </button>

        <button onClick={() => onOpenApp(AppType.BILIBILI)} className="group flex flex-col items-center w-20 mt-[10px] hover:scale-105 transition-transform active:scale-95 outline-none">
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-xl transition-all overflow-hidden rounded-[1.25rem]">
            {React.cloneElement(APP_CONFIG[AppType.BILIBILI].icon as React.ReactElement<any>, { size: 64 })}
          </div>
          <span className="text-[11px] font-bold text-slate-700 px-1 py-0.5 mt-[10px] text-center whitespace-nowrap group-hover:text-slate-900 transition-colors">哔哩哔哩</span>
        </button>

        <button onClick={() => onOpenApp(AppType.ALIPAY)} className="group flex flex-col items-center w-20 mt-[10px] hover:scale-105 transition-transform active:scale-95 outline-none">
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-xl transition-all overflow-hidden rounded-[1.25rem]">
            {React.cloneElement(APP_CONFIG[AppType.ALIPAY].icon as React.ReactElement<any>, { size: 64 })}
          </div>
          <span className="text-[11px] font-bold text-slate-700 px-1 py-0.5 mt-[10px] text-center whitespace-nowrap group-hover:text-slate-900 transition-colors">支付宝</span>
        </button>
      </div>

      {apps.filter(app => app.state !== 'minimized').map((app) => (
        <AppWindow
          key={app.id}
          app={app}
          isActive={activeAppId === app.id}
          onClose={onCloseApp}
          onMinimize={onMinimizeApp}
          onMaximize={onMaximizeApp}
          onFocus={onFocusApp}
          splitRatio={splitRatio}
        >
          {renderAppContent(app)}
        </AppWindow>
      ))}

      {apps.filter(a => a.state !== 'minimized').length === 0 && (
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none animate-pulse">
          <div className="w-12 h-1 bg-slate-200 rounded-full mb-4"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Nexus OS Workspace</p>
        </div>
      )}
    </div>
  );
};

export default Desktop;
