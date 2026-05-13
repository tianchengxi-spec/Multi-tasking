
import React, { useState, useEffect } from 'react';
import { SYSTEM_ICONS } from '../constants';

interface SystemBarProps {
  isDark?: boolean;
}

const SystemBar: React.FC<SystemBarProps> = ({ isDark = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
  };

  const textColor = isDark ? 'text-slate-900' : 'text-white';
  const subTextColor = isDark ? 'text-slate-500' : 'text-white/70';
  const iconColor = isDark ? 'text-slate-900' : 'text-white';

  return (
    <div className="h-10 shrink-0 px-6 flex items-center justify-between bg-transparent pointer-events-none">
      <div className={`flex items-center gap-4 text-[13px] font-bold ${textColor} pointer-events-auto cursor-default`}>
        <span>{formatTime(time)}</span>
        <span className={`${subTextColor} text-[11px] font-medium tracking-wide uppercase`}>{formatDate(time)}</span>
      </div>
      
      <div className={`flex items-center gap-5 ${iconColor} pointer-events-auto`}>
        <div className={`flex items-center gap-1.5 hover:bg-black/5 px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${iconColor}`}>
          {React.cloneElement(SYSTEM_ICONS.Signal as React.ReactElement, { className: iconColor })}
          <span className={`text-[10px] font-extrabold uppercase tracking-tighter ${textColor}`}>5G</span>
        </div>
        <div className={`flex items-center gap-1.5 hover:bg-black/5 px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${iconColor}`}>
          {React.cloneElement(SYSTEM_ICONS.Wifi as React.ReactElement, { className: iconColor })}
        </div>
        <div className={`flex items-center gap-1.5 hover:bg-black/5 px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${iconColor}`}>
           <span className={`text-[11px] font-bold ${textColor}`}>84%</span>
           {React.cloneElement(SYSTEM_ICONS.Battery as React.ReactElement, { className: iconColor })}
        </div>
      </div>
    </div>
  );
};

export default SystemBar;
