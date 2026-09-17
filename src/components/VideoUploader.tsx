'use client';

import React, { useState, useRef } from 'react';
import { Video, Upload, Link as LinkIcon, X, Check, Loader2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { idbSet } from '@/lib/indexedDb';

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
}

export default function VideoUploader({
  value,
  onChange,
  label = 'Video Minh Họa (YouTube, Vimeo Hoặc Tệp MP4)',
  helpText = 'Hỗ trợ link YouTube, Vimeo hoặc tải tệp video (.mp4)'
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Vui lòng chọn một tệp video (.mp4, .webm)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Tệp video quá lớn (> 100MB). Vui lòng dùng video dưới 100MB hoặc sử dụng link YouTube!');
      return;
    }

    setUploading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        const { error } = await supabase.storage
          .from('project-assets')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!error) {
          const { data } = supabase.storage.from('project-assets').getPublicUrl(filePath);
          onChange(data.publicUrl);
          return;
        }
      }

      // Save raw video File/Blob directly into IndexedDB for instant, zero-lag local video playback
      const videoKey = `video_asset_${Date.now()}`;
      await idbSet(videoKey, file);
      onChange(`idb://${videoKey}`);
    } catch (err) {
      console.warn('IndexedDB video blob save warning, falling back to data URL:', err);
      try {
        const dataUrl = await readFileAsDataURL(file);
        onChange(dataUrl);
      } catch (e) {
        alert('Không thể tải tệp video, hãy kiểm tra lại dung lượng tệp.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-cyan-400" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded ${mode === 'upload' ? 'bg-purple-950 text-purple-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Tải Tệp Video (.mp4)
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded ${mode === 'url' ? 'bg-purple-950 text-purple-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Nhập Link (YouTube/Vimeo)
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 bg-slate-900/60 rounded-xl p-4 text-center cursor-pointer transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-purple-400 py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang mã hóa & lưu trữ tệp video...</span>
            </div>
          ) : value ? (
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
              <span className="truncate max-w-md flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Đã lưu video thành công: {value.slice(0, 45)}...</span>
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="text-slate-400 hover:text-rose-400 p-1 bg-slate-950 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Nhấp vào để chọn tệp Video MP4 từ máy tính của bạn</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... hoặc https://vimeo.com/..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-purple-500 font-mono"
          />
          <LinkIcon className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
        </div>
      )}

      {helpText && <p className="text-[10px] text-slate-500 font-mono">{helpText}</p>}
    </div>
  );
}
