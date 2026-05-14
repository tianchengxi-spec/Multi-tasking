
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
  
  // Create a pseudo-combination for the currently active layout
  const activeTask: TaskCombination | null = useMemo(() => {
    if (currentApps.length === 0) return null;
    return {
      id: 'active-task',
      name: '当前任务单元',
      apps: currentApps.map(a => ({ type: a.type, state: a.state })),
      mode: 'regular',
      color: 'blue'
    };
  }, [currentApps]);

  const allTasks = useMemo(() => {
    const saved = combinations.filter(c => c.mode !== 'toolring');
    return activeTask ? [activeTask, ...saved] : saved;
  }, [activeTask, combinations]);

  const renderPreview = (combo: TaskCombination) => {
    return (
      <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner group-hover:border-blue-300 transition-colors">
        {/* Mock Desktop background */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {combo.apps.map((app, i) => {
          const config = APP_CONFIG[app.type];
          let style: React.CSSProperties = {};

          if (app.state === 'maximized') {
             style = { width: '100%', height: '100%', top: 0, left: 0 };
          } else if (app.state === 'split-left') {
             style = { width: '50%', height: '100%', top: 0, left: 0 };
          } else if (app.state === 'split-right') {
             style = { width: '50%', height: '100%', top: 0, left: '50%' };
          } else if (app.state === 'split-top') {
             style = { width: '100%', height: '50%', top: 0, left: 0 };
          } else if (app.state === 'split-bottom') {
             style = { width: '100%', height: '50%', top: '50%', left: 0 };
          } else if (app.state === 'split-sidebar-left') {
             style = { width: '25%', height: '100%', top: 0, left: 0 };
          } else if (app.state === 'split-sidebar-right') {
             style = { width: '25%', height: '100%', top: 0, right: 0 };
          } else if (app.state === 'split-middle') {
             style = { width: '33.3%', height: '100%', top: 0, left: '33.3%' };
          } else {
             // Floating or unknown
             style = { width: '60%', height: '60%', top: '20%', left: '20%' };
          }

          return (
            <div 
              key={`${combo.id}-${i}`}
              className="absolute p-0.5"
              style={style}
            >
              <div className={`w-full h-full ${config.color} rounded shadow-sm flex flex-col items-center justify-center border border-white/50 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                {React.cloneElement(config.icon as React.ReactElement, { size: 16, className: 'text-white/80' })}
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
          className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-2xl flex flex-col items-center justify-center p-8 select-none"
          onClick={onClose}
        >
          {/* Header */}
          <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="w-full max-w-6xl flex items-center justify-between mb-12"
             onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-xl">
                  <LayoutGrid size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">多任务后台</h1>
                  <p className="text-white/40 text-sm font-medium">查看并恢复最近的任务组合</p>
               </div>
            </div>
            
            <button 
              onClick={onClearTasks}
              className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-2xl border border-rose-500/20 transition-all font-bold text-sm"
            >
              <Trash2 size={18} />
              清除所有任务
            </button>
          </motion.div>

          {/* Task Strip */}
          <div className="w-full max-w-full overflow-x-auto overflow-y-hidden py-8 px-4 flex gap-12 no-scrollbar" onClick={e => e.stopPropagation()}>
             {allTasks.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-24 text-white/20 italic">
                   <p className="text-xl">当前没有活跃或保存的任务组合</p>
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
                              {combo.id === 'active-task' && <span className="ml-2 px-2 py-0.5 bg-blue-500 text-[10px] text-white rounded-full uppercase tracking-widest">活跃</span>}
                           </span>
                           <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">
                              {combo.apps.length} 个应用正在运行
                           </span>
                        </div>
                        <div className="flex -space-x-3">
                           {combo.apps.map((app, i) => {
                              const config = APP_CONFIG[app.type];
                              return (
                                 <div 
                                    key={i} 
                                    className={`w-10 h-10 rounded-full ${config.color} border-4 border-[#1E293B] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}
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
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-white/30 text-xs font-black uppercase tracking-[0.4em]"
          >
            点击任意区域或按 ESC 返回
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskSwitcher;
