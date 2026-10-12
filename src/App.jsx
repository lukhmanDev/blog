import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import { getStoredBookmarks, saveStoredBookmarks } from './api/blogService';
import { CheckCircle2 } from 'lucide-react';
import './styles/blog.css';

export default function App() {
  const [bookmarks, setBookmarks] = useState(getStoredBookmarks);
  const [theme, setTheme] = useState('light');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme with document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleBookmark = (id) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(bId => bId !== id);
      showToast('Article removed from saved bookmarks');
    } else {
      updated = [...bookmarks, id];
      showToast('Article saved to your bookmarks');
    }
    setBookmarks(updated);
    saveStoredBookmarks(updated);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <BlogListPage
              theme={theme}
              toggleTheme={toggleTheme}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onShowToast={showToast}
            />
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <BlogDetailPage
              theme={theme}
              toggleTheme={toggleTheme}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onShowToast={showToast}
            />
          }
        />
      </Routes>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast-notice" role="status">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </BrowserRouter>
  );
}
