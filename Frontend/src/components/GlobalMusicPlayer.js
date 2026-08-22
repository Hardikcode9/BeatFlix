/* eslint-disable */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import { useMusic } from '../context/MusicContext';
import { FaPlay, FaPause, FaExpandAlt, FaTimes, FaStepForward, FaStepBackward } from 'react-icons/fa';
import '../styles/GlobalMusicPlayer.css';

const GlobalMusicPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    seekTo,
    handlePlayerReady,
    handlePlayerStateChange,
    closePlayer,
    queue,
    playNext,
    playPrevious,
  } = useMusic();

  const isMusicDetailsPage = location.pathname.startsWith('/music/');

  if (!currentSong) return null;

  return (
    <>
      {/* Hidden YouTube Player always mounted to keep music playing */}
      <div className="youtube-hidden-player" style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <YouTube
          videoId={currentSong.videoId}
          opts={{
            height: "0",
            width: "0",
            playerVars: {
              autoplay: 1,
              controls: 0,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
            },
          }}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
        />
      </div>

      {/* Render the minimized player only if we are NOT on the details page */}
      {!isMusicDetailsPage && (
        <div className="global-music-player">
          <div className="gmp-progress-bar" style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}></div>
          
          <div className="gmp-content">
            <div className="gmp-info" onClick={() => navigate(`/music/${currentSong.videoId}`, { state: { song: currentSong } })}>
              <img src={currentSong.thumbnail || `https://i.ytimg.com/vi/${currentSong.videoId}/hqdefault.jpg`} alt="Album Art" className={`gmp-art ${isPlaying ? 'playing' : ''}`} />
              <div className="gmp-text">
                <h4>{currentSong.title}</h4>
                <p>{currentSong.channelTitle || 'Unknown Artist'}</p>
              </div>
            </div>

            <div className="gmp-controls">
              {queue && queue.length > 0 && (
                <button className="gmp-btn" onClick={(e) => { e.stopPropagation(); playPrevious(); }}>
                  <FaStepBackward />
                </button>
              )}
              <button className="gmp-btn" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              {queue && queue.length > 0 && (
                <button className="gmp-btn" onClick={(e) => { e.stopPropagation(); playNext(); }}>
                  <FaStepForward />
                </button>
              )}
              <button className="gmp-btn expand-btn" onClick={() => navigate(`/music/${currentSong.videoId}`, { state: { song: currentSong } })}>
                <FaExpandAlt />
              </button>
              <button className="gmp-btn close-btn" onClick={(e) => { e.stopPropagation(); closePlayer(); }}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalMusicPlayer;

