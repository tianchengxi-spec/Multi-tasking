import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Plus, BookOpen, Brain, Code, Palette, LucideIcon, Trash2 } from 'lucide-react';
import { AppType } from '../types';
import { APP_CONFIG } from '../constants';

interface CreateBoardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (data: { title: string; apps: AppType[]; mode: 'board' | 'toolring'; color: string }) => void;
}

const COLOR_OPTIONS = [
  { id: 'blue', color: 'bg-blue-500' },
  { id: 'rose', color: 'bg-rose-500' },
  { id: 'amber', color: 'bg-amber-500' },
  { id: 'emerald', color: 'bg-emerald-500' },
  { id: 'indigo', color: 'bg-indigo-500' },
  { id: 'purple', color: 'bg-purple-500' },
  { id: 'slate', color: 'bg-slate-800' },
];

const AVAILABLE_APPS = [
  AppType.CLOUD_DRIVE,
  AppType.NOTES,
  AppType.AI_ASSISTANT,
  AppType.BROWSER,
  AppType.CALENDAR,
  AppType.FILES,
  AppType.CALCULATOR,
  AppType.WHITEBOARD,
  AppType.DICTIONARY
];

const CreateBoardPanel: React.FC<CreateBoardPanelProps> = ({ isOpen, onClose, onDeploy }) => {
  const [creationMode, setCreationMode] = useState<'board' | 'toolring'>('board');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedApps, setSelectedApps] = useState<AppType[]>([]);

  const toggleApp = (appType: AppType) => {
    setSelectedApps(prev => 
      prev.includes(appType) 
        ? prev.filter(a => a !== appType) 
        : [...prev, appType]
    );
  };

  const handleDeploy = () => {
    if (selectedApps.length === 0) return;
    
    // Provide a default title if none is entered
    const finalTitle = title.trim() || (creationMode === 'board' ? '新建学习看板' : '我的工具环');
    
    onDeploy({
      title: finalTitle,
      apps: selectedApps,
      mode: creationMode,
      color: selectedColor
    });
    onClose();
    // Reset form
    setTitle('');
    setNotes('');
    setSelectedApps([]);
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
            {/* Mode Selector */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => setCreationMode('board')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${creationMode === 'board' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                学习看板
              </button>
              <button 
                onClick={() => setCreationMode('toolring')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${creationMode === 'toolring' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                轻量工具环
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {creationMode === 'board' ? '创建学习看板' : '创建轻量工具环'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {/* Task Name */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {creationMode === 'board' ? '项目名称' : '工具环名称'}
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={creationMode === 'board' ? "例如：日语 N1 考试" : "例如：设计必备 / 效率全家桶"}
                  className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Workflow Chain Builder / Tool Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {creationMode === 'board' ? '关联工作流 (任务链)' : '常用工具集'}
                  </label>
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
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tool Ring Preview */}
                <AnimatePresence>
                  {selectedApps.length > 0 && creationMode === 'toolring' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">轮盘预览 (唤起状态)</div>
                      
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Nexus Style Ring Plate */}
                        <div className="absolute inset-0 bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] rounded-full border border-slate-100" />
                        <div className="absolute inset-8 bg-slate-50/50 rounded-full border border-slate-100 shadow-inner" />
                        
                        {/* Central Indicator: Blue Pointer */}
                        <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center z-40 border border-slate-100">
                          <motion.div 
                            animate={{ rotate: 0 }}
                            className="relative w-10 h-10 flex items-center justify-center"
                          >
                            <div 
                              className="absolute top-0 w-4 h-6 bg-blue-500 shadow-lg shadow-blue-500/40" 
                              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '2px' }} 
                            />
                            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm z-10" />
                          </motion.div>
                        </div>

                        {/* Selected Apps around the ring */}
                        {selectedApps.map((appType, i) => {
                          const angle = (i / selectedApps.length) * Math.PI * 2 - Math.PI / 2;
                          const radius = 68;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          
                          return (
                            <React.Fragment key={appType}>
                              {/* Icon Slot */}
                              <div 
                                className="absolute w-12 h-12 bg-white rounded-full shadow-inner border border-slate-50 z-10"
                                style={{ transform: `translate(${x}px, ${y}px)` }}
                              />
                              
                              <motion.div
                                initial={{ scale: 0, x: 0, y: 0 }}
                                animate={{ 
                                  scale: 1, 
                                  x, 
                                  y,
                                  transition: { delay: i * 0.05, type: 'spring', damping: 15 }
                                }}
                                className={`absolute w-10 h-10 ${APP_CONFIG[appType].color} rounded-full flex items-center justify-center border-2 border-white shadow-md z-20`}
                              >
                                {React.cloneElement(APP_CONFIG[appType].icon as React.ReactElement, { size: 16 })}
                              </motion.div>

                              {/* Small accent dots between icons if multiple present */}
                              {selectedApps.length > 1 && (
                                <div 
                                  className={`absolute w-1 h-3 rounded-full bg-slate-200 z-10`}
                                  style={{ 
                                    transform: `translate(${Math.cos(angle + (Math.PI / selectedApps.length)) * radius}px, ${Math.sin(angle + (Math.PI / selectedApps.length)) * radius}px) rotate(${angle * 180 / Math.PI + 90 + 180 / selectedApps.length}deg)`
                                  }}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      
                      <p className="mt-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] text-center">
                        工具环模式 · 拖拽图标快速开启
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Intelligent Layout Recommendation */}
                <AnimatePresence>
                  {selectedApps.length > 0 && creationMode === 'board' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-blue-50/30 border border-blue-100 rounded-[2rem] p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#0873FF] rounded-full animate-pulse" />
                          <span className="text-[10px] font-black text-[#0873FF] uppercase tracking-[0.2em]">智能布局推荐</span>
                        </div>
                        <span className="text-[11px] font-bold text-blue-400">
                          {selectedApps.length === 1 && "单窗口聚焦"}
                          {selectedApps.length === 2 && "主辅分屏 (6:4)"}
                          {selectedApps.length === 3 && "三屏仪表盘"}
                          {selectedApps.length >= 4 && "四宫格指挥中心"}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-24 h-16 bg-white/60 border border-blue-200/50 rounded-xl overflow-hidden shadow-inner p-1">
                           {/* Layout Diagrams */}
                           {selectedApps.length === 1 && (
                             <div className="w-full h-full bg-[#0873FF]/20 rounded-md border border-[#0873FF]/30" />
                           )}
                           {selectedApps.length === 2 && (
                             <div className="w-full h-full flex gap-1">
                               <div className="w-[60%] h-full bg-[#0873FF]/30 rounded-md border border-[#0873FF]/40" />
                               <div className="w-[40%] h-full bg-blue-200/40 rounded-md border border-dashed border-blue-300/50" />
                             </div>
                           )}
                           {selectedApps.length === 3 && (
                             <div className="w-full h-full flex gap-1">
                               <div className="w-[40%] h-full bg-[#0873FF]/30 rounded-md border border-[#0873FF]/40" />
                               <div className="w-[60%] h-full flex flex-col gap-1">
                                  <div className="h-1/2 bg-blue-200/40 rounded-md border border-blue-300/50" />
                                  <div className="h-1/2 bg-blue-100/40 rounded-md border border-blue-200/50" />
                               </div>
                             </div>
                           )}
                           {selectedApps.length >= 4 && (
                             <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
                               <div className="bg-[#0873FF]/30 rounded-md border border-[#0873FF]/40" />
                               <div className="bg-blue-400/30 rounded-md border border-blue-400/40" />
                               <div className="bg-blue-300/30 rounded-md border border-blue-300/40" />
                               <div className="bg-blue-200/30 rounded-md border border-blue-200/40" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] text-blue-900/60 leading-relaxed font-medium">
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
                          ? `scale-125 shadow-xl z-10` 
                          : 'hover:scale-110 opacity-80 hover:opacity-100'
                      } ${item.color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Deployment Button - Moved inside the scrollable area to match the "scroll to bottom" logic */}
              <button 
                onClick={handleDeploy}
                disabled={selectedApps.length === 0}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all mt-4 mb-2
                  ${selectedApps.length > 0 
                    ? 'bg-[#0873FF] text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-95' 
                    : 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                  }`}
              >
                {creationMode === 'board' ? '确认部署看板' : '确认部署工具环'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateBoardPanel;
