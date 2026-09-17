'use client';

import React, { useState } from 'react';
import DeviceMockup from './DeviceMockup';
import VideoPlayer from './VideoPlayer';
import { DeviceType } from '@/lib/types';
import { Image as ImageIcon, Sparkles, Maximize2, X, Video } from 'lucide-react';

interface RichContentProps {
  content: string;
  galleryImages?: string[];
  mobileMockupUrl?: string;
  mockupType?: DeviceType;
  videoUrl?: string;
}

export default function RichContent({
  content,
  galleryImages,
  mobileMockupUrl,
  mockupType = 'iphone',
  videoUrl
}: RichContentProps) {
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  if (!content && !mobileMockupUrl && !videoUrl && (!galleryImages || galleryImages.length === 0)) {
    return null;
  }

  const lines = (content || '').split('\n');

  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-sans text-sm md:text-base">
      
      {/* Lightbox Zoom Modal */}
      {activeLightbox && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn cursor-pointer"
          onClick={() => setActiveLightbox(null)}
        >
          <button 
            onClick={() => setActiveLightbox(null)}
            className="absolute top-6 right-6 p-3 bg-slate-900 text-white rounded-full border border-slate-700 hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={activeLightbox} 
            alt="Enlarged preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-cyan-500/30"
          />
        </div>
      )}

      {/* POSITION 1: EMBEDDED DEMO VIDEO PLAYER (If videoUrl is provided) */}
      {videoUrl && (
        <VideoPlayer url={videoUrl} caption="Video phát trực tiếp minh họa tính năng thực tế" />
      )}

      {/* POSITION 2: MAIN APP DEVICE MOCKUP SHOWCASE */}
      {mobileMockupUrl && (
        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-6 my-6 flex flex-col items-center justify-between gap-6">
          <div className="space-y-2 text-center">
            <span className="px-3 py-1 text-xs font-mono font-semibold text-cyan-300 bg-cyan-950 border border-cyan-500/30 rounded-full">
              Device Mockup Showcase
            </span>
            <h4 className="text-xl font-bold text-white">Mô Phỏng Trải Nghiệm Thiết Bị</h4>
          </div>
          <DeviceMockup imageUrl={mobileMockupUrl} type={mockupType} caption="Mô phỏng thiết bị thực tế" />
        </div>
      )}

      {/* Main Content Body parsing */}
      <div className="space-y-4">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl md:text-3xl font-extrabold text-white tracking-tight pt-4 border-b border-slate-800 pb-2">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }

          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl md:text-2xl font-bold text-cyan-300 tracking-tight pt-3">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-semibold text-purple-300 pt-2">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // Video Markdown ![video](url) or @[youtube](url)
          if (trimmed.startsWith('![video](') || trimmed.startsWith('@[youtube](')) {
            const vUrl = trimmed.slice(trimmed.indexOf('(') + 1, trimmed.indexOf(')'));
            return <VideoPlayer key={idx} url={vUrl} caption="Video minh họa nội dung" />;
          }

          // Image Markdown ![alt](url)
          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const altText = imgMatch[1];
            const imgUrl = imgMatch[2];

            const isPhone = altText.toLowerCase().includes('mobile') || altText.toLowerCase().includes('phone') || altText.toLowerCase().includes('ví');
            const isTablet = altText.toLowerCase().includes('ipad') || altText.toLowerCase().includes('tablet');

            return (
              <div key={idx} className="my-6">
                <DeviceMockup
                  imageUrl={imgUrl}
                  title={altText}
                  type={isTablet ? 'ipad' : isPhone ? 'iphone' : 'macbook'}
                  caption={altText}
                />
              </div>
            );
          }

          if (trimmed.startsWith('- ')) {
            return (
              <li key={idx} className="flex items-start gap-2 text-slate-300 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>{trimmed.replace('- ', '')}</span>
              </li>
            );
          }

          if (trimmed.length > 0) {
            return (
              <p key={idx} className="text-slate-300 leading-relaxed">
                {trimmed}
              </p>
            );
          }

          return null;
        })}
      </div>

      {/* POSITION 3: INTERACTIVE GALLERY GRID SHOWCASE */}
      {galleryImages && galleryImages.length > 0 && (
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Thư Viện Trình Diễn Hình Ảnh ({galleryImages.length} Ảnh - Nhấp Để Phóng To)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveLightbox(img)}
                className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-lg group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Screenshot ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cyan-300 gap-2 font-mono text-xs">
                  <Maximize2 className="w-4 h-4" />
                  <span>Phóng To Xem</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
