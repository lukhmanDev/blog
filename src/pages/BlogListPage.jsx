import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import BlogCard from '../components/BlogCard';
import { blogService } from '../api/blogService';
import { Bookmark, Search } from 'lucide-react';

export default function BlogListPage({
  theme: _theme,
  toggleTheme: _toggleTheme,
  bookmarks,
  onToggleBookmark,
  onShowToast: _onShowToast,
}) {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await blogService.getArticles({
        search: searchQuery,
      });
      setArticles(data);
    };
    load();
  }, [searchQuery]);

  const displayedArticles = useMemo(() => {
    if (showOnlyBookmarks) {
      return articles.filter(art => bookmarks.includes(art.id));
    }
    return articles;
  }, [articles, showOnlyBookmarks, bookmarks]);

  return (
    <div className="app-container">
      {/* Dynamic subtle ambient light */}
      <div className="ambient-glow-wrapper" aria-hidden="true">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />
      </div>

      {/* Editorial Page Header */}
      <header className="journal-header">
        <p className="journal-eyebrow">DEVELOPMENT • DESIGN • TECHNOLOGY</p>
        <h1 className="journal-title">The Developer's Log</h1>
      </header>

      {/* Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Articles Feed */}
      <section className="articles-section" aria-label="Articles Feed">
        <div className="section-header">
          <h2 className="section-title">
            <span>
              {showOnlyBookmarks ? 'Your Saved Bookmarks' : 'All Articles'}
            </span>
            <span className="articles-count">{displayedArticles.length}</span>
          </h2>
        </div>

        {/* Blog Grid */}
        {displayedArticles.length > 0 ? (
          <div className="blog-grid">
            {displayedArticles.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                isBookmarked={bookmarks.includes(blog.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              {showOnlyBookmarks ? <Bookmark size={42} /> : <Search size={42} />}
            </div>
            <h3 className="empty-state-title">
              {showOnlyBookmarks
                ? 'No saved articles yet'
                : 'No matching articles found'}
            </h3>
            <p className="empty-state-text">
              {showOnlyBookmarks
                ? 'Click the bookmark icon on any article to save it for later reading.'
                : `We couldn't find any articles matching "${searchQuery}". Try searching for 'Django', 'React', or 'Architecture'.`}
            </p>
            {showOnlyBookmarks ? (
              <button
                className="cta-read-btn"
                onClick={() => setShowOnlyBookmarks(false)}
              >
                Browse All Articles
              </button>
            ) : (
              <button
                className="cta-read-btn"
                onClick={() => setSearchQuery('')}
              >
                Reset Search Filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
