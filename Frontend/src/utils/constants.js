/**
 * Shared constants used across multiple components.
 * Keeps the genre ID → name mapping and API base URL in one place
 * instead of duplicating them in every file that touches TMDB data.
 */

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

/**
 * Transforms raw TMDB movie data into the shape our UI expects.
 * Used by Home, Moods, and anywhere else that renders movie cards.
 */
export function formatMovieData(results) {
  return results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster",
    genre: (movie.genre_ids || [])
      .map((id) => GENRE_MAP[id])
      .filter(Boolean)
      .slice(0, 2),
    rating: movie.vote_average?.toFixed(1) || "0.0",
    year: movie.release_date?.split("-")[0] || "N/A",
    description: movie.overview || "No description available.",
  }));
}
