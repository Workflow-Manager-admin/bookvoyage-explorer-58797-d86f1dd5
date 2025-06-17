import React from "react";

/**
 * MapPanel Component (Demo/mock)
 *
 * PUBLIC_INTERFACE
 *
 * Shows mock clickable places. Lets the user select a place and "add to bucket".
 * Receives: places, selectedPlaceId, onSelectPlace, onAddToBucket, bucketList
 */
function MapPanel({
  places = [],
  selectedPlaceId,
  onSelectPlace,
  onAddToBucket,
  bucketList = []
}) {
  return (
    <div className="map-panel">
      <div className="map-placeholder">
        <h3>Interactive Map</h3>
        <p>
          [MapPanel - Click a place below to "select" it, or add to your bucket list!]
        </p>
        {places && places.length > 0 && (
          <ul style={{ marginTop: 18, marginBottom: 0, paddingLeft: '1.1em', listStyle: 'disc' }}>
            {places.map((place) => (
              <li
                key={place.id}
                style={{
                  marginBottom: 12,
                  fontWeight: selectedPlaceId === place.id ? 700 : 400,
                  color: selectedPlaceId === place.id ? "#FBBF24" : undefined,
                  cursor: 'pointer',
                  background: selectedPlaceId === place.id ? '#FFF8E1' : 'none',
                  borderRadius: '4px',
                  padding: '2px 7px'
                }}
                onClick={() => onSelectPlace && onSelectPlace(place.id)}
              >
                <span>{place.name}</span>
                <button
                  className="btn"
                  style={{
                    marginLeft: 14,
                    fontSize: '0.88em',
                    padding: '2px 12px',
                    background: bucketList.includes(place.id) ? "#9CA3AF" : undefined,
                    color: bucketList.includes(place.id) ? "#fff" : undefined,
                    opacity: bucketList.includes(place.id) ? 0.7 : 1,
                  }}
                  disabled={bucketList.includes(place.id)}
                  onClick={e => {
                    e.stopPropagation();
                    onAddToBucket && onAddToBucket(place.id);
                  }}
                >
                  {bucketList.includes(place.id) ? 'Added' : 'Add to Bucket'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MapPanel;
