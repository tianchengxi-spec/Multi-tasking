
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Volume2, 
  Battery, 
  Signal, 
  Plane, 
  Maximize2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose }) => {
  const [isConvergenceActive, setIsConvergenceActive] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/5 z-[2000]"
          />
          
          {/* Panel */}
          <motion.div 
            initial={{ y: -400, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -400, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-4 right-4 w-[360px] bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-white/50 z-[2001] p-6 overflow-hidden"
          >
            {/* Top Grid: Connectivity */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/60 rounded-3xl p-4 flex flex-col gap-4 shadow-sm border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Wifi size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 leading-none mb-1">Wi-Fi</span>
                    <span className="text-sm font-bold text-slate-800">Nexus_5G</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Bluetooth size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 leading-none mb-1">Bluetooth</span>
                    <span className="text-sm font-bold text-slate-800">On</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/60 rounded-3xl flex items-center justify-center shadow-sm border border-white/20 aspect-square hover:bg-blue-500 hover:text-white transition-colors cursor-pointer group">
                   <Plane size={24} className="text-slate-400 group-hover:text-white transition-colors" />
                 </div>
                 <div className="bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 aspect-square cursor-pointer">
                   <Signal size={24} className="text-white" />
                 </div>
                 <div 
                   onClick={() => setIsConvergenceActive(!isConvergenceActive)}
                   className={`${isConvergenceActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/60 text-slate-400 shadow-sm border border-white/20'} rounded-3xl flex items-center justify-center aspect-square cursor-pointer transition-all duration-300`}
                 >
                    <Sparkles size={24} />
                 </div>
                 <div className="bg-white/60 rounded-3xl flex items-center justify-center shadow-sm border border-white/20 aspect-square cursor-pointer">
                    <Maximize2 size={24} className="text-slate-400" />
                 </div>
              </div>
            </div>

            {/* Sliders Area */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="bg-white/60 rounded-3xl p-4 shadow-sm border border-white/20 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                   <Sun size={14} className="text-slate-400" />
                   <div className="flex-1 mx-4 h-6 bg-slate-200/50 rounded-full relative overflow-hidden group">
                      <div className="absolute top-0 left-0 h-full w-[75%] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                   </div>
                   <Sun size={18} className="text-slate-400" />
                </div>
                <div className="flex items-center justify-between px-1">
                   <Volume2 size={14} className="text-slate-400" />
                   <div className="flex-1 mx-4 h-6 bg-slate-200/50 rounded-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                   </div>
                   <Volume2 size={18} className="text-slate-400" />
                </div>
              </div>
            </div>



            {/* Footer Status */}
            <div className="mt-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Battery size={14} className="text-emerald-500" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">84% Charging</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
              >
                <ChevronRight size={16} className="rotate-90" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ControlCenter;
