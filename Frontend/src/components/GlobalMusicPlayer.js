import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { useMusic } from "../context/MusicContext";
import {
  FaPlay,
  FaPause,
  FaExpandAlt,
  FaTimes,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";
import "../styles/GlobalMusicPlayer.css";

const GlobalMusicPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    handlePlayerReady,
    handlePlayerStateChange,
    closePlayer,
    queue,
    playNext,
    playPrevious,
  } = useMusic();

  const isMusicDetailsPage = location.pathname.startsWith("/music/");

  return (
    <>
      {/* Hidden YouTube Player always mounted to keep audio playback state warm and instant */}
      <div className="youtube-hidden-player" aria-hidden="true">
        <YouTube
          videoId={currentSong?.videoId || ""}
          opts={{
            height: "200",
            width: "200",
            playerVars: {
              autoplay: 1,
              controls: 0,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              enablejsapi: 1,
              origin: typeof window !== "undefined" ? window.location.origin : "",
            },
          }}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
        />
      </div>

      {currentSong && !isMusicDetailsPage && (
        <div className="global-music-player">
          <div
            className="gmp-progress-bar"
            style={{
              width: `${duration > 0 ? (progress / duration) * 100 : 0}%`,
            }}
          ></div>

          <div className="gmp-content">
            <div
              className="gmp-info"
              onClick={() =>
                navigate(`/music/${currentSong.videoId}`, {
                  state: { song: currentSong },
                })
              }
            >
              <img
                src={
                  currentSong.thumbnail ||
                  `https://i.ytimg.com/vi/${currentSong.videoId}/hqdefault.jpg`
                }
                alt="Album Art"
                className={`gmp-art ${isPlaying ? "playing" : ""}`}
                loading="lazy"
              />
              <div className="gmp-text">
                <h4>{currentSong.title}</h4>
                <p>{currentSong.channelTitle || "Unknown Artist"}</p>
              </div>
            </div>

            <div className="gmp-controls">
              {queue && queue.length > 0 && (
                <button
                  className="gmp-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPrevious();
                  }}
                  aria-label="Previous song"
                >
                  <FaStepBackward />
                </button>
              )}
              <button
                className="gmp-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              {queue && queue.length > 0 && (
                <button
                  className="gmp-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playNext();
                  }}
                  aria-label="Next song"
                >
                  <FaStepForward />
                </button>
              )}
              <button
                className="gmp-btn expand-btn"
                onClick={() =>
                  navigate(`/music/${currentSong.videoId}`, {
                    state: { song: currentSong },
                  })
                }
                aria-label="Expand player"
              >
                <FaExpandAlt />
              </button>
              <button
                className="gmp-btn close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  closePlayer();
                }}
                aria-label="Close player"
              >
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
