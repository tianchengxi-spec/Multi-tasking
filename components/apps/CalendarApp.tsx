import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarApp: React.FC = () => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  
  // 2026年5月1日是周五
  // 5月有31天
  const calendarDays = [];
  
  // 填充月初空白
  for (let i = 0; i < 5; i++) {
    calendarDays.push(null);
  }
  
  // 填充日期
  for (let i = 1; i <= 31; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* 头部 */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">2026年5月</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">今天：5月2日 星期六</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 日历主体 */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-7 mb-2">
          {days.map((day, idx) => (
            <div key={day} className={`text-center py-2 text-xs font-bold ${idx === 0 || idx === 6 ? 'text-amber-500' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const isToday = day === 2;
            return (
              <div 
                key={idx} 
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all relative group cursor-pointer
                  ${day ? 'hover:bg-slate-50' : ''}
                  ${isToday ? 'bg-rose-50 border border-rose-100' : ''}
                `}
              >
                {day && (
                  <>
                    <span className={`text-sm font-semibold ${isToday ? 'text-rose-600' : 'text-slate-700'} ${idx % 7 === 0 || idx % 7 === 6 ? 'text-opacity-60' : ''}`}>
                      {day}
                    </span>
                    {day === 1 && <span className="absolute bottom-1.5 text-[8px] text-rose-400 font-bold">五一</span>}
                    {day === 4 && <span className="absolute bottom-1.5 text-[8px] text-slate-400 font-bold">周年</span>}
                    {isToday && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部详情提示 */}
      <div className="p-4 border-top border-slate-50 bg-slate-50/30">
        <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-1 h-3 bg-rose-500 rounded-full mt-1.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-800">全天日程</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Nexus UI 交互设计评审</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
