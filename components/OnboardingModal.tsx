
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, Layers, Box, Target } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[320px] bg-white rounded-[1.5rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center text-center p-6 select-none"
          >
            {/* Visual Header */}
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[1rem] mb-5 relative overflow-hidden group">
              {/* Abstract Workbench UI Mockup */}
              <div className="absolute inset-x-4 top-4 bottom-[-20%] bg-white rounded-t-xl shadow-xl flex flex-col overflow-hidden text-[8px]">
                <div className="flex-1 p-2 grid grid-cols-2 grid-rows-2 gap-1.5">
                    <div className="bg-blue-50 rounded-md border border-blue-100 animate-pulse" />
                    <div className="bg-orange-50 rounded-md border border-orange-100 animate-pulse [animation-delay:0.2s]" />
                    <div className="bg-purple-50 rounded-md border border-purple-100 animate-pulse [animation-delay:0.4s]" />
                    <div className="bg-emerald-50 rounded-md border border-emerald-100 animate-pulse [animation-delay:0.6s]" />
                </div>
              </div>

              {/* Floating Icons */}
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute left-4 top-10 w-6 h-6 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white"
              >
                <Layers size={12} />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-6 top-8 w-5 h-5 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center text-white"
              >
                <Target size={10} />
              </motion.div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">学习任务台</h2>
            
            <p className="text-[11px] leading-snug text-slate-500 max-w-xs mb-6 px-2">
              通过“学习任务台”，轻松地管理和协调多个学习任务。在这里，你可以按任务链的顺序创建任务、分配优先级、调整任务间的关系，并随时回溯任务进度。学习任务台支持任务的灵活组合和动态调度，让你在复杂的学习场景中游刃有余。
            </p>

            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              <button 
                onClick={onConfirm}
                className="w-full py-2.5 bg-[#1a237e] text-white text-[13px] font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                开启学习任务台
              </button>
              <button 
                onClick={onClose}
                className="w-full py-1.5 text-blue-600 font-medium text-[13px] hover:underline"
              >
                以后
              </button>
            </div>

            {/* Pagination Decorator */}
            <div className="flex gap-1 mt-4">
                <div className="w-1 h-1 rounded-full bg-blue-600" />
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="w-1 h-1 rounded-full bg-slate-200" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
