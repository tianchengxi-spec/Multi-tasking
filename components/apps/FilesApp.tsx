
import React from 'react';
import { Grid, List, ChevronRight, HardDrive, Cloud, Clock, Star, Trash2 } from 'lucide-react';

interface FilesAppProps {
  state?: any;
}

const FilesApp: React.FC<FilesAppProps> = ({ state }) => {
  const isSplit = state && state.startsWith('split-');
  const isFourGrid = state && (state.includes('top') || state.includes('bottom'));

  const folders = [
    { name: '文档', items: '124 个文件', color: 'bg-blue-100 text-blue-600' },
    { name: '毕业论文项目', items: '45 个文件', color: 'bg-amber-100 text-amber-600' },
    { name: '下载', items: '12 个文件', color: 'bg-emerald-100 text-emerald-600' },
    { name: '系统日志', items: '8 个文件', color: 'bg-slate-100 text-slate-600' },
  ];

  const files = [
    { name: '设计规范_v2.pdf', size: '2.4 MB', type: 'PDF' },
    { name: '原型演示.mp4', size: '124 MB', type: '视频' },
    { name: '最终图标集.zip', size: '4.1 MB', type: '压缩包' },
    { name: '参考清单.xlsx', size: '890 KB', type: '表格' },
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
        {!isFourGrid && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              Nexus 存储 <ChevronRight size={14} /> 文档
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="p-1.5 bg-white shadow-sm rounded-md text-slate-600"><Grid size={16} /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600"><List size={16} /></button>
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
                    <h4 className="text-sm font-semibold text-slate-700">{file.name}</h4>
                    <span className="text-xs text-slate-400">{file.type} • {file.size}</span>
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
