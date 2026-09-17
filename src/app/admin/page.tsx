'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import MultiImageUploader from '@/components/MultiImageUploader';
import VideoUploader from '@/components/VideoUploader';
import { Project, Post, SiteSettings, SkillCategory, DeviceType } from '@/lib/types';
import {
  getProjectsService,
  saveProjectService,
  deleteProjectService,
  getPostsService,
  savePostService,
  deletePostService,
  getSiteSettingsService,
  saveSiteSettingsService,
  getSkillCategoriesService,
  saveSkillCategoriesService,
  isSupabaseConfigured
} from '@/lib/supabase';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  FolderPlus,
  FileText,
  HelpCircle,
  ExternalLink,
  Upload,
  ArrowLeft,
  KeyRound,
  Database,
  Cloud,
  Layers,
  Settings,
  Cpu,
  Smartphone,
  Tablet,
  Laptop,
  Image as ImageIcon,
  Video,
  Sparkles,
  Sliders
} from 'lucide-react';

type ProjectFormData = Omit<Partial<Project>, 'tags'> & { tags?: string | string[] };
type PostFormData = Omit<Partial<Post>, 'tags'> & { tags?: string | string[] };

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'posts' | 'skills' | 'branding' | 'guide'>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Form States
  const [editingProject, setEditingProject] = useState<ProjectFormData | null>(null);
  const [editingPost, setEditingPost] = useState<PostFormData | null>(null);
  const [editingSettings, setEditingSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    document.title = 'Trang Quản Trị Portfolio | Admin Dashboard';
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    const [projData, postData, settingsData, skillsData] = await Promise.all([
      getProjectsService(),
      getPostsService(),
      getSiteSettingsService(),
      getSkillCategoriesService()
    ]);
    setProjects(projData);
    setPosts(postData);
    setSiteSettings(settingsData);
    setEditingSettings(settingsData);
    setSkillCategories(skillsData);
    setLoading(false);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Mật khẩu quản trị không đúng! Thử: admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  const notifySuccess = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // --------------------------------------------------
  // BRANDING SETTINGS HANDLERS
  // --------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSettings) return;
    await saveSiteSettingsService(editingSettings);
    setSiteSettings(editingSettings);
    notifySuccess('Đã cập nhật tên thương hiệu, Logo và thông tin trang chủ thành công!');
  };

  // --------------------------------------------------
  // SKILLS HANDLERS
  // --------------------------------------------------
  const handleAddSkillItem = (catId: string) => {
    const name = prompt('Nhập tên kỹ năng mới (VD: Next.js, Docker, Python):');
    if (!name) return;
    const levelStr = prompt('Nhập phần trăm thành thạo (0 - 100):', '90');
    const level = parseInt(levelStr || '90', 10);
    const highlight = prompt('Nhập ghi chú ngắn/highlight (Tùy chọn):', 'App Router, Server Actions');

    const updated = skillCategories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          skills: [...cat.skills, { id: `skill-${Date.now()}`, name, level, highlight: highlight || undefined }]
        };
      }
      return cat;
    });

    setSkillCategories(updated);
    saveSkillCategoriesService(updated);
    notifySuccess('Đã thêm kỹ năng mới!');
  };

  const handleDeleteSkillItem = (catId: string, skillId: string) => {
    if (!confirm('Xóa kỹ năng này?')) return;
    const updated = skillCategories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          skills: cat.skills.filter(s => s.id !== skillId)
        };
      }
      return cat;
    });
    setSkillCategories(updated);
    saveSkillCategoriesService(updated);
    notifySuccess('Đã xóa kỹ năng!');
  };

  // --------------------------------------------------
  // PROJECT HANDLERS
  // --------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.summary) {
      alert('Vui lòng nhập Tiêu đề và Mô tả ngắn!');
      return;
    }

    try {
      const parsedTags = typeof editingProject.tags === 'string'
        ? editingProject.tags.split(',').map(t => t.trim()).filter(Boolean)
        : editingProject.tags || ['Next.js'];

      await saveProjectService({
        id: editingProject.id,
        title: editingProject.title,
        slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        summary: editingProject.summary,
        description: editingProject.description || '',
        category: (editingProject.category as any) || 'Fullstack',
        tags: parsedTags,
        imageUrl: editingProject.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        mobileMockupUrl: editingProject.mobileMockupUrl || '',
        mockupType: editingProject.mockupType || 'iphone',
        videoUrl: editingProject.videoUrl || '',
        galleryImages: editingProject.galleryImages || [],
        demoUrl: editingProject.demoUrl,
        githubUrl: editingProject.githubUrl,
        featured: editingProject.featured ?? false,
        completionDate: editingProject.completionDate || '2026-03',
        metrics: editingProject.metrics || [{ label: 'Uptime', value: '99.9%' }]
      });

      notifySuccess('Đã lưu thông tin dự án thành công!');
      setEditingProject(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu dự án');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      await deleteProjectService(id);
      await loadData();
      notifySuccess('Đã xóa dự án!');
    }
  };

  // --------------------------------------------------
  // POST HANDLERS
  // --------------------------------------------------
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.summary) {
      alert('Vui lòng điền đủ thông tin bài viết!');
      return;
    }

    try {
      const parsedTags = typeof editingPost.tags === 'string'
        ? editingPost.tags.split(',').map(t => t.trim()).filter(Boolean)
        : editingPost.tags || ['Architecture'];

      await savePostService({
        id: editingPost.id,
        title: editingPost.title,
        slug: editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        summary: editingPost.summary,
        content: editingPost.content || '',
        category: editingPost.category || 'Kiến Trúc Phần Mềm',
        author: editingPost.author || 'Admin Architect',
        readTime: editingPost.readTime || '5 phút đọc',
        imageUrl: editingPost.imageUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
        videoUrl: editingPost.videoUrl || '',
        tags: parsedTags
      });

      notifySuccess('Đã lưu bài viết thành công!');
      setEditingPost(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu bài viết');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Xóa bài viết này khỏi hệ thống?')) {
      await deletePostService(id);
      await loadData();
      notifySuccess('Đã xóa bài viết!');
    }
  };

  const handleInsertVideoToPost = () => {
    const url = prompt('Nhập link Video YouTube / Vimeo / MP4:');
    if (!url) return;
    const snippet = `\n\n![video](${url.trim()})\n\n`;
    setEditingPost(prev => ({
      ...prev,
      content: (prev?.content || '') + snippet
    }));
  };

  const handleExportData = () => {
    const backup = {
      projects,
      posts,
      siteSettings,
      skillCategories,
      version: 'portfolio_v4_backup',
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notifySuccess('Đã xuất file sao lưu dữ liệu thành công!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.projects && Array.isArray(data.projects)) {
          for (const proj of data.projects) {
            await saveProjectService(proj);
          }
        }
        if (data.posts && Array.isArray(data.posts)) {
          for (const post of data.posts) {
            await savePostService(post);
          }
        }
        if (data.siteSettings) {
          await saveSiteSettingsService(data.siteSettings);
        }
        if (data.skillCategories && Array.isArray(data.skillCategories)) {
          await saveSkillCategoriesService(data.skillCategories);
        }
        await loadData();
        notifySuccess('Đã nhập và đồng bộ toàn bộ dữ liệu thành công!');
      } catch (err) {
        console.error(err);
        alert('File dữ liệu JSON không đúng định dạng!');
      }
    };
    reader.readAsText(file);
  };

  // IF NOT AUTHENTICATED -> LOGIN FORM
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 bg-cyber-grid flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0b0f19] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trang Quản Trị Portfolio</h1>
            <p className="text-xs text-slate-400">Nhập mật khẩu truy cập hệ thống quản trị</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Mật khẩu Admin</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu quản trị..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-semibold text-sm rounded-xl text-white shadow-lg transition-all"
            >
              Đăng Nhập Dashboard
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-cyan-400 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chính</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 bg-cyber-grid pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Bảng Quản Trị Hệ Thống (Admin Panel)</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Trạng thái Cloud Storage: {isSupabaseConfigured ? <span className="text-emerald-400">Đã Kết Nối Supabase Storage Bucket</span> : <span className="text-amber-400">Đang chạy ở chế độ Tải Ảnh Trực Tiếp Máy Cá Nhân (IndexedDB + Canvas Downscaler)</span>}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-3 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-xs font-mono text-purple-300 rounded-xl transition-all flex items-center gap-1.5"
              title="Xuất file JSON sao lưu tất cả dự án và cài đặt"
            >
              <Upload className="w-3.5 h-3.5 rotate-180" />
              <span>Xuất Dữ Liệu (JSON)</span>
            </button>
            <label className="px-3 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-mono text-cyan-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Nhập Dữ Liệu</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded-xl transition-all"
            >
              Xem Trang Landing Page
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/30 text-xs font-mono text-rose-300 rounded-xl transition-all"
            >
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-sm font-mono font-medium flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'projects'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Quản Lý Dự Án ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-sm font-mono font-medium flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'posts'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quản Lý Bài Viết ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-3 text-sm font-mono font-medium flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'skills'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Quản Lý Kỹ Năng</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`pb-3 text-sm font-mono font-medium flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'branding'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Logo, Tên Brand & Trang Chủ</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 text-sm font-mono font-medium flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'guide'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hướng Dẫn Host Free</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Danh Sách Dự Án Đã Lưu</h2>
              <button
                onClick={() => setEditingProject({ title: '', summary: '', description: '', category: 'Fullstack', tags: ['Next.js', 'PostgreSQL'], imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop', mobileMockupUrl: '', mockupType: 'iphone', videoUrl: '', galleryImages: [], featured: true })}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-semibold rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Dự Án Mới</span>
              </button>
            </div>

            {/* PROJECT EDIT / ADD FORM MODAL */}
            {editingProject && (
              <form onSubmit={handleSaveProject} className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 space-y-5">
                <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-2">
                  {editingProject.id ? 'Chỉnh Sửa Dự Án' : 'Tạo Dự Án Mới'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Tên Dự Án *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="VD: Hệ Thống BI Analytics Doanh Nghiệp"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Danh Mục Kiến Trúc</label>
                    <select
                      value={editingProject.category || 'Fullstack'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                    >
                      <option value="Fullstack">Fullstack</option>
                      <option value="Mobile">Mobile</option>
                      <option value="AI & Data">AI & Data</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Tóm Tắt Ngắn (Hiển thị ở Thẻ Card) *</label>
                  <textarea
                    required
                    rows={2}
                    value={editingProject.summary || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    placeholder="Mô tả 2-3 câu về điểm nổi bật của dự án..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Mô Tả Chi Tiết Case Study & Kiến Trúc Phần Mềm</label>
                  <textarea
                    rows={5}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Nhập thông tin kiến trúc, công nghệ backend/frontend..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono text-xs"
                  />
                </div>

                {/* VIDEO DEMO UPLOADER / EMBED FIELD */}
                <VideoUploader
                  label="Chèn Video Minh Họa Demo Dự Án (YouTube, Vimeo hoặc Tệp MP4)"
                  value={editingProject.videoUrl || ''}
                  onChange={(url) => setEditingProject({ ...editingProject, videoUrl: url })}
                  helpText="Dán link YouTube (https://www.youtube.com/watch?v=...) hoặc Vimeo để phát trực tiếp trong dự án"
                />

                {/* DEVICE MOCKUP FRAME TYPE SELECTOR & IMAGE UPLOADERS */}
                <div className="space-y-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <label className="text-xs font-mono font-bold text-cyan-400">Chọn Loại Khung Mockup Thiết Bị Trình Diễn</label>
                      <p className="text-[11px] text-slate-400">Tùy chọn hiển thị giao diện của bạn trên các thiết bị chuyên nghiệp</p>
                    </div>

                    <select
                      value={editingProject.mockupType || 'iphone'}
                      onChange={(e) => setEditingProject({ ...editingProject, mockupType: e.target.value as DeviceType })}
                      className="px-3 py-1.5 bg-slate-900 border border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-300 font-bold"
                    >
                      <option value="iphone">📱 Khung Điện thoại iPhone 15 Pro</option>
                      <option value="ipad">📱 Khung Máy tính bảng iPad Pro</option>
                      <option value="macbook">💻 Khung Laptop MacBook Pro</option>
                      <option value="dual">🖥️📱 Khung Kép Đa Thiết Bị (Desktop + Phone)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploader
                      label="Tải Ảnh Banner Chính (Cover Banner Image)"
                      value={editingProject.imageUrl || ''}
                      onChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                      helpText="Ảnh giao diện chính đại diện cho thẻ dự án"
                    />

                    <ImageUploader
                      label="Tải Ảnh Giao Diện Thiết Bị (Device Mockup Screen)"
                      value={editingProject.mobileMockupUrl || ''}
                      onChange={(url) => setEditingProject({ ...editingProject, mobileMockupUrl: url })}
                      helpText="Hình ảnh sẽ tự động lồng vào Khung Thiết Bị đã chọn ở trên"
                    />
                  </div>
                </div>

                {/* MULTI-FILE GALLERY UPLOADER */}
                <MultiImageUploader
                  label="Tải Nhiều Ảnh Vào Thư Viện Gallery"
                  images={editingProject.galleryImages || []}
                  onChange={(images) => setEditingProject({ ...editingProject, galleryImages: images })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Các Công Nghệ Sử Dụng (Phân cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : editingProject.tags || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                      placeholder="Next.js, Node.js, PostgreSQL, Docker"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Link Live Demo</label>
                    <input
                      type="text"
                      value={editingProject.demoUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                      placeholder="https://demo.example.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-mono rounded-lg"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-semibold rounded-lg shadow"
                  >
                    Lưu Dự Án
                  </button>
                </div>
              </form>
            )}

            {/* PROJECTS TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">Dự Án</th>
                    <th className="p-4">Danh Mục</th>
                    <th className="p-4">Mockup & Video</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-semibold text-white flex items-center gap-3">
                        <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                        <div>
                          <span>{p.title}</span>
                          <span className="block text-[10px] text-slate-500 font-sans">{p.summary.slice(0, 50)}...</span>
                        </div>
                      </td>
                      <td className="p-4 text-cyan-400">{p.category}</td>
                      <td className="p-4 text-slate-400 space-x-1">
                        {p.mobileMockupUrl && (
                          <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-500/40 uppercase text-[10px]">
                            {p.mockupType || 'iPhone'}
                          </span>
                        )}
                        {p.videoUrl && (
                          <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/40 uppercase text-[10px]">
                            Video Demo
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProject(p)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: POSTS MANAGEMENT */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Danh Sách Bài Viết Đã Đăng</h2>
              <button
                onClick={() => setEditingPost({ title: '', summary: '', content: '', category: 'Kiến Trúc Phần Mềm', author: 'Admin Lead', readTime: '5 phút đọc', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop', videoUrl: '', tags: ['Architecture', 'DevOps'] })}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-mono font-semibold rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Soạn Bài Viết Mới</span>
              </button>
            </div>

            {editingPost && (
              <form onSubmit={handleSavePost} className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-purple-400 border-b border-slate-800 pb-2">
                  {editingPost.id ? 'Sửa Bài Viết' : 'Soạn Bài Viết Mới'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Tiêu Đề Bài Viết *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.title || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      placeholder="VD: Xây Dựng Kiến Trúc Microservices Tốc Độ Cao"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Chuyên Mục</label>
                    <input
                      type="text"
                      value={editingPost.category || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      placeholder="Kiến Trúc Phần Mềm / UI/UX / DevOps"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Tóm Tắt Ngắn *</label>
                  <textarea
                    required
                    rows={2}
                    value={editingPost.summary || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>

                <ImageUploader
                  label="Tải Ảnh Bìa Bài Viết (Post Cover Banner)"
                  value={editingPost.imageUrl || ''}
                  onChange={(url) => setEditingPost({ ...editingPost, imageUrl: url })}
                />

                <VideoUploader
                  label="Chèn Video YouTube / MP4 Trong Bài Viết (Tùy chọn)"
                  value={editingPost.videoUrl || ''}
                  onChange={(url) => setEditingPost({ ...editingPost, videoUrl: url })}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-purple-300">Nội Dung Chi Tiết Bài Viết (Markdown)</label>
                    <button
                      type="button"
                      onClick={handleInsertVideoToPost}
                      className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[11px] font-mono rounded flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>+ Chèn Link Video Trong Bài</span>
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    placeholder="Soạn bài viết kỹ thuật..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-mono rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-mono font-semibold rounded-lg shadow"
                  >
                    Đăng Bài
                  </button>
                </div>
              </form>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="p-4">Bài Viết</th>
                    <th className="p-4">Chuyên Mục</th>
                    <th className="p-4">Thời Gian Đọc</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-semibold text-white flex items-center gap-3">
                        <img src={post.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                        <span>{post.title}</span>
                      </td>
                      <td className="p-4 text-purple-400">{post.category}</td>
                      <td className="p-4 text-slate-400">{post.readTime}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="px-2.5 py-1 bg-slate-800 text-purple-300 rounded"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-2.5 py-1 bg-rose-950 text-rose-300 rounded"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS MANAGEMENT */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-white">Quản Lý Nhóm Kỹ Năng & Công Nghệ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-cyan-400">{cat.title}</h3>
                    <button
                      onClick={() => handleAddSkillItem(cat.id)}
                      className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Kỹ Năng</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cat.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white font-mono">{skill.name}</span>
                          {skill.highlight && <p className="text-[10px] text-slate-500 font-mono">{skill.highlight}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-purple-400 font-bold">{skill.level}%</span>
                          <button
                            onClick={() => handleDeleteSkillItem(cat.id, skill.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BRANDING, LOGO & HOMEPAGE SETTINGS */}
        {activeTab === 'branding' && editingSettings && (
          <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>Tùy Chỉnh Tên Thương Hiệu (DEV.PORTFOLIO), Logo & Nội Dung Trang Chủ</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Tên Thương Hiệu (Tiền tố) *</label>
                <input
                  type="text"
                  required
                  value={editingSettings.brandName}
                  onChange={(e) => setEditingSettings({ ...editingSettings, brandName: e.target.value })}
                  placeholder="DEV"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Hậu Tố Tên Thương Hiệu *</label>
                <input
                  type="text"
                  required
                  value={editingSettings.brandSuffix}
                  onChange={(e) => setEditingSettings({ ...editingSettings, brandSuffix: e.target.value })}
                  placeholder=".PORTFOLIO"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Phụ Đề Dưới Logo *</label>
                <input
                  type="text"
                  required
                  value={editingSettings.brandSubtitle}
                  onChange={(e) => setEditingSettings({ ...editingSettings, brandSubtitle: e.target.value })}
                  placeholder="SYSTEM ARCHITECT & FULLSTACK"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>

            <ImageUploader
              label="Tải Ảnh Logo Thương Hiệu (Brand Logo Image)"
              value={editingSettings.brandLogoUrl || ''}
              onChange={(url) => setEditingSettings({ ...editingSettings, brandLogoUrl: url })}
              helpText="Chọn tệp logo từ máy tính của bạn (để trống nếu muốn dùng icon mặc định)"
            />

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white">Nội Dung Hero Section & Giới Thiệu</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Nội dung Badge Trạng Thái</label>
                <input
                  type="text"
                  value={editingSettings.heroBadge}
                  onChange={(e) => setEditingSettings({ ...editingSettings, heroBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Tiêu Đề Chính Hero Title</label>
                <input
                  type="text"
                  value={editingSettings.heroTitle}
                  onChange={(e) => setEditingSettings({ ...editingSettings, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Mô Tả Ngắn Giới Thiệu (Hero Subtitle)</label>
                <textarea
                  rows={2}
                  value={editingSettings.heroSubtitle}
                  onChange={(e) => setEditingSettings({ ...editingSettings, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>

            {/* DYNAMIC SECTION HEADINGS EDITORS */}
            <div className="space-y-6 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-cyan-400 font-mono">
                📌 Tùy Chỉnh Tiêu Đề & Mô Tả Các Section Trên Trang Chủ
              </h3>

              {/* SECTION 1: PROJECTS */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-300">1. Mục Dự Án (Projects Showcase)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Tiêu Đề Mục Dự Án</label>
                    <input
                      type="text"
                      value={editingSettings.projectsTitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, projectsTitle: e.target.value })}
                      placeholder="Danh Sách Dự Án Tiêu Biểu"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Mô Tả Mục Dự Án</label>
                    <input
                      type="text"
                      value={editingSettings.projectsSubtitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, projectsSubtitle: e.target.value })}
                      placeholder="Các sản phẩm được phân loại theo kiến trúc..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SKILLS */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-purple-300">2. Mục Kỹ Năng (Technical Capabilities)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Tiêu Đề Mục Kỹ Năng</label>
                    <input
                      type="text"
                      value={editingSettings.skillsTitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, skillsTitle: e.target.value })}
                      placeholder="Công Nghệ Chủ Đạo & Kiến Trúc Software"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Mô Tả Mục Kỹ Năng</label>
                    <input
                      type="text"
                      value={editingSettings.skillsSubtitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, skillsSubtitle: e.target.value })}
                      placeholder="Bảng đánh giá năng lực chuyên môn..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: POSTS */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-300">3. Mục Bài Viết (Technical Insights)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Tiêu Đề Mục Bài Viết</label>
                    <input
                      type="text"
                      value={editingSettings.postsTitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, postsTitle: e.target.value })}
                      placeholder="Bài Viết & Chia Sẻ Kỹ Thuật"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Mô Tả Mục Bài Viết</label>
                    <input
                      type="text"
                      value={editingSettings.postsSubtitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, postsSubtitle: e.target.value })}
                      placeholder="Nhật ký chia sẻ kiến trúc phần mềm..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: CONTACT */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-300">4. Mục Liên Hệ (Connect & Collaborate)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Tiêu Đề Mục Liên Hệ</label>
                    <input
                      type="text"
                      value={editingSettings.contactTitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, contactTitle: e.target.value })}
                      placeholder="Khởi Động Dự Án Mới"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Mô Tả Mục Liên Hệ</label>
                    <input
                      type="text"
                      value={editingSettings.contactSubtitle || ''}
                      onChange={(e) => setEditingSettings({ ...editingSettings, contactSubtitle: e.target.value })}
                      placeholder="Gửi thông tin trao đổi trực tiếp..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Email Liên Hệ</label>
                <input
                  type="email"
                  value={editingSettings.contactEmail}
                  onChange={(e) => setEditingSettings({ ...editingSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Link GitHub Profile</label>
                <input
                  type="text"
                  value={editingSettings.githubUrl}
                  onChange={(e) => setEditingSettings({ ...editingSettings, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Link LinkedIn Profile</label>
                <input
                  type="text"
                  value={editingSettings.linkedinUrl}
                  onChange={(e) => setEditingSettings({ ...editingSettings, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs font-mono rounded-xl shadow-lg"
              >
                Lưu Tất Cả Cấu Hình Trang Chủ
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: HOSTING GUIDE */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 md:p-8 space-y-6 text-slate-300 font-sans text-sm">
            <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              <span>Hướng Dẫn Phát Hành Website Lên Hosting Miễn Phí (100% Free Tier)</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-base">Bước 1: Tạo Database & Storage Miễn Phí Trên Supabase</h3>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 font-mono text-xs">
                  <li>Truy cập <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">supabase.com</a> và đăng ký tài khoản (Miễn phí 500MB DB + 1GB Storage).</li>
                  <li>Tạo dự án mới (New Project) và mở mục **SQL Editor**.</li>
                  <li>Chạy lệnh SQL tạo bảng trong file <code className="text-cyan-300">supabase-schema.sql</code>.</li>
                  <li>Lấy thông tin <code className="text-purple-300">NEXT_PUBLIC_SUPABASE_URL</code> và <code className="text-purple-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-base">Bước 2: Deploy Frontend & Backend Lên Vercel</h3>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 font-mono text-xs">
                  <li>Đẩy toàn bộ mã nguồn folder này lên kho lưu trữ **GitHub** của bạn.</li>
                  <li>Truy cập <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">vercel.com</a> &gt; Add New Project.</li>
                  <li>Nhập 2 biến môi trường <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_URL</code> và <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
                  <li>Bấm **Deploy**. Trong 60 giây, website của bạn sẽ hoạt động trực tuyến 24/7!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
