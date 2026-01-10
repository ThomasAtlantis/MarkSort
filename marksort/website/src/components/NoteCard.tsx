import { useState, useRef, useEffect } from 'react';
import type { NoteWithDetail } from '../types';
import { getNoteUrl, getCoverImageUrl, getVideoUrl } from '../services/dataService';
import './NoteCard.css';

interface NoteCardProps {
  note: NoteWithDetail;
}

export default function NoteCard({ note }: NoteCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const coverUrl = getCoverImageUrl(note);
  const noteUrl = getNoteUrl(note.note_id, note.xsec_token);
  const videoUrl = getVideoUrl(note);

  const title = note.detail?.note_card.title || note.display_title;
  const author = note.detail?.note_card.user.nickname || note.user.nickname;
  const description = note.detail?.note_card.desc || '';
  const tags = note.detail?.note_card.tag_list || [];
  const interactInfo = note.detail?.note_card.interact_info || note.interact_info;
  const avatar = note.detail?.note_card.user.avatar || note.user.avatar;

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoUrl) {
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

  return (
    <div className="note-card">
      <div className="note-card-header">
        <div className="note-cover">
          {isVideoPlaying && videoUrl ? (
            <div className="video-container">
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
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt={title}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              {note.detail?.note_card.type === 'video' && videoUrl && (
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
            </>
          )}
        </div>
      </div>

      <div className="note-card-body">
        <h3 className="note-title">{title}</h3>

        <div className="note-author">
          <img
            src={avatar}
            alt={author}
            className="author-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="%23ddd"/></svg>';
            }}
          />
          <span className="author-name">{author}</span>
        </div>

        {description && (
          <p className="note-description">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="note-tags">
            {tags.map(tag => (
              <span key={tag.id} className="tag">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="note-interactions">
          <span className="interaction-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {interactInfo.liked_count || '0'}
          </span>
          {note.detail?.note_card.interact_info && (
            <>
              <span className="interaction-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" />
                </svg>
                {note.detail.note_card.interact_info.collected_count || '0'}
              </span>
              <span className="interaction-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                {note.detail.note_card.interact_info.comment_count || '0'}
              </span>
            </>
          )}
        </div>

        <a
          href={noteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="note-link"
        >
          查看原动态 →
        </a>
      </div>
    </div>
  );
}
