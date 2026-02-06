
import React from 'react';
import { 
  FileText, 
  Folder, 
  Globe, 
  Sparkles, 
  Calendar, 
  Settings, 
  Wifi, 
  Battery, 
  SignalHigh
} from 'lucide-react';
import { AppType } from './types';

const BilibiliIcon = ({ size = 24 }: { size?: number }) => (
  <img 
    src="https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png" 
    style={{ width: size, height: size }} 
    className="rounded-md object-cover"
    alt="Bilibili"
  />
);

const XiaohongshuIcon = ({ size = 24 }: { size?: number }) => (
  <img 
    src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/31/31/85/3131853f-4217-1569-2321-72909185a86d/AppIcon-0-0-1x_U007emarketing-0-7-0-sRGB-85-220.png/512x512bb.jpg" 
    style={{ width: size, height: size }} 
    className="rounded-md object-cover"
    alt="Xiaohongshu"
  />
);

const CalculatorIcon = ({ size = 24 }: { size?: number }) => (
  <img 
    src="https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/6d/2f/50/6d2f504e-670d-f53e-329b-839f379207e2/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg" 
    style={{ width: size, height: size }} 
    className="rounded-md object-cover"
    alt="Calculator"
  />
);

export const APP_CONFIG = {
  [AppType.NOTES]: { icon: <FileText size={24} />, color: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
  [AppType.FILES]: { icon: <Folder size={24} />, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  [AppType.BROWSER]: { icon: <Globe size={24} />, color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
  [AppType.AI_ASSISTANT]: { icon: <Sparkles size={24} />, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  [AppType.CALENDAR]: { icon: <Calendar size={24} />, color: 'bg-rose-100 text-rose-600', border: 'border-rose-200' },
  [AppType.SETTINGS]: { icon: <Settings size={24} />, color: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
  [AppType.BILIBILI]: { icon: <BilibiliIcon />, color: 'bg-white', border: 'border-pink-100' },
  [AppType.XIAOHONGSHU]: { icon: <XiaohongshuIcon />, color: 'bg-white', border: 'border-red-100' },
  [AppType.CALCULATOR]: { icon: <CalculatorIcon />, color: 'bg-white', border: 'border-orange-100' },
};

export const SYSTEM_ICONS = {
  Wifi: <Wifi size={16} />,
  Battery: <Battery size={16} />,
  Signal: <SignalHigh size={16} />,
};