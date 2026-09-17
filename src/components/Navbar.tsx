'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Shield, Menu, X, Sparkles } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import { getSiteSettingsService } from '@/lib/supabase';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    getSiteSettingsService().then(setSettings);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang Chủ', href: '#hero' },
    { name: 'Dự Án', href: '#projects' },
    { name: 'Kỹ Năng', href: '#skills' },
    { name: 'Bài Viết', href: '#articles' },
    { name: 'Liên Hệ', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070a12]/85 backdrop-blur-md border-b border-cyan-500/20 py-3 shadow-lg shadow-cyan-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {settings?.brandLogoUrl ? (
            <img src={settings.brandLogoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-cyan-500/40" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          )}
          <div>
            <span className="text-lg font-extrabold tracking-wider text-white flex items-center gap-1.5">
              {settings?.brandName || 'DEV'}<span className="text-cyan-400 font-mono">{settings?.brandSuffix || '.PORTFOLIO'}</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-mono -mt-1 uppercase">
              {settings?.brandSubtitle || 'SYSTEM ARCHITECT & FULLSTACK'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0f172a]/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Quick Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Light / Dark Theme Switcher Button */}
          <ThemeToggle />

          <Link
            href="/admin"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg hover:border-cyan-500/40 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Quản Trị</span>
          </Link>

          <a
            href="#contact"
            className="relative group overflow-hidden px-4 py-2 rounded-lg font-medium text-xs text-white bg-gradient-to-r from-cyan-500 to-purple-600 p-[1px] shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
          >
            <div className="px-3 py-1 bg-[#090d16] group-hover:bg-transparent rounded-[7px] flex items-center gap-1.5 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
              <span>Hợp Tác Dự Án</span>
            </div>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d]/95 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Trang Quản Trị (/admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
