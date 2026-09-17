'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Loader2, Link as LinkIcon } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/indexedDb';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Tải Ảnh Lên Hoặc Nhập URL',
  placeholder = 'https://...',
  helpText
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh (.png, .jpg, .jpeg, .webp, .svg)');
      return;
    }

    setUploading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Upload directly to Supabase Cloud Bucket
        const fileExt = file.name.split('.').pop();
        const fileName = `upload-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-assets')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) {
          console.warn('Supabase storage upload error, falling back to compressed base64:', uploadError);
          const compressed = await compressImage(file);
          onChange(compressed);
        } else {
          const { data } = supabase.storage.from('project-assets').getPublicUrl(filePath);
          onChange(data.publicUrl);
        }
      } else {
        // Local mode fallback: Compress image via Canvas (downscales to ~100-200KB) to prevent QuotaExceededError
        const compressed = await compressImage(file);
        onChange(compressed);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Không thể tải ảnh lên, vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
        </label>

        {/* Toggle Mode Button */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded ${mode === 'upload' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Tải Tệp Lên (Upload)
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded ${mode === 'url' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Nhập URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/40'
              : 'border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-2 text-cyan-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-mono">Đang tự động nén & xử lý hình ảnh...</span>
            </div>
          ) : value ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={value} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-800 shrink-0" />
                <div className="text-left truncate">
                  <p className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chọn & tối ưu ảnh thành công</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{value.slice(0, 50)}...</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-lg border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-3 space-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-200">Nhấp để chọn tệp từ máy tính hoặc Kéo & Thả ảnh vào đây</p>
              <p className="text-[10px] text-slate-500 font-mono">Tự động nén tối ưu dung lượng - Bảo vệ bộ nhớ 100%</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-cyan-500"
          />
          <LinkIcon className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
        </div>
      )}

      {helpText && <p className="text-[10px] text-slate-500 font-mono">{helpText}</p>}
    </div>
  );
}
