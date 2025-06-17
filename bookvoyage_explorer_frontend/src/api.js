//
// API utility stubs for BookVoyage Explorer
//
// PUBLIC_INTERFACE

/**
 * Stub for fetching books from Google Books API.
 * Returns dummy data, simulating an async API response.
 *
 * PUBLIC_INTERFACE
 * @param {string} query - Book title, author, or search term.
 * @returns {Promise<Object>} - Simulated Google Books API book search results.
 *
 * TODO: Replace with real API call to Google Books API.
 */
export async function fetchBooksFromGoogle(query) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 400));
  // Return dummy search result data
  return {
    items: [
      {
        id: "dummy1",
        volumeInfo: {
          title: "Sample Book Title",
          authors: ["Sample Author"],
          description: "This is a dummy description of a book.",
          imageLinks: { thumbnail: "https://via.placeholder.com/100x150" },
        },
      },
      {
        id: "dummy2",
        volumeInfo: {
          title: `Returned for: '${query}'`,
          authors: ["Another Author"],
          description: "Another sample book description.",
          imageLinks: { thumbnail: "https://via.placeholder.com/100x150?text=Book" },
        },
      },
    ],
    totalItems: 2,
  };
}

/**
 * Stub for fetching article summary from Wikipedia API.
 * Returns dummy data, simulates fetching info for a book, author, or topic.
 *
 * PUBLIC_INTERFACE
 * @param {string} title - Wikipedia page title or search word.
 * @returns {Promise<Object>} - Simulated Wikipedia intro.
 *
 * TODO: Replace with real API call to Wikipedia.
 */
export async function fetchWikipediaSummary(title) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 300));
  // Return dummy Wikipedia-like content
  return {
    title,
    summary: `This is a simulated Wikipedia summary about '${title}'. Replace this with real info pulled from Wikipedia API.`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}
