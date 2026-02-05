"use client";

import React, { useState, useCallback } from 'react';
import { FileText, Send, Loader2, CheckCircle2, ChevronLeft, Upload, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const MAX_JD = 5;
const ACCEPT_TYPES = '.pdf,.doc,.docx';

type FileInfo = { name: string; size: number; type: string } | null;

function FileUploadArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: FileInfo;
  onChange: (info: FileInfo) => void;
  placeholder: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        return;
      }
      const valid = /\.(pdf|doc|docx)$/i.test(file.name);
      if (!valid) {
        alert('PDF または Word ファイル（.doc / .docx）を選択してください。');
        return;
      }
      onChange({ name: file.name, size: file.size, type: file.type });
    },
    [onChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file || null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
    e.target.value = '';
  };

  const clear = () => onChange(null);

  return (
    <div className="space-y-2">
      <h3 className="font-extrabold text-white mb-2 flex items-center gap-2 tracking-wider">
        <Upload className="text-[#c5a059]" size={20} strokeWidth={1.5} />
        {label}
      </h3>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center transition-all
          ${isDragging ? 'border-[#c5a059] bg-[#c5a059]/10' : 'border-[#c5a059]/40 bg-white/5'}
          hover:border-[#c5a059]/60 hover:bg-[#c5a059]/5
        `}
      >
        {value ? (
          <div className="flex items-center justify-between gap-3 text-left">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{value.name}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); clear(); }}
              className="shrink-0 p-2 rounded-xl text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-colors active:scale-95"
              aria-label="ファイルを削除"
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <input
              type="file"
              accept={ACCEPT_TYPES}
              onChange={onInputChange}
              className="sr-only"
              aria-label={label}
            />
            <Upload className="mx-auto text-[#c5a059] mb-2 opacity-80" size={28} />
            <p className="text-sm text-[#94a3b8]">{placeholder}</p>
            <p className="text-xs text-[#94a3b8]/80 mt-1">PDF / Word（.doc, .docx）</p>
          </label>
        )}
      </div>
    </div>
  );
}

export default function DocumentCheckPage() {
  const [careerFile, setCareerFile] = useState<FileInfo>(null);
  const [resumeFile, setResumeFile] = useState<FileInfo>(null);
  const [jds, setJds] = useState<{ id: number; text: string }[]>([{ id: 1, text: '' }]);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(2);

  const addJd = () => {
    if (jds.length >= MAX_JD) return;
    setJds((prev) => [...prev, { id: nextId, text: '' }]);
    setNextId((n) => n + 1);
  };

  const removeJd = (id: number) => {
    if (jds.length <= 1) return;
    setJds((prev) => prev.filter((j) => j.id !== id));
  };

  const updateJd = (id: number, text: string) => {
    setJds((prev) => prev.map((j) => (j.id === id ? { ...j, text } : j)));
  };

  const handleCheck = async () => {
    const hasCareer = careerFile?.name;
    const hasResume = resumeFile?.name;
    const hasJd = jds.some((j) => j.text.trim());

    if (!hasCareer && !hasResume) {
      alert('職務経歴書または履歴書のいずれか（または両方）をアップロードしてください。');
      return;
    }
    if (!hasJd) {
      alert('少なくとも1件の求人票を入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const fileInfo = {
        career: careerFile ? { name: careerFile.name, size: careerFile.size, type: careerFile.type } : null,
        resume: resumeFile ? { name: resumeFile.name, size: resumeFile.size, type: resumeFile.type } : null,
      };
      const jdList = jds.filter((j) => j.text.trim()).map((j) => j.text.trim());

      const response = await fetch('/api/check-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileInfo, jds: jdList }),
      });
      const data = await response.json();
      setResult(data.result ?? data.error ?? '解析結果を取得できませんでした。');
    } catch (error) {
      console.error(error);
      alert('通信に失敗しました。APIキーの設定を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const cardClass =
    'p-7 rounded-[2rem] border border-[#c5a059]/25 transition-all duration-200';
  const cardStyle = {
    background: 'linear-gradient(145deg, rgba(43, 51, 65, 0.85) 0%, rgba(34, 43, 54, 0.9) 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
  };
  const inputClass =
    'flex-1 min-h-[100px] p-4 bg-[#252d3a] border border-white/10 rounded-2xl outline-none text-sm text-white placeholder:text-[#94a3b8]/70 focus:ring-2 focus:ring-[#c5a059] focus:border-[#c5a059] transition-all resize-y';

  return (
    <div className="min-h-screen p-10" style={{ background: '#1a1f26' }}>
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#94a3b8] hover:text-[#c5a059] mb-10 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" strokeWidth={1.5} /> ダッシュボードへ戻る
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-white tracking-widest">書類自動添削エージェント</h1>
          <p className="text-[#94a3b8] mt-3">AIが求人票の要件を分析し、あなたの経歴を最適化します。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            {/* 履歴書アップロード */}
            <div className={`${cardClass} rounded-[2rem]`} style={cardStyle}>
              <FileUploadArea
                label="履歴書"
                value={resumeFile}
                onChange={setResumeFile}
                placeholder="ファイルをドラッグ＆ドロップ、またはクリックして選択"
              />
            </div>

            {/* 職務経歴書アップロード */}
            <div className={`${cardClass} rounded-[2rem]`} style={cardStyle}>
              <FileUploadArea
                label="職務経歴書"
                value={careerFile}
                onChange={setCareerFile}
                placeholder="ファイルをドラッグ＆ドロップ、またはクリックして選択"
              />
            </div>

            {/* 求人票（JD）動的リスト */}
            <div className={`${cardClass} rounded-[2rem]`} style={cardStyle}>
              <h3 className="font-extrabold text-white mb-5 flex items-center gap-2 tracking-wider">
                <Send className="text-[#c5a059]" size={20} strokeWidth={1.5} />
                対象の求人票 (JD)
              </h3>
              <div className="space-y-5">
                {jds.map((jd) => (
                  <div key={jd.id} className="flex gap-2 items-start">
                    <textarea
                      className={inputClass}
                      placeholder="募集要項を貼り付けてください..."
                      value={jd.text}
                      onChange={(e) => updateJd(jd.id, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeJd(jd.id)}
                      disabled={jds.length <= 1}
                      className="shrink-0 p-2.5 rounded-xl text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#94a3b8] transition-colors mt-1 active:scale-95"
                      aria-label="この求人を削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {jds.length < MAX_JD && (
                  <button
                    type="button"
                    onClick={addJd}
                    className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#c5a059]/40 text-[#94a3b8] hover:border-[#c5a059] hover:text-[#c5a059] hover:bg-[#c5a059]/5 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium"
                    style={{
                      boxShadow: '0 4px 20px rgba(197, 160, 89, 0.08)',
                    }}
                  >
                    <Plus size={20} className="text-[#c5a059]" strokeWidth={1.5} /> 求人を追加
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={isLoading}
              className="w-full text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95 hover:shadow-[0_0_28px_rgba(197,160,89,0.45)]"
              style={{
                background: 'linear-gradient(180deg, #c5a059 0%, #92713e 100%)',
                boxShadow: '0 4px 24px rgba(197, 160, 89, 0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-[#c5a059]" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 8px rgba(197, 160, 89, 0.6))' }} />
                  解析中...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} strokeWidth={1.5} /> 高精度AI添削を開始する
                </>
              )}
            </button>
          </div>

          {/* 結果表示エリア（より深い黒に近いグレー） */}
          <div
            className="text-white p-8 rounded-[2.5rem] min-h-[720px] sticky top-8 border border-[#c5a059]/20"
            style={{
              background: 'linear-gradient(180deg, #0f1218 0%, #151a22 50%, #12161d 100%)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-5">
              <h3 className="text-lg font-extrabold flex items-center gap-2 text-white tracking-wider">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#c5a059', boxShadow: '0 0 10px rgba(197,160,89,0.6)' }}
                />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#c5a059] to-[#92713e]">AIアドバイザーの診断結果</span>
              </h3>
              {result && (
                <span
                  className="text-[10px] font-medium px-2.5 py-1 rounded uppercase tracking-wider"
                  style={{
                    background: 'rgba(197, 160, 89, 0.2)',
                    color: '#c5a059',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                  }}
                >
                  Analysis Complete
                </span>
              )}
            </div>

            {result ? (
              <div className="max-w-none text-[#e2e8f0] whitespace-pre-wrap text-[15px] leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-[#94a3b8]">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-[#c5a059]/20"
                  style={{ background: 'rgba(197, 160, 89, 0.08)' }}
                >
                  <FileText size={32} className="text-[#c5a059] opacity-60" />
                </div>
                <p className="text-sm text-white/90">左側の情報を入力して解析を開始してください</p>
                <p className="text-xs mt-2 text-[#94a3b8] italic">※解析には30秒ほどかかる場合があります</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
