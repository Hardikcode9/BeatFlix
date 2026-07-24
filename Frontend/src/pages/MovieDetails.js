import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaPlay,
  FaTimes,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import "../styles/MovieDetails.css";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

// 3D Tilt Logic for the Poster
const handlePosterMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12; // 12deg tilt
  const rotateX = (((rect.height / 2) - y) / (rect.height / 2)) * 12;
  card.style.setProperty("--rotateX", `${rotateX}deg`);
  card.style.setProperty("--rotateY", `${rotateY}deg`);
};

const handlePosterLeave = (e) => {
  e.currentTarget.style.setProperty("--rotateX", "0deg");
  e.currentTarget.style.setProperty("--rotateY", "0deg");
};

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInList, setIsInList] = useState(false);

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchProviders, setWatchProviders] = useState(null);

  // 1. Sync button state with LocalStorage on load and when the custom event fires
  useEffect(() => {
    window.scrollTo(0, 0);

    const checkMyList = () => {
      const savedList = JSON.parse(localStorage.getItem("myList")) || [];
      const isSaved = savedList.some((m) => m.id.toString() === id.toString());
      setIsInList(isSaved);
    };

    checkMyList(); // Check immediately on load
    window.addEventListener("myListUpdated", checkMyList); // Keep in sync if removed from the panel

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://192.168.0.100:4000/api/movies/${id}`);
        const data = await res.json();
        if (data.success) {
          setMovie(data.movie);
          setCast(data.cast || []);
          setSimilarMovies(data.similar || []);
          setTrailer(data.trailer || null);
          setWatchProviders(data.watchProviders || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();

    return () => window.removeEventListener("myListUpdated", checkMyList);
  }, [id]);

  // 2. Add or Remove from LocalStorage
  const toggleMyList = () => {
    setIsInList((prev) => {
      const newState = !prev;
      let savedList = JSON.parse(localStorage.getItem("myList")) || [];

      if (newState) {
        // Add current movie to list
        if (!savedList.find((m) => m.id === movie.id)) {
          savedList.push(movie);
        }
      } else {
        // Remove current movie from list
        savedList = savedList.filter((m) => m.id !== movie.id);
      }

      localStorage.setItem("myList", JSON.stringify(savedList));
      window.dispatchEvent(new Event("myListUpdated")); // Tell Navbar/Panel to update
      
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader-pulse"></div>
      </div>
    );
  }

  if (!movie)
    return (
      <div className="loading-page">
        <h1>Movie Not Found</h1>
      </div>
    );

  return (
    <div className="movie-details-page">
      {/* BACKGROUND WITH LIVE VIDEO OR BREATHING IMAGE */}
      <div className="movie-backdrop">
        {trailer ? (
          <div className="live-bg-wrapper">
            <iframe
              className="live-bg-iframe"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}&modestbranding=1`}
              title="Live Background"
              allow="autoplay; encrypted-media"
              tabIndex="-1"
            />
          </div>
        ) : (
          <div
            className="backdrop-img"
            style={{ backgroundImage: `url(${IMAGE_URL}${movie.backdrop_path})` }}
          ></div>
        )}

        {/* Animated Gradient Overlay */}
        <div className="backdrop-overlay animated-gradient-overlay"></div>

        <div className="movie-hero">
          {/* 3D INTERACTIVE POSTER */}
          <div className="poster-section animate-slide-right">
            <div className="poster-glow-orb"></div>
            <div
              className="poster-3d-wrapper"
              onMouseMove={handlePosterMove}
              onMouseLeave={handlePosterLeave}
            >
              <img
                src={`${POSTER_URL}${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="poster-reflection"></div>
            </div>
          </div>

          <div className="info-section animate-slide-up">
            <h1 className="title-gradient">{movie.title}</h1>

            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

            <div className="movie-meta">
              <span className="premium-pill gold-pill">
                <FaStar /> {movie.vote_average.toFixed(1)}
              </span>
              <span className="premium-pill">
                <FaCalendarAlt className="accent-icon" /> {movie.release_date}
              </span>
              <span className="premium-pill">
                <FaClock className="accent-icon" /> {movie.runtime} min
              </span>
            </div>

            <div className="genre-list">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="neon-chip">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="button-group">
              {/* Watch Trailer Button */}
              <button
                className="btn-primary"
                onClick={() => setShowTrailer(true)}
              >
                <span className="play-circle">▶</span>
                Watch Trailer
              </button>

              {/* My List Button */}
              <button
                type="button"
                className={`btn-secondary btn-mylist ${isInList ? "in-list" : ""}`}
                onClick={toggleMyList}
                aria-label={isInList ? "Remove from My List" : "Add to My List"}
              >
                {isInList ? (
                  <FaBookmark className="bookmark-icon" />
                ) : (
                  <FaRegBookmark className="bookmark-icon" />
                )}
                <span>{isInList ? "In My List" : "Add to My List"}</span>
              </button>

              {/* Back Button */}
              <button className="btn-secondary" onClick={() => navigate(-1)}>
                <FaArrowLeft style={{ marginRight: "6px" }} /> Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* OVERVIEW */}
        <section
          className="overview-section animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="section-title">Overview</h2>
          <p className="overview-text">{movie.overview}</p>
        </section>

        {watchProviders && (
  <section className="watch-section animate-slide-up">
    <h2 className="section-title">Where to Watch</h2>

    <div className="watch-grid">
                {(
            watchProviders.flatrate ||
            watchProviders.rent ||
            watchProviders.buy ||
            []
          ).map((provider) => (
                  <a
          key={provider.provider_id}
          href={watchProviders.link}
          target="_blank"
          rel="noreferrer"
          className="watch-card"
        >
          <img
            src={`https://image.tmdb.org/t/p/w185${provider.logo_path}`}
            alt={provider.provider_name}
          />

          <span>{provider.provider_name}</span>
        </a>
      ))}
    </div>
  </section>
)}

        {/* DYNAMIC CAST GRID */}
        {cast.length > 0 && (
          <section
            className="cast-section animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="section-title">Top Cast</h2>
            <div className="cast-grid">
              {cast.slice(0, 10).map((actor) => (
                <div key={actor.cast_id || actor.id} className="cast-card-3d">
                  <img
                    src={
                      actor.profile_path
                        ? `${POSTER_URL}${actor.profile_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={actor.name}
                  />
                  <div className="cast-color-overlay"></div>
                  <div className="cast-info-layer">
                    <h4>{actor.name}</h4>
                    <p>{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BENTO SIMILAR MOVIES */}
        {similarMovies.length > 0 && (
          <section
            className="similar-section animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <h2 className="section-title">You May Also Like</h2>
            <div className="similar-grid">
              {similarMovies.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="similar-bento-card"
                  onClick={() => navigate(`/movie/${item.id}`)}
                >
                  <img
                    src={`${POSTER_URL}${item.poster_path}`}
                    alt={item.title}
                  />
                  <div className="similar-hover-sweep"></div>
                  <div className="similar-content">
                    <h4>{item.title}</h4>
                    <span className="rating-badge">
                      <FaStar /> {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && trailer && (
        <div
          className="trailer-overlay glass-bg"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="trailer-modal modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowTrailer(false)}
            >
              <FaTimes />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;