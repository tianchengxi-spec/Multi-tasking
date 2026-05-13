import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const DeadlineWidget: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: '提交毕业设计论文初稿（周五前）', completed: false, priority: 'high' },
    { id: 2, text: '阅读大屏多任务相关外文文献 3 篇', completed: true, priority: 'medium' },
    { id: 3, text: '修改开题报告格式', completed: false, priority: 'low' },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)] group hover:bg-white/60 transition-all duration-500 cursor-default aspect-square w-[240px] flex flex-col">
      <div className="flex flex-col mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-slate-900 font-bold text-lg tracking-tight">近期 DDL</h3>
          <span className="bg-rose-500 w-2 h-2 rounded-full animate-pulse" />
        </div>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          {tasks.filter(t => !t.completed).length} Pending Tasks
        </span>
      </div>

      <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 cursor-pointer group/item"
          >
            <div className="shrink-0 mt-0.5 transition-transform active:scale-90">
              {task.completed ? (
                <CheckCircle2 className="text-emerald-500" size={18} />
              ) : (
                <Circle className="text-slate-300 group-hover/item:text-slate-400" size={18} />
              )}
            </div>
            <span className={`text-[13px] leading-tight font-medium transition-all ${
              task.completed 
                ? 'text-slate-400 line-through decoration-emerald-500/30' 
                : 'text-slate-700'
            }`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineWidget;
