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
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] group hover:bg-white/60 transition-all duration-500 cursor-default">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-slate-900 font-bold text-lg tracking-tight flex items-center gap-2">
          近期 DDL
          <span className="bg-rose-100 text-rose-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Urgent</span>
        </h3>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          {tasks.filter(t => !t.completed).length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-3 cursor-pointer group/item"
          >
            <div className="shrink-0 transition-transform active:scale-90">
              {task.completed ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <Circle className="text-slate-300 group-hover/item:text-slate-400" size={20} />
              )}
            </div>
            <span className={`text-sm font-medium transition-all ${
              task.completed 
                ? 'text-slate-400 line-through decoration-emerald-500/30' 
                : 'text-slate-700'
            }`}>
              {task.text}
            </span>
            {!task.completed && task.priority === 'high' && (
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineWidget;
