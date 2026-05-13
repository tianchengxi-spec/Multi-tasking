
import React, { useMemo } from 'react';
import AppWindow from './AppWindow';
import { AppInstance, AppType } from '../types';
import GeminiApp from './apps/GeminiApp';
import NotesApp from './apps/NotesApp';
import BrowserApp from './apps/BrowserApp';
import FilesApp from './apps/FilesApp';
import CalendarApp from './apps/CalendarApp';
import CalculatorApp from './apps/CalculatorApp';
import SettingsApp from './apps/SettingsApp';
import DictionaryApp from './apps/DictionaryApp';
import ScheduleWidget from './ScheduleWidget';
import DeadlineWidget from './DeadlineWidget';
import DesktopClock from './DesktopClock';
import { APP_CONFIG } from '../constants';
import { Cloud, Video, FileVideo, Search, MoreVertical, Folder, Grid, List as ListIcon, Play, PenTool, Plus } from 'lucide-react';
import CreateBoardPanel from './CreateBoardPanel';

interface DesktopProps {
  apps: AppInstance[];
  activeAppId: string | null;
  onCloseApp: (id: string) => void;
  onMinimizeApp: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocusApp: (id: string) => void;
  onOpenApp: (type: AppType) => void;
  splitRatios: [number, number];
  swappingAppId?: string | null;
  swappingOverId?: string | null;
  onDragAppStart?: (id: string, x: number, y: number) => void;
  onClickWallpaper?: () => void;
  isResizing?: boolean;
  onStartStudy?: () => void;
  onOpenCreator?: () => void;
  onTogglePin?: (id: string) => void;
  onToggleTopmost?: (id: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({ 
  apps, 
  activeAppId, 
  onCloseApp, 
  onMinimizeApp, 
  onFocusApp,
  onOpenApp,
  splitRatios,
  swappingAppId = null,
  swappingOverId = null,
  onDragAppStart,
  onClickWallpaper,
  isResizing = false,
  onStartStudy,
  onOpenCreator,
  onTogglePin,
  onToggleTopmost
}) => {
  const isTripleVertical = useMemo(() => apps.some(a => a.state === 'split-middle'), [apps]);
  const hasSidebarLeft = useMemo(() => apps.some(a => a.state === 'split-sidebar-left'), [apps]);
  const hasSidebarRight = useMemo(() => apps.some(a => a.state === 'split-sidebar-right'), [apps]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    // 仅在点击壁纸本身且在屏幕左侧 150px 范围内时触发
    if (e.target === e.currentTarget && e.clientX < 150) {
      onOpenCreator?.();
    }
  };

  const renderAppContent = (app: AppInstance) => {
    switch (app.type) {
      case AppType.NOTES: return <NotesApp state={app.state} initialNoteId={app.initialData?.noteId} />;
      case AppType.BROWSER: return <BrowserApp state={app.state} />;
      case AppType.AI_ASSISTANT: return <GeminiApp apps={apps} />;
      case AppType.FILES: return <FilesApp state={app.state} />;
      case AppType.CALENDAR: return <CalendarApp state={app.state} />;
      case AppType.CALCULATOR: return <CalculatorApp state={app.state} />;
      case AppType.SETTINGS: return <SettingsApp />;
      case AppType.DICTIONARY: return <DictionaryApp state={app.state} />;
      case AppType.WHITEBOARD: return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="flex-1 flex items-center justify-center relative">
             <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                   <Plus className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-800 font-black text-lg mb-2">开始您的创意之旅</h3>
                <p className="text-slate-400 text-sm font-medium">双击此处或拖入素材以初始化画布</p>
             </div>
          </div>
        </div>
      );
      case AppType.CLOUD_DRIVE: {
        const isFourGrid = app.state && (app.state.includes('top') || app.state.includes('bottom'));
        return (
          <div className="flex flex-col h-full bg-slate-50">
            {!isFourGrid && (
              <div className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold">
                    <Cloud size={18} />
                    <span className="text-sm">Nexus Drive</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Folder size={12} />
                    <span>我的文件</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800">英语学习</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="bg-slate-100 rounded-full py-1.5 pl-9 pr-4 text-[11px] w-48 focus:outline-none focus:ring-1 focus:ring-indigo-400" placeholder="搜索文件..." />
                  </div>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Grid size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
            )}
            
            <div className={`flex-1 ${isFourGrid ? 'p-4' : 'p-6'} overflow-y-auto`}>
              <div className={`grid ${isFourGrid ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4`}>
              <div className="group bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 cursor-pointer">
                <div className="aspect-video bg-indigo-50 rounded-xl mb-4 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-100/50 transition-colors relative overflow-hidden">
                   <FileVideo size={32} />
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-200" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={12} fill="currentColor" className="text-indigo-600 ml-1" />
                   </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-1 truncate max-w-[120px]">六级真题解析.mp4</h4>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">VIDEO • 120.4 MB • 刚刚</p>
                  </div>
                  <MoreVertical size={14} className="text-slate-300" />
                </div>
              </div>

              <div className="group bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 cursor-pointer">
                <div className="aspect-video bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-300">
                   <Folder size={32} />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-1">精听素材库</h4>
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">FOLDER • 12 Files</p>
                  </div>
                  <MoreVertical size={14} className="text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
      default: return <div className="p-8 text-slate-400 italic text-sm">此应用目前正处于原型开发阶段。</div>;
    }
  };

  return (
    <div 
      className="relative flex-1 overflow-hidden cursor-default"
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClickWallpaper) {
          onClickWallpaper();
        }
      }}
    >
      <DesktopClock />
      
      <div className="absolute top-40 left-12 w-[340px] z-0">
        <ScheduleWidget onStartStudy={onStartStudy} />
      </div>

      <div className="absolute top-40 right-12 z-0">
        <DeadlineWidget />
      </div>

      <div className="absolute top-72 left-12 grid grid-cols-4 gap-x-12 gap-y-10 z-0">

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
          onDragStart={onDragAppStart}
          isResizing={isResizing}
          isSwapping={swappingAppId === app.id}
          isSwappingOver={swappingOverId === app.id}
          onTogglePin={() => onTogglePin?.(app.id)}
          onToggleTopmost={() => onToggleTopmost?.(app.id)}
        >
          {renderAppContent(app)}
        </AppWindow>
      ))}
    </div>
  );
};

export default Desktop;
