import React from 'react';
import { 
  LayoutDashboard, UserCircle, FileText, Video, Search, 
  ClipboardList, BookOpen, Settings, Bell, Mail, TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100 text-slate-800 font-sans">
      {/* サイドバー（ダークネイビー） */}
      <aside className="w-64 bg-[#1a2233] text-gray-300 flex flex-col">
        <div className="p-6 text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xs">C</div> 
          Candidate
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: 'ダッシュボード', icon: LayoutDashboard, active: true },
            { name: 'プロフィール編集', icon: UserCircle },
            { name: '書類自動添削', icon: FileText },
            { name: 'AI面接対策', icon: Video },
            { name: '求人検索', icon: Search },
            { name: '選考管理', icon: ClipboardList },
            { name: '企業コラム', icon: BookOpen },
            { name: '設定', icon: Settings },
          ].map((item) => (
            <div key={item.name} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${item.active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* ヘッダー */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">PC ダッシュボード</h1>
          <div className="flex items-center gap-6 text-gray-400">
            <Mail size={20} className="hover:text-gray-600 cursor-pointer" />
            <Bell size={20} className="hover:text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2 border-l pl-6">
              <span className="text-sm font-medium text-gray-600">田畑 誠一</span>
              <div className="w-9 h-9 bg-gray-300 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* コンテンツ上部：スコアとスカウト */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-8 bg-[#1e293b] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-6 opacity-80">AI面接トレーニング＆スカウト状況</h3>
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-sm opacity-60 mb-2">候補者スコア</p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32">
                      <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64" />
                      <circle className="text-amber-400" strokeWidth="8" strokeDasharray={314} strokeDashoffset={314 * (1 - 0.88)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-bold">S</span>
                      <span className="text-xs opacity-60">88/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-32 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <TrendingUp className="text-amber-400 mr-2" />
                  <span className="text-sm opacity-50 italic font-light">トレンドグラフ表示エリア</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/20 rounded-2xl"><Bell className="text-amber-300" /></div>
              <span className="bg-red-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">New</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">新着スカウト：3件</h3>
              <p className="text-sm opacity-70 mb-6">優良企業からのスカウトが届いています</p>
              <button className="w-full bg-amber-400 hover:bg-amber-300 text-indigo-900 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                スカウトを確認
              </button>
            </div>
          </div>
        </div>

        {/* 選考ステータス */}
        <div className="grid grid-cols-12 gap-6">
           <div className="col-span-9 grid grid-cols-3 gap-4">
              {['A社：一次面接通過', 'B社：最終面接調整中', 'C社：最終面接調整中'].map((title, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{title.split('：')[1]}</p>
                  <h4 className="font-bold text-gray-700 mb-4">{title.split('：')[0]}</h4>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-indigo-500 rounded-full w-[${(i+1)*30}%]`}></div>
                  </div>
                </div>
              ))}
           </div>
           
           {/* ToDoリスト */}
           <div className="col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <ClipboardList size={18} className="text-indigo-500" /> ToDoリスト
             </h3>
             <ul className="space-y-3">
               {[
                 { task: "A社 適性検査", date: "10/25", urgent: true },
                 { task: "B社 履歴書提出", date: "10/26", urgent: false },
                 { task: "C社 面接準備", date: "10/28", urgent: false },
               ].map((todo, i) => (
                 <li key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                   <div className="flex items-center gap-2">
                     <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                     <span className={`text-xs ${todo.urgent ? 'text-red-500 font-bold' : 'text-gray-600'}`}>{todo.task}</span>
                   </div>
                   <span className="text-[10px] text-gray-400 font-mono">{todo.date}</span>
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </main>
    </div>
  );
}