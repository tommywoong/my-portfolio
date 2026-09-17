'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Mail, Heart, Cpu, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { getSiteSettingsService } from '@/lib/supabase';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettingsService().then(setSettings);
  }, []);

  return (
    <footer className="relative bg-[#050810] border-t border-slate-800/80 pt-16 pb-8 overflow-hidden">
      {/* Radial glow background effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings?.brandLogoUrl ? (
                <img src={settings.brandLogoUrl} alt="Logo" className="w-9 h-9 object-contain rounded-lg border border-cyan-500/30" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                  <div className="w-full h-full bg-[#090d16] rounded-[7px] flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              )}
              <span className="text-lg font-bold text-white tracking-wider">
                {settings?.brandName || 'DEV'}<span className="text-cyan-400 font-mono">{settings?.brandSuffix || '.PORTFOLIO'}</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {settings?.footerAbout || 'Trang thông tin & lưu trữ các dự án phần mềm chuyên nghiệp.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 rounded-full border border-emerald-500/30 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hệ Thống Hoạt Động 24/7 (Free Tier Cloud)</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase">
              // Điều Hướng
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#hero" className="hover:text-cyan-400 transition-colors">Trang Chủ</a></li>
              <li><a href="#projects" className="hover:text-cyan-400 transition-colors">Danh Sách Dự Án</a></li>
              <li><a href="#skills" className="hover:text-cyan-400 transition-colors">Bộ Kỹ Năng</a></li>
              <li><a href="#articles" className="hover:text-cyan-400 transition-colors">Bài Viết & Case Studies</a></li>
              <li><Link href="/admin" className="hover:text-purple-400 transition-colors flex items-center gap-1"><span>Quản Trị viên</span> <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">Admin</span></Link></li>
            </ul>
          </div>

          {/* Col 3: Tech Stack & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase">
              // Kết Nối & Công Nghệ
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={settings?.githubUrl || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.linkedinUrl || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings?.contactEmail || 'contact@example.com'}`}
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-2">
              <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next.js 16 + Supabase DB + Vercel</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings?.brandName || 'DEV'} {settings?.brandSuffix || '.PORTFOLIO'}. Bảo lưu mọi bản quyền.</p>
          <p className="flex items-center gap-1 font-mono">
            <span>Thiết kế sang trọng & công nghệ cao với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
