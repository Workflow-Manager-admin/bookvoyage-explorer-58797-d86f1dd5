import React from 'react';
import './App.css';

/**
 * BookVoyage Explorer Main Container & Component Hierarchy
 * 
 * Layout structure:
 * 
 * <div className="app">
 *   <nav className="navbar"> ... </nav>
 *   <div className="main-content">
 *     <aside className="sidebar"> [Trivia/Info Panel] </aside>
 *     <section className="explorer-panel">
 *       <header className="search-bar"> [Search Bar] </header>
 *       <div className="map-and-bucket">
 *         <div className="map-panel"> [Interactive Map Placeholder] </div>
 *         <aside className="bucket-list"> [Bucket List Panel] </aside>
 *       </div>
 *     </section>
 *   </div>
 * </div>
 */

function App() {
  return (
    <div className="app">
      {/* Top Navbar/Header */}
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" role="img" aria-label="Book icon">📚</span>
              BookVoyage Explorer
            </div>
            <button className="btn" disabled>Login (placeholder)</button>
          </div>
        </div>
      </nav>

      {/* Main Layout Container */}
      <div className="main-content">
        {/* Sidebar for Info/Trivia */}
        <aside className="sidebar">
          {/* INFO/TRIVIA SIDEBAR */}
          {/* Replace placeholder with real trivia/info in future */}
          <h2>Trivia & Info</h2>
          <div className="sidebar-content">
            <p>[Trivia and information about selected book, author, or place will appear here.]</p>
          </div>
        </aside>

        {/* Main explorer area (map/search/bucket list) */}
        <section className="explorer-panel">
          {/* Search Bar */}
          <header className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search books, authors, or places..."
              disabled
            />
            <button className="btn" disabled>Search</button>
          </header>

          {/* Map & Bucket List Panel Row */}
          <div className="map-and-bucket">
            {/* Interactive Map Placeholder */}
            <div className="map-panel">
              <div className="map-placeholder">
                <h3>Interactive Map</h3>
                <p>[An interactive world map will appear here.]</p>
              </div>
            </div>
            {/* Bucket List Panel */}
            <aside className="bucket-list">
              <h2>Bucket List</h2>
              <div className="bucket-list-content">
                <ul>
                  <li>[Your saved places will appear here!]</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
