'use client';

import React from 'react';
import { Post } from '@/lib/types';
import RichContent from './RichContent';
import { X, Calendar, Clock, User, Tag } from 'lucide-react';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0b0f19] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/50 text-slate-200 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Post Metadata Header */}
        <div className="space-y-4 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-medium text-purple-300 bg-purple-950/80 border border-purple-500/30 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-full">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>{post.readTime}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{post.publishedAt}</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white">
              <User className="w-3.5 h-3.5" />
            </div>
            <span>Tác giả: <strong className="text-slate-200">{post.author}</strong></span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative my-6 aspect-video w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Post Summary & Rich Content with Image Support */}
        <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-800/80 pt-6">
          <p className="text-base md:text-lg font-medium text-cyan-300/90 italic bg-cyan-950/30 p-4 border-l-2 border-cyan-400 rounded-r-xl">
            {post.summary}
          </p>

          <RichContent
            content={post.content}
            galleryImages={post.galleryImages}
          />
        </div>

        {/* Tags Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="w-4 h-4 text-purple-400" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono bg-slate-900 text-purple-300 border border-slate-800 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all"
          >
            Đóng Bài Viết
          </button>
        </div>
      </div>
    </div>
  );
}
