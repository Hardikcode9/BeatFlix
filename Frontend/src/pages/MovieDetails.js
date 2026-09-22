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
      <div
        className="details-backdrop"
        style={{
          backgroundImage: `url(${IMAGE_URL}${movie.backdrop_path})`,
        }}
      >
        <div className="backdrop-gradient"></div>
        <div className="backdrop-noise"></div>
      </div>

      <div className="details-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="movie-header">
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
                loading="eager"
                decoding="async"
              />
              <div className="poster-reflection"></div>
            </div>
          </div>

          <div className="info-section animate-slide-up">
            <h1 className="title-gradient">{movie.title}</h1>

            {movie.tagline && <p className="tagline">&quot;{movie.tagline}&quot;</p>}

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

            <p className="overview">{movie.overview}</p>

            <div className="action-buttons">
              {trailer && (
                <button
                  className="glow-btn play-trailer"
                  onClick={() => setShowTrailer(true)}
                >
                  <FaPlay /> Watch Trailer
                </button>
              )}

              <button
                className={`glow-btn vibe-music-btn ${
                  isGeneratingVibe ? "generating" : ""
                }`}
                onClick={handleGenerateVibePlaylist}
                disabled={isGeneratingVibe}
                title="Generate an AI-curated playlist reflecting this movie's exact mood & themes"
              >
                <FaMagic className={isGeneratingVibe ? "spin-icon" : ""} />
                {isGeneratingVibe ? "Crafting Soundtrack..." : "Vibe Soundtrack"}
              </button>

              <button
                className={`glow-btn add-list ${isInList ? "saved" : ""}`}
                onClick={toggleMyList}
              >
                {isInList ? (
                  <>
                    <FaBookmark className="accent-icon" /> In My List
                  </>
                ) : (
                  <>
                    <FaRegBookmark /> Add to List
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {watchProviders && watchProviders.flatrate?.length > 0 && (
          <section className="providers-section animate-slide-up">
            <h3 className="section-title">Streaming On</h3>
            <div className="providers-grid">
              {watchProviders.flatrate.map((provider) => (
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
                    decoding="async"
                  />
                  <span>{provider.provider_name}</span>
                </a>
              ))}
            </div>
          </section>
        )}

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
                    decoding="async"
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
                    loading="lazy"
                    decoding="async"
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
              aria-label="Close trailer"
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