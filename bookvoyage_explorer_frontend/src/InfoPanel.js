import React, { useState } from "react";

/**
 * InfoPanel Component
 *
 * PUBLIC_INTERFACE
 *
 * Displays trivia and information about a selected book, author, or place.
 * Enhanced: Supports multiple trivia entries, interactive navigation, clickable links, and book covers.
 * Receives "triviaInfo" (object, entry, or array), "selectedPlaceId".
 *
 * Expects each trivia entry in array/object to have: { title, summary, link?, cover?, books? }
 */
function parseTriviaEntries(triviaInfo) {
  // Accept: single object or array of objects for backward compatibility
  if (!triviaInfo) return [];
  if (Array.isArray(triviaInfo)) return triviaInfo;
  // If it's already in the new format (multi-entry), accept as such
  if (triviaInfo.entries && Array.isArray(triviaInfo.entries)) return triviaInfo.entries;
  // If it's just a single entry (original data model), wrap it in array
  if (triviaInfo.title || triviaInfo.summary || triviaInfo.books) return [triviaInfo];
  return [];
}

// PUBLIC_INTERFACE
function InfoPanel({ triviaInfo = {}, selectedPlaceId }) {
  const triviaEntries = parseTriviaEntries(triviaInfo);

  const [currentIdx, setCurrentIdx] = useState(0);

  // Handle navigation between trivia entries
  const handlePrev = () => setCurrentIdx((idx) => (idx > 0 ? idx - 1 : triviaEntries.length - 1));
  const handleNext = () => setCurrentIdx((idx) => (idx < triviaEntries.length - 1 ? idx + 1 : 0));

  let content = (
    <p>[Select a place to view info and book trivia!]</p>
  );
  if (selectedPlaceId && triviaEntries.length > 0) {
    const entry = triviaEntries[currentIdx] || {};
    content = (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <strong style={{ fontSize: "1.07em" }}>{entry.title}</strong>
          {/* If there is a link, add an external icon */}
          {entry.link && (
            <a href={entry.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.22em", color: "#FBBF24" }} title="Open info link">
              🔗
            </a>
          )}
        </div>
        {/* Book cover image or main image */}
        {entry.cover && (
          <div style={{
            margin: '7px 0',
            display: "flex",
            justifyContent: "center"
          }}>
            <img style={{ maxWidth: 90, maxHeight: 130, borderRadius: 8, boxShadow: "0 2px 8px #0002" }} src={entry.cover} alt={entry.title + " cover"} loading="lazy" />
          </div>
        )}
        <div style={{ margin: '7px 0 9px 0', lineHeight: 1.45 }}>
          {/* Attempt to auto linkify URLs in summary text */}
          {entry.summary && entry.summary.split(/((?:https?:\/\/|www\.)\S+)/g).map((part, i) => {
            if (/^(https?:\/\/|www\.)\S+/.test(part)) {
              const url = part.startsWith("http") ? part : "https://" + part;
              return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="link">{part}</a>;
            }
            return part;
          })}
        </div>
        {entry.books && Array.isArray(entry.books) && entry.books.length > 0 && (
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Book(s) Set Here:</div>
            <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: '1em' }}>
              {entry.books.map((b, idx) => (
                <li key={idx} style={{marginBottom: 3}}>
                  {/* Optionally, add cover thumbnail if provided */}
                  {b.cover && (
                    <img style={{ width: 22, height: 32, objectFit: "cover", borderRadius: 4, marginRight: 7, verticalAlign: "middle" }} src={b.cover} alt={b.title + " cover"} />
                  )}
                  <em>{b.title}</em> <span style={{ color: '#6B7280' }}>by</span> {b.author}
                  {b.link && (
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="link" style={{marginLeft: 4, fontSize: "1.01em"}}>🔗</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Navigation controls if multiple entries */}
        {triviaEntries.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", gap: 14, marginTop: 14 }}>
            <button className="btn" style={{
              padding: "5px 18px", background: "#FBBF24", color: "#23272e",
              fontWeight: 600, fontSize: "1em"
            }} onClick={handlePrev} title="Previous fact">&lt;</button>
            <span style={{
              fontSize: '0.97em', fontWeight: 500, color: "#9CA3AF"
            }}>{currentIdx + 1} / {triviaEntries.length}</span>
            <button className="btn" style={{
              padding: "5px 18px", background: "#FBBF24", color: "#23272e",
              fontWeight: 600, fontSize: "1em"
            }} onClick={handleNext} title="Next fact">&gt;</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="sidebar">
      <h2>Trivia & Info</h2>
      <div className="sidebar-content">
        {content}
      </div>
    </aside>
  );
}

export default InfoPanel;
