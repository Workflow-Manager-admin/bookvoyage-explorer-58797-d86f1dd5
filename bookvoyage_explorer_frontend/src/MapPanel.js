import React, { useState } from "react";

/**
 * MapPanel Component (Enhanced Version)
 *
 * PUBLIC_INTERFACE
 *
 * Shows clickable and hoverable "markers" for places, allows selection, marker hover previews,
 * info popup with links/images, and category filters. All map filter state synchronizes through props and callbacks as needed.
 *
 * Receives props:
 *  - places: array of place objects { id, name, books, ... }
 *  - selectedPlaceId: id of currently selected place
 *  - onSelectPlace: handler for selecting a marker
 *  - onAddToBucket: handler for adding a place to user's bucket list
 *  - bucketList: array of place ids in bucket
 *  - isLoading: boolean for loading UI
 *  - onSetCategoryFilters: callback for category filter changes
 *  - categoryFilters: array of current filter values (optional)
 */
function MapPanel({
  places = [],
  selectedPlaceId,
  onSelectPlace,
  onAddToBucket,
  bucketList = [],
  isLoading = false,
  onSetCategoryFilters,
  categoryFilters, // Array of category strings (optional)
}) {
  // Info popup state (for click). Hover preview state (for mouse-over only).
  const [popupPlaceId, setPopupPlaceId] = useState(null);
  const [hoverPlaceId, setHoverPlaceId] = useState(null);

  // ---- Category Filter Setup ----
  // Collect unique categories and regions
  const allCategories = Array.from(
    new Set(
      places
        .map((p) => (p.category ? p.category : null))
        .filter(Boolean)
    )
  );
  const allRegions = Array.from(
    new Set(
      places
        .map((p) => (p.region ? p.region : null))
        .filter(Boolean)
    )
  );
  // Filter state (if not up to parent), fallback to local state
  const [localCategoryFilters, setLocalCategoryFilters] = useState([]);
  const effectiveCategoryFilters = categoryFilters || localCategoryFilters;

  // Filtering: which markers are visible?
  let visiblePlaces = places;
  if (effectiveCategoryFilters.length > 0) {
    visiblePlaces = visiblePlaces.filter(
      (p) =>
        (p.category && effectiveCategoryFilters.includes(p.category)) ||
        (p.region && effectiveCategoryFilters.includes(p.region))
    );
  }

  // ---- Marker Hover Handlers ----
  function handleMarkerMouseEnter(placeId) {
    setHoverPlaceId(placeId);
  }
  function handleMarkerMouseLeave() {
    setHoverPlaceId(null);
  }
  // Handler: Clicking a marker
  function handleMarkerClick(placeId) {
    if (onSelectPlace) onSelectPlace(placeId);
    setPopupPlaceId(placeId);
    setHoverPlaceId(null);
  }
  // Handler: closing info popup
  function handleClosePopup() {
    setPopupPlaceId(null);
  }

  // Handler: category filter toggles
  function toggleCategoryFilter(cat) {
    let newFilters = [];
    if (effectiveCategoryFilters.includes(cat)) {
      newFilters = effectiveCategoryFilters.filter((x) => x !== cat);
    } else {
      newFilters = [...effectiveCategoryFilters, cat];
    }
    if (onSetCategoryFilters) onSetCategoryFilters(newFilters);
    else setLocalCategoryFilters(newFilters);
  }

  // No search results/loading → Show loading or empty state
  if (isLoading) {
    return (
      <div className="map-panel" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="map-placeholder">
          <h3>Loading...</h3>
          <p>Fetching live places/books…</p>
        </div>
      </div>
    );
  }
  if (!places?.length) {
    return (
      <div className="map-panel" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="map-placeholder">
          <h3>No Places</h3>
          <p>No results found. Please search for a place or book above.</p>
        </div>
      </div>
    );
  }

  // ---- Category/Region Filters UI ----
  const filtersDisplay = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 10, marginTop: 4, justifyContent: "flex-start" }}>
      {(allCategories.length > 0 || allRegions.length > 0) && (
        <>
          {allCategories.map((cat) => (
            <button
              key={`cat_${cat}`}
              style={{
                padding: "4.5px 15px",
                borderRadius: 19,
                border: "1.5px solid #FBBF24",
                fontSize: "0.92em",
                background: effectiveCategoryFilters.includes(cat) ? "#FBBF24" : "#FFF8E1",
                color: effectiveCategoryFilters.includes(cat) ? "#23272e" : "#AC7A25",
                marginRight: 3,
                fontWeight: effectiveCategoryFilters.includes(cat) ? 700 : 500,
                cursor: "pointer",
                outline: "none"
              }}
              onClick={() => toggleCategoryFilter(cat)}
              aria-pressed={effectiveCategoryFilters.includes(cat)}
            >
              {cat}
            </button>
          ))}
          {allRegions.map((r) => (
            <button
              key={`region_${r}`}
              style={{
                padding: "4.5px 14px",
                borderRadius: 19,
                border: "1.5px solid #AC7A25",
                fontSize: "0.9em",
                background: effectiveCategoryFilters.includes(r) ? "#FFF8E1" : "#FFF",
                color: effectiveCategoryFilters.includes(r) ? "#4B5563" : "#AC7A25",
                marginRight: 3,
                fontWeight: effectiveCategoryFilters.includes(r) ? 700 : 500,
                cursor: "pointer"
              }}
              onClick={() => toggleCategoryFilter(r)}
              aria-pressed={effectiveCategoryFilters.includes(r)}
            >
              {r}
            </button>
          ))}
          {(allCategories.length === 0 && allRegions.length === 0) && <span>No categories/regions</span>}
        </>
      )}
      {(allCategories.length > 0 || allRegions.length > 0) && (
        <button
          style={{
            marginLeft: 6,
            fontSize: "0.87em",
            color: "#9CA3AF",
            border: "none",
            background: "none",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => {
            if (onSetCategoryFilters) onSetCategoryFilters([]);
            else setLocalCategoryFilters([]);
          }}
          tabIndex={0}
        >Clear filters</button>
      )}
    </div>
  );

  // ---- UI Render ----
  return (
    <div className="map-panel" style={{ position: "relative" }}>
      <div className="map-placeholder">
        <h3>Results Map</h3>
        <p>
          Hover <span role="img" aria-label="hand">👆</span> or click a marker below to preview trivia and books!
        </p>
        {filtersDisplay}
        {/* Marker List - real places from search */}
        <ul
          style={{
            marginTop: 2,
            marginBottom: 0,
            paddingLeft: 0,
            listStyle: "none",
            display: "flex",
            gap: "11px",
            flexWrap: "wrap",
            justifyContent: "flex-start"
          }}
        >
          {visiblePlaces.map((place) => (
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
                background: (selectedPlaceId === place.id) ? '#FBBF24'
                  : hoverPlaceId === place.id ? "#FFF8E1"
                  : '#f1f2f7',
                color: (selectedPlaceId === place.id) ? "#23272e" : '#4B5563',
                fontWeight: selectedPlaceId === place.id ? 700 : 500,
                cursor: 'pointer',
                border: (popupPlaceId === place.id) ? '2.7px solid #FBBF24' : hoverPlaceId === place.id ? '2px solid #AC7A25' : '1px solid #e5e7eb',
                boxShadow: (selectedPlaceId === place.id)
                  ? "0 3px 14px 0 rgba(251,191,36,0.16)"
                  : hoverPlaceId === place.id
                    ? "0 1px 6px 0 rgba(80,90,120,0.11)"
                    : "0 1px 3px 0 rgba(0,0,0,0.03)"
              }}
              onClick={() => handleMarkerClick(place.id)}
              onMouseEnter={() => handleMarkerMouseEnter(place.id)}
              onMouseLeave={handleMarkerMouseLeave}
              tabIndex={0}
              aria-label={`Select ${place.name}`}
              onKeyDown={e => { if (e.key === 'Enter') handleMarkerClick(place.id); }}
            >
              {/* Marker visual + hover preview */}
              <div style={{
                width: 30, height: 30,
                borderRadius: "50%",
                background: (selectedPlaceId === place.id) ? "#FFF8E1"
                  : hoverPlaceId === place.id ? "#FBBF24" : "#FFF",
                border: '2.2px solid #FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
                marginTop: 4,
                transition: "background 0.18s, border 0.2s"
              }}>
                <span role="img" aria-label="map marker">📍</span>
              </div>
              <span style={{
                fontSize: '0.96em', textAlign: 'center',
                textDecoration: hoverPlaceId === place.id ? "underline" : "none"
              }}>
                {place.name?.split(',')[0] || place.name}
              </span>
              <span style={{
                fontSize: '0.7em',
                color: "#9CA3AF",
                marginTop: 1,
                fontWeight: 400
              }}>
                {place.region || place.category || "Place"}
              </span>
              {/* Hover preview shows over marker */}
              {hoverPlaceId === place.id && place.books && place.books.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: -56,
                  left: -10,
                  zIndex: 100,
                  background: "#fff",
                  border: "2px solid #FBBF24",
                  borderRadius: 7,
                  padding: "6px 13px",
                  minWidth: 170,
                  maxWidth: 210,
                  boxShadow: "0 2px 12px #FBBF241C",
                  fontSize: "0.99em"
                }}>
                  <strong>{place.name}</strong>
                  <div style={{ margin: "6px 0 2px 0" }}>
                    {place.books[0].title} <span style={{ color: "#AC7A25" }}>by</span> {place.books[0].author}
                  </div>
                  {place.books[0].cover && (
                    <img src={place.books[0].cover} alt="cover" style={{
                      width: 38, height: 55, objectFit: "cover", borderRadius: 4, marginTop: 2, marginBottom: 2
                    }} />
                  )}
                  <div>
                    <a href={place.books[0].link} className="link" style={{ fontSize: "0.91em" }} target="_blank" rel="noopener noreferrer">Book link</a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* ---- Marker Details Popup ---- */}
        {popupPlaceId && (() => {
          const popupPlace = places.find((p) => p.id === popupPlaceId);
          if (!popupPlace) return null;
          return (
            <div style={{
              position: 'absolute',
              left: '54%',
              top: '22%',
              minWidth: 270,
              maxWidth: 320,
              zIndex: 33,
              borderRadius: 13,
              background: "#fff",
              boxShadow: '0 8px 32px 0 rgba(80,90,120,0.18)',
              padding: "23px 27px 19px 24px",
              border: "2.5px solid #FBBF24",
              color: '#23272e'
            }}>
              <button
                onClick={handleClosePopup}
                style={{
                  fontSize: "1.18em",
                  background: "none",
                  border: "none",
                  float: "right",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  marginTop: "-6px"
                }}
                aria-label="Close info popup"
                tabIndex={0}
              >×</button>
              <div style={{ marginBottom: 7, fontSize: "1.11em", fontWeight: 700 }}>
                {popupPlace.name}
              </div>
              {/* Optional cover (for book-driven results) */}
              {popupPlace.cover && (
                <img style={{ maxWidth: 106, borderRadius: 8, marginBottom: 9 }} src={popupPlace.cover} alt="Cover" />
              )}
              <div style={{ color: "#4B5563", marginBottom: 8, fontSize: "1em" }}>
                {popupPlace.description}
              </div>
              {popupPlace.books && popupPlace.books.length > 0 && (
                <div style={{ margin: '10px 0 7px 0' }}>
                  <div style={{ fontWeight: 500, marginBottom: 3, color: "#6B7280" }}>Books set here:</div>
                  <ul style={{ margin: 0, paddingLeft: '1em', fontSize: '0.98em', color: '#23272e' }}>
                    {popupPlace.books.map((b, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {!!b.cover && (
                          <img src={b.cover} alt="cover" style={{ width: 22, height: 32, objectFit: "cover", borderRadius: 3, marginRight: 7, verticalAlign: "middle" }} />
                        )}
                        <em>{b.title}</em> <span style={{ color: "#AC7A25" }}>by</span> {b.author}
                        {b.link && (
                          <a href={b.link} target="_blank" rel="noopener noreferrer" className="link" style={{ marginLeft: 5, fontSize: "1.01em" }}>🔗</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Add to bucket button */}
              <div style={{ marginTop: 14 }}>
                <button
                  className="btn"
                  onClick={() => onAddToBucket && onAddToBucket(popupPlace.id)}
                  style={{
                    opacity: bucketList.includes(popupPlace.id) ? 0.6 : 1,
                    background: bucketList.includes(popupPlace.id) ? "#9CA3AF" : "#FBBF24",
                    color: bucketList.includes(popupPlace.id) ? "#fff" : "#23272e",
                    fontSize: "1em",
                    padding: "6px 18px"
                  }}
                  disabled={bucketList.includes(popupPlace.id)}
                >
                  {bucketList.includes(popupPlace.id) ? "Already in Bucket" : "Add to Bucket"}
                </button>
                {selectedPlaceId !== popupPlace.id && (
                  <button
                    className="btn"
                    style={{
                      marginLeft: 14,
                      fontSize: "0.99em",
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
        <div style={{ marginTop: 24, fontSize: '0.92em', color: '#9CA3AF', textAlign: 'center' }}>
          <span style={{ fontWeight: 500 }}>Legend:</span>
          <span style={{ marginLeft: 7 }}><span role="img" aria-label="pin">📍</span> = Place Marker</span>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default MapPanel;
