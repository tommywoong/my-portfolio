'use client';

import React from 'react';
import { Project } from '@/lib/types';
import RichContent from './RichContent';
import VideoPlayer from './VideoPlayer';
import { X, ExternalLink, Calendar, Layers, CheckCircle2, Video } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0b0f19] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 text-slate-200 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 rounded-full">
              {project.category}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hoàn thành: {project.completionDate}</span>
            </span>
            {project.videoUrl && (
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-purple-300 bg-purple-950/80 border border-purple-500/40 rounded-full">
                <Video className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Có Video Demo</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
            {project.title}
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* PROMINENT VIDEO DEMO PLAYER SECTION (Rendered right at top if videoUrl is set) */}
        {project.videoUrl ? (
          <div className="my-6">
            <VideoPlayer
              url={project.videoUrl}
              title={project.title}
              caption="Video trực quan minh họa hoạt động của dự án"
            />
          </div>
        ) : (
          /* Cover Banner fallback if no video */
          <div className="relative my-6 aspect-video w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl group">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {project.metrics.map((m, i) => (
              <div key={i} className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl text-center">
                <p className="text-xs text-slate-400 font-mono mb-1">{m.label}</p>
                <p className="text-xl font-extrabold text-cyan-400 font-mono">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Rich Description, Device Mockups & Image Gallery */}
        <div className="border-t border-slate-800/80 pt-6">
          <RichContent
            content={project.description}
            mobileMockupUrl={project.mobileMockupUrl}
            mockupType={project.mockupType}
            galleryImages={project.galleryImages}
          />
        </div>

        {/* Architecture Highlights */}
        {project.architectureHighlights && project.architectureHighlights.length > 0 && (
          <div className="mt-8 bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4 md:p-5 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Điểm Nổi Bật Về Kiến Trúc Software</span>
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-slate-300">
              {project.architectureHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Badges */}
        <div className="mt-6 space-y-2">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Công Nghệ & Công Cụ Sử Dụng
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-800 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 rounded-xl transition-all"
          >
            Đóng Cửa Sổ [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
