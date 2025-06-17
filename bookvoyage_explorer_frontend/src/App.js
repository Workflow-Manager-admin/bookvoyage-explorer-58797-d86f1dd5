import React, { useState, useEffect } from 'react';
import './App.css';

import MapPanel from './MapPanel';
import InfoPanel from './InfoPanel';
import SearchBar from './SearchBar';
import BucketList from './BucketList';
import { fetchBooksFromGoogle, fetchWikipediaSummary } from "./api";

/**
 * BookVoyage Explorer - Stateful Demo Container
 * 
 * Handles mock state for places, map selection, bucket list, and trivia/info panels.
 * Passes relevant state and handlers to stub UI components for demo interactivity.
 */
function App() {
  // Sample mock places for demo - in the future this would come from map API/book API
  const MOCK_PLACES = [
    {
      id: 'paris',
      name: 'Paris, France',
      trivia: "Known as the City of Light, famous for the Eiffel Tower.",
      books: [
        { title: "The Hunchback of Notre-Dame", author: "Victor Hugo" },
        { title: "Paris to the Moon", author: "Adam Gopnik" }
      ]
    },
    {
      id: 'london',
      name: 'London, UK',
      trivia: "Home of Big Ben, the British Museum, and Sherlock Holmes.",
      books: [
        { title: "Neverwhere", author: "Neil Gaiman" },
        { title: "Oliver Twist", author: "Charles Dickens" }
      ]
    },
    {
      id: 'kyoto',
      name: 'Kyoto, Japan',
      trivia: "Ancient capital, famous for temples and cherry blossoms.",
      books: [
        { title: "Memoirs of a Geisha", author: "Arthur Golden" }
      ]
    }
  ];

  // STATE
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // id of the place selected on map
  // Bucket list now stores array of {id, note} objects for each place in order
  const [bucketList, setBucketList] = useState([]); // array of { id, note }
  const [triviaInfo, setTriviaInfo] = useState({}); // {title, summary, books}
  // Optionally, loading state for fetches (not needed for this stub)

  // Select a place (triggers info panel/trivia refresh)
  // PUBLIC_INTERFACE
  function handleSelectPlace(placeId) {
    setSelectedPlaceId(placeId);

    // Demo: showing multiple trivia items for improved interactivity
    // Here, for demo, we'll create multiple facts per place if available.
    const place = MOCK_PLACES.find((p) => p.id === placeId);
    if (place) {
      // Multiple trivia entries demo: summary, url, and media
      // In real app, you'd fetch richer data
      let entries = [
        {
          title: place.name,
          summary: place.trivia,
          books: place.books
        }
      ];
      // Add extra demo trivia fact, with a link for interactivity
      if (place.name === "Paris, France") {
        entries.push({
          title: "Eiffel Tower Fact",
          summary: "Did you know the <strong>Eiffel Tower</strong> was built for the 1889 World's Fair?",
          link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
          cover: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
          books: [
            { title: "Paris Revealed", author: "Stephen Clarke", link: "https://www.goodreads.com/book/show/11199794-paris-revealed" }
          ]
        });
      }
      if (place.name === "London, UK") {
        entries.push({
          title: "Sherlock Holmes",
          summary: "221B Baker Street is the legendary home of Sherlock Holmes. See <a href='https://en.wikipedia.org/wiki/221B_Baker_Street'>221B Baker St</a>.",
          link: "https://en.wikipedia.org/wiki/221B_Baker_Street",
          books: [
            { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", link: "https://www.goodreads.com/book/show/3590.The_Adventures_of_Sherlock_Holmes" }
          ]
        });
      }
      if (place.name === "Kyoto, Japan") {
        entries.push({
          title: "Kyoto Temples",
          summary: "Fushimi Inari-taisha, with its 10,000 iconic torii gates, is a must-see.",
          link: "https://en.wikipedia.org/wiki/Fushimi_Inari-taisha"
        });
      }
      setTriviaInfo({ entries });
    }
  }

  // Add a place to the bucket list (with note field, and de-dupe by id)
  // PUBLIC_INTERFACE
  function handleAddToBucket(placeId) {
    setBucketList((prev) => {
      // Support legacy: prev might be array of ids
      const items = Array.isArray(prev)
        ? (typeof prev[0] === "object" ? prev : prev.map(id => ({ id, note: "" })))
        : [];
      if (items.some(item => item.id === placeId)) return items;
      return [...items, { id: placeId, note: "" }];
    });
  }

  // Remove a place from the bucket list
  // PUBLIC_INTERFACE
  function handleRemoveFromBucket(placeId) {
    setBucketList((prev) => {
      // Support legacy: prev might be array of ids
      const items = Array.isArray(prev)
        ? (typeof prev[0] === "object" ? prev : prev.map(id => ({ id, note: "" })))
        : [];
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

  // Demo useEffect: On first load, show trivia for first mock place
  useEffect(() => {
    handleSelectPlace(MOCK_PLACES[0].id);
    // Optionally: can demo sample fetchBooksFromGoogle/fetchWikipediaSummary here
  }, []); // Only run once

  // Pass props for demo interactivity
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
              {/* In CRA, assets are loaded using process.env.PUBLIC_URL; ensure no unguarded usage */}
            </div>
            <button className="btn" disabled>Login (placeholder)</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {/* Sidebar Trivia/Info */}
        <InfoPanel
          triviaInfo={triviaInfo}
          selectedPlaceId={selectedPlaceId}
        />

        <section className="explorer-panel">
          <SearchBar
            // Could later pass onSearch handler that updates map etc.
          />
          <div className="map-and-bucket">
            <MapPanel
              places={MOCK_PLACES}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              onAddToBucket={handleAddToBucket}
              bucketList={bucketList}
            />
            <BucketList
              places={MOCK_PLACES}
              bucketList={bucketList}
              onRemoveFromBucket={handleRemoveFromBucket}
              onUpdateBucketListReorder={handleReorderBucketList}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
