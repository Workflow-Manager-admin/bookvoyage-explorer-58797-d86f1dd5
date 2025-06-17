import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import MapPanel from './MapPanel';
import InfoPanel from './InfoPanel';
import SearchBar from './SearchBar';
import BucketList from './BucketList';
import {
  fetchBooksFromGoogle,
  fetchWikipediaSummary,
  fetchBooksByAuthor,
  fetchBooksByPlace,
} from "./api";

/**
 * BookVoyage Explorer - Refactored for Live Async Data
 * 
 * - All data flows (places, trivia/info, search, bucket list) use api.js with async responses
 * - State includes loading & error states for all async operations
 * - Removes demo/static/mock data
 * - Core UI handlers and flows updated for live API state
 */
function App() {
  const [searchType, setSearchType] = useState("place");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [triviaInfo, setTriviaInfo] = useState(null);
  const [triviaLoading, setTriviaLoading] = useState(false);
  const [triviaError, setTriviaError] = useState("");

  const [bucketList, setBucketList] = useState([]); // array of {id, note}

  // Helper: forcibly get latest place obj from either searchResults or bucketList
  const findPlaceById = useCallback(
    (id) =>
      searchResults.find((p) => p.id === id) ||
      bucketList.find((item) => item.id === id) ||
      null,
    [searchResults, bucketList]
  );

  // PUBLIC_INTERFACE
  // Search for books, authors, or places using API (removes static fallback)
  const handleSearch = useCallback(
    async (term, type) => {
      setSearchError("");
      setSearchLoading(true);
      setQuery(term);
      setSearchType(type);
      setSearchResults([]);
      setSelectedPlaceId(null);
      setTriviaInfo(null);
      setTriviaError("");

      try {
        let results = [];
        if (type === "book") {
          const data = await fetchBooksFromGoogle(term, { maxResults: 10 });
          if (data.error) throw new Error(data.error);
          results = (data.items || []).map(item => ({
            id: item.id,
            name: item.volumeInfo?.title || "Unknown Title",
            author: item.volumeInfo?.authors?.[0] || "",
            description: item.volumeInfo?.description,
            cover: item.volumeInfo?.imageLinks?.thumbnail,
            googleInfo: item
          }));
        } else if (type === "author") {
          const data = await fetchBooksByAuthor(term, { maxResults: 10 });
          if (data.error) throw new Error(data.error);
          results = (data.items || []).map(item => ({
            id: item.id,
            name: item.volumeInfo?.title || "Unknown Title",
            author: item.volumeInfo?.authors?.[0] || "",
            description: item.volumeInfo?.description,
            cover: item.volumeInfo?.imageLinks?.thumbnail,
            googleInfo: item
          }));
        } else {
          const data = await fetchBooksByPlace(term, { maxResults: 7 });
          if (data.error) throw new Error(data.error);
          results = [
            {
              id: term.toLowerCase().replace(/\s+/g, "_"),
              name: term,
              books: (data.items || []).map(item => ({
                title: item.volumeInfo?.title || "Unknown Title",
                author: item.volumeInfo?.authors?.[0] || "",
                cover: item.volumeInfo?.imageLinks?.thumbnail,
                link: item.volumeInfo?.infoLink,
              })),
            },
          ];
        }
        setSearchResults(results);
        // Do NOT auto-select any place on search!
        setSelectedPlaceId(null);
        setSelectedPlace(null);
      } catch (err) {
        setSearchError(err?.message || "Unknown error during search.");
      }
      setSearchLoading(false);
    },
    [setSearchType, setQuery, setSearchResults, setSelectedPlaceId, setSelectedPlace, setSearchError, setSearchLoading]
  );

  // PUBLIC_INTERFACE
  // Optional: If you want to load initial data without auto-selecting, you can trigger a blank state or leave empty.
  // On app load, do NOT trigger any search or default assignment of place/trivia. All selections remain null until user interacts.
  // useEffect intentionally left blank.

  // useEffect(() => {
  //   (async () => {
  //     // No-op for first load: no search or auto-selection!
  //   })();
  //   // eslint-disable-next-line
  // }, []);

  // PUBLIC_INTERFACE
  // Select a place/book/author and retrieve live trivia/info
  const handleSelectPlace = useCallback(
    async (placeId) => {
      const place = findPlaceById(placeId);
      setSelectedPlaceId(placeId);
      setSelectedPlace(place);

      setTriviaLoading(true);
      setTriviaError("");
      setTriviaInfo(null);

      try {
        const title = place?.name || "";
        const wikiData = await fetchWikipediaSummary(title);
        setTriviaInfo({
          entries: [
            {
              title: wikiData.title || title,
              summary: wikiData.summary || "",
              link: wikiData.url,
              cover: wikiData.thumbnail,
              books: place?.books
            },
          ],
        });
      } catch (err) {
        setTriviaError(err?.message || "Unable to fetch trivia for this place.");
        setTriviaInfo({ entries: [] });
      }
      setTriviaLoading(false);
    },
    [findPlaceById, setSelectedPlace, setTriviaLoading, setTriviaError, setTriviaInfo]
  );

  // PUBLIC_INTERFACE
  function handleAddToBucket(placeId) {
    setBucketList(prev => {
      const norm = Array.isArray(prev)
        ? typeof prev[0] === "object"
          ? prev
          : prev.map((id) => ({ id, note: "" }))
        : [];
      if (norm.some(item => item.id === placeId)) return norm;
      return [...norm, { id: placeId, note: "" }];
    });
  }
  // PUBLIC_INTERFACE
  function handleRemoveFromBucket(placeId) {
    setBucketList(prev => {
      const norm = Array.isArray(prev)
        ? typeof prev[0] === "object"
          ? prev
          : prev.map((id) => ({ id, note: "" }))
        : [];
      return norm.filter(item => item.id !== placeId);
    });
  }
  // PUBLIC_INTERFACE
  function handleReorderBucketList(newList) {
    setBucketList(newList);
  }
  // PUBLIC_INTERFACE
  function handleUpdateNote(placeId, note) {
    setBucketList(prev =>
      prev.map((item) =>
        item.id === placeId ? { ...item, note } : item
      )
    );
  }

  // Whenever user selects a new place, fetch new trivia/info asynchronously
  useEffect(() => {
    if (!selectedPlaceId) return;
    handleSelectPlace(selectedPlaceId);
    // eslint-disable-next-line
  }, [selectedPlaceId]);

  // Only show places in map/bucket picker if result type is "place"
  const placesForMap = searchType === "place" ? searchResults : [];

  // -- MapPanel filter state (interactive map/category filters sync) --
  const [categoryFilters, setCategoryFilters] = useState([]);
  // New: Marker hover/preview state for MapPanel and cross-panel sync
  const [previewPlaceId, setPreviewPlaceId] = useState(null);

  // Helper: propagate hover state to InfoPanel, MapPanel, BucketList if needed
  const handleMarkerPreview = useCallback((placeId) => {
    setPreviewPlaceId(placeId);
  }, []);

  // [Tight state sync note]
  // Show marker preview in InfoPanel if previewPlaceId is set, otherwise show selectedPlaceId;
  // Always show selectedPlaceId for full selection/book/fact info.
  // BucketList draws from current places and bucket state as before.

  // --- UI Render ---
  return (
    <div className="app">
      <nav
        className="navbar"
        style={{
          color: '#4b5563',
          backgroundColor: '#0d1301'
        }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            color: '#4b5563',
            backgroundColor: '#0be4f4'
          }}>
            <div className="logo">
              <span className="logo-symbol" role="img" aria-label="Book icon">📚</span>
              BookVoyage Explorer
            </div>
            <button className="btn" disabled>Login (placeholder)</button>
          </div>
        </div>
      </nav>
      <div className="main-content">
        <InfoPanel
          triviaInfo={
            // If nothing is previewed or selected, show neutral/empty state.
            previewPlaceId &&
            placesForMap.find((p) => p.id === previewPlaceId)
              ? {
                  entries: [
                    // Compose a lightweight preview for InfoPanel:
                    (() => {
                      const p = placesForMap.find((x) => x.id === previewPlaceId);
                      return {
                        title: p.name,
                        summary: p.books && p.books.length > 0 ? `"${p.books[0].title}" by ${p.books[0].author}` : "",
                        cover: (p.books && p.books[0] && p.books[0].cover) || p.cover || undefined,
                        link: (p.books && p.books[0] && p.books[0].link) || undefined
                      }
                    })()
                  ]
                }
              // else, use selected/loaded state only if selectedPlaceId
              : (triviaLoading && selectedPlaceId
                  ? { entries: [{ title: 'Loading...', summary: 'Fetching live info...' }] }
                  : triviaError && selectedPlaceId
                    ? { entries: [{ title: 'Error', summary: triviaError }] }
                    : (selectedPlaceId ? triviaInfo : undefined))
          }
          selectedPlaceId={previewPlaceId || selectedPlaceId}
        />
        <section className="explorer-panel">
          <SearchBar
            onSearch={handleSearch}
            isLoading={searchLoading}
            error={searchError}
            initialType={searchType}
            initialQuery={query}
          />
          <div className="map-and-bucket">
            <MapPanel
              places={placesForMap}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={id => setSelectedPlaceId(id)}
              onAddToBucket={handleAddToBucket}
              bucketList={bucketList.map(x => x.id)}
              isLoading={searchLoading}
              categoryFilters={categoryFilters}
              onSetCategoryFilters={setCategoryFilters}
              // --- New handlers for preview state/hover sync:
              onPreviewPlace={handleMarkerPreview}
              previewPlaceId={previewPlaceId}
            />
            <BucketList
              places={placesForMap}
              bucketList={bucketList}
              onRemoveFromBucket={handleRemoveFromBucket}
              onUpdateBucketListReorder={handleReorderBucketList}
              onUpdateNote={handleUpdateNote}
            />
          </div>
          {searchLoading && (
            <div style={{
              color: "#4B5563", fontWeight: 500, margin: "14px auto 0 auto", textAlign: "center"
            }}>
              Searching for {searchType === "book" ? "books" : searchType === "author" ? "authors" : "places"}&hellip;
            </div>
          )}
          {searchError && (
            <div style={{
              color: "red",
              fontWeight: 500,
              margin: "14px auto 0 auto",
              textAlign: "center"
            }}>{searchError}</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
