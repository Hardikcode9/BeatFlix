import { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import MovieGrid from "../components/MovieGrid";
import "../styles/Movies.css";

function Movies() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const moviesGridRef = useRef(null);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setTimeout(() => {
      moviesGridRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const genres = [
    "All", "Action", "Animation", "Comedy", "Documentary",
    "Drama", "Family", "History", "Horror", "Romance",
    "Sci-Fi", "Thriller",
  ];

  return (
    <main className="movies-page">
      {/* KINETIC AURORA BACKGROUND */}
      <div className="movies-ambient-bg">
        <div className="ambient-blob color-1"></div>
        <div className="ambient-blob color-2"></div>
        <div className="ambient-blob color-3"></div>
      </div>

      <section className="movies-hero">
        <div className="hero-content">
          <div className="movies-badge">
            <span className="badge-dot"></span>
            <span>✦ EXPLORE BEATFLIX</span>
          </div>

          <h1 className="movies-title">
            <span className="title-line">Your Next Obsession</span>
            <span className="text-gradient">Starts Here</span>
          </h1>

          <p className="movies-subtitle">
            Discover thousands of cinematic masterpieces. Search your favorites or let the grid guide you.
          </p>
        </div>
      </section>

      <div className="movies-content-wrapper">
        
        {/* CYBERNETIC SEARCH BAR */}
        <div className="movies-search-container">
          <div className="search-glass-wrapper">
            <FaSearch className="movies-search-icon" />
            <input
              type="text"
              placeholder="Initialize search sequence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="search-glow-line"></div>
          </div>
        </div>

        {/* GLASSMORPHISM GENRE FILTERS */}
        <div className="movies-filter-bar">
          <div className="genre-filters">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-filter-btn ${selectedGenre === genre ? "active" : ""}`}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* GRID MOUNT POINT */}
        <div ref={moviesGridRef} className="movies-grid-mount">
          <MovieGrid search={search} selectedGenre={selectedGenre} />
        </div>
      </div>
    </main>
  );
}

export default Movies;