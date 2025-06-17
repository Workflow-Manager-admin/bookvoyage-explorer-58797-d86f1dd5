import React, { useState } from "react";

/**
 * SearchBar Component
 *
 * PUBLIC_INTERFACE
 *
 * Allows searching for books, authors, or places.
 * Calls onSearch(query, type) prop with user input.
 * Shows loading/error feedback if needed.
 */
function SearchBar({
  onSearch,
  isLoading = false,
  error = "",
  initialType = "place",
  initialQuery = ""
}) {
  const [searchType, setSearchType] = useState(initialType);
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e) {
    e.preventDefault();
    if (!onSearch) return;
    if (!query.trim()) return;
    onSearch(query.trim(), searchType);
  }

  function handleTypeChange(e) {
    setSearchType(e.target.value);
  }

  return (
    <header className="search-bar">
      <form style={{ display: "flex", width: "100%", gap: 10, alignItems: "center" }} onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search books, authors, or places..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
          aria-label="Enter a search term"
          style={{ flex: 2 }}
        />
        <select
          value={searchType}
          onChange={handleTypeChange}
          disabled={isLoading}
          style={{ padding: "8px", fontSize: "1em" }}
          aria-label="Search type"
        >
          <option value="place">Place</option>
          <option value="book">Book</option>
          <option value="author">Author</option>
        </select>
        <button className="btn" type="submit" disabled={!query.trim() || isLoading} style={{ flex: 0 }}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      {error &&
        <div style={{ color: "red", marginLeft: 8, fontSize: "0.96em" }}>
          {error}
        </div>
      }
    </header>
  );
}

export default SearchBar;
