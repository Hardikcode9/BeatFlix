import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  FaArrowLeft,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaPlay,
  FaTimes,
  FaBookmark,
  FaRegBookmark,
  FaMagic,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE } from "../utils/constants";
import { useMusic } from "../context/MusicContext";
import "../styles/MovieDetails.css";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

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

  const { playQueue } = useMusic();
  const [isGeneratingVibe, setIsGeneratingVibe] = useState(false);

  const handlePosterMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 12;
    card.style.setProperty("--rotateX", `${rotateX}deg`);
    card.style.setProperty("--rotateY", `${rotateY}deg`);
  }, []);

  const handlePosterLeave = useCallback((e) => {
    e.currentTarget.style.setProperty("--rotateX", "0deg");
    e.currentTarget.style.setProperty("--rotateY", "0deg");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkMyList = () => {
      const savedList = JSON.parse(localStorage.getItem("myList")) || [];
      const isSaved = savedList.some((m) => m.id.toString() === id.toString());
      setIsInList(isSaved);
    };

    checkMyList();
    window.addEventListener("myListUpdated", checkMyList);

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/movies/${id}`);
        const data = await res.json();
        if (data.success) {
          setMovie(data.movie);
          setCast(data.cast || []);
          setSimilarMovies(data.similar || []);
          setTrailer(data.trailer || null);
          setWatchProviders(data.watchProviders || null);
        }
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();

    return () => window.removeEventListener("myListUpdated", checkMyList);
  }, [id]);

  const toggleMyList = () => {
    setIsInList((prev) => {
      const newState = !prev;
      let savedList = JSON.parse(localStorage.getItem("myList")) || [];

      if (newState) {
        if (!savedList.find((m) => m.id === movie.id)) {
          savedList.push(movie);
        }
      } else {
        savedList = savedList.filter((m) => m.id !== movie.id);
      }

      localStorage.setItem("myList", JSON.stringify(savedList));
      window.dispatchEvent(new Event("myListUpdated"));

      return newState;
    });
  };

  const handleGenerateVibePlaylist = async () => {
    if (!movie) return;
    setIsGeneratingVibe(true);
    try {
      const token = localStorage.getItem("token");
      const genres = movie.genres.map((g) => g.name).join(", ");

      const vibeRes = await fetch(`${API_BASE}/api/gemini/vibe-playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieTitle: movie.title,
          moviePlot: movie.overview,
          movieGenres: genres,
        }),
      });
      const vibeData = await vibeRes.json();

      if (!vibeData.songs || vibeData.songs.length === 0) {
        toast.error("Failed to generate vibe playlist. Try again.");
        setIsGeneratingVibe(false);
        return;
      }

      const songPromises = vibeData.songs.map(async (songQuery) => {
        try {
          const res = await fetch(
            `${API_BASE}/api/music/search?q=${encodeURIComponent(songQuery)}`
          );
          const searchData = await res.json();
          if (
            searchData.success &&
            searchData.songs &&
            searchData.songs.length > 0
          ) {
            return searchData.songs[0];
          }
        } catch (e) {
          console.error("Music search error", e);
        }
        return null;
      });

      const fetchedSongs = (await Promise.all(songPromises)).filter(
        (s) => s !== null
      );

      if (fetchedSongs.length > 0) {
        const vibeContext = {
          movieTitle: movie.title,
          moviePlot: movie.overview,
          movieGenres: genres,
        };
        playQueue(fetchedSongs, 0, vibeContext);
        toast.success(`Generated vibe soundtrack for ${movie.title}!`);
      } else {
        toast.warn("Could not find playable tracks for this vibe.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating playlist. Please check your AI tokens.");
    } finally {
      setIsGeneratingVibe(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader-pulse"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-page">
        <h2>Movie not found</h2>
        <Link to="/home" className="back-btn">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      {/* BACKGROUND WITH LIVE VIDEO OR BREATHING IMAGE */}
      <div className="movie-backdrop">
        {trailer && trailer.key ? (
          <div className="live-bg-wrapper">
            <iframe
              className="live-bg-iframe"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}&modestbranding=1&enablejsapi=1`}
              title="Live Background"
              allow="autoplay; encrypted-media"
              tabIndex="-1"
            />
          </div>
        ) : (
          <div
            className="backdrop-img"
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(${IMAGE_URL}${movie.backdrop_path})`
                : undefined,
            }}
          />
        )}

        {/* Animated Gradient Overlay */}
        <div className="backdrop-overlay animated-gradient-overlay" />

        <div className="movie-hero">
          {/* 3D INTERACTIVE POSTER */}
          <div className="poster-section animate-slide-right">
            <div className="poster-glow-orb" />
            <div
              className="poster-3d-wrapper"
              onMouseMove={handlePosterMove}
              onMouseLeave={handlePosterLeave}
            >
              <img
                src={
                  movie.poster_path
                    ? `${POSTER_URL}${movie.poster_path}`
                    : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster"
                }
                alt={movie.title}
                loading="eager"
              />
              <div className="poster-reflection" />
            </div>
          </div>

          <div className="info-section animate-slide-up">
            <h1 className="title-gradient">{movie.title}</h1>

            {movie.tagline && <p className="tagline">&quot;{movie.tagline}&quot;</p>}

            <div className="movie-meta">
              <span className="premium-pill gold-pill">
                <FaStar /> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="premium-pill">
                <FaCalendarAlt className="accent-icon" /> {movie.release_date || "N/A"}
              </span>
              <span className="premium-pill">
                <FaClock className="accent-icon" /> {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="genre-list">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="neon-chip">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="button-group">
              {/* Watch Trailer Button */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (trailer && trailer.key) {
                    setShowTrailer(true);
                  } else {
                    window.open(
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(
                        movie.title + " official trailer"
                      )}`,
                      "_blank"
                    );
                  }
                }}
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

              {/* Vibe Soundtrack Button */}
              <button
                type="button"
                className={`btn-secondary vibe-soundtrack-btn ${
                  isGeneratingVibe ? "generating" : ""
                }`}
                onClick={handleGenerateVibePlaylist}
                disabled={isGeneratingVibe}
                title="Generate an AI-curated playlist reflecting this movie's exact mood & themes"
                style={{
                  background: "linear-gradient(45deg, #ec4899, #8b5cf6)",
                  border: "none",
                  color: "white",
                }}
              >
                <FaMagic
                  className={isGeneratingVibe ? "spin-icon" : ""}
                  style={{ marginRight: "6px" }}
                />
                {isGeneratingVibe ? "Crafting Soundtrack..." : "Vibe Soundtrack"}
              </button>

              {/* Back Button */}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft style={{ marginRight: "6px" }} /> Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* OVERVIEW */}
        {movie.overview && (
          <section
            className="overview-section animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="section-title">Overview</h2>
            <p className="overview-text">{movie.overview}</p>
          </section>
        )}

        {/* WHERE TO WATCH / STREAMING */}
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
                    loading="lazy"
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
                        : "https://placehold.co/300x450/1a1a1a/ffffff?text=No+Image"
                    }
                    alt={actor.name}
                    loading="lazy"
                  />
                  <div className="cast-color-overlay" />
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
                    src={
                      item.poster_path
                        ? `${POSTER_URL}${item.poster_path}`
                        : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster"
                    }
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className="similar-hover-sweep" />
                  <div className="similar-content">
                    <h4>{item.title}</h4>
                    <span className="rating-badge">
                      <FaStar /> {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && (
        <div
          className="trailer-overlay glass-bg"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="trailer-modal modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trailer-modal-bar">
              {trailer?.key && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="trailer-external-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Watch on YouTube ↗
                </a>
              )}
              <button
                className="modal-close"
                onClick={() => setShowTrailer(false)}
                aria-label="Close trailer"
              >
                <FaTimes />
              </button>
            </div>
            {trailer?.key ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="trailer-fallback">
                <h3>Trailer video not available</h3>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    movie.title + " official trailer"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
                  <span className="play-circle">▶</span>
                  Search on YouTube
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;