/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlay,
  FaPause,
  FaMusic,
  FaExternalLinkAlt,
} from "react-icons/fa";

import { useMusic } from "../context/MusicContext";
import "../styles/Music.css";

const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:4000"
}/api/music`;

const MOODS = [
  "All",
  "Happy",
  "Chill",
  "Energetic",
  "Romantic",
  "Sad",
  "Workout",
  "Party",
  "Focus",
];

const POPULAR_ARTISTS = [
  "Arijit Singh",
  "The Weeknd",
  "Taylor Swift",
  "Dua Lipa",
  "Drake",
  "Billie Eilish",
  "A.R. Rahman",
  "Armaan Malik",
];

function Music() {
  const { 
    currentSong, isPlaying, playSong,
    cachedSongs: songs, setCachedSongs: setSongs,
    cachedSearch: search, setCachedSearch: setSearch,
    cachedActiveSearch: activeSearch, setCachedActiveSearch: setActiveSearch,
    cachedSelectedMood: selectedMood, setCachedSelectedMood: setSelectedMood
  } = useMusic();

  const [loading, setLoading] = useState(songs.length === 0);
  const [searchError, setSearchError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.playSong) {
      handlePlay(location.state.playSong);
    }
  }, [location.state]);

  const [myPlaylist, setMyPlaylist] = useState([]);
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("beatflix_playlist")) || [];
    setMyPlaylist(list);
    
    const handleUpdate = () => {
        setMyPlaylist(JSON.parse(localStorage.getItem("beatflix_playlist")) || []);
    };
    window.addEventListener("playlistUpdated", handleUpdate);
    return () => window.removeEventListener("playlistUpdated", handleUpdate);
  }, []);

  const searchTimeoutRef =
    useRef(null);

  const getPoster = (song) => {
    if (!song?.videoId) {
      return song?.thumbnail || "";
    }

    return `https://i.ytimg.com/vi/${song.videoId}/maxresdefault.jpg`;
  };

  const getPosterFallback = (song) => {
    if (!song?.videoId) {
      return song?.thumbnail || "";
    }

    return `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`;
  };




  const renderSongCard = (song) => {
    const isCurrent = currentSong?.videoId === song.videoId;
    return (
      <article
        key={song.videoId}
        className={isCurrent ? "music-card current" : "music-card"}
        onClick={() => handlePlay(song)}
      >
        <div className="music-card-cover">
          <img
            src={getPoster(song)}
            alt={song.title}
            loading="lazy"
            onError={(e) => {
              const fallback = getPosterFallback(song);
              if (e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />
          <div className="cover-overlay" />
          <button type="button" className="music-play-button" onClick={(e) => { e.stopPropagation(); handlePlay(song); }}>
            {isCurrent && isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
        <div className="music-card-info">
          <h3>{song.title}</h3>
          <p>{song.channelTitle}</p>
        </div>
        <a className="music-youtube-link" href={`https://music.youtube.com/watch?v=${song.videoId}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
          Source <FaExternalLinkAlt />
        </a>
      </article>
    );
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchMusic = async (
    query = "Arijit Singh"
  ) => {
    try {
      setLoading(true);
      setSearchError("");

      const response =
        await fetch(
          `${API_URL}/search?q=${encodeURIComponent(
            query
          )}`
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Music search failed."
        );
      }

      setSongs(
        Array.isArray(data.songs)
          ? data.songs
          : []
      );
    } catch (error) {
      console.error(
        "Music search error:",
        error
      );

      setSongs([]);

      setSearchError(
        error.message ||
          "Unable to load music."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (songs.length === 0) {
      searchMusic(activeSearch || "Arijit Singh");
    } else {
      setLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(
          searchTimeoutRef.current
        );
      }
    };
  }, []);

  const handleSearch = (event) => {
    const value =
      event.target.value;

    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(
        searchTimeoutRef.current
      );
    }

    const query =
      value.trim() ||
      "Arijit Singh";

    searchTimeoutRef.current =
      setTimeout(() => {
        setActiveSearch(query);
        searchMusic(query);
      }, 600);
  };

  const handleArtistClick = (
    artist
  ) => {
    setSearch(artist);
    setActiveSearch(artist);
    setSelectedMood("All");

    searchMusic(artist);
  };

  const handleMoodClick = (
    mood
  ) => {
    setSelectedMood(mood);

    const query =
      mood === "All"
        ? activeSearch ||
          "Arijit Singh"
        : `${mood} mood songs`;

    searchMusic(query);
  };

  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

  const handlePlay = (song) => {
    playSong(song);
    navigate(`/music/${song.videoId}`, { state: { song } });
  };

  return (
    <main className="music-page">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="music-ambient-bg">
        <div className="ambient-blob color-1" />
        <div className="ambient-blob color-2" />
        <div className="ambient-blob color-3" />
        <div className="music-grid-overlay" />
      </div>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="music-hero">
        <div className="music-hero-glow" />

        <div className="hero-content">
          <div className="music-badge">
            <span className="badge-dot" />

            <span>
              BEATFLIX AUDIO
            </span>
          </div>

          <h1 className="music-title">
            <span className="title-line">
              Feel Every
            </span>

            <span className="text-gradient">
              Frequency
            </span>
          </h1>

          <p className="music-subtitle">
            Discover songs and listen
            through the BeatFlix audio
            experience.
          </p>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="music-content-wrapper">
        {/* SEARCH */}

        <div className="music-search-container">
          <div className="search-glass-wrapper">
            <FaSearch
              className="music-search-icon"
            />

            <input
              type="text"
              placeholder="Search songs, artists or albums..."
              value={search}
              onChange={
                handleSearch
              }
            />

            {loading && (
              <span className="search-loading">
                Searching...
              </span>
            )}
          </div>
        </div>

        {/* POPULAR ARTISTS */}

        <section className="quick-artists-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">
                EXPLORE
              </span>

              <h2>
                Popular Artists
              </h2>
            </div>
          </div>

          <div className="artist-pills">
            {POPULAR_ARTISTS.map(
              (artist) => (
                <button
                  key={artist}
                  type="button"
                  className={
                    activeSearch ===
                    artist
                      ? "artist-pill active"
                      : "artist-pill"
                  }
                  onClick={() =>
                    handleArtistClick(
                      artist
                    )
                  }
                >
                  {artist}
                </button>
              )
            )}
          </div>
        </section>

        <section className="genre-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">
                DISCOVER
              </span>

              <h2>
                Browse by Mood
              </h2>
            </div>
          </div>

          <div className="genre-filters">
            {MOODS.map(
              (mood) => (
                <button
                  key={mood}
                  type="button"
                  className={
                    selectedMood ===
                    mood
                      ? "genre-filter-btn active"
                      : "genre-filter-btn"
                  }
                  onClick={() =>
                    handleMoodClick(
                      mood
                    )
                  }
                >
                  {mood}
                </button>
              )
            )}
          </div>
        </section>

        {/* MY PLAYLIST */}
        <section className="music-grid-section">
          <div className="section-heading-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/playlist')}>
            <div>
              <span className="section-eyebrow">YOUR COLLECTION</span>
              <h2>My Playlist <FaExternalLinkAlt style={{fontSize: '0.8rem', marginLeft: '8px', opacity: 0.7}} /></h2>
            </div>
          </div>
          {myPlaylist.length === 0 ? (
            <div className="music-empty" style={{ minHeight: '150px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <FaMusic style={{ opacity: 0.5, fontSize: '2rem' }} />
              <h3 style={{ fontSize: '1.2rem', margin: '10px 0 5px' }}>Playlist is empty</h3>
              <p style={{ opacity: 0.7, margin: 0, fontSize: '0.9rem' }}>Add songs from the search results below.</p>
            </div>
          ) : (
            <div className="music-grid">
              {myPlaylist.map(renderSongCard)}
            </div>
          )}
        </section>

        {/* RESULTS */}

        <section className="music-grid-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">
                MUSIC
              </span>

              <h2>
                Results for "
                {activeSearch}
                "
              </h2>
            </div>
          </div>

          {loading && (
            <div className="music-loading">
              <div className="music-spinner" />

              <p>
                Finding music...
              </p>
            </div>
          )}

          {!loading &&
            searchError && (
              <div className="music-error">
                <FaMusic />

                <h3>
                  Music couldn't load
                </h3>

                <p>
                  {searchError}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    searchMusic(
                      activeSearch ||
                        "Arijit Singh"
                    )
                  }
                >
                  Try Again
                </button>
              </div>
            )}

          {!loading &&
            !searchError &&
            songs.length === 0 && (
              <div className="music-empty">
                <FaMusic />

                <h3>
                  No songs found
                </h3>

                <p>
                  Try another artist
                  or song.
                </p>
              </div>
            )}

          {!loading &&
            !searchError &&
            songs.length > 0 && (
              <div className="music-grid">
                {songs.map(renderSongCard)}
              </div>
            )}
        </section>
      </div>


    </main>
  );
}

export default Music;