/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaTrash, FaMusic, FaArrowLeft, FaRandom } from "react-icons/fa";
import { useMusic } from "../context/MusicContext";
import "../styles/Playlist.css";

const Playlist = () => {
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState([]);
  const { playQueue, currentSong, isPlaying, playSong, togglePlay } = useMusic();

  useEffect(() => {
    const loadPlaylist = () => {
      const pList = JSON.parse(localStorage.getItem("beatflix_playlist")) || [];
      setPlaylist(pList);
    };

    loadPlaylist();
    window.addEventListener("playlistUpdated", loadPlaylist);
    return () => window.removeEventListener("playlistUpdated", loadPlaylist);
  }, []);

  const handlePlayAll = () => {
    if (playlist.length > 0) {
      playQueue(playlist, 0);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.length > 0) {
      const shuffled = [...playlist].sort(() => Math.random() - 0.5);
      playQueue(shuffled, 0);
    }
  };

  const removeSong = (e, videoId) => {
    e.stopPropagation();
    const updated = playlist.filter((s) => s.videoId !== videoId);
    setPlaylist(updated);
    localStorage.setItem("beatflix_playlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("playlistUpdated"));
  };

  const clearPlaylist = () => {
    if (window.confirm("Are you sure you want to clear your entire playlist?")) {
      setPlaylist([]);
      localStorage.setItem("beatflix_playlist", JSON.stringify([]));
      window.dispatchEvent(new Event("playlistUpdated"));
    }
  };

  const handlePlaySong = (index) => {
    // Treat clicking a specific song as starting the queue from that index
    playQueue(playlist, index);
  };

  return (
    <div className="playlist-page-container">
      <div className="playlist-page-header">
        <button className="back-btn" onClick={() => navigate("/music")}>
          <FaArrowLeft /> Back to Music
        </button>
        <div className="playlist-title-section">
          <h1>My Playlist</h1>
          <p>{playlist.length} {playlist.length === 1 ? "track" : "tracks"}</p>
        </div>
        
        {playlist.length > 0 && (
          <div className="playlist-actions">
            <button className="play-all-btn" onClick={handlePlayAll}>
              <FaPlay /> Play All
            </button>
            <button className="shuffle-all-btn" onClick={handleShufflePlay}>
              <FaRandom /> Shuffle
            </button>
            <button className="clear-playlist-btn" onClick={clearPlaylist}>
              <FaTrash /> Clear All
            </button>
          </div>
        )}
      </div>

      <div className="playlist-content">
        {playlist.length === 0 ? (
          <div className="empty-playlist">
            <FaMusic className="empty-icon" />
            <h2>Your playlist is empty</h2>
            <p>Go to the music section and add some tracks!</p>
            <button className="go-to-music-btn" onClick={() => navigate("/music")}>
              Explore Music
            </button>
          </div>
        ) : (
          <div className="playlist-list">
            {playlist.map((song, index) => {
              const isCurrent = currentSong?.videoId === song.videoId;
              
              return (
                <div 
                  key={song.videoId + index} 
                  className={`playlist-item ${isCurrent ? 'active' : ''}`}
                  onClick={() => handlePlaySong(index)}
                >
                  <div className="playlist-item-index">
                    {isCurrent && isPlaying ? (
                      <div className="playing-bars">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                      </div>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  <img 
                    src={song.thumbnail || `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`} 
                    alt={song.title} 
                    className="playlist-item-thumb" 
                  />
                  
                  <div className="playlist-item-info">
                    <h3 className={isCurrent ? 'text-cyan' : ''}>{song.title}</h3>
                    <p>{song.channelTitle || "Unknown Artist"}</p>
                  </div>
                  
                  <button 
                    className="remove-song-btn" 
                    onClick={(e) => removeSong(e, song.videoId)}
                    title="Remove from Playlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;

