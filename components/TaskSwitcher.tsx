
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppInstance, TaskCombination, AppType, WindowState } from '../types';
import { APP_CONFIG } from '../constants';
import { X, Trash2, LayoutGrid, Plus, Cloud, Folder, FileVideo, Play, Search, MoreVertical } from 'lucide-react';

// Live App component imports for real-time snapshots
import NotesApp from './apps/NotesApp';
import BrowserApp from './apps/BrowserApp';
import GeminiApp from './apps/GeminiApp';
import FilesApp from './apps/FilesApp';
import CalendarApp from './apps/CalendarApp';
import CalculatorApp from './apps/CalculatorApp';
import SettingsApp from './apps/SettingsApp';
import DictionaryApp from './apps/DictionaryApp';

interface TaskSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  combinations: TaskCombination[];
  currentApps: AppInstance[];
  onRestore: (combo: TaskCombination) => void;
  onClearTasks: () => void;
  splitRatios?: number[];
}

const TaskSwitcher: React.FC<TaskSwitcherProps> = ({ 
  isOpen, 
  onClose, 
  combinations, 
  currentApps,
  onRestore,
  onClearTasks,
  splitRatios
}) => {
  
  // Create a list of active task units from current apps
  const activeTasks: TaskCombination[] = useMemo(() => {
    if (currentApps.length === 0) return [];
    
    const floatingApps = currentApps.filter(a => a.state === 'floating');
    const maximizedApps = currentApps.filter(a => a.state === 'maximized');
    const splitApps = currentApps.filter(a => a.state && a.state.startsWith('split-'));

    const tasks: TaskCombination[] = [];

    // Group split apps together as one task unit
    if (splitApps.length > 0) {
      tasks.push({
        id: 'active-split-task',
        name: splitApps.length > 1 ? '窗口布局单元' : (splitApps[0].title || splitApps[0].type),
        apps: splitApps.map(a => ({ type: a.type, state: a.state })),
        mode: 'regular',
        color: 'blue',
        splitRatios: splitRatios || [0.5, 0.66],
        timestamp: Date.now()
      });
    }

    // Each maximized app is its own task unit
    maximizedApps.forEach(app => {
      tasks.push({
        id: `active-maximized-${app.id}`,
        name: app.title || app.type,
        apps: [{ type: app.type, state: app.state }],
        mode: 'regular',
        color: 'indigo',
        splitRatios: splitRatios || [0.5, 0.66],
        timestamp: Date.now()
      });
    });

    // Each floating app is its own task unit
    floatingApps.forEach(app => {
      tasks.push({
        id: `active-floating-${app.id}`,
        name: app.title || app.type,
        apps: [{ type: app.type, state: app.state }],
        mode: 'regular',
        color: 'indigo',
        splitRatios: splitRatios || [0.5, 0.66],
        timestamp: Date.now()
      });
    });

    return tasks;
  }, [currentApps, splitRatios]);

  const allTasks = useMemo(() => {
    const saved = combinations.filter(c => c.mode !== 'toolring');
    return [...activeTasks, ...saved];
  }, [activeTasks, combinations]);

  const renderLiveAppContent = (type: AppType, state: WindowState, appsToPass: AppInstance[]) => {
    switch (type) {
      case AppType.NOTES: return <NotesApp state={state} />;
      case AppType.BROWSER: return <BrowserApp state={state} />;
      case AppType.AI_ASSISTANT: return <GeminiApp apps={appsToPass} state={state} />;
      case AppType.FILES: return <FilesApp state={state} />;
      case AppType.CALENDAR: return <CalendarApp state={state} />;
      case AppType.CALCULATOR: return <CalculatorApp state={state} />;
      case AppType.SETTINGS: return <SettingsApp />;
      case AppType.DICTIONARY: return <DictionaryApp state={state} />;
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
        const isFourGrid = state && (state.includes('top') || state.includes('bottom'));
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
                    <input className="bg-slate-100 rounded-full py-1.5 pl-9 pr-4 text-[11px] w-48 focus:outline-none" placeholder="搜索文件..." />
                  </div>
                </div>
              </div>
            )}
            
            <div className={`flex-1 ${isFourGrid ? 'p-4' : 'p-6'} overflow-y-auto`}>
              <div className={`grid ${isFourGrid ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
                <div className="group bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer">
                  <div className="aspect-video bg-indigo-50 rounded-xl mb-4 flex items-center justify-center text-indigo-400 relative overflow-hidden">
                     <FileVideo size={32} />
                     <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-200" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-100">
                        <Play size={12} fill="currentColor" className="text-indigo-600 ml-0.5" />
                     </div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-1 truncate">六级真题解析.mp4</h4>
                  </div>
                </div>

                <div className="group bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer">
                  <div className="aspect-video bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-300">
                     <Folder size={32} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-1">精听素材库</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      default:
        return <div className="p-8 text-slate-400 italic text-sm">此应用目前正处于原型开发阶段。</div>;
    }
  };

  const renderPreview = (combo: TaskCombination) => {
    // If we have sidebar left or right in this combo
    const hasSidebarLeft = combo.apps.some(a => a.state === 'split-sidebar-left');
    const hasSidebarRight = combo.apps.some(a => a.state === 'split-sidebar-right');
    const isTripleVertical = combo.apps.some(a => a.state === 'split-middle');
    
    const sidebarWidthPct = 12; // 12% width proportion inside the preview
    const lOffset = hasSidebarLeft ? sidebarWidthPct : 0;
    const rOffset = hasSidebarRight ? sidebarWidthPct : 0;
    const workingWidthPct = 100 - lOffset - rOffset;
    
    const rRatios = combo.splitRatios || [0.5, 0.66];

    return (
      <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-white/20 group-hover:border-blue-500/50 transition-colors">
        {/* Workspace wallpaper simulator background */}
        <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E1B4B] opacity-95" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
        
        {combo.apps.map((app, i) => {
          const config = APP_CONFIG[app.type];
          let style: React.CSSProperties = {};

          if (app.state === 'split-sidebar-left') {
            style = {
              left: 0,
              width: `${sidebarWidthPct}%`,
              height: '100%',
              top: 0
            };
          } else if (app.state === 'split-sidebar-right') {
            style = {
              right: 0,
              width: `${sidebarWidthPct}%`,
              height: '100%',
              top: 0
            };
          } else if (app.state === 'split-left') {
            style = {
              left: `${lOffset}%`,
              width: `${rRatios[0] * workingWidthPct}%`,
              height: '100%',
              top: 0
            };
          } else if (app.state === 'split-left-top') {
            style = {
              left: `${lOffset}%`,
              width: `${rRatios[0] * workingWidthPct}%`,
              height: '50%',
              top: 0
            };
          } else if (app.state === 'split-left-bottom') {
            style = {
              left: `${lOffset}%`,
              width: `${rRatios[0] * workingWidthPct}%`,
              height: '50%',
              top: '50%'
            };
          } else if (app.state === 'split-middle') {
            style = {
              left: `${lOffset + rRatios[0] * workingWidthPct}%`,
              width: `${(rRatios[1] - rRatios[0]) * workingWidthPct}%`,
              height: '100%',
              top: 0
            };
          } else if (app.state === 'split-right') {
            const startRatio = isTripleVertical ? rRatios[1] : rRatios[0];
            style = {
              right: `${rOffset}%`,
              width: `${(1 - startRatio) * workingWidthPct}%`,
              height: '100%',
              top: 0
            };
          } else if (app.state === 'split-right-top') {
            style = {
              right: `${rOffset}%`,
              width: `${(1 - rRatios[0]) * workingWidthPct}%`,
              height: '50%',
              top: 0
            };
          } else if (app.state === 'split-right-bottom') {
            style = {
              right: `${rOffset}%`,
              width: `${(1 - rRatios[0]) * workingWidthPct}%`,
              height: '50%',
              top: '50%'
            };
          } else if (app.state === 'maximized') {
            style = {
              left: 0,
              width: '100%',
              height: '100%',
              top: 0
            };
          } else {
             // Floating Window overlay
             style = {
               width: '64%',
               height: '64%',
               top: '18%',
               left: '18%',
               zIndex: 10
             };
          }

          return (
            <div 
              key={`${combo.id}-${i}`}
              className="absolute p-0.5"
              style={style}
            >
              <div className="w-full h-full bg-white/95 rounded-xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col pointer-events-none select-none">
                {/* Miniature Beautiful Window Header */}
                <div className="h-4 bg-slate-50 border-b border-slate-100 flex items-center px-1.5 gap-1 shrink-0 select-none">
                  <div className="w-1 h-1 rounded-full bg-rose-400" />
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  <div className="flex-1" />
                  <div className="text-[6px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-[80px]">{config?.name || app.type}</div>
                </div>
                {/* Scale Live Window Content */}
                <div className="flex-1 relative overflow-hidden bg-white select-none">
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '380%',
                    height: '380%',
                    transform: 'scale(0.263)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}>
                    {renderLiveAppContent(app.type, app.state, currentApps)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] bg-white/5 backdrop-blur-[40px] flex flex-col items-center justify-center p-4 md:p-8 select-none"
          onClick={onClose}
        >
          {/* Header */}
          <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="w-full max-w-6xl flex items-center justify-between mb-12 px-2"
             onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-sm backdrop-blur-md">
                  <LayoutGrid size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">多任务后台</h1>
                  <p className="text-white/60 text-sm font-medium">查看并恢复最近的任务单元</p>
               </div>
            </div>
            
            <button 
              onClick={onClearTasks}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-rose-500 text-white hover:text-white rounded-2xl border border-white/20 transition-all font-bold text-sm backdrop-blur-sm shadow-sm"
            >
              <Trash2 size={18} />
              清除所有任务
            </button>
          </motion.div>

          {/* Task Strip */}
          <div className="w-full max-w-full overflow-x-auto overflow-y-hidden py-8 px-4 flex gap-12 no-scrollbar" onClick={e => e.stopPropagation()}>
             {allTasks.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-24 text-white/30 italic">
                   <p className="text-xl font-bold">当前没有活跃或保存的任务组合</p>
                </div>
             ) : (
                allTasks.map((combo, idx) => (
                  <motion.div
                    key={combo.id}
                    initial={{ x: 100, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1, transition: { delay: idx * 0.05 } }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="flex-shrink-0 w-[420px] group cursor-pointer"
                    onClick={() => onRestore(combo)}
                  >
                     <div className="aspect-[16/10] mb-4">
                        {renderPreview(combo)}
                     </div>
                     <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                           <span className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                              {combo.name}
                              {combo.id.startsWith('active-') && <span className="ml-2 px-2 py-0.5 bg-blue-500 text-[10px] text-white rounded-full uppercase tracking-widest">活跃</span>}
                           </span>
                           <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                              {combo.apps.length} 个应用正在运行
                           </span>
                        </div>
                        <div className="flex -space-x-3">
                           {combo.apps.map((app, i) => {
                              const config = APP_CONFIG[app.type];
                              return (
                                 <div 
                                    key={i} 
                                    className={`w-10 h-10 rounded-full ${config.color} border-4 border-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}
                                 >
                                    {React.cloneElement(config.icon as React.ReactElement, { size: 16, className: 'text-white' })}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </motion.div>
                ))
             )}
          </div>

          {/* Close Hint */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskSwitcher;
