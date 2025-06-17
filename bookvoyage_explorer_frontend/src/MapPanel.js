import React, { useState } from "react";

/**
 * MapPanel Component (Live Data Version)
 *
 * PUBLIC_INTERFACE
 *
 * Shows clickable "markers" for places, lets user select a place,
 * displays info bubble on marker selection, and allows "add to bucket" action.
 * Accepts real API-driven places array.
 *
 * Receives props:
 *  - places: array of place objects { id, name, books, ... }
 *  - selectedPlaceId: id of currently selected place
 *  - onSelectPlace: handler for selecting a marker
 *  - onAddToBucket: handler for adding a place to user's bucket list
 *  - bucketList: array of place ids in bucket
 *  - isLoading: boolean for loading UI
 */
function MapPanel({
  places = [],
  selectedPlaceId,
  onSelectPlace,
  onAddToBucket,
  bucketList = [],
  isLoading = false
}) {
  // Local state: info popup for the selected marker
  const [popupPlaceId, setPopupPlaceId] = useState(null);

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

  // Handler: Clicking a marker
  function handleMarkerClick(placeId) {
    if (onSelectPlace) onSelectPlace(placeId);
    setPopupPlaceId(placeId);
  }
  // Handler: closing info popup
  function handleClosePopup() {
    setPopupPlaceId(null);
  }

  return (
    <div className="map-panel" style={{ position: "relative" }}>
      <div className="map-placeholder">
        <h3>Results Map</h3>
        <p>Click a place marker below to view trivia and books!</p>
        {/* Marker List - real places from search */}
        <ul
          style={{
            marginTop: 10,
            marginBottom: 0,
            paddingLeft: 0,
            listStyle: "none",
            display: "flex",
            gap: "9px",
            flexWrap: "wrap",
            justifyContent: "flex-start"
          }}
        >
          {places.map(place => (
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
              {/* Marker visual */}
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
                {place.name?.split(',')[0] || place.name}
              </span>
              <span style={{
                fontSize: '0.71em',
                color: "#9CA3AF",
                marginTop: 1,
                fontWeight: 400
              }}>
                {place.region || place.category || "Place"}
              </span>
            </li>
          ))}
        </ul>

        {/* ---- Marker Details Popup ---- */}
        {popupPlaceId && (() => {
          const popupPlace = places.find(p => p.id === popupPlaceId);
          if (!popupPlace) return null;
          return (
            <div style={{
              position: 'absolute',
              left: '54%',
              top: '22%',
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
              </div>
              {/* Optional cover (for book-driven results) */}
              {popupPlace.cover && (
                <img style={{ maxWidth: 80, borderRadius: 8, marginBottom: 8 }} src={popupPlace.cover} alt="Cover" />
              )}
              <div style={{ color: "#4B5563", marginBottom: 7, fontSize: "1em" }}>
                {popupPlace.description}
              </div>
              {popupPlace.books && popupPlace.books.length > 0 && (
                <div style={{ margin: '8px 0 8px 0' }}>
                  <div style={{ fontWeight: 500, marginBottom: 2, color: "#6B7280" }}>Books set here:</div>
                  <ul style={{ margin: 0, paddingLeft: '1em', fontSize: '0.98em', color: '#23272e' }}>
                    {popupPlace.books.map((b, idx) => (
                      <li key={idx} style={{marginBottom: 2}}>
                        {!!b.cover && (
                          <img src={b.cover} alt="cover" style={{ width: 18, height: 28, objectFit: "cover", borderRadius: 3, marginRight: 6, verticalAlign: "middle" }} />
                        )}
                        <em>{b.title}</em> <span style={{ color: "#AC7A25" }}>by</span> {b.author}
                        {b.link && (
                          <a href={b.link} target="_blank" rel="noopener noreferrer" className="link" style={{marginLeft: 4, fontSize: "1.01em"}}>🔗</a>
                        )}
                      </li>
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
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default MapPanel;
