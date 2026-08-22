/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaStar, FaFilm, FaMusic, FaCheck, FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/MyListPage.css";

const POSTER_URL = "https://image.tmdb.org/t/p/w500";

const MyListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("movies");
  const [savedMovies, setSavedMovies] = useState([]);
  const [savedMusic, setSavedMusic] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    const loadLists = () => {
      const movies = JSON.parse(localStorage.getItem("myList")) || [];
      const music = JSON.parse(localStorage.getItem("myMusicList")) || [];
      setSavedMovies(movies);
      setSavedMusic(music);
    };

    loadLists();
    window.addEventListener("myListUpdated", loadLists);
    return () => window.removeEventListener("myListUpdated", loadLists);
  }, []);

  const saveMovies = (movies) => {
    setSavedMovies(movies);
    localStorage.setItem("myList", JSON.stringify(movies));
    window.dispatchEvent(new Event("myListUpdated"));
  };

  const saveMusic = (music) => {
    setSavedMusic(music);
    localStorage.setItem("myMusicList", JSON.stringify(music));
    window.dispatchEvent(new Event("myListUpdated"));
  };

  const removeMovie = (e, id) => {
    e.stopPropagation();
    const updated = savedMovies.filter((m) => m.id !== id);
    saveMovies(updated);
  };

  const removeMusic = (e, id) => {
    e.stopPropagation();
    const updated = savedMusic.filter((m) => m.videoId !== id);
    saveMusic(updated);
  };

  const updateMovieField = (id, field, value) => {
    const updated = savedMovies.map(movie => 
      movie.id === id ? { ...movie, [field]: value } : movie
    );
    saveMovies(updated);
  };

  const toggleLiked = (e, movie) => {
    e.stopPropagation();
    updateMovieField(movie.id, "liked", !movie.liked);
  };

  const toggleWatched = (e, movie) => {
    e.stopPropagation();
    updateMovieField(movie.id, "watched", !movie.watched);
  };

  const handleRating = (e, movie, rating) => {
    e.stopPropagation();
    updateMovieField(movie.id, "userRating", rating);
  };

  const handleReviewChange = (e, id) => {
    updateMovieField(id, "review", e.target.value);
  };

  return (
    <div className="mylist-page-container">
      <div className="mylist-page-header">
        <h1>My Vault</h1>
        <div className="mylist-tabs">
          <button 
            className={`mylist-tab ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            <FaFilm /> Movies
          </button>
          <button 
            className={`mylist-tab ${activeTab === 'music' ? 'active' : ''}`}
            onClick={() => setActiveTab('music')}
          >
            <FaMusic /> Music
          </button>
        </div>
      </div>

      {activeTab === "movies" && (
        <div className="mylist-section">
          {savedMovies.length === 0 ? (
            <div className="empty-list">
              <FaFilm className="empty-icon" />
              <h2>No movies saved yet.</h2>
              <p>Explore the catalog and add movies to your list!</p>
            </div>
          ) : (
            <div className="mylist-page-grid">
              {savedMovies.map((movie) => (
                <div key={movie.id} className="mylist-page-card-wrapper">
                  <div className="mylist-page-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                    <img 
                      src={`${POSTER_URL}${movie.poster_path}`} 
                      alt={movie.title} 
                      className="mylist-page-poster" 
                    />
                    <div className="mylist-page-info">
                      <h3>{movie.title}</h3>
                      <button className="remove-btn-abs" onClick={(e) => removeMovie(e, movie.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Controls outside the link */}
                  <div className="mylist-controls">
                    <div className="mylist-actions">
                      <button 
                        className={`action-btn ${movie.liked ? 'active-heart' : ''}`} 
                        onClick={(e) => toggleLiked(e, movie)}
                        title="Like"
                      >
                        {movie.liked ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <button 
                        className={`action-btn ${movie.watched ? 'active-check' : ''}`} 
                        onClick={(e) => toggleWatched(e, movie)}
                        title="Mark as Watched"
                      >
                        <FaCheck /> {movie.watched ? 'Watched' : 'Unwatched'}
                      </button>
                    </div>
                    
                    <div className="mylist-rating">
                      <span className="rating-label">Rate:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          className={`star-icon ${movie.userRating >= star ? 'filled' : ''}`}
                          onClick={(e) => handleRating(e, movie, star)}
                        />
                      ))}
                    </div>

                    <div className="mylist-review">
                      <textarea 
                        placeholder="Write a personal review..."
                        value={movie.review || ""}
                        onChange={(e) => handleReviewChange(e, movie.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "music" && (
        <div className="mylist-section">
          {savedMusic.length === 0 ? (
            <div className="empty-list">
              <FaMusic className="empty-icon" />
              <h2>No music saved yet.</h2>
              <p>Listen to songs and add them to your list!</p>
            </div>
          ) : (
            <div className="mylist-page-grid">
              {savedMusic.map((song) => (
                <div key={song.videoId} className="mylist-page-card-wrapper music-card-wrapper">
                  <div 
                    className="mylist-page-card" 
                    onClick={() => navigate(`/music/${song.videoId}`, { state: { song } })}
                  >
                    <img 
                      src={song.thumbnail || `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`} 
                      alt={song.title} 
                      className="mylist-page-poster music-poster" 
                    />
                    <div className="mylist-page-info">
                      <h3>{song.title}</h3>
                      <p className="song-artist">{song.channelTitle || "Unknown Artist"}</p>
                      <button className="remove-btn-abs" onClick={(e) => removeMusic(e, song.videoId)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyListPage;

