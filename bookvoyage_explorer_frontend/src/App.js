import React from 'react';
import './App.css';

// Import stub components (now used for layout)
import MapPanel from './MapPanel';
import InfoPanel from './InfoPanel';
import SearchBar from './SearchBar';
import BucketList from './BucketList';

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
        <InfoPanel />

        {/* Main explorer area (map/search/bucket list) */}
        <section className="explorer-panel">
          {/* Search Bar */}
          <SearchBar />

          {/* Map & Bucket List Panel Row */}
          <div className="map-and-bucket">
            <MapPanel />
            <BucketList />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
