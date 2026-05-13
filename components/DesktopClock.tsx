
import React, { useState, useEffect } from 'react';

const DesktopClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  
  const dayName = time.toLocaleDateString('zh-CN', { weekday: 'short' });
  const dateStr = time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

  return (
    <div className="absolute top-12 left-12 flex flex-col items-start pointer-events-none select-none z-0">
      <div className="flex flex-col items-start">
        <div className="flex gap-2 items-baseline">
          {/* text-5xl (48px) * 1.3 = ~62px -> text-[64px] */}
          <div className="text-[64px] font-light text-white/90 leading-none tracking-tighter">
            {hours}
          </div>
          {/* text-4xl (36px) * 1.3 = ~47px -> text-5xl (48px) */}
          <div className="text-5xl font-light text-white/40 leading-none tracking-tighter">
            :
          </div>
          <div className="text-[64px] font-light text-white/90 leading-none tracking-tighter">
            {minutes}
          </div>
        </div>
        <div className="mt-3 flex flex-col items-start px-1">
          {/* text-xs (12px) * 1.3 = ~16px -> text-base */}
          <span className="text-base font-bold text-white/70 tracking-[0.15em] uppercase">
            {dayName}, {dateStr}
          </span>
        </div>
        
        {/* Slightly larger decorative glow */}
        <div className="absolute -inset-10 bg-white/10 rounded-full blur-3xl -z-10 opacity-70"></div>
      </div>
    </div>
  );
};

export default DesktopClock;
