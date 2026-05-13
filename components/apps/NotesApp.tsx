
import React, { useState } from 'react';
import { Plus, Search, Tag, MoreVertical } from 'lucide-react';
import { WindowState } from '../../types';

interface NotesAppProps {
  state?: WindowState;
  initialNoteId?: string;
}

const NotesApp: React.FC<NotesAppProps> = ({ state, initialNoteId }) => {
  const [selectedNoteId, setSelectedNoteId] = useState(initialNoteId || '1');
  const [notes] = useState([
    { 
      id: '1', 
      title: '交互设计', 
      content: (
        <div className="space-y-4">
          <p>核心原则：</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>费茨法则：</strong>目标越小，距离越远，到达目标所需的时间就越长。</li>
            <li><strong>希克法则：</strong>增加选择的数量会指数级增加决策所需的时间。</li>
            <li><strong>尼尔森原则：</strong>系统的状态可见性、环境贴切、用户控制权和自由度。</li>
            <li><strong>奥卡姆剃刀：</strong>如无必要，勿增实体。保持界面的极简与高效。</li>
          </ul>
        </div>
      ),
      tags: ['研究', '论文'],
      date: '2分钟前' 
    },
    { 
      id: '2', 
      title: '购物清单', 
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>苹果</li>
          <li>牛奶</li>
          <li>面包</li>
          <li>新触控笔</li>
          <li>Paperwhite显示屏</li>
        </ul>
      ),
      tags: ['个人', '清单'],
      date: '1小时前' 
    },
    { 
      id: '3', 
      title: '会议记录：Nexus OS', 
      content: <p>多任务体验应该是流畅且无摩擦的。讨论了边缘吸附、小窗模式以及不同应用间的状态同步。</p>,
      tags: ['工作', '会议'],
      date: '昨天' 
    },
    { 
      id: '4', 
      title: '每日英语学习', 
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Serendipity</h2>
            <p className="text-sm text-blue-600/80 italic mb-4">/ˌserənˈdipədē/</p>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-1">Definition</p>
                <p className="text-slate-600">The occurrence and development of events by chance in a happy or beneficial way.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-1">Example Usage</p>
                <p className="text-slate-600">“It was sheer <span className="text-blue-600 font-medium">serendipity</span> that I found my lost ring while looking for my keys.”</p>
              </div>
            </div>
          </div>
        </div>
      ),
      tags: ['学习', '英语'],
      date: '刚刚' 
    },
  ]);

  const currentNote = notes.find(n => n.id === selectedNoteId) || notes[0];
  const isSplit = state?.startsWith('split-') && state !== 'split-sidebar-left' && state !== 'split-sidebar-right';

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar - Hidden if in split view */}
      {!isSplit && (
        <div className="w-64 border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">我的笔记</h2>
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
            <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors group ${selectedNoteId === note.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-[13px] truncate ${selectedNoteId === note.id ? 'text-blue-700' : 'text-slate-800'}`}>{note.title}</h3>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{note.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">点击查看详情</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Editor */}
      <div className={`flex-1 flex flex-col ${isSplit ? 'p-4' : 'p-8'} max-w-2xl mx-auto overflow-y-auto`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {currentNote.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <MoreVertical className="text-slate-400 cursor-pointer" size={18} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6">{currentNote.title}</h1>
        <div className="space-y-4 text-slate-600 leading-relaxed text-[13px]">
          {currentNote.content}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
