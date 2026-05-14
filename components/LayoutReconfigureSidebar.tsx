
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, X, Sparkles, RefreshCw, Save } from 'lucide-react';

interface LayoutReconfigureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onReconfigure: () => void;
  onSaveCombination?: () => void;
}

const LayoutReconfigureSidebar: React.FC<LayoutReconfigureSidebarProps> = ({ 
  isOpen, 
  onClose, 
  onReconfigure,
  onSaveCombination 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="fixed top-20 right-6 z-[6000] w-80 bg-white shadow-2xl rounded-3xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: '#0873FF' }} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">布局动态管理</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: '#0873FF', boxShadow: '0 10px 15px -3px rgba(8, 115, 255, 0.2)' }}
              >
                <Layout size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-600 leading-normal font-bold">
                  当前的窗口分配非常高效。
                </p>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                  您可以将当前组合保存为预设，方便下次快速开启。
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={onSaveCombination}
                  className="flex-1 py-3 px-4 bg-white border-2 border-[#0873FF] text-[#0873FF] rounded-xl transition-all font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-95"
                >
                  <Save size={14} />
                  保存当前组合
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={onReconfigure}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  智能收束
                </button>
                <button 
                  onClick={onClose}
                  className="w-12 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-xl transition-all flex items-center justify-center group"
                >
                  <span className="group-hover:scale-110 transition-transform">关</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LayoutReconfigureSidebar;
