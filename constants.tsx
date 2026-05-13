
import React from 'react';
import { 
  FileText, 
  Folder, 
  Globe, 
  Sparkles, 
  Calendar, 
  Settings, 
  Calculator,
  Wifi, 
  Battery, 
  SignalHigh,
  Cloud
} from 'lucide-react';
import { AppType } from './types';

/**
 * Xiaohongshu "Frame" Icon
 * Re-generated based on the provided Android XML spec (80dp, clipToOutline)
 */
const XiaohongshuIcon = ({ size = 24 }: { size?: number }) => (
  <div 
    id="frame"
    className="relative flex items-center justify-center overflow-hidden bg-[#FF2442] shadow-inner"
    style={{ 
      width: size, 
      height: size,
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)'
    }}
  >
    <img 
      src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/31/31/85/3131853f-4217-1569-2321-72909185a86d/AppIcon-0-0-1x_U007emarketing-0-7-0-sRGB-85-220.png/1024x1024bb.jpg" 
      className="w-full h-full object-cover transform active:scale-95 transition-transform"
      alt="Xiaohongshu"
    />
    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
  </div>
);

const CalculatorIcon = ({ size = 24 }: { size?: number }) => (
  <Calculator size={size} />
);

export const APP_CONFIG = {
  [AppType.NOTES]: { icon: <FileText size={24} />, color: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
  [AppType.FILES]: { icon: <Folder size={24} />, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  [AppType.BROWSER]: { icon: <Globe size={24} />, color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
  [AppType.AI_ASSISTANT]: { icon: <Sparkles size={24} />, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  [AppType.CALENDAR]: { icon: <Calendar size={24} />, color: 'bg-rose-100 text-rose-600', border: 'border-rose-200' },
  [AppType.SETTINGS]: { icon: <Settings size={24} />, color: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
  [AppType.XIAOHONGSHU]: { icon: <XiaohongshuIcon />, color: 'bg-[#FF2442]', border: 'border-red-400/10' },
  [AppType.CALCULATOR]: { icon: <Calculator size={30} />, color: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
  [AppType.CLOUD_DRIVE]: { icon: <Cloud size={24} />, color: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
};

export const SYSTEM_ICONS = {
  Wifi: <Wifi size={16} />,
  Battery: <Battery size={16} />,
  Signal: <SignalHigh size={16} />,
};