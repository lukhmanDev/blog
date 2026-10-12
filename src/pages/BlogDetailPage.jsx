import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  Check,
  Copy,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';
import { blogService } from '../api/blogService';

export default function BlogDetailPage({
  theme,
  toggleTheme,
  bookmarks,
  onToggleBookmark,
  onShowToast,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const [burstParticle, setBurstParticle] = useState(false);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticle = async () => {
      setLoading(true);
      const data = await blogService.getArticleBySlug(slug);
      const list = await blogService.getArticles();
      setArticle(data);
      setAllArticles(list);
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  // Track window scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    onShowToast('Code snippet copied to clipboard');
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Article link copied to clipboard');
    }
  };

  const handleClap = async () => {
    if (!article) return;
    const res = await blogService.clapArticle(article.id);
    setArticle(prev => ({ ...prev, claps: res.claps }));
    setBurstParticle(true);
    setTimeout(() => setBurstParticle(false), 900);
  };

  const handleAddComment = async (commentData) => {
    if (!article) return;
    const newComment = await blogService.addComment(article.id, commentData);
    setArticle(prev => ({
      ...prev,
      comments: [newComment, ...(prev.comments || [])],
    }));
    onShowToast('Your comment was posted successfully!');
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          bookmarksCount={bookmarks.length}
          showOnlyBookmarks={false}
          setShowOnlyBookmarks={() => navigate('/')}
        />
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
          <p>Loading full article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="app-container">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          bookmarksCount={bookmarks.length}
          showOnlyBookmarks={false}
          setShowOnlyBookmarks={() => navigate('/')}
        />
        <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Article Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The requested technical article could not be located.
          </p>
          <button className="cta-read-btn" onClick={() => navigate('/')}>
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);
  const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <div className="app-container">
      {/* Pinned Window Scroll Reading Progress Bar */}
      <div
        className="reading-progress-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: `${scrollProgress}%`,
          zIndex: 1000,
        }}
        aria-hidden="true"
      />

      {/* Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        bookmarksCount={bookmarks.length}
        showOnlyBookmarks={false}
        setShowOnlyBookmarks={() => navigate('/')}
      />

      {/* Dedicated Full Page Article Wrapper */}
      <div className="article-page-container">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="article-page-header-bar">
          <button
            className="back-to-blogs-btn"
            onClick={() => navigate('/')}
            aria-label="Back to all articles"
          >
            <ArrowLeft size={18} />
            <span>Back to all articles</span>
          </button>

          <div className="reader-actions-top">
            <button
              className={`icon-action-btn ${isBookmarked ? 'active' : ''}`}
              onClick={() => onToggleBookmark(article.id)}
              title={isBookmarked ? 'Bookmarked' : 'Save article'}
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
          </div>
        </div>

        {/* Clean Hero Header */}
        <header className="article-page-header">
          <div className="card-meta-top" style={{ marginBottom: '1rem' }}>
            <span className="card-category-inline">{article.category}</span>
            <span className="meta-divider" />
            <span>{article.publishedAt}</span>
            <span className="meta-divider" />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} />
              {article.readTime}
            </span>
            <span className="meta-divider" />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={14} />
              {article.views} reads
            </span>
          </div>

          <h1 className="article-page-title">{article.title}</h1>
          <p className="article-page-subtitle">{article.subtitle}</p>

          {/* Author Strip */}
          <div className="author-strip">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="author-avatar"
              style={{ width: '44px', height: '44px' }}
            />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{article.author.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{article.author.role}</div>
            </div>
          </div>
        </header>

        {/* Clean Cover Media Image (No overlays) */}
        <div className="article-page-cover-wrapper">
          <img
            src={article.coverImage}
            alt={article.title}
            className="article-page-cover-img"
          />
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

        {/* Article Body Content */}
        <main className="article-page-body">
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
        </main>

        {/* Clapper / Reactions Bar */}
        <div className="reader-engagement-bar" style={{ marginTop: '3.5rem' }}>
          <button
            className="clap-button"
            onClick={handleClap}
            aria-label={`Clap for this article, current claps: ${article.claps}`}
          >
            <Heart size={20} fill="currentColor" />
            <span>{article.claps} Reactions</span>
            {burstParticle && (
              <span className="clap-burst-particle">+1</span>
            )}
          </button>

          <button
            className="nav-btn"
            onClick={handleShare}
            style={{ padding: '0.65rem 1.2rem' }}
          >
            <Share2 size={15} />
            <span>Share Article</span>
          </button>
        </div>

        {/* Discussion / Comments Section */}
        <CommentSection
          comments={article.comments || []}
          onAddComment={handleAddComment}
        />

        {/* Related Articles Strip */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section" aria-label="Related articles">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              More from the Journal
            </h3>
            <div className="blog-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {relatedArticles.map(rel => (
                <article
                  key={rel.id}
                  className="blog-card"
                  onClick={() => navigate(`/blog/${rel.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-media-wrapper" style={{ height: '170px' }}>
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="card-cover-img"
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-meta-top">
                      <span className="card-category-inline">{rel.category}</span>
                      <span className="meta-divider" />
                      <span>{rel.readTime}</span>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{rel.title}</h3>
                    <p className="card-excerpt" style={{ fontSize: '0.85rem' }}>{rel.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
