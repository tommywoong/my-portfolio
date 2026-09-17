'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio_theme') as 'dark' | 'light' | null;
    if (savedTheme === 'light') {
      setTheme('light');
      document.body.classList.add('light-theme');
    } else {
      setTheme('dark');
      document.body.classList.remove('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-all border shadow-sm ${
        theme === 'light'
          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-amber-900/10'
          : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-700/80 shadow-cyan-500/10'
      }`}
      title={theme === 'light' ? 'Chuyển sang Giao diện Tối Cyber' : 'Chuyển sang Giao diện Sáng Luxury'}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-700" />
          <span>Giao Diện Tối</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Giao Diện Sáng</span>
        </>
      )}
    </button>
  );
}
