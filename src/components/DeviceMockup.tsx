'use client';

import React from 'react';
import { Smartphone, Tablet, Laptop, Monitor, Sparkles, Layers } from 'lucide-react';
import { DeviceType } from '@/lib/types';

interface DeviceMockupProps {
  imageUrl: string;
  title?: string;
  type?: DeviceType | 'desktop' | 'phone';
  caption?: string;
}

export default function DeviceMockup({ imageUrl, title, type = 'iphone', caption }: DeviceMockupProps) {
  if (!imageUrl) return null;

  // Normalize type string
  const deviceType: DeviceType = (type === 'phone' ? 'iphone' : type === 'desktop' ? 'macbook' : type) as DeviceType;

  // 1. IPAD MOCKUP FRAME
  if (deviceType === 'ipad') {
    return (
      <div className="flex flex-col items-center my-8">
        <div className="relative w-[340px] sm:w-[460px] md:w-[540px] aspect-[4/3] rounded-[28px] p-4 bg-gradient-to-b from-slate-700 via-slate-850 to-slate-950 shadow-2xl shadow-purple-950/60 border border-slate-700/80 group hover:scale-[1.01] transition-transform duration-500">
          
          {/* Outer Tablet Bezel */}
          <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-black border border-slate-800 flex flex-col justify-between">
            {/* Top Front Camera */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-900 border border-slate-800 z-20" />
            
            {/* Screen Content */}
            <div className="relative w-full h-full overflow-hidden bg-slate-950">
              <img
                src={imageUrl}
                alt={title || 'iPad App Screenshot'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600 rounded-full z-20" />
          </div>
        </div>

        {caption && (
          <p className="text-xs font-mono text-slate-400 mt-3 flex items-center gap-1.5">
            <Tablet className="w-3.5 h-3.5 text-purple-400" />
            <span>{caption || 'Giao diện Tablet iPad'}</span>
          </p>
        )}
      </div>
    );
  }

  // 2. MACBOOK / LAPTOP MOCKUP FRAME
  if (deviceType === 'macbook') {
    return (
      <div className="flex flex-col items-center my-8 w-full max-w-3xl mx-auto">
        {/* Screen Bezel */}
        <div className="relative w-full aspect-video rounded-t-2xl p-3 bg-gradient-to-b from-slate-700 via-slate-850 to-slate-950 border border-slate-700 shadow-2xl group">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black border border-slate-800">
            {/* Webcam */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900 border border-slate-800 z-20" />
            
            <img
              src={imageUrl}
              alt={title || 'MacBook Screen'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Laptop Base Stand */}
        <div className="w-[106%] h-4 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 rounded-b-xl border-t border-slate-600 shadow-xl flex items-center justify-center relative">
          <div className="w-16 h-1.5 bg-slate-900 rounded-full border border-slate-700" />
        </div>

        {caption && (
          <p className="text-xs font-mono text-slate-400 mt-3 flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            <span>{caption || 'Giao diện Desktop Laptop'}</span>
          </p>
        )}
      </div>
    );
  }

  // 3. DUAL DEVICE MOCKUP FRAME (MacBook + iPhone Side by Side)
  if (deviceType === 'dual') {
    return (
      <div className="my-8 py-6 px-4 bg-slate-900/50 rounded-3xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          
          {/* Main Desktop Screen */}
          <div className="flex-1 w-full max-w-md">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-xl group">
              <img
                src={imageUrl}
                alt="Desktop Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-cyan-300 rounded border border-cyan-500/30">
                Web App Desktop
              </div>
            </div>
          </div>

          {/* Overlapping iPhone Phone Frame */}
          <div className="w-[200px] shrink-0">
            <div className="relative aspect-[9/19] rounded-[32px] p-2.5 bg-slate-800 border border-slate-700 shadow-2xl group">
              <div className="w-full h-full rounded-[24px] overflow-hidden bg-black relative">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-950 rounded-full z-20" />
                <img
                  src={imageUrl}
                  alt="Mobile Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>

        {caption && (
          <p className="text-xs font-mono text-slate-400 mt-4 text-center flex items-center justify-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{caption || 'Hiển thị đa nền tảng Responsive (Desktop & Mobile)'}</span>
          </p>
        )}
      </div>
    );
  }

  // 4. IPHONE MOCKUP FRAME (Default)
  return (
    <div className="flex flex-col items-center my-8">
      {/* Smartphone Frame Wrapper */}
      <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] rounded-[42px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 shadow-2xl shadow-cyan-950/60 border border-slate-700/80 group hover:scale-[1.02] transition-transform duration-500">
        
        {/* Outer Bezel */}
        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black border border-slate-800 flex flex-col justify-between">
          
          {/* Top Speaker / Dynamic Island Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center gap-2 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-950 border border-cyan-800" />
          </div>

          {/* Screen Content */}
          <div className="relative w-full h-full overflow-hidden bg-slate-950">
            <img
              src={imageUrl}
              alt={title || 'Mobile App Screenshot'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          </div>

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600 rounded-full z-20" />
        </div>
      </div>

      {caption && (
        <p className="text-xs font-mono text-slate-400 mt-3 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>{caption || 'Giao diện Điện thoại iPhone'}</span>
        </p>
      )}
    </div>
  );
}
