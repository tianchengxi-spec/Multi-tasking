import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Plus, BookOpen, Brain, Code, Palette, LucideIcon } from 'lucide-react';

interface CreateBoardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_OPTIONS = [
  { id: 'target', icon: Target, label: '目标', color: 'bg-rose-500' },
  { id: 'book', icon: BookOpen, label: '阅读', color: 'bg-blue-500' },
  { id: 'brain', icon: Brain, label: '记忆', color: 'bg-purple-500' },
  { id: 'code', icon: Code, label: '编程', color: 'bg-slate-800' },
  { id: 'art', icon: Palette, label: '创作', color: 'bg-amber-500' },
];

const CreateBoardPanel: React.FC<CreateBoardPanelProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [days, setDays] = useState('30');
  const [selectedIcon, setSelectedIcon] = useState('target');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 h-full w-[400px] bg-white/80 backdrop-blur-2xl border-r border-white/40 shadow-2xl z-[101] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">创建学习看板</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto pr-2">
              {/* Task Name */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">项目名称</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：日语 N1 考试"
                  className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Icon Selection */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">视觉标识</label>
                <div className="flex gap-3">
                  {ICON_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIcon(item.id)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedIcon === item.id 
                          ? `${item.color} text-white scale-110 shadow-lg` 
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <item.icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Countdown */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">倒计时（天）</label>
                <input 
                  type="number" 
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Tool Prep */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">关联工作流</label>
                <div className="p-5 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                    <Plus size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">点击添加关联应用</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#0873FF] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-10">
              确认部署看板
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateBoardPanel;
