
import React, { useMemo } from 'react';
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
  onMaximize: (id: string) => void;
  onFocusApp: (id: string) => void;
  onOpenApp: (type: AppType) => void;
  splitRatios: [number, number];
}

const Desktop: React.FC<DesktopProps> = ({ 
  apps, 
  activeAppId, 
  onCloseApp, 
  onMinimizeApp, 
  onFocusApp,
  onOpenApp,
  splitRatios
}) => {
  const isTripleVertical = useMemo(() => apps.some(a => a.state === 'split-middle'), [apps]);
  const hasSidebarLeft = useMemo(() => apps.some(a => a.state === 'split-sidebar-left'), [apps]);
  const hasSidebarRight = useMemo(() => apps.some(a => a.state === 'split-sidebar-right'), [apps]);

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
        <button onClick={() => onOpenApp(AppType.NOTES)} className="group flex flex-col items-center w-20">
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md rounded-2xl bg-[#F5EDA9]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2">备忘录</span>
        </button>
      </div>
      {apps.filter(app => app.state !== 'minimized').map((app) => (
        <AppWindow
          key={app.id}
          app={app}
          isActive={activeAppId === app.id}
          onClose={onCloseApp}
          onMinimize={onMinimizeApp}
          onFocus={onFocusApp}
          splitRatios={splitRatios}
          isTripleVertical={isTripleVertical}
          hasSidebarLeft={hasSidebarLeft}
          hasSidebarRight={hasSidebarRight}
        >
          {renderAppContent(app)}
        </AppWindow>
      ))}
    </div>
  );
};

export default Desktop;
