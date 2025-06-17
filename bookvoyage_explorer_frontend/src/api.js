//
// API utilities for BookVoyage Explorer
// Implements live data fetching from Google Books API and Wikipedia API with error handling and secure key management (via environment variables).
//

/**
 * PUBLIC_INTERFACE
 * Fetches books from Google Books API based on the search query.
 *
 * @param {string} query - Book title, author, or keyword to search for.
 * @param {Object} [options] - Optional settings (maxResults, startIndex, etc.).
 * @returns {Promise<Object>} - Parsed Google Books API response.
 *
 * SECURITY: The Google Books API key, if required (for higher quota), should be set as "REACT_APP_GOOGLE_BOOKS_API_KEY" in the environment (.env file).
 * The browser bundles only variables prefixed with REACT_APP_, so DO NOT hardcode keys here.
 */
export async function fetchBooksFromGoogle(query, options = {}) {
  if (!query || typeof query !== "string") {
    throw new Error("fetchBooksFromGoogle: Query string is required.");
  }
  // PUBLIC_INTERFACE
  // In the browser (React), env variables must be accessed at build time and must be prefixed with REACT_APP_.
  // Attempt to access the Google Books API key from the build-time-injected variable if present.
  const apiKey = typeof process !== "undefined" && process.env && process.env.REACT_APP_GOOGLE_BOOKS_API_KEY
    ? process.env.REACT_APP_GOOGLE_BOOKS_API_KEY
    : (window.REACT_APP_GOOGLE_BOOKS_API_KEY || undefined); // fallback for customized deployments
  const params = new URLSearchParams({
    q: query,
    maxResults: options.maxResults ? String(options.maxResults) : "10",
    ...("startIndex" in options ? { startIndex: String(options.startIndex) } : {})
  });
  if (apiKey) params.append("key", apiKey);

  const endpoint = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      // Google Books API returns 400/403 for invalid/missing keys or misconfigured requests
      const errText = await res.text();
      throw new Error(`Google Books API error (${res.status}): ${errText}`);
    }
    const data = await res.json();
    // API boilerplate: always return shape { items: [...], totalItems: n }
    return {
      items: data.items || [],
      totalItems: data.totalItems || 0
    };
  } catch (err) {
    // Logging is useful for debugging; consider less verbose logging in production
    console.error("fetchBooksFromGoogle failed:", err);
    return {
      items: [],
      totalItems: 0,
      error: String(err)
    };
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetches detailed book info by Google Books volume ID.
 *
 * @param {string} volumeId - The ID of the book volume.
 * @returns {Promise<Object>} - Google Books volume details, or error.
 */
export async function fetchBookDetailsById(volumeId) {
  if (!volumeId || typeof volumeId !== "string") {
    throw new Error("fetchBookDetailsById: volumeId is required.");
  }
  const apiKey = typeof process !== "undefined" && process.env && process.env.REACT_APP_GOOGLE_BOOKS_API_KEY
    ? process.env.REACT_APP_GOOGLE_BOOKS_API_KEY
    : (window.REACT_APP_GOOGLE_BOOKS_API_KEY || undefined); // fallback for customized deployments
  
  const endpoint = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}${apiKey ? `?key=${apiKey}` : ""}`;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Books API error (${res.status}): ${errText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("fetchBookDetailsById failed:", err);
    return { error: String(err) };
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetches a Wikipedia article summary and canonical URL using the Wikipedia REST API.
 *
 * @param {string} title - The Wikipedia page title or phrase (not full URL).
 * @returns {Promise<Object>} - { title, summary, url, description, thumbnail } if found.
 *
 * NOTE: No API key required. The REST endpoint is CORS enabled.
 */
export async function fetchWikipediaSummary(title) {
  if (!title || typeof title !== "string") {
    throw new Error("fetchWikipediaSummary: title is required.");
  }
  // Wikipedia REST API: returns summary, page URL, optionally image in 'originalimage' or 'thumbnail'
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(endpoint);
    if (res.status === 404) {
      // Not found
      return {
        title,
        summary: `No Wikipedia summary found for '${title}'.`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
      };
    }
    if (!res.ok) {
      throw new Error(`Wikipedia API error (${res.status})`);
    }
    const data = await res.json();
    return {
      title: data.title,
      summary: data.extract,
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      description: data.description || undefined,
      thumbnail: data.thumbnail?.source || undefined
    };
  } catch (err) {
    console.error("fetchWikipediaSummary failed:", err);
    return {
      title,
      summary: `Unable to fetch Wikipedia data for '${title}'.`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      error: String(err)
    };
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetches Wikipedia search results (for finding possible disambiguation pages).
 *
 * @param {string} query - Free-text search string.
 * @param {Object} [options] - E.g., { limit: 5 }
 * @returns {Promise<Object>} - { results: [{title, snippet, pageid}], total }
 */
export async function searchWikipediaTitles(query, options = {}) {
  if (!query || typeof query !== "string") {
    throw new Error("searchWikipediaTitles: query is required.");
  }
  const limit = options.limit ? String(options.limit) : "5";
  const endpoint = `https://en.wikipedia.org/w/api.php?` +
    `action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}` +
    `&format=json&origin=*`;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Wikipedia search API error (${res.status})`);
    }
    const data = await res.json();
    return {
      results: (data.query?.search || []).map(entry => ({
        title: entry.title,
        snippet: entry.snippet,
        pageid: entry.pageid
      })),
      total: data.query?.searchinfo?.totalhits || 0
    };
  } catch (err) {
    console.error("searchWikipediaTitles failed:", err);
    return { results: [], total: 0, error: String(err) };
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetches books from Google Books API by author name.
 *
 * @param {string} author - Author's full name.
 * @param {Object} [options] - E.g., { maxResults }
 * @returns {Promise<Object>} - API result, same format as fetchBooksFromGoogle.
 */
export async function fetchBooksByAuthor(author, options = {}) {
  // Google Books supports searching: q=inauthor:Author+Name
  return await fetchBooksFromGoogle(`inauthor:"${author}"`, options);
}

/**
 * PUBLIC_INTERFACE
 * Fetches books from Google Books API associated with a place name.
 *
 * @param {string} place - The place or location name.
 * @param {Object} [options] - E.g., { maxResults }
 * @returns {Promise<Object>} - API result, same format as fetchBooksFromGoogle.
 */
export async function fetchBooksByPlace(place, options = {}) {
  // We try various query constructs to maximize hit rate
  let query = `subject:"${place}"`;
  let result = await fetchBooksFromGoogle(query, options);
  // Fallback to broader search if not enough results
  if (result.totalItems < 3) {
    query = `"${place}"`; // Quote for phrase search
    result = await fetchBooksFromGoogle(query, options);
  }
  return result;
}

/**
 * SECURITY NOTE:
 * - To use Google Books API key in development/production, set up a .env file at the root of your app (not checked in to git), e.g.:
 *     REACT_APP_GOOGLE_BOOKS_API_KEY=your_api_key_here
 * - The API key is **read at build time** via process.env.REACT_APP_GOOGLE_BOOKS_API_KEY when using Create React App.
 * - No API credentials are required for Wikipedia API (public REST search).
 */

