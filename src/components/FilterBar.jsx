import React from 'react';
import { Search, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="filter-section">
      <div className="filter-top-row">
        {/* Search Input Box */}
        <div className="search-and-controls">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tech, stack, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

