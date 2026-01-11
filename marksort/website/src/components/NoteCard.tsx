import { useState, useRef, useEffect } from 'react';
import type { UnifiedItem } from '../types';
import { getPlatformName } from '../services/dataService';
import './NoteCard.css';

interface NoteCardProps {
  item: UnifiedItem;
}

export default function NoteCard({ item }: NoteCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoUrl = item.videoUrl;
  const isBilibili = item.platform === 'bilibili';
  const hasVideo = !!videoUrl || !!item.bilibiliPlayerParams;

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoUrl || item.bilibiliPlayerParams) {
      setIsVideoPlaying(true);
    }
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Reset video when component unmounts or video URL changes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [videoUrl]);

  const platformName = getPlatformName(item.platform);

  // Format duration for display (seconds to mm:ss)
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate bilibili iframe src URL
  const getBilibiliIframeSrc = (): string => {
    if (!item.bilibiliPlayerParams) return '';
    const { aid, bvid, cid, page } = item.bilibiliPlayerParams;
    const params = new URLSearchParams({
      isOutside: 'true',
      aid: String(aid),
      bvid: bvid,
      cid: String(cid),
      p: String(page),
    });
    return `//player.bilibili.com/player.html?${params.toString()}`;
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <div className="note-cover">
          {isVideoPlaying && (videoUrl || item.bilibiliPlayerParams) ? (
            <div className="video-container">
              {isBilibili && item.bilibiliPlayerParams ? (
                <iframe
                  ref={iframeRef}
                  src={getBilibiliIframeSrc()}
                  className="bilibili-iframe"
                  scrolling="no"
                  style={{ border: 'none' }}
                  allowFullScreen
                />
              ) : (
                videoUrl && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="note-video"
                    playsInline
                    onError={(e) => {
                      console.error('Video load error:', e);
                      setIsVideoPlaying(false);
                    }}
                  />
                )
              )}
              <button
                className="video-close-button"
                onClick={handleCloseVideo}
                title="关闭视频"
                aria-label="关闭视频"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              {item.cover && (
                <img
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              {hasVideo && (
                <div
                  className="video-badge"
                  onClick={handleVideoClick}
                  title="点击播放视频"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
              {item.duration && (
                <div className="duration-badge">
                  {formatDuration(item.duration)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="note-card-body">
        <div className="note-header-row">
          <h3 className="note-title">{item.title}</h3>
          <span className={`platform-badge platform-badge-${item.platform}`}>
            {platformName}
          </span>
        </div>

        <div className="note-author">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            className="author-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="%23ddd"/></svg>';
            }}
          />
          <span className="author-name">{item.author.name}</span>
        </div>

        {item.description && (
          <p className="note-description">{item.description}</p>
        )}

        {item.tags.length > 0 && (
          <div className="note-tags">
            {item.tags.map(tag => (
              <span key={tag.id} className="tag">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="note-interactions">
          {item.interactInfo.liked_count && (
            <span className="interaction-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {item.interactInfo.liked_count}
            </span>
          )}
          {item.interactInfo.collected_count && (
            <span className="interaction-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" />
              </svg>
              {item.interactInfo.collected_count}
            </span>
          )}
          {item.interactInfo.comment_count && (
            <span className="interaction-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              {item.interactInfo.comment_count}
            </span>
          )}
          {item.interactInfo.play_count && (
            <span className="interaction-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {item.interactInfo.play_count}
            </span>
          )}
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="note-link"
        >
          查看原文 →
        </a>
      </div>
    </div>
  );
}
