'use client';

import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/indexedDb';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export default function MultiImageUploader({
  images,
  onChange,
  label = 'Thư Viện Hình Ảnh Trình Diễn (Gallery)'
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];

      for (const file of validFiles) {
        if (isSupabaseConfigured && supabase) {
          const fileExt = file.name.split('.').pop();
          const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { error } = await supabase.storage
            .from('project-assets')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });

          if (!error) {
            const { data } = supabase.storage.from('project-assets').getPublicUrl(filePath);
            newUrls.push(data.publicUrl);
          } else {
            const compressed = await compressImage(file);
            newUrls.push(compressed);
          }
        } else {
          // Compress gallery image to ~100-200KB before storing
          const compressed = await compressImage(file);
          newUrls.push(compressed);
        }
      }

      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error('Error uploading files:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>{label} ({images.length} Ảnh)</span>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Ẩn Ô Nhập URL' : '+ Thêm Qua URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Dán URL hình ảnh..."
            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-lg"
          >
            Thêm
          </button>
        </div>
      )}

      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/50'
            : 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tự động nén & tối ưu các hình ảnh...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Kéo & Thả Nhanh NỀU ẢNH Từ Máy Tính (Tự Động Nén Tối Ưu)</span>
          </div>
        )}
      </div>

      {/* Thumbnails Grid Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 group bg-slate-900">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-900 text-rose-300 rounded-md opacity-90 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
