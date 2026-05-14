
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppInstance, TaskCombination, AppType, WindowState } from '../types';
import { APP_CONFIG } from '../constants';
import { X, Trash2, LayoutGrid } from 'lucide-react';

interface TaskSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  combinations: TaskCombination[];
  currentApps: AppInstance[];
  onRestore: (combo: TaskCombination) => void;
  onClearTasks: () => void;
}

const TaskSwitcher: React.FC<TaskSwitcherProps> = ({ 
  isOpen, 
  onClose, 
  combinations, 
  currentApps,
  onRestore,
  onClearTasks
}) => {
  
  // Create a list of active task units from current apps
  const activeTasks: TaskCombination[] = useMemo(() => {
    if (currentApps.length === 0) return [];
    
    const floatingApps = currentApps.filter(a => a.state === 'floating');
    const layoutApps = currentApps.filter(a => a.state !== 'floating');

    const tasks: TaskCombination[] = [];

    // Group layout apps together as one task unit
    if (layoutApps.length > 0) {
      tasks.push({
        id: 'active-layout-task',
        name: layoutApps.length > 1 ? '窗口布局单元' : (layoutApps[0].title || layoutApps[0].type),
        apps: layoutApps.map(a => ({ type: a.type, state: a.state })),
        mode: 'regular',
        color: 'blue'
      });
    }

    // Each floating app is its own task unit
    floatingApps.forEach(app => {
      tasks.push({
        id: `active-floating-${app.id}`,
        name: app.title || app.type,
        apps: [{ type: app.type, state: app.state }],
        mode: 'regular',
        color: 'indigo'
      });
    });

    return tasks;
  }, [currentApps]);

  const allTasks = useMemo(() => {
    const saved = combinations.filter(c => c.mode !== 'toolring');
    return [...activeTasks, ...saved];
  }, [activeTasks, combinations]);

  const renderAppContentPreview = (type: AppType, config: any) => {
    switch (type) {
      case 'CALENDAR':
        return (
          <div className="space-y-1.5">
            <div className="grid grid-cols-7 gap-0.5 opacity-60">
              {[...Array(21)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-[1px] ${i === 12 ? 'bg-blue-400' : 'bg-slate-100'}`} />
              ))}
            </div>
            <div className="h-1 w-2/3 bg-slate-200 rounded-full" />
          </div>
        );
      case 'FILES':
        return (
          <div className="space-y-1.5 h-full">
            <div className="grid grid-cols-2 gap-1 px-0.5">
              <div className="aspect-square bg-blue-50/80 rounded border border-blue-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-300 rounded-sm" />
              </div>
              <div className="aspect-square bg-amber-50/80 rounded border border-amber-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-300 rounded-sm" />
              </div>
            </div>
            <div className="space-y-1 mt-1">
              <div className="h-1 w-full bg-slate-100 rounded-full" />
              <div className="h-1 w-5/6 bg-slate-100 rounded-full" />
            </div>
          </div>
        );
      case 'AI_ASSISTANT':
        return (
          <div className="space-y-2 h-full flex flex-col justify-end">
            <div className="flex justify-end pr-1">
              <div className="h-3 w-4/5 bg-blue-100 rounded-l-lg rounded-tr-lg" />
            </div>
            <div className="flex gap-1 pl-1">
              <div className="w-2 h-2 rounded-full bg-blue-200 shrink-0 mt-0.5" />
              <div className="h-4 w-full bg-slate-100 rounded-r-lg rounded-tl-lg" />
            </div>
          </div>
        );
      case 'CALCULATOR':
        return (
          <div className="grid grid-cols-4 gap-0.5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`aspect-square rounded ${i > 7 ? 'bg-amber-100' : 'bg-slate-100'}`} />
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <div className="h-1.5 w-1/2 bg-slate-200 rounded-full" />
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-slate-100 rounded-full" />
              <div className="h-1 w-5/6 bg-slate-100 rounded-full" />
            </div>
            <div className="aspect-video bg-slate-50 border border-slate-100 rounded" />
          </div>
        );
    }
  };

  const renderPreview = (combo: TaskCombination) => {
    return (
      <div className="relative w-full h-full bg-white/40 rounded-2xl overflow-hidden border border-white/60 shadow-sm group-hover:border-blue-200 transition-colors">
        {/* Mock Desktop background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748B 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {combo.apps.map((app, i) => {
          const config = APP_CONFIG[app.type];
          let style: React.CSSProperties = {};

          if (app.state === 'maximized') {
             style = { width: '100%', height: '100%', top: 0, left: 0 };
          } else if (app.state === 'split-left' || app.state === 'split-sidebar-left') {
             style = { width: app.state === 'split-sidebar-left' ? '25%' : '50%', height: '100%', top: 0, left: 0 };
          } else if (app.state === 'split-right' || app.state === 'split-sidebar-right') {
             style = { width: app.state === 'split-sidebar-right' ? '25%' : '50%', height: '100%', top: 0, right: 0 };
          } else if (app.state === 'split-top') {
             style = { width: '100%', height: '50%', top: 0, left: 0 };
          } else if (app.state === 'split-bottom') {
             style = { width: '100%', height: '50%', bottom: 0, left: 0 };
          } else if (app.state === 'split-middle') {
             style = { width: '33.3%', height: '100%', top: 0, left: '33.3%' };
          } else {
             // Floating
             style = { width: '64%', height: '64%', top: '18%', left: '18%', zIndex: 10 };
          }

          return (
            <div 
              key={`${combo.id}-${i}`}
              className="absolute p-0.5"
              style={style}
            >
              <div className="w-full h-full bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden flex flex-col">
                {/* Mock Window Header */}
                <div className="h-4 bg-slate-50 border-b border-slate-100 flex items-center px-1.5 gap-1 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
                  <div className="flex-1" />
                  <div className="text-[6px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[40px]">{app.type}</div>
                </div>
                {/* Mock Window Content */}
                <div className="flex-1 p-2 overflow-hidden bg-white">
                   <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded-md ${config.color} flex items-center justify-center shrink-0`}>
                        {React.cloneElement(config.icon as React.ReactElement, { size: 10, className: 'text-white' })}
                      </div>
                      <div className="h-1.5 w-1/2 bg-slate-200 rounded-full" />
                   </div>
                   {renderAppContentPreview(app.type, config)}
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
