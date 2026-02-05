'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, UserCircle, FileText, Video, Search,
  ClipboardList, BookOpen, Settings, Bell, Mail, TrendingUp,
  HeartHandshake
} from 'lucide-react';

const AVATAR_STORAGE_KEY = 'profileAvatarUrl';
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&topType=ShortHairShortFlat&accessoriesType=Prescription02&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Gray01&skinColor=Light';

export default function Dashboard() {
  const [headerAvatarUrl, setHeaderAvatarUrl] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(AVATAR_STORAGE_KEY) : null;
      if (stored) setHeaderAvatarUrl(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === AVATAR_STORAGE_KEY && e.newValue) setHeaderAvatarUrl(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const menuItems = [
    { name: 'ダッシュボード', icon: LayoutDashboard, active: true, href: '/' },
    { name: 'プロフィール編集', icon: UserCircle, href: '/profile' },
    { name: '書類自動添削', icon: FileText, href: '/document-check' },
    { name: 'AI面接対策', icon: Video, href: '#' },
    { name: 'AIキャリアカウンセリング', icon: HeartHandshake, href: '/ai-counseling' },
    { name: '求人検索', icon: Search, href: '#' },
    { name: '選考管理', icon: ClipboardList, href: '#' },
    { name: '企業コラム', icon: BookOpen, href: '#' },
    { name: '設定', icon: Settings, href: '#' },
  ];

  const scorePercent = 88;
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference * (1 - scorePercent / 100);

  return (
    <div
      className="flex h-screen font-sans text-white min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #1a1f26 0%, #222b36 40%, #1e252e 100%)',
      }}
    >
      {/* サイドバー（より深いダーク） */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: 'linear-gradient(180deg, #0f1218 0%, #151a22 100%)' }}
      >
        <div className="p-9 text-xl font-extrabold flex items-center gap-3 tracking-wider">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-extrabold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #c5a059 0%, #92713e 100%)',
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.35)',
            }}
          >
            C
          </div>
          <span className="text-white">Candidate</span>
        </div>
        <nav className="flex-1 px-5 py-4 space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                item.active
                  ? 'text-white shadow-lg'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
              }`}
              style={
                item.active
                  ? {
                      background: 'linear-gradient(135deg, #c5a059 0%, #92713e 100%)',
                      boxShadow: '0 4px 14px rgba(197, 160, 89, 0.25)',
                    }
                  : undefined
              }
            >
              <item.icon size={20} className="flex-shrink-0" strokeWidth={1.5} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 overflow-y-auto">
        {/* ヘッダー（透過・高級感） */}
        <header className="sticky top-0 z-10 flex justify-between items-center px-12 py-7 mb-12 bg-[#1a1f26]/70 backdrop-blur-md border-b border-white/5">
          <h1 className="text-2xl font-extrabold text-white tracking-widest">PC ダッシュボード</h1>
          <div className="flex items-center gap-8 text-[#94a3b8]">
            <Mail size={22} className="hover:text-[#c5a059] cursor-pointer transition-colors" strokeWidth={1.5} />
            <div className="relative">
              <Bell size={22} className="hover:text-[#c5a059] cursor-pointer transition-colors" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-8">
              <span className="text-sm font-extrabold text-white tracking-wider">田畑 誠一</span>
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#c5a059]/40 shadow-lg">
                <img src={headerAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="px-12 pb-14">
          {/* コンテンツ上部：スコアとスカウト（左7 : 右5） */}
          <div className="grid grid-cols-12 gap-10 mb-14">
            {/* 候補者スコア・トレンドカード（ガラスモーフィズム＋ゴールドボーダー） */}
            <div
              className="col-span-7 rounded-3xl relative overflow-hidden border border-[#c5a059]/25"
              style={{
                background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.85) 0%, rgba(34, 43, 54, 0.9) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div className="p-12">
                <h3 className="text-lg font-semibold text-[#94a3b8] mb-10 tracking-wider">
                  AI面接トレーニング＆スカウト状況
                </h3>
                <div className="flex items-center gap-16">
                  <div className="text-center">
                    <p className="text-sm text-[#94a3b8] mb-5 uppercase tracking-wider">候補者スコア</p>
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-36 h-36 drop-shadow-[0_0_12px_rgba(197,160,89,0.5)]" viewBox="0 0 128 128">
                        <circle
                          className="text-white/10"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="50"
                          cx="64"
                          cy="64"
                        />
                        <circle
                          className="transition-all duration-700"
                          strokeWidth="10"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          stroke="url(#goldGradient)"
                          fill="transparent"
                          r="50"
                          cx="64"
                          cy="64"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(197, 160, 89, 0.6))',
                          }}
                        />
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c5a059" />
                            <stop offset="100%" stopColor="#92713e" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-[#c5a059] to-[#92713e]">S</span>
                        <span className="text-sm font-semibold mt-1 bg-clip-text text-transparent bg-gradient-to-b from-[#c5a059] to-[#92713e]">88/100</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                      <span className="w-2 h-2 rounded-full bg-[#c5a059] shadow-[0_0_8px_#c5a059]" title="Sランク" />
                      <span className="w-2 h-2 rounded-full bg-orange-400/80" title="Bランク" />
                      <span className="w-2 h-2 rounded-full bg-sky-400/80" title="3ランク" />
                    </div>
                  </div>
                  <div
                    className="flex-1 h-36 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    }}
                  >
                    <TrendingUp
                      size={48}
                      className="text-[#c5a059] flex-shrink-0"
                      strokeWidth={1.5}
                      style={{ filter: 'drop-shadow(0 0 10px rgba(197, 160, 89, 0.5))' }}
                    />
                    <span className="text-sm text-[#94a3b8] ml-4 italic">トレンドグラフ表示エリア</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右列：新着スカウト ＋ AI面接官カード（ゆとりある幅） */}
            <div className="col-span-5 flex flex-col gap-6">
              {/* 新着スカウトカード（微細パターン＋スポットライト） */}
              <div
                className="rounded-3xl relative overflow-hidden border border-[#c5a059]/25 flex flex-col justify-between p-8 sm:p-10 flex-1 min-h-0"
                style={{
                  background: 'linear-gradient(165deg, rgba(43, 51, 65, 0.92) 0%, rgba(34, 43, 54, 0.96) 100%), repeating-linear-gradient(45deg, transparent 0px, transparent 1px, rgba(197,160,89,0.02) 1px, rgba(197,160,89,0.02) 2px), radial-gradient(ellipse 120% 80% at 80% 20%, rgba(197,160,89,0.06) 0%, transparent 55%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <div className="flex justify-between items-start">
                  <div
                    className="p-3.5 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.2) 0%, rgba(146, 113, 62, 0.15) 100%)',
                      boxShadow: '0 0 20px rgba(197, 160, 89, 0.15)',
                    }}
                  >
                    <Bell size={24} className="text-[#c5a059]" strokeWidth={1.5} />
                  </div>
                  <span className="bg-red-500/90 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white">
                    New
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-wider mb-3">新着スカウト：<span className="bg-clip-text text-transparent bg-gradient-to-b from-[#c5a059] to-[#92713e]">3</span>件</h3>
                  <p className="text-sm text-[#94a3b8] mb-10">優良企業からのスカウトが届いています</p>
                  <button
                    className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_28px_rgba(197,160,89,0.45)]"
                    style={{
                      background: 'linear-gradient(180deg, #c5a059 0%, #92713e 100%)',
                      boxShadow: '0 4px 20px rgba(197, 160, 89, 0.3)',
                    }}
                  >
                    スカウトを確認
                  </button>
                </div>
              </div>

              {/* AI面接官とトレーニング開始カード（スポットライト背景・人物を下端に配置） */}
              <div
                className="rounded-3xl relative overflow-hidden border border-[#c5a059]/25 flex items-stretch min-h-[220px]"
                style={{
                  background: 'linear-gradient(165deg, rgba(43, 51, 65, 0.92) 0%, rgba(34, 43, 54, 0.96) 100%), repeating-linear-gradient(-35deg, transparent 0px, transparent 1px, rgba(197,160,89,0.02) 1px, rgba(197,160,89,0.02) 2px), radial-gradient(ellipse 100% 70% at 85% 30%, rgba(197,160,89,0.07) 0%, transparent 60%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 pr-2 min-w-0 z-10">
                  <h3 className="text-lg font-extrabold text-white tracking-wider leading-snug">
                    AI面接官とトレーニング開始
                  </h3>
                  <p className="text-sm text-[#94a3b8] mt-2 mb-5">面接はAI学習をして、AI面接でトレーニングしましょう。</p>
                  <button
                    className="w-fit py-3 px-6 rounded-2xl font-bold text-white transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_24px_rgba(217,180,100,0.5)]"
                    style={{
                      background: 'linear-gradient(180deg, #d4b85c 0%, #c5a059 35%, #a68b4a 100%)',
                      boxShadow: '0 4px 20px rgba(197, 160, 89, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                  >
                    今すぐ開始
                  </button>
                </div>
                {/* AI面接官：Container（背景はカードのまま）→ スポットライト → 人物画像 */}
                <div className="relative overflow-hidden w-36 sm:w-44 flex-shrink-0 self-stretch min-h-[200px] rounded-r-3xl">
                  <div
                    className="absolute inset-0 rounded-r-3xl bg-[radial-gradient(circle_at_center,_#374151_0%,_transparent_70%)] pointer-events-none"
                    aria-hidden
                  />
                  <Image
                    src="/ai-sensei.png"
                    alt="AI面接官"
                    fill
                    priority
                    sizes="(max-width: 640px) 176px, 176px"
                    className="object-cover object-bottom"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 選考ステータス & ToDo */}
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-9 grid grid-cols-3 gap-7">
              {[
                { company: 'A社', stage: '一次面接通過', progress: 30 },
                { company: 'B社', stage: '最終面接調整中', progress: 60 },
                { company: 'C社', stage: '最終面接調整中', progress: 90 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-7 cursor-pointer transition-all duration-200 border border-[#c5a059]/20 hover:border-[#c5a059]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.8) 0%, rgba(34, 43, 54, 0.85) 100%)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-3">{item.stage}</p>
                  <h4 className="font-bold text-white text-lg mb-5">{item.company}</h4>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.progress}%`,
                        background: 'linear-gradient(90deg, #c5a059 0%, #92713e 100%)',
                        boxShadow: '0 0 12px rgba(197, 160, 89, 0.5)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ToDoリスト */}
            <div
              className="col-span-3 rounded-3xl p-9 border border-[#c5a059]/20"
              style={{
                background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.85) 0%, rgba(34, 43, 54, 0.9) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <h3 className="font-extrabold text-white mb-7 flex items-center gap-2 text-base tracking-wider">
                <ClipboardList size={20} className="text-[#c5a059] flex-shrink-0" strokeWidth={1.5} />
                ToDoリスト
              </h3>
              <ul className="space-y-1.5">
                {[
                  { task: 'A社 適性検査受〆切', date: '10/25', urgent: true },
                  { task: 'B社 履歴書提出', date: '10/26', urgent: false },
                  { task: 'C社 面接準備', date: '10/28', urgent: false },
                ].map((todo, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-5 px-4 rounded-xl hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-white/30 bg-white/5 text-[#c5a059] focus:ring-[#c5a059]/50"
                      />
                      <span className={`text-sm ${todo.urgent ? 'text-amber-400 font-semibold' : 'text-[#94a3b8]'}`}>
                        {todo.task}
                      </span>
                    </div>
                    <span className="text-xs text-[#94a3b8] font-mono">{todo.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
