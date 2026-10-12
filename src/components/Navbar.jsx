import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sun, Moon, ArrowUpRight } from 'lucide-react';

export default function Navbar({
  theme,
  toggleTheme,
  bookmarksCount,
  showOnlyBookmarks,
  setShowOnlyBookmarks,
}) {
  return (
    <header className="navbar" role="banner">
      <Link
        to="/"
        className="nav-brand"
        onClick={() => {
          if (showOnlyBookmarks && setShowOnlyBookmarks) {
            setShowOnlyBookmarks(false);
          }
        }}
        aria-label="Lukman's Journal Home"
      >
        <div className="brand-badge" aria-hidden="true">
          L
        </div>
        <div className="brand-info">
          <span className="brand-title">The Developer's Log</span>
          <span className="brand-subtitle">DEVELOPMENT • DESIGN • TECHNOLOGY</span>
        </div>
      </Link>

      <nav className="nav-actions" aria-label="Main Navigation">
        <button
          className={`nav-btn ${showOnlyBookmarks ? 'active' : ''}`}
          onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
          title="Saved Bookmarks"
          aria-label="Filter bookmarked articles"
        >
          <Bookmark size={16} fill={showOnlyBookmarks ? 'currentColor' : 'none'} />
          <span>Saved</span>
          {bookmarksCount > 0 && (
            <span className="articles-count" style={{ padding: '0.1rem 0.45rem', fontSize: '0.72rem' }}>
              {bookmarksCount}
            </span>
          )}
        </button>

        <button
          className="nav-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle visual theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <a
          href="/"
          className="portfolio-link-badge"
          title="Return to main portfolio"
        >
          <span>Portfolio</span>
          <ArrowUpRight size={14} />
        </a>
      </nav>
    </header>
  );
}
