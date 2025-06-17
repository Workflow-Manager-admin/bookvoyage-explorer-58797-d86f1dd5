import React from "react";

/**
 * SearchBar Component (STUB)
 * 
 * PUBLIC_INTERFACE
 * 
 * Search bar intended for use in BookVoyage Explorer explorer panel.
 * Allows searching for books, authors, or places.
 * 
 * Currently a non-functional placeholder with comments.
 */
function SearchBar() {
  return (
    <header className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search books, authors, or places..."
        disabled
      />
      <button className="btn" disabled>Search</button>
    </header>
  );
}

export default SearchBar;
