
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
  SignalHigh
} from 'lucide-react';
import { AppType } from './types';

const AlipayIcon = ({ size = 24 }: { size?: number }) => (
  <div className="flex items-center justify-center overflow-hidden bg-white" style={{ width: size, height: size }}>
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 15.38V54.768H79.996C79.996 54.768 79.76 60.8 79.76 67.336C79.1191 70.8865 77.2519 74.0993 74.4844 76.4137C71.7168 78.7282 68.2245 79.9974 64.6168 80H15.3792C11.3007 79.9989 7.38958 78.3782 4.50564 75.4941C1.62171 72.6101 0.00106031 68.6987 0 64.62V15.38C0.00211963 11.3016 1.62311 7.39089 4.50681 4.50704C7.39052 1.62319 11.3011 0.00211974 15.3792 0H64.6168C68.6956 0.00105977 72.6072 1.62166 75.4918 4.50563C78.3764 7.38959 79.9979 11.3009 80 15.38Z" fill="white"/>
      <path d="M80 54.768V15.38C79.9979 11.3009 78.3763 7.38959 75.4918 4.50563C72.6072 1.62166 68.6956 0.00105977 64.6168 0L15.3792 0C11.3011 0.00211974 7.39052 1.62319 4.50681 4.50704C1.62311 7.39089 0.00211963 11.3016 0 15.38V64.62C0.00106031 68.6987 1.62171 72.6101 4.50564 75.4941C7.39052 78.3782 11.3007 79.9989 15.3792 80H64.6168C68.2245 79.9974 71.7168 78.7282 74.4844 76.4137C77.2519 74.0993 79.1191 70.8865 79.76 67.336C75.6802 65.568 58.0011 57.936 48.7896 53.536C41.7819 62.028 34.4383 67.124 23.3748 67.124C12.3114 67.124 4.92375 60.308 5.81171 51.964C6.39568 46.492 10.1515 37.544 26.4587 39.076C35.0582 39.884 38.9901 41.488 46.0017 43.804C47.8136 40.476 49.3215 36.816 50.4655 32.924H19.379V29.844H34.7623V24.308H15.9992V20.92H34.7583V12.94C34.7583 12.94 34.9263 11.692 36.3062 11.692H43.9978V20.92H63.9968V24.312H43.9978V29.84H60.313C58.9058 35.6659 56.674 41.261 53.6853 46.456C58.4251 48.176 79.996 54.768 79.996 54.768H80ZM22.1509 61.844C10.4595 61.844 8.61157 54.464 9.23154 51.38C9.84351 48.308 13.2313 44.3 19.731 44.3C27.1986 44.3 33.8903 46.212 41.9219 50.124C36.2822 57.468 29.3505 61.844 22.1509 61.844Z" fill="#009FE8"/>
    </svg>
  </div>
);

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
  <div className="flex items-center justify-center bg-slate-100 rounded-xl" style={{ width: size, height: size }}>
    <Calculator size={size * 0.7} className="text-slate-600" />
  </div>
);

export const APP_CONFIG = {
  [AppType.NOTES]: { icon: <FileText size={24} />, color: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
  [AppType.FILES]: { icon: <Folder size={24} />, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  [AppType.BROWSER]: { icon: <Globe size={24} />, color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
  [AppType.AI_ASSISTANT]: { icon: <Sparkles size={24} />, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  [AppType.CALENDAR]: { icon: <Calendar size={24} />, color: 'bg-rose-100 text-rose-600', border: 'border-rose-200' },
  [AppType.SETTINGS]: { icon: <Settings size={24} />, color: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
  [AppType.XIAOHONGSHU]: { icon: <XiaohongshuIcon />, color: 'bg-[#FF2442]', border: 'border-red-400/10' },
  [AppType.CALCULATOR]: { icon: <CalculatorIcon />, color: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
  [AppType.ALIPAY]: { icon: <AlipayIcon />, color: 'bg-[#009FE8]', border: 'border-blue-200' },
};

export const SYSTEM_ICONS = {
  Wifi: <Wifi size={16} />,
  Battery: <Battery size={16} />,
  Signal: <SignalHigh size={16} />,
};