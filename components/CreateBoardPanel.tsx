import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Plus, BookOpen, Brain, Code, Palette, LucideIcon, Trash2 } from 'lucide-react';
import { AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface CreateBoardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { id: 'blue', color: 'bg-blue-500' },
  { id: 'rose', color: 'bg-rose-500' },
  { id: 'amber', color: 'bg-amber-500' },
  { id: 'emerald', color: 'bg-emerald-500' },
  { id: 'indigo', color: 'bg-indigo-500' },
  { id: 'purple', color: 'bg-purple-500' },
  { id: 'slate', color: 'bg-slate-800' },
  { id: 'none', color: 'bg-transparent border-2 border-slate-100 flex items-center justify-center' },
];

const AVAILABLE_APPS = [
  AppType.CLOUD_DRIVE,
  AppType.NOTES,
  AppType.AI_ASSISTANT,
  AppType.BROWSER,
  AppType.CALENDAR,
  AppType.FILES,
  AppType.CALCULATOR,
  AppType.WHITEBOARD
];

const CreateBoardPanel: React.FC<CreateBoardPanelProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedApps, setSelectedApps] = useState<AppType[]>([]);
  const [isAppPickerOpen, setIsAppPickerOpen] = useState(false);

  const toggleApp = (appType: AppType) => {
    setSelectedApps(prev => 
      prev.includes(appType) 
        ? prev.filter(a => a !== appType) 
        : [...prev, appType]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[190]"
          />
          <motion.div 
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-6 left-6 h-fit max-h-[calc(100%-3rem)] w-[400px] bg-white border border-slate-100 rounded-[3rem] shadow-2xl z-[200] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">创建学习看板</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 overflow-y-auto overflow-x-hidden">
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

              {/* Workflow Chain Builder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">关联工作流 (任务链)</label>
                  {selectedApps.length > 0 && (
                    <button 
                      onClick={() => setSelectedApps([])}
                      className="text-[10px] text-rose-500 font-bold uppercase tracking-tight hover:underline flex items-center gap-1"
                    >
                      清空已选
                    </button>
                  )}
                </div>
                
                <div className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 p-4">
                  {/* Selected Apps Chain */}
                  {selectedApps.length > 0 ? (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        {selectedApps.map((appType, index) => (
                          <motion.div 
                            key={appType}
                            initial={{ scale: 0, x: -20 }}
                            animate={{ scale: 1, x: 0 }}
                            className={`w-12 h-12 ${APP_CONFIG[appType].color} rounded-[1.25rem] flex items-center justify-center border-2 border-white shadow-lg overflow-hidden shrink-0 z-${30 - index * 10}`}
                            style={{ marginLeft: index > 0 ? '-1.25rem' : '0' }}
                          >
                            {React.cloneElement(APP_CONFIG[appType].icon as React.ReactElement, { size: 24 })}
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex-1">
                         <p className="text-slate-800 text-[13px] font-black tracking-tight">已连接 {selectedApps.length} 个应用</p>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">任务链已建立</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                       <p className="text-slate-300 text-[11px] font-bold uppercase tracking-widest">尚未添加关联应用</p>
                    </div>
                  )}

                  {/* App Picker */}
                  <div className="grid grid-cols-4 gap-3">
                    {AVAILABLE_APPS.map((appType) => {
                      const isSelected = selectedApps.includes(appType);
                      return (
                        <button
                          key={appType}
                          onClick={() => toggleApp(appType)}
                          className={`group relative flex flex-col items-center justify-center gap-2 p-2 rounded-2xl transition-all duration-300 ${
                            isSelected 
                              ? 'bg-blue-50/50 scale-105' 
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-10 h-10 ${APP_CONFIG[appType].color} rounded-xl flex items-center justify-center shadow-sm transition-all ${
                            isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                          }`}>
                            {React.cloneElement(APP_CONFIG[appType].icon as React.ReactElement, { size: 20 })}
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border border-white">
                              <Plus size={10} className="text-white rotate-45" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Intelligent Layout Recommendation */}
                <AnimatePresence>
                  {selectedApps.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-indigo-50/30 border border-indigo-100 rounded-[2rem] p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">智能布局推荐</span>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-400">
                          {selectedApps.length === 1 && "单窗口聚焦"}
                          {selectedApps.length === 2 && "主辅分屏 (6:4)"}
                          {selectedApps.length === 3 && "三屏仪表盘"}
                          {selectedApps.length >= 4 && "四宫格指挥中心"}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-24 h-16 bg-white/60 border border-indigo-200/50 rounded-xl overflow-hidden shadow-inner p-1">
                           {/* Layout Diagrams */}
                           {selectedApps.length === 1 && (
                             <div className="w-full h-full bg-indigo-500/20 rounded-md border border-indigo-500/30" />
                           )}
                           {selectedApps.length === 2 && (
                             <div className="w-full h-full flex gap-1">
                               <div className="w-[60%] h-full bg-indigo-500/30 rounded-md border border-indigo-500/40" />
                               <div className="w-[40%] h-full bg-indigo-200/40 rounded-md border border-dashed border-indigo-300/50" />
                             </div>
                           )}
                           {selectedApps.length === 3 && (
                             <div className="w-full h-full flex gap-1">
                               <div className="w-[40%] h-full bg-indigo-500/30 rounded-md border border-indigo-500/40" />
                               <div className="w-[60%] h-full flex flex-col gap-1">
                                  <div className="h-1/2 bg-indigo-200/40 rounded-md border border-indigo-300/50" />
                                  <div className="h-1/2 bg-indigo-100/40 rounded-md border border-indigo-200/50" />
                               </div>
                             </div>
                           )}
                           {selectedApps.length >= 4 && (
                             <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
                               <div className="bg-indigo-500/30 rounded-md border border-indigo-500/40" />
                               <div className="bg-indigo-400/30 rounded-md border border-indigo-400/40" />
                               <div className="bg-indigo-300/30 rounded-md border border-indigo-300/40" />
                               <div className="bg-indigo-200/30 rounded-md border border-indigo-200/40" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] text-indigo-900/60 leading-relaxed font-medium">
                            {selectedApps.length === 1 && "最佳单窗口操作体验，专注核心任务。"}
                            {selectedApps.length === 2 && "左右 6:4 比例，平衡核心输出与参考资料。"}
                            {selectedApps.length === 3 && "左侧主视口 + 右侧双辅助，适合多维数据监控。"}
                            {selectedApps.length >= 4 && "全屏网格覆盖，快速穿梭于四个核心应用。"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">备注</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="添加一些备注信息..."
                  rows={2}
                  className="w-full bg-white/50 border border-slate-200 rounded-2xl py-3 px-5 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none placeholder:text-slate-300 transition-all"
                />
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">组件边框颜色</label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedColor(item.id)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === item.id 
                          ? `scale-125 shadow-xl z-20 ring-2 ring-offset-2 ring-slate-100` 
                          : 'hover:scale-110 opacity-80 hover:opacity-100'
                      } ${item.color}`}
                    >
                      {item.id === 'none' && <X size={16} className="text-slate-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full bg-[#0873FF] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-6">
              确认部署看板
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateBoardPanel;
