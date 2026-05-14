
import React from 'react';
import { Grid, List, ChevronRight, HardDrive, Cloud, Clock, Star, Trash2, Search, Folder, LayoutGrid } from 'lucide-react';

interface FilesAppProps {
  state?: any;
}

const FilesApp: React.FC<FilesAppProps> = ({ state }) => {
  const isSplit = state && state.startsWith('split-');
  const isFourGrid = state && (state.includes('top') || state.includes('bottom'));
  const isNarrow = state === 'floating' || (state && (state.includes('left') || state.includes('right')));

  const folders = [
    { name: '精听素材库', items: '12 个文件', color: 'bg-indigo-100 text-indigo-600' },
    { name: '阅读真题', items: '45 个文件', color: 'bg-amber-100 text-amber-600' },
    { name: '口语模考', items: '8 个文件', color: 'bg-rose-100 text-rose-600' },
    { name: '听力脚本', items: '124 个文件', color: 'bg-slate-100 text-slate-600' },
  ];

  const files = [
    { name: '六级真题解析.mp4', size: '120.4 MB', type: 'VIDEO', time: '刚刚' },
    { name: 'CET6_Vocabulary.pdf', size: '4.2 MB', type: 'PDF', time: '2小时前' },
    { name: '听力训练_01.mp3', size: '12.8 MB', type: 'AUDIO', time: '昨天' },
    { name: '考研英语长难句.docx', size: '890 KB', type: 'DOC', time: '2天前' },
  ];

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar - Hidden in four grid mode for efficiency */}
      {!isFourGrid && (
        <div className="w-56 border-r border-slate-100 bg-slate-50/50 p-4 space-y-6 shrink-0">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">位置</h3>
            <nav className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 font-semibold text-sm cursor-pointer">
                <HardDrive size={16} /> Nexus 存储
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm transition-colors cursor-pointer">
                <Cloud size={16} /> Nexus 云盘
              </div>
            </nav>
          </div>
          
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">收藏夹</h3>
            <nav className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm transition-colors cursor-pointer"><Clock size={16} /> 最近</div>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm transition-colors cursor-pointer"><Star size={16} /> 星标</div>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm transition-colors cursor-pointer"><Trash2 size={16} /> 回收站</div>
            </nav>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {!isSplit && (
          <div className="flex items-center justify-between gap-4 mb-8 sticky top-0 bg-white z-10 py-1 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              {/* Brand Logo - Hide when narrow */}
              {!isNarrow && !isFourGrid && (
                <>
                  <div className="flex items-center gap-2 text-blue-600 shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Cloud size={18} />
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Nexus</span>
                      <span className="text-sm font-black tracking-tight">Drive</span>
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-100 mx-1" />
                </>
              )}

              {/* Breadcrumbs - Hide when extreme narrow */}
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Folder size={16} />
                </div>
                <div className="flex items-center text-xs font-bold text-slate-400 truncate overflow-hidden">
                  {!isNarrow && <span className="hover:text-slate-600 cursor-pointer">我的文件</span>}
                  {!isNarrow && <ChevronRight size={14} className="mx-0.5 opacity-50 shrink-0" />}
                  <span className="text-slate-800 truncate">英语学习</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-end max-w-xl">
              {/* Search Bar - Responsive width */}
              <div className={`relative group ${isNarrow ? 'w-full max-w-[40px] md:max-w-[200px]' : 'w-full max-w-[320px]'}`}>
                <Search size={isNarrow ? 18 : 14} className={`absolute ${isNarrow ? 'left-1/2 -translate-x-1/2' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
                <input 
                  type="text" 
                  placeholder={isNarrow ? "" : "搜索文件..."}
                  className={`w-full bg-slate-100/50 border border-transparent focus:border-blue-200 focus:bg-white rounded-xl ${isNarrow ? 'py-4 opacity-0 md:opacity-100 md:py-2 md:pl-9 md:pr-4' : 'py-2 pl-9 pr-4'} text-xs outline-none transition-all placeholder:text-slate-400`}
                />
              </div>
              
              <button className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
                <div className="p-1.5 bg-white shadow-sm rounded-lg text-blue-600"><LayoutGrid size={16} /></div>
                {!isNarrow && <div className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><List size={16} /></div>}
              </button>
            </div>
          </div>
        )}

        <section className={isFourGrid ? 'mb-6' : 'mb-10'}>
          <h2 className="text-sm font-bold text-slate-800 mb-4 px-1">文件夹</h2>
          <div className={`grid ${isFourGrid ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
            {folders.map(folder => (
              <div key={folder.name} className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all cursor-pointer group">
                <div className={`w-10 h-10 ${folder.color} rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  <HardDrive size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-0.5">{folder.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{folder.items}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-4 px-1">最近文件</h2>
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.name} className="flex items-center justify-between p-3 border border-transparent hover:border-slate-100 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-500 transition-colors">
                    <Grid size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">{file.name}</h4>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{file.type} • {file.size} • {file.time}</span>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600"><Star size={18} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FilesApp;
