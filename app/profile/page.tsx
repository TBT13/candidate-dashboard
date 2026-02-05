"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  User, Mail, Calendar, Briefcase, GraduationCap, Award, Save, ChevronLeft,
  Search, Plus, X, Languages, Users, Medal, Upload, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const AVATAR_STORAGE_KEY = 'profileAvatarUrl';
const DICEBEAR_BASE = 'https://api.dicebear.com/7.x/avataaars/svg';
const DEFAULT_AVATAR = `${DICEBEAR_BASE}?seed=Oliver&topType=ShortHairShortFlat&accessoriesType=Prescription02&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Gray01&skinColor=Light`;

const SKILL_OPTIONS = [
  '法人営業', '個人営業', '新規開拓', 'Python', 'JavaScript', 'AWS', 'GCP', 'Azure',
  'キャリアカウンセリング', 'プロジェクトマネジメント', '英語', '中国語', 'データ分析',
  'React', 'TypeScript', 'SQL', '営業企画', 'マーケティング'
];

const QUALIFICATION_OPTIONS = [
  '宅建', 'TOEIC', 'TOEFL', '基本情報技術者', '応用情報技術者', 'AWS認定', '簿記2級', '簿記3級',
  'ファイナンシャルプランナー', 'キャリアコンサルタント', '中小企業診断士', 'PMP'
];

const MANAGEMENT_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '5', label: '5名以下' },
  { value: '6-10', label: '6名から10名' },
  { value: '11-20', label: '11名から20名' },
  { value: '21-50', label: '21名から50名' },
  { value: '51', label: '51名以上' },
];

const LANGUAGE_OPTIONS = ['英語', '中国語', '韓国語', 'スペイン語', 'フランス語', 'その他'];
const LEVEL_OPTIONS = ['基礎会話', '日常会話', 'ビジネス会話', 'ネイティブ'];

