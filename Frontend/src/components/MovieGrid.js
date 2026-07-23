import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/MovieGrid.css";
import MovieCard from "./MovieCard";

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

function MovieGrid({ selectedMood, search = "", selectedGenre = "All" }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false);
  const observer = useRef();

  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetching.current
        ) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setMovies([]);
    setHasMore(true);
    setPage(1);
  }, [selectedGenre, search]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (isFetching.current || !hasMore) return;
      isFetching.current = true;
      setLoading(true);

      try {
        const params = new URLSearchParams({ page });
        if (selectedGenre !== "All") params.append("genre", selectedGenre);
        if (search.trim() !== "") params.append("search", search.trim());

        const res = await fetch(`http://localhost:4000/api/movies?${params.toString()}`);
        const data = await res.json();
        const newMovies = Array.isArray(data.results) ? data.results : [];

        const formattedMovies = newMovies.map(movie => ({
          ...movie,
          genreNames: (movie.genre_ids || []).map(id => genreMap[id]).filter(Boolean),
          rating: movie.vote_average ? movie.vote_average.toFixed(1) : "0.0",
          year: movie.release_date?.split("-")[0] || "N/A"
        }));

        setMovies((prev) => (page === 1 ? formattedMovies : [...prev, ...formattedMovies]));
        setHasMore(data.page < data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };
    fetchMovies();
  }, [page, search, selectedGenre]);

  return (
    <section className="movie-grid">
      <div className="movie-container">
        {/* Render Loaded Movies */}
        {movies.length > 0 ? (
          movies.map((movie, index) => {
            const isLoadTrigger = index === movies.length - 5;

            return (
              <div
                key={`${movie.id}-${index}`}
                ref={isLoadTrigger ? lastMovieRef : null}
              >
                <MovieCard
                  id={movie.id}
                  poster={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster"
                  }
                  title={movie.title}
                  genre={movie.genreNames}
                  rating={movie.rating}
                  year={movie.year}
                  index={index}
                />
              </div>
            );
          })
        ) : (
          !loading && (
            <div className="no-results">
              <p>No movies found.</p>
            </div>
          )
        )}

        {/* Seamless Infinite Scroll Skeletons */}
        {loading && (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="skeleton-card">
                <div className="skeleton-poster"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line genre"></div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* End of results message */}
      {!hasMore && movies.length > 0 && (
        <div className="loading-more">
          <p>You have reached the end of the grid.</p>
        </div>
      )}
    </section>
  );
}

export default MovieGrid;