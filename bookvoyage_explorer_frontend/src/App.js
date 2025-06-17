import React, { useEffect } from 'react';
import './App.css';

// Import stub components (now used for layout)
import MapPanel from './MapPanel';
import InfoPanel from './InfoPanel';
import SearchBar from './SearchBar';
import BucketList from './BucketList';
// Import the API stub functions
import { fetchBooksFromGoogle, fetchWikipediaSummary } from "./api";

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

  // Example stub usage: fetch dummy book and Wikipedia data on mount;
  // Replace with stateful/search-driven logic in future.
  useEffect(() => {
    // TODO: Remove this example, integrate calls where user searches or selects a book/place.
    async function demoStubCalls() {
      // Fetch dummy Google Books data for "Paris"
      const books = await fetchBooksFromGoogle("Paris");
      console.log("[STUB DEMO] Google Books API result:", books);

      // Fetch dummy Wikipedia info for "Paris"
      const wiki = await fetchWikipediaSummary("Paris");
      console.log("[STUB DEMO] Wikipedia API result:", wiki);
    }
    demoStubCalls();
  }, []);
  

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
          <SearchBar 
            // TODO: Integrate API stubs - Example:
            // onSearch={async (query) => {
            //   const books = await fetchBooksFromGoogle(query);
            //   // Use books data for state/display
            // }}
          />

          {/* Map & Bucket List Panel Row */}
          <div className="map-and-bucket">
            <MapPanel 
              // TODO: Use Google Books and Wikipedia data to highlight locations on the map.
            />
            <BucketList 
              // TODO: Save items retrieved from API stubs to the bucket list
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
