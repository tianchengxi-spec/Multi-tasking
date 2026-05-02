
import React, { useState } from 'react';
import { Plus, Search, Tag, MoreVertical } from 'lucide-react';

const NotesApp: React.FC = () => {
  const [notes] = useState([
    { id: '1', title: '交互设计论文', preview: '专注于平板环境中的多模态反馈循环...', date: '2分钟前' },
    { id: '2', title: '购物清单', preview: '苹果、牛奶、面包、新触控笔、Paperwhite显示屏...', date: '1小时前' },
    { id: '3', title: '会议记录：Nexus OS', preview: '多任务体验应该是流畅且无摩擦的...', date: '昨天' },
  ]);

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">我的备忘录</h2>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="p-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索备忘录..." 
              className="w-full bg-slate-100 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            {notes.map(note => (
              <div key={note.id} className="p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-[13px] text-slate-800 truncate">{note.title}</h3>
                  <span className="text-[10px] text-slate-400 shrink-0">{note.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{note.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Editor Placeholder */}
      <div className="flex-1 flex flex-col p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">研究</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">论文</span>
          </div>
          <MoreVertical className="text-slate-400 cursor-pointer" size={18} />
        </div>
        <h1 className="text-xl font-extrabold text-slate-800 mb-6">交互设计论文</h1>
        <div className="space-y-4 text-slate-600 leading-relaxed text-[13px]">
          <p>本研究探讨了大幅面平板电脑上<strong>触觉反馈</strong>与<strong>手势多任务处理</strong>的交集。</p>
          <p>iPadOS和Android平板电脑目前的局限性通常源于“手机优先”的遗产。Nexus OS旨在通过将屏幕视为一个流动的画布来打破这一点，在这个画布上，应用程序可以根据用户流程而不是严格的网格进行重新排列和调整大小。</p>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs border-l-4 border-l-blue-400">
            “屏幕不是容器，而是工作空间。” —— 原型原则 #1
          </div>
          <p>初步用户研究的主要观察结果 (n=12):</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>用户在进行研究时更喜欢水平拆分而不是垂直拆分。</li>
            <li>应用间的拖放是请求最多的功能。</li>
            <li>视觉深度（阴影、层级）有助于减轻认知负荷。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
