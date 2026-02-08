
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
}

const Desktop: React.FC<DesktopProps> = ({ 
  apps, 
  activeAppId, 
  onCloseApp, 
  onMinimizeApp, 
  onMaximizeApp, 
  onFocusApp,
  onOpenApp
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
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Desktop Widgets Layer (Clock) */}
      <DesktopClock />

      {/* Desktop Icons Layer - Reverted to 4 Columns */}
      <div className="absolute top-40 left-12 grid grid-cols-4 gap-x-12 gap-y-10 z-0">
        
        {/* Notes Shortcut */}
        <button 
          onClick={() => onOpenApp(AppType.NOTES)}
          className="group flex flex-col items-center w-20 mt-[10px] hover:scale-105 transition-transform active:scale-95 outline-none"
        >
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-xl transition-all">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M79.9888 18.0375V61.9625C79.9888 71.9262 71.9285 80 61.9564 80H18.0324C8.07155 80 0 71.915 0 61.9625V18.0375C0 8.08499 8.08273 0 18.0324 0H61.9452C71.9285 0 79.9888 8.08499 79.9888 18.0375Z" fill="#F5EDA9"/>
              <path d="M80 18.0375V20.4529H0.0111694V18.0375C0.0111694 8.08499 8.0939 0 18.0436 0H61.9564C71.9396 0 80 8.08499 80 18.0375Z" fill="#FFD143"/>
              <path d="M0 38.6357H79.9888V40H0V38.6357ZM0 58.194H79.9888V59.5583H0V58.194Z" fill="#C2C2C7"/>
              <path d="M1.55392 24.4118C1.55392 24.5424 1.57966 24.6719 1.62966 24.7926C1.67966 24.9134 1.75295 25.0231 1.84534 25.1155C1.93774 25.2079 2.04742 25.2812 2.16814 25.3312C2.28885 25.3813 2.41823 25.407 2.54889 25.407C2.67956 25.407 2.80894 25.3813 2.92965 25.3312C3.05037 25.2812 3.16005 25.2079 3.25244 25.1155C3.34484 25.0231 3.41812 24.9134 3.46813 24.7926C3.51813 24.6719 3.54386 24.5424 3.54386 24.4118C3.54386 24.1478 3.43904 23.8947 3.25244 23.708C3.06585 23.5214 2.81278 23.4165 2.54889 23.4165C2.28501 23.4165 2.03194 23.5214 1.84534 23.708C1.65875 23.8947 1.55392 24.4118Z" fill="#C2C2C7"/>
              <path d="M4.673 24.4118C4.673 24.6757 4.77783 24.9289 4.96442 25.1155C5.15102 25.3021 5.40409 25.407 5.66797 25.407C5.93186 25.407 6.18493 25.3021 6.37152 25.1155C6.55812 24.9289 6.66294 24.6757 6.66294 24.4118C6.66294 24.2811 6.63721 24.1516 6.58721 24.0309C6.5372 23.9101 6.46392 23.8004 6.37152 23.708C6.27913 23.6156 6.16945 23.5423 6.04873 23.4923C5.92802 23.4422 5.79864 23.4165 5.66797 23.4165C5.53731 23.4165 5.40793 23.4422 5.28722 23.4923C5.1665 23.5423 5.05682 23.6156 4.96442 23.708C4.87203 23.8004 4.79874 23.9101 4.74874 24.0309C4.69874 24.1516 4.673 24.2811 4.673 24.4118Z" fill="#C2C2C7"/>
              <path d="M7.79205 24.4118C7.79205 24.5424 7.81779 24.6719 7.86779 24.7926C7.91779 24.9134 7.99108 25.0231 8.08347 25.1155C8.17586 25.2079 8.28555 25.2812 8.40626 25.3312C8.52698 25.3813 8.65636 25.407 8.78702 25.407C8.91768 25.407 9.04707 25.3813 9.16778 25.3312C9.2885 25.2812 9.39818 25.2079 9.49057 25.1155C9.58296 25.0231 9.65625 24.9134 9.70625 24.7926C9.75626 24.6719 9.78199 24.5424 9.78199 24.4118Z" fill="#C2C2C7"/>
              <path d="M10.9111 24.4118C10.9111 24.5424 10.9368 24.6719 10.9868 24.7926C11.0368 24.9134 11.1101 25.0231 11.2025 25.1155C11.2949 25.2079 11.4046 25.2812 11.5253 25.3312C11.646 25.3813 11.7754 25.407 11.9061 25.407Z" fill="#C2C2C7"/>
              <path d="M14.0414 24.4118C14.0414 24.6757 14.1462 24.9289 14.3328 25.1155C14.5194 25.3021 14.7724 25.407 15.0363 25.407C15.3002 25.407 15.5533 25.3021 15.7399 25.1155C15.9265 24.9289 16.0313 24.6757 16.0313 24.4118Z" fill="#C2C2C7"/>
            </svg>
          </div>
          <span className="text-[11px] font-bold text-slate-700 px-1 py-0.5 mt-[10px] text-center whitespace-nowrap group-hover:text-slate-900 transition-colors">备忘录</span>
        </button>

        {/* Bilibili Shortcut */}
        <button 
          onClick={() => onOpenApp(AppType.BILIBILI)}
          className="group flex flex-col items-center w-20 mt-[10px] hover:scale-105 transition-transform active:scale-95 outline-none"
        >
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-xl transition-all overflow-hidden rounded-[1.25rem]">
            {React.cloneElement(APP_CONFIG[AppType.BILIBILI].icon as React.ReactElement<any>, { size: 64 })}
          </div>
          <span className="text-[11px] font-bold text-slate-700 px-1 py-0.5 mt-[10px] text-center whitespace-nowrap group-hover:text-slate-900 transition-colors">哔哩哔哩</span>
        </button>

        {/* Alipay Shortcut */}
        <button 
          onClick={() => onOpenApp(AppType.ALIPAY)}
          className="group flex flex-col items-center w-20 mt-[10px] hover:scale-105 transition-transform active:scale-95 outline-none"
        >
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-xl transition-all overflow-hidden rounded-[1.25rem]">
            {React.cloneElement(APP_CONFIG[AppType.ALIPAY].icon as React.ReactElement<any>, { size: 64 })}
          </div>
          <span className="text-[11px] font-bold text-slate-700 px-1 py-0.5 mt-[10px] text-center whitespace-nowrap group-hover:text-slate-900 transition-colors">支付宝</span>
        </button>
      </div>

      {/* Windows Layer */}
      {apps.filter(app => app.state !== 'minimized').map((app) => (
        <AppWindow
          key={app.id}
          app={app}
          isActive={activeAppId === app.id}
          onClose={onCloseApp}
          onMinimize={onMinimizeApp}
          onMaximize={onMaximizeApp}
          onFocus={onFocusApp}
        >
          {renderAppContent(app)}
        </AppWindow>
      ))}

      {/* Empty Desktop Hint */}
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