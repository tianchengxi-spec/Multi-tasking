
import React, { useState, useEffect } from 'react';
import { SYSTEM_ICONS } from '../constants';

const SystemBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-10 shrink-0 px-6 flex items-center justify-between bg-transparent pointer-events-none">
      <div className="flex items-center gap-4 text-[13px] font-bold text-slate-800 pointer-events-auto cursor-default">
        <span>{formatTime(time)}</span>
        <span className="text-slate-400 text-[11px] font-medium tracking-wide uppercase">{formatDate(time)}</span>
      </div>
      
      <div className="flex items-center gap-5 text-slate-600 pointer-events-auto">
        <div className="flex items-center gap-1.5 hover:bg-white/50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer">
          {SYSTEM_ICONS.Signal}
          <span className="text-[10px] font-extrabold uppercase tracking-tighter">Nexus 5G</span>
        </div>
        <div className="flex items-center gap-1.5 hover:bg-white/50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer">
          {SYSTEM_ICONS.Wifi}
        </div>
        <div className="flex items-center gap-1.5 hover:bg-white/50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer">
           <span className="text-[11px] font-bold">84%</span>
           {SYSTEM_ICONS.Battery}
        </div>
      </div>
    </div>
  );
};

export default SystemBar;
