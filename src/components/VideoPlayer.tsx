'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Video, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { idbGet } from '@/lib/indexedDb';

interface VideoPlayerProps {
  url: string;
  title?: string;
  caption?: string;
}

export default function VideoPlayer({ url, title, caption }: VideoPlayerProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!url || !url.trim()) return null;

  const trimmed = url.trim();

  // Robust YouTube URL Extractor with autoplay=1
  const getYouTubeEmbedUrl = (link: string): string | null => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = link.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
    return null;
  };

  // Vimeo URL Extractor with autoplay=1
  const getVimeoEmbedUrl = (link: string): string | null => {
    const match = link.match(/(?:vimeo)\.com.*(?:videos\/|video\/|channels\/|channels\/\w+\/|)([\d]+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(trimmed);
  const vimeoEmbed = getVimeoEmbedUrl(trimmed);

  useEffect(() => {
    let isMounted = true;
    let createdObjectUrl: string | null = null;

    setLoading(true);
    setHasError(false);

    async function prepareMedia() {
      if (ytEmbed || vimeoEmbed) {
        if (isMounted) {
          setResolvedSrc(trimmed);
          setLoading(false);
        }
        return;
      }

      // Handle IndexedDB stored blob key (e.g. idb://video_asset_12345)
      if (trimmed.startsWith('idb://')) {
        const key = trimmed.replace('idb://', '');
        try {
          const storedItem = await idbGet<any>(key);
          if (storedItem) {
            let blob: Blob;
            if (storedItem instanceof Blob) {
              blob = storedItem;
            } else if (typeof storedItem === 'string' && storedItem.startsWith('data:')) {
              const res = await fetch(storedItem);
              blob = await res.blob();
            } else {
              blob = new Blob([storedItem], { type: 'video/mp4' });
            }
            const objectUrl = URL.createObjectURL(blob);
            createdObjectUrl = objectUrl;
            if (isMounted) {
              setResolvedSrc(objectUrl);
              setLoading(false);
            }
            return;
          }
        } catch (err) {
          console.error('Failed to load video from IndexedDB:', err);
        }
      }

      // Handle Base64 Data URL (Convert to Blob ObjectURL so Chromium HTML5 video tag can decode & play)
      if (trimmed.startsWith('data:video/')) {
        try {
          const res = await fetch(trimmed);
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          createdObjectUrl = objectUrl;
          if (isMounted) {
            setResolvedSrc(objectUrl);
            setLoading(false);
          }
          return;
        } catch (err) {
          console.error('Failed to convert base64 data URL to Blob:', err);
        }
      }

      // Standard HTTP/HTTPS or Blob URL
      if (isMounted) {
        setResolvedSrc(trimmed);
        setLoading(false);
      }
    }

    prepareMedia();

    return () => {
      isMounted = false;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
    };
  }, [trimmed, ytEmbed, vimeoEmbed]);

  // Set default volume to 40% (0.4) and attempt unmuted autoplay when video is ready
  useEffect(() => {
    if (!loading && resolvedSrc && videoRef.current) {
      videoRef.current.volume = 0.4; // 40% volume
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.info('Unmuted autoplay prevented by browser policy, attempting muted autoplay fallback:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [loading, resolvedSrc]);

  return (
    <div className="my-6 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Video Trình Diễn Demo ({title || 'Project Video Demo'})</span>
        </span>
        {!trimmed.startsWith('data:') && !trimmed.startsWith('idb://') && (
          <a
            href={trimmed}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 rounded-full flex items-center gap-1 transition-all"
          >
            <span>Mở Video Gốc</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#090d16] shadow-2xl shadow-cyan-950/60 group">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-cyan-400 font-mono text-xs gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span>Đang chuẩn bị luồng phát Video...</span>
          </div>
        ) : ytEmbed ? (
          <iframe
            src={ytEmbed}
            title={title || 'YouTube Video Player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : vimeoEmbed ? (
          <iframe
            src={vimeoEmbed}
            title={title || 'Vimeo Video Player'}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-rose-400 font-mono text-xs gap-2 p-4 text-center">
            <AlertCircle className="w-6 h-6 text-rose-400" />
            <span>Không thể nạp tệp video. Hãy thử tải lại tệp MP4 hoặc sử dụng link YouTube.</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            controls
            playsInline
            preload="auto"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
            src={resolvedSrc}
          >
            Trình duyệt của bạn không hỗ trợ phát thẻ video.
          </video>
        )}
      </div>

      {caption && (
        <p className="text-xs font-mono text-slate-400 text-center pt-1">
          🎬 {caption}
        </p>
      )}
    </div>
  );
}


