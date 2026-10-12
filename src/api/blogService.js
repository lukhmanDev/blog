import { INITIAL_BLOGS } from '../data/mockBlogs';

// Django REST API Configuration
// When you start your Django API server, switch USE_DJANGO_API to true or set VITE_USE_DJANGO_API=true in .env
export const API_CONFIG = {
  useDjangoApi: import.meta.env.VITE_USE_DJANGO_API === 'true' || false,
  baseUrl: import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/blogs/',
};

const STORAGE_KEY = 'lukman_portfolio_blogs_v1';
const BOOKMARKS_KEY = 'lukman_portfolio_bookmarks_v1';

// Initialize local storage with initial blogs if not present
function getStoredBlogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
  return INITIAL_BLOGS;
}

function saveStoredBlogs(blogs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (e) {
    console.warn('Could not write to localStorage', e);
  }
}

export function getStoredBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredBookmarks(bookmarks) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.warn('Could not save bookmarks', e);
  }
}

// Main Blog API Service
export const blogService = {
  // Fetch all articles with optional filters
  async getArticles({ category = 'All Articles', search = '', sortBy = 'latest' } = {}) {
    if (API_CONFIG.useDjangoApi) {
      try {
        const queryParams = new URLSearchParams();
        if (category && category !== 'All Articles') queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        if (sortBy) queryParams.append('ordering', sortBy === 'popular' ? '-claps_count' : '-published_at');

        const response = await fetch(`${API_CONFIG.baseUrl}?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) ? data : data.results || [];
        }
      } catch (err) {
        console.warn('Django API not reachable, falling back to local dataset:', err);
      }
    }

    // Fallback or Local Mock Data
    let blogs = [...getStoredBlogs()];

    // Filter by Category
    if (category && category !== 'All Articles') {
      blogs = blogs.filter(
        b => b.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search query filter (title, subtitle, tags, content)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      blogs = blogs.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'popular') {
      blogs.sort((a, b) => b.claps - a.claps);
    } else if (sortBy === 'quick') {
      blogs.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
    } else {
      // Default latest (by ID descending in mock)
      blogs.sort((a, b) => b.id - a.id);
    }

    return blogs;
  },

  // Get a single article by slug or ID
  async getArticleBySlug(slug) {
    if (API_CONFIG.useDjangoApi) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}${slug}/`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('Django API fetch error for single article, using fallback', err);
      }
    }

    const blogs = getStoredBlogs();
    return blogs.find(b => b.slug === slug || String(b.id) === String(slug)) || null;
  },

  // Clap / Like an article
  async clapArticle(articleId) {
    if (API_CONFIG.useDjangoApi) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}${articleId}/clap/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Django API clap endpoint failed, updating locally', err);
      }
    }

    const blogs = getStoredBlogs();
    const target = blogs.find(b => b.id === articleId);
    if (target) {
      target.claps = (target.claps || 0) + 1;
      saveStoredBlogs(blogs);
      return { claps: target.claps };
    }
    return { claps: 0 };
  },

  // Add comment
  async addComment(articleId, { author, content }) {
    const newComment = {
      id: Date.now(),
      author: author.trim() || 'Tech Reader',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author || 'Reader')}`,
      date: 'Just now',
      content: content.trim(),
      likes: 0
    };

    if (API_CONFIG.useDjangoApi) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}${articleId}/comments/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author, content })
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Django API comment post failed, saving locally', err);
      }
    }

    const blogs = getStoredBlogs();
    const target = blogs.find(b => b.id === articleId);
    if (target) {
      if (!target.comments) target.comments = [];
      target.comments.unshift(newComment);
      saveStoredBlogs(blogs);
      return newComment;
    }
    return newComment;
  },

  // Reset to default mock data (helper utility)
  resetData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
};
