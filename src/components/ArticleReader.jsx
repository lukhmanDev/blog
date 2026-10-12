import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  Check,
  Copy,
  Clock,
  Eye,
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react';
import CommentSection from './CommentSection';

export default function ArticleReader({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onClap,
  onAddComment,
  onShowToast,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const [burstParticle, setBurstParticle] = useState(false);
  const readerRef = useRef(null);

  // Track scroll progress within reader
  const handleScroll = () => {
    if (readerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = readerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Copy code handler
  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    onShowToast('Code snippet copied to clipboard');
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Share handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Article link copied to clipboard');
    }
  };

  // Clap burst animation
  const handleClapClick = () => {
    onClap(article.id);
    setBurstParticle(true);
    setTimeout(() => setBurstParticle(false), 900);
  };

  return (
    <div
      className="reader-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
      ref={readerRef}
      onScroll={handleScroll}
    >
      <div className="reader-container">
        {/* Real-time Reading Progress Bar */}
        <div
          className="reading-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {/* Reader Top Navigation Bar */}
        <header className="reader-header-bar">
          <button
            className="back-to-blogs-btn"
            onClick={onClose}
            aria-label="Back to all articles"
          >
            <ArrowLeft size={18} />
            <span>Back to Journal</span>
          </button>

          <div className="reader-actions-top">
            <button
              className={`icon-action-btn ${isBookmarked ? 'active' : ''}`}
              onClick={() => onToggleBookmark(article.id)}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark this read'}
              aria-label="Bookmark article"
            >
              <Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              className="icon-action-btn"
              onClick={handleShare}
              title="Share article"
              aria-label="Share article link"
            >
              <Share2 size={17} />
            </button>

            <button
              className="icon-action-btn"
              onClick={onClose}
              title="Close reader (Esc)"
              aria-label="Close reader"
            >
              <X size={17} />
            </button>
          </div>
        </header>

        {/* Media Hero */}
        <div className="reader-hero-media">
          <img
            src={article.coverImage}
            alt={article.title}
            className="reader-hero-img"
          />
          <div className="reader-hero-gradient" />
        </div>

        {/* Content Body */}
        <main className="reader-body-content">
          <span className="reader-category">{article.category}</span>
          <h1 className="reader-title">{article.title}</h1>
          <p className="reader-subtitle">{article.subtitle}</p>

          {/* Author & Meta Row */}
          <div className="reader-meta-profile">
            <div className="author-full">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="author-full-avatar"
              />
              <div>
                <div className="author-full-name">{article.author.name}</div>
                <div className="author-full-role">{article.author.role}</div>
              </div>
            </div>

            <div className="reader-quick-stats">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} />
                {article.publishedAt}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} />
                {article.readTime}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Eye size={15} />
                {article.views} reads
              </span>
            </div>
          </div>

          {/* Table of Contents */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <nav className="toc-box" aria-label="Table of contents">
              <div className="toc-title">Table of Contents</div>
              <ul className="toc-list">
                {article.tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Structured Article Sections */}
          <article className="article-rendered-text">
            {article.content.map((block, idx) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={idx} id={block.id} className="article-section-heading">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="article-paragraph">
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'callout') {
                return (
                  <div key={idx} className="article-callout">
                    <div className="callout-title">{block.title}</div>
                    <p className="callout-text">{block.text}</p>
                  </div>
                );
              }
              if (block.type === 'code') {
                return (
                  <div key={idx} className="code-snippet-box">
                    <div className="code-header">
                      <span>{block.filename || block.language}</span>
                      <button
                        className="copy-code-btn"
                        onClick={() => handleCopyCode(block.code, idx)}
                        aria-label="Copy code snippet"
                      >
                        {copiedCodeIndex === idx ? (
                          <>
                            <Check size={13} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="code-pre">
                      <code>{block.code}</code>
                    </pre>
                  </div>
                );
              }
              if (block.type === 'list') {
                return (
                  <ul key={idx} className="takeaway-list">
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="takeaway-item">
                        <CheckCircle2 size={18} className="takeaway-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </article>

          {/* Engagement Reaction Bar */}
          <div className="reader-engagement-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="clap-button"
                onClick={handleClapClick}
                aria-label={`Clap for this article, current claps: ${article.claps}`}
              >
                <Heart size={20} fill="currentColor" />
                <span>{article.claps} Reactions</span>
                {burstParticle && (
                  <span className="clap-burst-particle">+1</span>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="nav-btn"
                onClick={handleShare}
                style={{ padding: '0.65rem 1.1rem' }}
              >
                <Share2 size={15} />
                <span>Share Article</span>
              </button>
            </div>
          </div>

          {/* Interactive Comments Section */}
          <CommentSection
            comments={article.comments || []}
            onAddComment={(commentData) => onAddComment(article.id, commentData)}
          />
        </main>
      </div>
    </div>
  );
}
