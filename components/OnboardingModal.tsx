
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, Layers, Box, Target, ChevronRight, ChevronLeft, Sparkles, LayoutGrid, MousePointer2, RefreshCw } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PAGES = [
  {
    title: '学习任务台',
    description: '通过学习任务台，轻松地管理和协调多个学习任务。让你在复杂的学习场景中游刃有余。',
    icon: <Layout size={24} />,
    color: 'from-blue-600 to-indigo-700',
    illustration: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/40 rounded-3xl flex items-center justify-center text-white shadow-2xl">
          <Layout size={32} />
        </div>
      </div>
    )
  },
  {
    title: '学习任务台--学习看板',
    description: '内置全能白板，支持绘制思维导图、流程图及灵感笔记，让知识在这片自由画布上生长。',
    icon: <LayoutGrid size={24} />,
    color: 'from-emerald-500 to-teal-700',
    illustration: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/40 rounded-3xl flex items-center justify-center text-white shadow-2xl">
          <LayoutGrid size={32} />
        </div>
      </div>
    )
  },
  {
    title: '学习任务台--轻量工具环',
    description: '通过独特的边缘双击触发，在侧边快速调起翻译、词典等辅助工具，不打断主学习流。',
    icon: <MousePointer2 size={24} />,
    color: 'from-purple-500 to-indigo-700',
    illustration: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-[6px] border-white/20 relative">
          <div className="absolute inset-0">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-lg shadow-lg flex items-center justify-center text-purple-600">
              <Box size={12} />
            </div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white rounded-lg shadow-lg flex items-center justify-center text-indigo-600">
              <Target size={12} />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                <MousePointer2 size={24} />
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: '学习任务台--智能收束',
    description: '通过在屏幕右侧连续点击，AI 能够智能识别当前杂乱的窗口状态，并为您一键重构最优布局。',
    icon: <Sparkles size={24} />,
    color: 'from-blue-500 to-blue-700',
    illustration: (
      <div className="absolute inset-4 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/40 rounded-3xl flex items-center justify-center text-white shadow-2xl">
             <Sparkles size={32} />
          </div>
          
          {/* Scatter dots that converge - static positions */}
          <div className="absolute top-4 right-4 w-4 h-4 bg-[#0873FF] rounded-full shadow-lg" />
          <div className="absolute bottom-6 left-4 w-5 h-5 bg-blue-300 rounded-full shadow-lg" />
          <div className="absolute top-8 left-10 w-3 h-3 bg-indigo-400 rounded-full shadow-lg" />
        </div>
      </div>
    )
  }
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onConfirm();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6">
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
            className="relative w-full max-w-[320px] bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center text-center select-none"
          >
            {/* Carousel Content */}
            <div className="w-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-6 pb-2 flex flex-col items-center"
                >
                  {/* Visual Header */}
                  <div className={`w-full aspect-[16/10] bg-gradient-to-br ${PAGES[currentPage].color} rounded-[1.5rem] mb-6 relative overflow-hidden`}>
                    {PAGES[currentPage].illustration}
                  </div>

                  <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight leading-tight px-4">
                    {PAGES[currentPage].title}
                  </h2>
                  
                  <p className="text-[12px] leading-relaxed text-slate-500 max-w-[240px] mb-6 h-12 flex items-center justify-center font-medium">
                    {PAGES[currentPage].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="w-full px-6 pb-8 flex flex-col items-center gap-6">
              {/* Pagination Dots */}
              <div className="flex gap-2">
                {PAGES.map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      width: i === currentPage ? 16 : 6,
                      backgroundColor: i === currentPage ? '#0873FF' : '#E2E8F0'
                    }}
                    className="h-1.5 rounded-full"
                  />
                ))}
              </div>

              {/* Action Button */}
              <div className="w-full flex items-center gap-3">
                {currentPage > 0 && (
                  <button 
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all border border-slate-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                
                <button 
                  onClick={handleNext}
                  className="flex-1 h-12 bg-[#0873FF] text-white text-[14px] font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  {currentPage === PAGES.length - 1 ? '开启学习任务台' : '下一步'}
                  {currentPage < PAGES.length - 1 && (
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  )}
                </button>
              </div>

              {currentPage === 0 && (
                <button 
                  onClick={onClose}
                  className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  跳过介绍
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;

