import React from "react";

/**
 * InfoPanel Component
 *
 * PUBLIC_INTERFACE
 *
 * Displays trivia and information about a selected book, author, or place.
 * Receives "triviaInfo" (object with keys: title, summary, books), "selectedPlaceId".
 */
function InfoPanel({ triviaInfo = {}, selectedPlaceId }) {
  return (
    <aside className="sidebar">
      <h2>Trivia & Info</h2>
      <div className="sidebar-content">
        {selectedPlaceId ? (
          <>
            <strong>{triviaInfo.title}</strong>
            <div style={{ margin: '7px 0 9px 0' }}>
              {triviaInfo.summary}
            </div>
            {triviaInfo.books && Array.isArray(triviaInfo.books) && triviaInfo.books.length > 0 && (
              <>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Book(s) Set Here:</div>
                <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: '1em' }}>
                  {triviaInfo.books.map((b, idx) => (
                    <li key={idx}><em>{b.title}</em> <span style={{ color: '#6B7280' }}>by</span> {b.author}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <p>[Select a place to view info and book trivia!]</p>
        )}
      </div>
    </aside>
  );
}

export default InfoPanel;
