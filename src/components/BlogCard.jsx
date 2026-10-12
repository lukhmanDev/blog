import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Eye, Heart } from 'lucide-react';

export default function BlogCard({
  blog,
  isBookmarked,
  onToggleBookmark,
}) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/blog/${blog.slug}`);
  };

  return (
    <article
      className="blog-card"
      onClick={handleOpen}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`Article: ${blog.title}`}
    >
      <div className="card-body">
        <div className="card-meta-top">
          <span className="card-category-inline">{blog.category}</span>
          <span className="meta-divider" />
          <span>{blog.publishedAt}</span>
          <span className="meta-divider" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={13} />
            {blog.readTime}
          </span>
        </div>

        <h2 className="card-title">{blog.title}</h2>

        <p className="card-excerpt">{blog.subtitle}</p>

        <div className="card-tags">
          {blog.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-item">
              #{tag}
            </span>
          ))}
        </div>

        <div className="card-footer">
          <div className="card-author">
            <span className="author-mini-name">{blog.author.name}</span>
          </div>

          <div className="card-engagement">
            <span className="card-stat-pill" title="Claps / Likes">
              <Heart size={14} />
              {blog.claps}
            </span>
            <span className="card-stat-pill" title="Reader Views">
              <Eye size={14} />
              {blog.views}
            </span>
            <button
              className={`footer-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(blog.id);
              }}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
