'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectModal from '@/components/ProjectModal';
import PostModal from '@/components/PostModal';
import DeviceMockup from '@/components/DeviceMockup';
import { Project, Post, SiteSettings, SkillCategory } from '@/lib/types';
import {
  getProjectsService,
  getPostsService,
  getSiteSettingsService,
  getSkillCategoriesService
} from '@/lib/supabase';
import { GithubIcon } from '@/components/Icons';
import {
  Terminal,
  Code2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  Cpu,
  Database,
  Globe,
  BookOpen,
  Send,
  CheckCircle2,
  Check,
  ShieldAlert,
  Search,
  Filter,
  Smartphone
} from 'lucide-react';

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [projData, postData, settingsData, skillsData] = await Promise.all([
          getProjectsService(),
          getPostsService(),
          getSiteSettingsService(),
          getSkillCategoriesService()
        ]);
        setProjects(projData);
        setPosts(postData);
        setSettings(settingsData);
        setSkillCategories(skillsData);

        if (settingsData) {
          document.title = `${settingsData.brandName}${settingsData.brandSuffix} | ${settingsData.brandSubtitle}`;
        }
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ['All', 'Fullstack', 'Mobile', 'AI & Data', 'Cloud & DevOps'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 bg-cyber-grid selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-36 sm:pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-radial-gradient">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 font-mono shadow-lg shadow-cyan-950/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span>{settings?.heroBadge || 'Software Architect • Available for High-Impact Projects'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                {settings?.heroTitle ? (
                  <span>{settings.heroTitle}</span>
                ) : (
                  <>
                    Kiến Trúc & Trình Bày <br />
                    <span className="text-gradient-cyan">Dự Án Phần Mềm</span> <br />
                    Đẳng Cấp Công Nghệ.
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                {settings?.heroSubtitle || 'Nơi tổng hợp, lưu trữ và minh họa sinh động các hệ thống phần mềm Enterprise, ứng dụng AI, Microservices và nền tảng Web & Mobile độ tin cậy cao.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#projects"
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all group"
                >
                  <span>Khám Phá Các Dự Án</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#contact"
                  className="flex items-center gap-2 px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-sm rounded-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Liên Hệ Hợp Tác</span>
                </a>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-lg">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                    {settings?.totalProjectsCount || '15+'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Dự Án Đã Xây Dựng</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
                    {settings?.uptimeMetric || '99.9%'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Sẵn Sàng Vận Hành</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                    {settings?.hostingCostMetric || '0đ'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Chi Phí Free Host Cloud</p>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Terminal / Visual Graphic */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#0b0f19] border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl font-mono text-xs text-slate-300 space-y-4">
                {/* Terminal Window Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">architecture-stack.config.ts</span>
                </div>

                {/* Code Body */}
                <div className="space-y-2 text-slate-300 leading-relaxed font-mono">
                  <p className="text-purple-400">const<span className="text-white"> portfolioConfig</span> = &#123;</p>
                  <p className="pl-4 text-cyan-300">architect: <span className="text-emerald-400">&apos;{settings?.brandName || 'DEV'} {settings?.brandSuffix || '.PORTFOLIO'}&apos;</span>,</p>
                  <p className="pl-4 text-cyan-300">frontend: <span className="text-emerald-400">&apos;Next.js 16 + Tailwind CSS v4&apos;</span>,</p>
                  <p className="pl-4 text-cyan-300">backend: <span className="text-emerald-400">&apos;Supabase PostgreSQL + Microservices&apos;</span>,</p>
                  <p className="pl-4 text-cyan-300">hosting: <span className="text-emerald-400">&apos;Vercel Global CDN (100% Free)&apos;</span>,</p>
                  <p className="pl-4 text-cyan-300">status: <span className="text-emerald-400">&apos;PRODUCTION_READY&apos;</span></p>
                  <p className="text-purple-400">&#125;;</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-emerald-400">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>$ systemctl status portfolio-service --active</span>
                  </div>
                  <p className="text-slate-400 pl-6">● active (running) since Wed 2026-09-16 14:00:00</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROJECTS SHOWCASE SECTION */}
      <section id="projects" className="py-20 relative border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
            <span className="px-3.5 py-1 text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 rounded-full uppercase tracking-wider">
              // Portfolio Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {settings?.projectsTitle || 'Danh Sách Dự Án Tiêu Biểu'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {settings?.projectsSubtitle || 'Các sản phẩm được phân loại theo kiến trúc kỹ thuật. Nhấp vào thẻ bất kỳ để xem chi tiết bài phân tích kỹ thuật, mô hình thiết bị di động và demo.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat === 'All' ? 'Tất Cả Dự Án' : cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="py-20 text-center font-mono text-cyan-400">
              Đang tải dữ liệu dự án...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image Banner */}
                    <div className="relative aspect-video w-full overflow-hidden border-b border-slate-800">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 text-[11px] font-mono font-semibold text-cyan-300 bg-[#090d16]/90 border border-cyan-500/30 rounded-md backdrop-blur-md">
                          {project.category}
                        </span>
                        {project.mobileMockupUrl && (
                          <span className="px-2 py-1 text-[10px] font-mono text-purple-300 bg-purple-950/90 border border-purple-500/40 rounded-md flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-purple-400" />
                            <span>Mobile App</span>
                          </span>
                        )}
                      </div>
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 text-[11px] font-mono font-semibold text-amber-300 bg-amber-950/90 border border-amber-500/30 rounded-md backdrop-blur-md flex items-center gap-1">
                            ★ Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Tags & Action */}
                  <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-800/60 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>Chi tiết Case Study & Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* TECH STACK & SKILLS GRID SECTION */}
      <section id="skills" className="py-20 bg-[#050810]/80 relative border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1 text-xs font-mono font-semibold text-purple-400 bg-purple-950/60 border border-purple-500/30 rounded-full uppercase tracking-wider">
              // Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {settings?.skillsTitle || 'Công Nghệ Chủ Đạo & Kiến Trúc Software'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {settings?.skillsSubtitle || 'Bảng đánh giá năng lực chuyên môn và các công cụ lập trình sản xuất.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((cat, i) => (
              <div
                key={cat.id || i}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 hover:border-purple-500/30 transition-all"
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <span>{cat.title}</span>
                </h3>

                <div className="space-y-4">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={skill.id || sIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-200 font-semibold">{skill.name}</span>
                        <span className="text-purple-400">{skill.level}%</span>
                      </div>
                      
                      {/* Skill progress bar */}
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      
                      {skill.highlight && (
                        <p className="text-[11px] text-slate-500 font-mono pt-0.5">
                          💡 {skill.highlight}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ARTICLES & CASE STUDIES (BLOG) SECTION */}
      <section id="articles" className="py-20 relative border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-14">
            <span className="px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-full uppercase tracking-wider">
              // Technical Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {settings?.postsTitle || 'Bài Viết & Chia Sẻ Kỹ Thuật'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {settings?.postsSubtitle || 'Nhật ký chia sẻ kiến trúc phần mềm, kinh nghiệm lập trình và giải pháp tối ưu hệ thống.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-md">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>Đọc bài viết đầy đủ</span>
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT & DIRECT MESSAGE SECTION */}
      <section id="contact" className="py-20 relative bg-[#050810] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-cyan-500/30 space-y-8">
            <div className="text-center space-y-3">
              <span className="px-3.5 py-1 text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 rounded-full uppercase tracking-wider">
                // Connect & Collaborate
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                {settings?.contactTitle || 'Khởi Động Dự Án Mới'}
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                {settings?.contactSubtitle || `Gửi thông tin trao đổi trực tiếp tới ${settings?.contactEmail || 'contact@example.com'}`}
              </p>
            </div>

            {contactSubmitted ? (
              <div className="p-6 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center space-y-2 font-mono text-emerald-300 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="text-base font-bold">Cảm ơn bạn! Tin nhắn đã được gửi thành công.</p>
                <p className="text-xs text-slate-400">Tôi sẽ phản hồi lại bạn qua Email trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Họ & Tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Email Liên Hệ *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@domain.com"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Nội dung trao đổi / Yêu cầu dự án *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mô tả sơ lược về nhu cầu xây dựng phần mềm hoặc câu hỏi của bạn..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Tin Nhắn Nhanh</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Modals */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
