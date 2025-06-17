import React, { useState, useEffect } from 'react';
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
 * BookVoyage Explorer - Main Live Data Implementation
 * 
 * Connects all feature components to real API data.
 * - All sample/mock state is removed
 * - State is updated asynchronously as the user searches/acts
 * - UI shows loading/error indicators as appropriate
 * - All trivia and result panels display true API-based results
 */
function App() {
  // ------ STATE ------
  // Query/search term for books/authors/places (set by SearchBar)
  const [searchType, setSearchType] = useState("place"); // "book", "author", "place"
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // books, authors, or places (depending on searchType)
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Detailed info for the currently selected place (or author/book)
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null); // {id, name, ...}
  const [triviaInfo, setTriviaInfo] = useState(null); // {entries: [...]}
  const [triviaLoading, setTriviaLoading] = useState(false);
  const [triviaError, setTriviaError] = useState("");

  // Bucket list as array of {id, note} ("placeId", note)
  const [bucketList, setBucketList] = useState([]);

  // --- Default: No results yet ---
  // On first load, show a starter search for "Paris"
  useEffect(() => {
    handleInitialDemoLoad();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  // Search handler: Fetches data from live APIs depending on type (book, author, place)
  async function handleSearch(term, type) {
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
        // Search for books by title/keyword
        const data = await fetchBooksFromGoogle(term, { maxResults: 10 });
        if (data.error) throw new Error(data.error);
        results = (data.items || []).map(item => ({
          id: item.id,
          name: item.volumeInfo?.title || "Unknown Title",
          author: (item.volumeInfo?.authors?.[0]) || "",
          description: item.volumeInfo?.description,
          cover: item.volumeInfo?.imageLinks?.thumbnail,
          googleInfo: item
        }));
      } else if (type === "author") {
        // Search for books by the given author
        const data = await fetchBooksByAuthor(term, { maxResults: 10 });
        if (data.error) throw new Error(data.error);
        results = (data.items || []).map(item => ({
          id: item.id,
          name: item.volumeInfo?.title || "Unknown Title",
          author: (item.volumeInfo?.authors?.[0]) || "",
          description: item.volumeInfo?.description,
          cover: item.volumeInfo?.imageLinks?.thumbnail,
          googleInfo: item
        }));
      } else {
        // type === "place" - show books + trivia about a place
        // We'll search for books set in this place
        const data = await fetchBooksByPlace(term, { maxResults: 7 });
        if (data.error) throw new Error(data.error);
        // Unlike demo, here each 'place' will be just one: what the user searched for
        results = [{
          id: term.toLowerCase().replace(/\s+/g, "_"),
          name: term,
          books: (data.items || []).map(item => ({
            title: item.volumeInfo?.title || "Unknown Title",
            author: (item.volumeInfo?.authors?.[0]) || "",
            cover: item.volumeInfo?.imageLinks?.thumbnail,
            link: item.volumeInfo?.infoLink
          })),
        }];
      }
      setSearchResults(results);
      // By default, select the first result/place (for info panel)
      if (results[0]) {
        setSelectedPlaceId(results[0].id);
        setSelectedPlace(results[0]);
      } else {
        setSelectedPlaceId(null);
        setSelectedPlace(null);
      }
    } catch (err) {
      setSearchError(err?.message || "Unknown error during search.");
    }
    setSearchLoading(false);
  }

  // PUBLIC_INTERFACE
  // Initial demo load: show "Paris" books and trivia
  async function handleInitialDemoLoad() {
    setQuery("Paris");
    setSearchType("place");
    await handleSearch("Paris", "place");
  }

  // PUBLIC_INTERFACE
  // Handler for selecting a place (or book/author result) - fetch trivia/info
  async function handleSelectPlace(placeId) {
    let place = searchResults.find(p => p.id === placeId);
    if (!place && bucketList.some(item => item.id === placeId)) {
      // Try to get from bucket list (if user clicks from there)
      place = bucketList.find(item => item.id === placeId);
    }
    setSelectedPlaceId(placeId);
    setSelectedPlace(place);

    // Fetch Wikipedia summary for this place (or author/book)
    setTriviaLoading(true);
    setTriviaError("");
    setTriviaInfo(null);
    const title = place?.name || "";
    let entries = [];
    try {
      // Always try to get Wikipedia summary
      const wikiData = await fetchWikipediaSummary(title);
      entries.push({
        title: wikiData.title || title,
        summary: wikiData.summary || "",
        link: wikiData.url,
        cover: wikiData.thumbnail,
        books: place?.books
      });
      // Show books only if present for this place (if not, omit)
      setTriviaInfo({ entries });
    } catch (err) {
      setTriviaError(err?.message || "Unable to fetch trivia for this place.");
      setTriviaInfo({ entries: [] });
    }
    setTriviaLoading(false);
  }

  // PUBLIC_INTERFACE
  // Add a place to the bucket list (de-duplicate by id)
  function handleAddToBucket(placeId) {
    setBucketList((prev) => {
      const items = Array.isArray(prev) ? (typeof prev[0] === "object" ? prev : prev.map(id => ({ id, note: "" }))) : [];
      if (items.some(item => item.id === placeId)) return items;
      return [...items, { id: placeId, note: "" }];
    });
  }

  // PUBLIC_INTERFACE
  // Remove a place from the bucket list
  function handleRemoveFromBucket(placeId) {
    setBucketList((prev) => {
      const items = Array.isArray(prev) ? (typeof prev[0] === "object" ? prev : prev.map(id => ({ id, note: "" }))) : [];
      return items.filter(item => item.id !== placeId);
    });
  }

  // PUBLIC_INTERFACE
  // Handler to reorder bucket list items (list is array of { id, note })
  function handleReorderBucketList(newList) {
    setBucketList(newList);
  }

  // PUBLIC_INTERFACE
  // Handler to update note per place in bucket
  function handleUpdateNote(placeId, note) {
    setBucketList((prev) =>
      prev.map((item) =>
        item.id === placeId ? { ...item, note } : item
      )
    );
  }

  // When user selects different place or result from Map or search results, update info
  useEffect(() => {
    if (selectedPlaceId && searchResults.length > 0) {
      handleSelectPlace(selectedPlaceId);
    }
    // eslint-disable-next-line
  }, [selectedPlaceId]);

  // UI props for MapPanel/BucketList - show results as 'places'
  const placesForMap = searchType === "place" ? searchResults : [];

  // --- Render Main UI ---
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
        {/* Sidebar Trivia/Info */}
        <InfoPanel
          triviaInfo={triviaLoading && selectedPlaceId ? {entries:[{title: 'Loading...', summary: 'Fetching live info...'}]} : triviaError && selectedPlaceId ? {entries:[{title:'Error', summary:triviaError}]} : triviaInfo}
          selectedPlaceId={selectedPlaceId}
        />

        <section className="explorer-panel">
          <SearchBar
            onSearch={handleSearch}
            isLoading={searchLoading}
            error={searchError}
            initialType={searchType}
            initialQuery={query}
          />
          {/* Display list/map of results only after search */}
          <div className="map-and-bucket">
            <MapPanel
              places={placesForMap}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={id => setSelectedPlaceId(id)}
              onAddToBucket={handleAddToBucket}
              bucketList={bucketList.map(x => x.id)}
              isLoading={searchLoading}
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
            }}>Searching for {searchType === "book" ? "books" : searchType === "author" ? "authors" : "places"}&hellip;</div>
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
