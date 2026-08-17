import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaBookmark, FaCheck } from "react-icons/fa";
import { useMusic } from "../context/MusicContext";
import "../styles/MusicDetails.css";

const MusicDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    currentSong,
    isPlaying,
    progress,
    isMuted,
    isShuffle,
    isLoop,
    setIsShuffle,
    setIsLoop,
    togglePlay,
    toggleMute,
    seekTo,
    playSong,
    duration,
  } = useMusic();

  const [song, setSong] = useState(location.state?.song || currentSong || null);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const formatTime = (seconds) => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = Math.floor(value / 60);
    const secondsPart = value % 60;
    return `${minutes}:${String(secondsPart).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (song) {
      const pList = JSON.parse(localStorage.getItem("beatflix_playlist")) || [];
      setIsPlaylist(pList.some((s) => s.videoId === song.videoId));

      const mList = JSON.parse(localStorage.getItem("myMusicList")) || [];
      setIsBookmarked(mList.some((s) => s.videoId === song.videoId));
    }
  }, [song]);

  const togglePlaylist = () => {
    if (!song) return;
    const pList = JSON.parse(localStorage.getItem("beatflix_playlist")) || [];
    let updatedList;
    if (isPlaylist) {
      updatedList = pList.filter((s) => s.videoId !== song.videoId);
      setIsPlaylist(false);
    } else {
      updatedList = [...pList, song];
      setIsPlaylist(true);
    }
    localStorage.setItem("beatflix_playlist", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("playlistUpdated"));
  };

  const toggleBookmark = () => {
    if (!song) return;
    const mList = JSON.parse(localStorage.getItem("myMusicList")) || [];
    let updatedList;
    if (isBookmarked) {
      updatedList = mList.filter((s) => s.videoId !== song.videoId);
      setIsBookmarked(false);
    } else {
      updatedList = [...mList, song];
      setIsBookmarked(true);
    }
    localStorage.setItem("myMusicList", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("myListUpdated"));
  };

  useEffect(() => {
    // If we didn't get the song from state, we can't easily fetch full metadata without a dedicated endpoint,
    // but the youtube player will still work.
    let current = song;
    if (!current) {
      current = {
        videoId: id,
        title: "Loading Track...",
        channelTitle: "Artist",
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
      setSong(current);
    }
    
    // Auto-play the song in global context if it's not already the current one
    if (current && (!currentSong || currentSong.videoId !== current.videoId)) {
      playSong(current);
    }
  }, [id, song, currentSong, playSong]);

  const handleSeek = (e) => {
    const newProgress = e.target.value;
    seekTo(newProgress);
  };

  if (!song) return null;

  return (
    <div className="music-details-container">
      {/* Blurred background image */}
      <div 
        className="music-details-bg" 
        style={{ backgroundImage: `url(${song.thumbnail})` }}
      ></div>
      <div className="music-details-overlay"></div>

      <div className="music-details-content">
        <button className="back-btn" onClick={() => navigate("/music")}>
          <FaArrowLeft /> Back
        </button>

        <button 
          className={`save-music-btn ${isBookmarked ? 'saved' : ''}`}
          onClick={toggleBookmark}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            margin: 0, 
            padding: '14px', 
            minWidth: 'auto', 
            borderRadius: '50%', 
            background: isBookmarked ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.15)', 
            color: isBookmarked ? '#000' : '#fff', 
            border: 'none',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          title={isBookmarked ? "Remove from My List" : "Add to My List"}
        >
          {isBookmarked ? <FaCheck /> : <FaBookmark />}
        </button>

        <div className="album-art-container">
          <img src={song.thumbnail} alt={song.title} className={`album-art ${isPlaying ? 'playing' : ''}`} />
          <div className="album-art-glow" style={{ backgroundImage: `url(${song.thumbnail})` }}></div>
        </div>


        <div className="song-info">
          <h1 className="song-title">{song.title}</h1>
          <h2 className="song-artist">{song.channelTitle || "Unknown Artist"}</h2>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center', justifyContent: 'center'}}>
            <button 
              className={`save-music-btn ${isPlaylist ? 'saved' : ''}`}
              onClick={togglePlaylist}
              style={{ margin: 0 }}
            >
              {isPlaylist ? <FaCheck /> : <FaBookmark />} 
              {isPlaylist ? 'Saved to Playlist' : 'Add to Playlist'}
            </button>
          </div>
        </div>

        <div className="player-controls-container">
          <div className="progress-row">
            <span className="time-text">{formatTime(progress)}</span>
            <input 
              type="range" 
              className="progress-bar" 
              value={progress} 
              onChange={handleSeek} 
              min="0" 
              max={duration || 100} 
              step="0.1"
            />
            <span className="time-text">{formatTime(duration)}</span>
          </div>

          <div className="main-controls">
            <button className={`control-btn secondary-btn ${isShuffle ? 'active-state' : ''}`} onClick={() => setIsShuffle(!isShuffle)}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M403.73 131.52A200.7 200.7 0 00256 71.05C118.8 71.05 13.92 186.2 3.65 319.46a16.48 16.48 0 0016.42 17.58h22.6c8.53 0 15.68-6.52 16.38-14.93C68.12 201.27 151.79 104 256 104c45.9 0 88 15.35 121.2 41.24l-38.3 38.3c-14.13 14.13-4.14 38.27 15.86 38.27h111.4c8.84 0 16-7.16 16-16v-111.4c0-20-24.13-30-38.27-15.86l-38.31 38.31zM492.35 192.54a16.48 16.48 0 00-16.42-17.58h-22.6c-8.53 0-15.68 6.52-16.38 14.93C427.88 310.73 344.21 408 240 408c-45.9 0-88-15.35-121.2-41.24l38.3-38.3c14.13-14.13 4.14-38.27-15.86-38.27H31.84c-8.84 0-16 7.16-16 16v111.4c0 20 24.13 30 38.27 15.86l38.31-38.31A200.7 200.7 0 00240 440.95c137.2 0 242.08-115.15 252.35-248.41z"></path></svg>
            </button>
            <button className="control-btn mute-btn" onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button className="control-btn play-pause-btn" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="control-btn secondary-btn" onClick={() => seekTo(0)}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M497.9 142.1l-46.1 46.1c47.2 59.7 37.4 147.1-22.5 195.9-63.5 51.6-159.2 47.9-217.4-8.5l26-26c45.5 44 117.8 45.4 163.6 4.7 46.8-41.8 48.7-111.8 8.1-158.4l-42.5 42.5c-14.1 14.1-38.3 4.1-38.3-15.9V111.9c0-8.8 7.2-16 16-16h111.4c20 0 30 24.1 15.9 38.2L497.9 142.1zM142.1 497.9l46.1-46.1c-47.2-59.7-37.4-147.1 22.5-195.9 63.5-51.6 159.2-47.9 217.4 8.5l-26 26c-45.5-44-117.8-45.4-163.6-4.7-46.8 41.8-48.7 111.8-8.1 158.4l42.5-42.5c14.1-14.1 38.3-4.1 38.3 15.9v110.6c0 8.8-7.2 16-16 16H183.8c-20 0-30-24.1-15.9-38.2l34.2-34.1z"></path></svg>
            </button>
            <button className={`control-btn secondary-btn ${isLoop ? 'active-state' : ''}`} onClick={() => setIsLoop(!isLoop)}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MusicDetails;
