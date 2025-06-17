import React, { useState } from "react";

/**
 * MapPanel Component (Enhanced Demo Version)
 *
 * PUBLIC_INTERFACE
 *
 * Shows clickable "markers" for demo places, lets user filter by category/type,
 * displays info bubble on marker selection, and allows "add to bucket" action.
 * Integrates with parent state for selection and bucket list.
 *
 * Receives props:
 *  - places: array of place objects { id, name, trivia, books, ...type/category }
 *  - selectedPlaceId: id of currently selected place
 *  - onSelectPlace: handler for selecting a marker
 *  - onAddToBucket: handler for adding a place to user's bucket list
 *  - bucketList: array of place ids in bucket
 *
 * In a real app, rendering and marker logic would be powered by a map SDK (Mapbox,
 * Google Maps, Leaflet, etc.), and info bubble would be an overlay.
 * Here, we simulate this with rich demo data and more realistic logic.
 */
function MapPanel({
  places = [],
  selectedPlaceId,
  onSelectPlace,
  onAddToBucket,
  bucketList = [],
}) {
  // ---- Demo Data: Enhanced Place List ----
  // If no places provided, fallback to an enhanced set
  const demoPlaces = places.length > 0 ? places : [
    {
      id: 'paris',
      name: "Paris, France",
      trivia: "Known as the City of Light, famous for the Eiffel Tower.",
      books: [
        { title: "The Hunchback of Notre-Dame", author: "Victor Hugo" },
        { title: "Paris to the Moon", author: "Adam Gopnik" }
      ],
      category: "City",
      region: "Europe"
    },
    {
      id: 'london',
      name: "London, UK",
      trivia: "Home of Big Ben and Sherlock Holmes.",
      books: [
        { title: "Neverwhere", author: "Neil Gaiman" },
        { title: "Oliver Twist", author: "Charles Dickens" }
      ],
      category: "City",
      region: "Europe"
    },
    {
      id: 'kyoto',
      name: "Kyoto, Japan",
      trivia: "Ancient capital, famous for temples and cherry blossoms.",
      books: [
        { title: "Memoirs of a Geisha", author: "Arthur Golden" },
      ],
      category: "City",
      region: "Asia"
    },
    {
      id: 'uluru',
      name: "Uluru (Ayers Rock), Australia",
      trivia: "Sacred sandstone monolith in Australia's Outback.",
      books: [
        { title: "Mutant Message Down Under", author: "Marlo Morgan" }
      ],
      category: "Landmark",
      region: "Australia"
    },
    {
      id: 'venice',
      name: "Venice, Italy",
      trivia: "The city of canals, gondolas, and masked carnivals.",
      books: [
        { title: "Death in Venice", author: "Thomas Mann" }
      ],
      category: "City",
      region: "Europe"
    },
    {
      id: 'andes',
      name: "The Andes Mountains",
      trivia: "Longest continental mountain range, stretches along South America.",
      books: [
        { title: "Turn Right at Machu Picchu", author: "Mark Adams" }
      ],
      category: "Natural Wonder",
      region: "South America"
    },
    {
      id: 'santorini',
      name: "Santorini, Greece",
      trivia: "Iconic blue-domed churches, caldera views, and sunsets.",
      books: [
        { title: "The Sisterhood of the Traveling Pants", author: "Ann Brashares" }
      ],
      category: "Island",
      region: "Europe"
    },
    {
      id: 'yosemite',
      name: "Yosemite National Park, USA",
      trivia: "Majestic granite cliffs, waterfalls, and sequoias.",
      books: [
        { title: "The Yosemite", author: "John Muir" }
      ],
      category: "National Park",
      region: "North America"
    },
    {
      id: 'transylvania',
      name: "Transylvania, Romania",
      trivia: "Count Dracula's legendary homeland.",
      books: [
        { title: "Dracula", author: "Bram Stoker" }
      ],
      category: "Region",
      region: "Europe"
    },
    {
      id: 'cairo',
      name: "Cairo, Egypt",
      trivia: "Gateway to the pyramids and sphinx on the Nile.",
      books: [
        { title: "Death on the Nile", author: "Agatha Christie" }
      ],
      category: "City",
      region: "Africa"
    }
  ];

  // ---- Filtering Logic ----
  // Compute a list of unique categories and regions from the data.
  const allCategories = [
    ...new Set(demoPlaces.map(p => p.category || "Other"))
  ];
  const allRegions = [
    ...new Set(demoPlaces.map(p => p.region || "Other"))
  ];

  // Local state: selected filter for demo (by category or region)
  const [filterType, setFilterType] = useState('All');
  const [filterMode, setFilterMode] = useState('category'); // or 'region'
  // Local state: info-bubble visibility (open for marker), for future expansion in real map
  const [popupPlaceId, setPopupPlaceId] = useState(null);

  // Filtering places by selected category/region (but don't filter out the currently selected marker)
  const filteredPlaces = demoPlaces.filter(
    (p) =>
      filterType === 'All' ||
      (filterMode === "category" ? (p.category === filterType || p.id === selectedPlaceId) :
        (p.region === filterType || p.id === selectedPlaceId))
  );

  // Find selected place for info bubble
  const selectedPlace = demoPlaces.find(p => p.id === selectedPlaceId);

  // Handler: Clicking a marker
  // Simulates a map marker click → updates selection globally and shows popup locally
  function handleMarkerClick(placeId) {
    if (onSelectPlace) onSelectPlace(placeId);
    setPopupPlaceId(placeId); // opens info popup for this marker
  }

  // Handler: closing info popup
  function handleClosePopup() {
    setPopupPlaceId(null);
  }

  // Handler: Filtering change
  function handleFilterChange(e) {
    setFilterType(e.target.value);
    setPopupPlaceId(null);
  }

  // Handler: Toggle filter mode (category/region)
  function handleFilterModeChange(e) {
    setFilterMode(e.target.value);
    setFilterType('All');
    setPopupPlaceId(null);
  }


  return (
    <div className="map-panel" style={{ position: "relative" }}>
      <div className="map-placeholder">
        <h3>Interactive Map</h3>
        <p>[Click a marker to select. Filter by category or region to explore!]</p>

        {/* ---- Filter Controls ---- */}
        <form style={{
          display: "flex", gap: 12, margin: "8px 0 16px 0", alignItems: "center", flexWrap: "wrap"
        }}
        onSubmit={e => e.preventDefault()}>
          <label htmlFor="filter-mode">
            <select
              id="filter-mode"
              style={{ fontSize: '0.95em', padding: '2px 10px' }}
              value={filterMode}
              onChange={handleFilterModeChange}
              aria-label="Filter Mode"
            >
              <option value="category">Filter by Category</option>
              <option value="region">Filter by Region</option>
            </select>
          </label>
          <label htmlFor="filter-type">
            <select
              id="filter-type"
              style={{ fontSize: '0.95em', padding: '2px 10px' }}
              value={filterType}
              onChange={handleFilterChange}
              aria-label="Place type or region"
            >
              <option value="All">All</option>
              {(filterMode === "category" ? allCategories : allRegions).map(t =>
                <option key={t} value={t}>{t}</option>
              )}
            </select>
          </label>
        </form>

        {/* ---- Marker List (simulated) ---- */}
        <ul
          style={{
            marginTop: 8,
            marginBottom: 0,
            paddingLeft: '0',
            listStyle: 'none',
            display: 'flex',
            gap: '9px',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}
        >
          {filteredPlaces.map((place) => (
            <li
              key={place.id}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 116,
                minHeight: 68,
                margin: '4px',
                borderRadius: 8,
                background: (selectedPlaceId === place.id) ? '#FBBF24' : '#f1f2f7',
                color: (selectedPlaceId === place.id) ? "#23272e" : '#4B5563',
                fontWeight: selectedPlaceId === place.id ? 700 : 500,
                cursor: 'pointer',
                border: (popupPlaceId === place.id) ? '2.5px solid #FBBF24' : '1px solid #e5e7eb',
                boxShadow: (selectedPlaceId === place.id)
                  ? "0 3px 12px 0 rgba(251,191,36,0.12)"
                  : "0 1px 3px 0 rgba(0,0,0,0.03)"
              }}
              onClick={() => handleMarkerClick(place.id)}
              tabIndex={0}
              aria-label={`Select ${place.name}`}
              onKeyDown={e => { if (e.key === 'Enter') handleMarkerClick(place.id); }}
            >
              {/* Place "Marker" visual */}
              <div style={{
                width: 30, height: 30,
                borderRadius: "50%",
                background: (selectedPlaceId === place.id) ? "#FFF8E1" : "#FFF",
                border: '2.2px solid #FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
                marginTop: 4
              }}>
                <span role="img" aria-label="map marker">📍</span>
              </div>
              <span style={{ fontSize: '0.96em', textAlign: 'center' }}>
                {place.name.split(',')[0]} {/* Show short name */}
              </span>
              <span style={{
                fontSize: '0.71em',
                color: "#9CA3AF",
                marginTop: 1,
                fontWeight: 400
              }}>
                {place.category || place.region}
              </span>
            </li>
          ))}
        </ul>

        {/* ---- Marker Info Popup ---- */}
        {popupPlaceId && (() => {
          const popupPlace = demoPlaces.find(p => p.id === popupPlaceId);
          if (!popupPlace) return null;
          return (
            <div style={{
              position: 'absolute',
              left: '54%',
              top: '26%',
              minWidth: 260,
              maxWidth: 300,
              zIndex: 12,
              borderRadius: 12,
              background: "#fff",
              boxShadow: '0 8px 32px 0 rgba(80,90,120,0.18)',
              padding: "20px 22px 16px 22px",
              border: "2.5px solid #FBBF24",
              color: '#23272e'
            }}>
              <button
                onClick={handleClosePopup}
                style={{
                  fontSize: "1.15em",
                  background: "none",
                  border: "none",
                  float: "right",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  marginTop: "-5px"
                }}
                aria-label="Close info popup"
                tabIndex={0}
              >×</button>
              <div style={{ marginBottom: 7, fontSize: "1.07em", fontWeight: 700 }}>
                {popupPlace.name}
                <span style={{
                  fontWeight: 500,
                  marginLeft: 9,
                  fontSize: "0.81em",
                  background: "#fbbf2420",
                  color: "#848585",
                  padding: "1px 8px",
                  borderRadius: "8px"
                }}>
                  {popupPlace.category}
                </span>
              </div>
              <div style={{ color: "#4B5563", marginBottom: 7, fontSize: "1em" }}>
                {popupPlace.trivia}
              </div>
              {popupPlace.books && popupPlace.books.length > 0 && (
                <div style={{ margin: '8px 0 8px 0' }}>
                  <div style={{ fontWeight: 500, marginBottom: 2, color: "#6B7280" }}>Books set here:</div>
                  <ul style={{ margin: 0, paddingLeft: '1em', fontSize: '0.98em', color: '#23272e' }}>
                    {popupPlace.books.map((b, idx) => (
                      <li key={idx}><em>{b.title}</em> <span style={{ color: "#AC7A25" }}>by</span> {b.author}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Add to bucket button */}
              <div style={{ marginTop: 8 }}>
                <button
                  className="btn"
                  onClick={() => onAddToBucket && onAddToBucket(popupPlace.id)}
                  style={{
                    opacity: bucketList.includes(popupPlace.id) ? 0.6 : 1,
                    background: bucketList.includes(popupPlace.id) ? "#9CA3AF" : undefined,
                    color: bucketList.includes(popupPlace.id) ? "#fff" : undefined,
                    fontSize: "1em",
                    padding: "4px 14px"
                  }}
                  disabled={bucketList.includes(popupPlace.id)}
                >
                  {bucketList.includes(popupPlace.id) ? "Already in Bucket" : "Add to Bucket"}
                </button>
                {selectedPlaceId !== popupPlace.id && (
                  <button
                    className="btn"
                    style={{
                      marginLeft: 10,
                      fontSize: "0.95em",
                      background: "#f1f2f7",
                      color: "#4B5563",
                      border: "1px solid #e5e7eb"
                    }}
                    onClick={() => {
                      if (onSelectPlace) onSelectPlace(popupPlace.id);
                      setPopupPlaceId(popupPlace.id);
                    }}
                  >Show Details</button>
                )}
              </div>
            </div>
          );
        })()}

        {/* ---- Legend/Hint ---- */}
        <div style={{ marginTop: 27, fontSize: '0.92em', color: '#9CA3AF', textAlign: 'center' }}>
          <span style={{ fontWeight: 500 }}>Legend:</span>
          <span style={{ marginLeft: 7 }}><span role="img" aria-label="pin">📍</span> = Place Marker</span>
          <br />
          <span>Click a marker for info, or use "Add to Bucket"!</span>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default MapPanel;

/**
 * Notes:
 * - In production, marker coordinates/Map API would be used instead of a "list".
 * - This file illustrates realistic interactive filtering, marker info, and bucket-list integration, ready for true API data.
 * - Future extension: Replace the simulated marker list with a geographic map (Leaflet, Google Maps, Mapbox, etc.).
 * - Optionally allow filter/search bar input above the map.
 */