function calcAge(birthDateStr: string): number | null {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

type LanguagePair = { lang: string; level: string };

export default function ProfileEditPage() {
  const [formData, setFormData] = useState({
    name: '山林 隆之',
    birthDate: '1996-05-15',
    email: 'yamabayashi@example.com',
    job: 'IT営業 / キャリアコンサルタント',
    education: '〇〇大学 経済学部 卒業',
    jobSummary: 'これまでIT業界を中心に5年間、営業およびキャリア支援に従事してきました。',
    management: '',
    awards: '',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['法人営業', 'Python', '英語']);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>(['TOEIC', '基本情報技術者']);
  const [languages, setLanguages] = useState<LanguagePair[]>([{ lang: '英語', level: '日常会話' }]);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  const [qualSearch, setQualSearch] = useState('');

  const age = useMemo(() => calcAge(formData.birthDate), [formData.birthDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setToastVisible(true);
  };

  const openAvatarModal = () => setAvatarModalOpen(true);
  const closeAvatarModal = () => {
    setAvatarModalOpen(false);
    setUploadPreview(null);
  };

  const setAvatar = useCallback((url: string) => {
    setAvatarUrl(url);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AVATAR_STORAGE_KEY, url);
      } catch {
        // ignore
      }
    }
    closeAvatarModal();
  }, []);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const prev = uploadPreview;
    if (prev) URL.revokeObjectURL(prev);
    setUploadPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const confirmUpload = () => {
    if (uploadPreview) {
      setAvatar(uploadPreview);
    }
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).slice(2, 12);
    setAvatar(`${DICEBEAR_BASE}?seed=${seed}`);
  };

  const addSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) return;
    setSelectedSkills(prev => [...prev, skill]);
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const addQualification = (q: string) => {
    if (selectedQualifications.includes(q)) return;
    setSelectedQualifications(prev => [...prev, q]);
  };

  const removeQualification = (q: string) => {
    setSelectedQualifications(prev => prev.filter(x => x !== q));
  };

  const addLanguageRow = () => {
    setLanguages(prev => [...prev, { lang: '英語', level: '日常会話' }]);
  };

  const updateLanguage = (index: number, field: 'lang' | 'level', value: string) => {
    setLanguages(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const removeLanguageRow = (index: number) => {
    if (languages.length <= 1) return;
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (stored) setAvatarUrl(stored);
    } catch {
      // ignore
    }
  }, []);

  const filteredSkills = SKILL_OPTIONS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s)
  );
  const filteredQuals = QUALIFICATION_OPTIONS.filter(q =>
    q.toLowerCase().includes(qualSearch.toLowerCase()) && !selectedQualifications.includes(q)
  );

  const inputClass =
    'w-full p-3 bg-[#252d3a] border border-white/10 rounded-xl outline-none transition-all text-white placeholder:text-[#94a3b8]/70 focus:ring-2 focus:ring-[#c5a059] focus:ring-offset-2 focus:ring-offset-[#1a1f26] focus:border-[#c5a059]';
  const cardClass =
    'p-8 rounded-3xl border border-[#c5a059]/25 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-0.5';
  const cardStyle = {
    background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.85) 0%, rgba(34, 43, 54, 0.9) 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
  };
  const labelClass = 'block text-xs font-bold text-[#94a3b8] uppercase mb-2';
  const sectionTitleClass = 'font-extrabold text-white mb-3 flex items-center gap-2 border-b border-white/10 pb-3 tracking-wider';

  return (
    <div className="min-h-screen p-8" style={{ background: '#1a1f26' }}>
      {/* トースト通知 */}
      <div
        role="alert"
        aria-live="polite"
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl text-white font-medium transition-all duration-300 ease-out ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, #c5a059 0%, #92713e 100%)',
          boxShadow: '0 8px 32px rgba(197, 160, 89, 0.4)',
        }}
      >
        プロフィールを更新しました！
      </div>

      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#94a3b8] hover:text-[#c5a059] mb-10 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" strokeWidth={1.5} /> ダッシュボードへ戻る
        </Link>

        <header className="mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-widest">プロフィール編集</h1>
            <p className="text-[#94a3b8] mt-3">あなたの基本情報と経歴を充実させましょう。</p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all active:scale-95 hover:shadow-[0_0_24px_rgba(197,160,89,0.4)]"
            style={{
              background: 'linear-gradient(180deg, #c5a059 0%, #92713e 100%)',
              boxShadow: '0 4px 20px rgba(197, 160, 89, 0.3)',
            }}
          >
            <Save size={18} strokeWidth={1.5} /> 保存する
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* アバターエリア（クリックでモーダル） */}
          <section className={`${cardClass} flex flex-col items-center justify-center p-8`} style={cardStyle}>
            <button
              type="button"
              onClick={openAvatarModal}
              className="relative group block w-32 h-32 rounded-full overflow-hidden border-4 border-[#c5a059]/40 shadow-xl ring-2 ring-[#c5a059]/20 focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:ring-offset-2 focus:ring-offset-[#1a1f26]"
              aria-label="画像を変更"
            >
              <img src={avatarUrl} alt="プロフィール" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white text-sm font-medium">
                画像を変更
              </span>
            </button>
            <p className="text-xs text-[#94a3b8] mt-3 font-medium">プロフィール画像</p>
          </section>

          {/* アバター選択モーダル */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-modal-title"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
              avatarModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
              onClick={closeAvatarModal}
              aria-hidden="true"
            />
            <div
              className={`relative w-full max-w-md rounded-3xl border border-[#c5a059]/25 p-8 transition-all duration-300 ease-out ${
                avatarModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              style={{
                background: 'linear-gradient(145deg, rgba(30, 36, 48, 0.98) 0%, rgba(22, 28, 38, 0.99) 100%)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(197, 160, 89, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeAvatarModal}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors active:scale-95"
                aria-label="閉じる"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
              <h2 id="avatar-modal-title" className="text-xl font-extrabold text-white tracking-wider mb-6 pr-10">
                プロフィール画像を変更
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 写真をアップロード */}
                <div
                  className="rounded-2xl border border-[#c5a059]/20 p-6 transition-all hover:border-[#c5a059]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.6) 0%, rgba(34, 43, 54, 0.7) 100%)',
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-[#c5a059]/30" style={{ background: 'rgba(197, 160, 89, 0.1)' }}>
                      <Upload className="text-[#c5a059]" size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-white font-semibold tracking-wider">写真をアップロード</span>
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadChange}
                        className="sr-only"
                      />
                      <span className="block w-full py-2.5 rounded-xl text-center text-sm font-medium text-[#94a3b8] border border-white/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] cursor-pointer transition-colors">
                        ファイルを選択
                      </span>
                    </label>
                    {uploadPreview && (
                      <>
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c5a059]/30">
                          <img src={uploadPreview} alt="プレビュー" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={confirmUpload}
                          className="w-full py-2.5 rounded-xl font-semibold text-white transition-all active:scale-95"
                          style={{
                            background: 'linear-gradient(180deg, #c5a059 0%, #92713e 100%)',
                            boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)',
                          }}
                        >
                          この画像を使う
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* 理想のアバターを生成 */}
                <div
                  className="rounded-2xl border border-[#c5a059]/20 p-6 transition-all hover:border-[#c5a059]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.6) 0%, rgba(34, 43, 54, 0.7) 100%)',
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-[#c5a059]/30" style={{ background: 'rgba(197, 160, 89, 0.1)' }}>
                      <Sparkles className="text-[#c5a059]" size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-white font-semibold tracking-wider">理想のアバターを生成</span>
                    <p className="text-xs text-[#94a3b8] text-center">クリックでランダムなイラストを生成</p>
                    <button
                      type="button"
                      onClick={generateRandomAvatar}
                      className="w-full py-2.5 rounded-xl font-semibold text-white transition-all active:scale-95 hover:shadow-[0_0_20px_rgba(197,160,89,0.35)]"
                      style={{
                        background: 'linear-gradient(180deg, #c5a059 0%, #92713e 100%)',
                        boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)',
                      }}
                    >
                      生成して設定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <section className={`${cardClass} space-y-4`} style={cardStyle}>
            <h3 className={`${sectionTitleClass}`}>
              <User className="text-[#c5a059]" size={18} strokeWidth={1.5} /> 基本情報
            </h3>
            <div>
              <label className={labelClass}>氏名</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Calendar size={12} className="text-[#c5a059]" strokeWidth={1.5} /> 生年月日
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={inputClass}
                />
                {age != null && (
                  <p className="text-xs font-semibold mt-2 bg-clip-text text-transparent bg-gradient-to-b from-[#c5a059] to-[#92713e]">
                    <span>{age}歳</span>
                  </p>
                )}
              </div>
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Mail size={12} className="text-[#c5a059]" /> メール
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </section>

          {/* キースキル（タグ選択） */}
          <section className={`${cardClass} space-y-5`} style={cardStyle}>
            <h3 className={sectionTitleClass}>
              <Award className="text-[#c5a059]" size={18} strokeWidth={1.5} /> キースキル
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]" size={18} />
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="スキルを検索して追加..."
                className={`${inputClass} pl-10`}
              />
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {selectedSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-[#c5a059]/30 bg-[#c5a059]/10 text-[#c5a059]"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="p-0.5 rounded-full hover:bg-[#c5a059]/20 transition-colors active:scale-95 text-white/80 hover:text-white"
                    aria-label={`${s}を削除`}
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </span>
              ))}
            </div>
            {skillSearch && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {filteredSkills.length === 0 ? (
                  <span className="text-xs text-[#94a3b8]">該当する候補がありません</span>
                ) : (
                  filteredSkills.slice(0, 8).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-[#94a3b8] text-sm border border-white/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition-colors active:scale-95"
                    >
                      <Plus size={14} className="text-[#c5a059]" strokeWidth={1.5} /> {s}
                    </button>
                  ))
                )}
              </div>
            )}
          </section>

          {/* 資格（タグ選択） */}
          <section className={`${cardClass} space-y-5`} style={cardStyle}>
            <h3 className={sectionTitleClass}>
              <GraduationCap className="text-[#c5a059]" size={18} /> 資格
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]" size={18} />
              <input
                type="text"
                value={qualSearch}
                onChange={(e) => setQualSearch(e.target.value)}
                placeholder="資格を検索して追加..."
                className={`${inputClass} pl-10`}
              />
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {selectedQualifications.map((q) => (
                <span
                  key={q}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-[#c5a059]/25 bg-[#92713e]/15 text-[#c5a059]"
                >
                  {q}
                  <button
                    type="button"
                    onClick={() => removeQualification(q)}
                    className="p-0.5 rounded-full hover:bg-[#c5a059]/20 transition-colors active:scale-95 text-white/80 hover:text-white"
                    aria-label={`${q}を削除`}
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </span>
              ))}
            </div>
            {qualSearch && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {filteredQuals.length === 0 ? (
                  <span className="text-xs text-[#94a3b8]">該当する候補がありません</span>
                ) : (
                  filteredQuals.slice(0, 8).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => addQualification(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-[#94a3b8] text-sm border border-white/10 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition-colors active:scale-95"
                    >
                      <Plus size={14} className="text-[#c5a059]" strokeWidth={1.5} /> {q}
                    </button>
                  ))
                )}
              </div>
            )}
          </section>

          {/* 職務要約 */}
          <section className={`col-span-1 md:col-span-2 ${cardClass} space-y-5`} style={cardStyle}>
            <h3 className={sectionTitleClass}>
              <Briefcase className="text-[#c5a059]" size={18} strokeWidth={1.5} /> 職務要約
            </h3>
            <textarea
              name="jobSummary"
              value={formData.jobSummary}
              onChange={handleChange}
              className={`${inputClass} h-32 text-sm resize-y`}
              placeholder="職務経歴の要約を記入してください..."
            />
          </section>

          {/* 経歴詳細・マネジメント */}
          <section className={`${cardClass} space-y-5`} style={cardStyle}>
            <h3 className={sectionTitleClass}>
              <Briefcase className="text-[#c5a059]" size={18} strokeWidth={1.5} /> 経歴詳細
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Briefcase size={12} className="text-[#c5a059]" /> 直近の職種
                </label>
                <input type="text" name="job" value={formData.job} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <GraduationCap size={12} className="text-[#c5a059]" strokeWidth={1.5} /> 最終学歴
                </label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}>
                <Users size={12} className="text-[#c5a059]" /> マネジメント経験
              </label>
              <select
                name="management"
                value={formData.management}
                onChange={handleChange}
                className={inputClass}
              >
                {MANAGEMENT_OPTIONS.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </section>

          {/* 語学 */}
          <section className={`${cardClass} space-y-5`} style={cardStyle}>
            <h3 className={sectionTitleClass}>
              <Languages className="text-[#c5a059]" size={18} strokeWidth={1.5} /> 語学
            </h3>
            <div className="space-y-3">
              {languages.map((pair, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <select
                    value={pair.lang}
                    onChange={(e) => updateLanguage(index, 'lang', e.target.value)}
                    className={`${inputClass} flex-1 min-w-[120px] max-w-[140px]`}
                  >
                    {LANGUAGE_OPTIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <select
                    value={pair.level}
                    onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                    className={`${inputClass} flex-1 min-w-[140px] max-w-[160px]`}
                  >
                    {LEVEL_OPTIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {languages.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeLanguageRow(index)}
                      className="p-2 rounded-xl text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-colors active:scale-95"
                      aria-label="この語学を削除"
                    >
                      <X size={18} />
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguageRow}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-[#c5a059]/30 text-[#94a3b8] hover:border-[#c5a059] hover:text-[#c5a059] text-sm font-medium transition-colors active:scale-95"
              >
                <Plus size={16} className="text-[#c5a059]" strokeWidth={1.5} /> 語学を追加
              </button>
            </div>
          </section>

          {/* 表彰歴 */}
          <section className={`col-span-1 md:col-span-2 ${cardClass} space-y-5`} style={cardStyle}>
            <h3 className={sectionTitleClass}>
              <Medal className="text-[#c5a059]" size={18} strokeWidth={1.5} /> 表彰歴
            </h3>
            <textarea
              name="awards"
              value={formData.awards}
              onChange={handleChange}
              className={`${inputClass} h-24 text-sm resize-y`}
              placeholder="表彰・受賞歴を自由に記入してください..."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
