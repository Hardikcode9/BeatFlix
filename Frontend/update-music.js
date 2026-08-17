const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Music.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import YouTube
content = content.replace(
  'import { useEffect, useRef, useState } from "react";\nimport {',
  'import { useEffect, useRef, useState } from "react";\nimport YouTube from "react-youtube";\nimport {'
);

// 2. Replace refs
content = content.replace(
  `  const audioRef = useRef(null);

  const searchTimeoutRef =
    useRef(null);

  const requestIdRef =
    useRef(0);`,
  `  const [ytPlayer, setYtPlayer] = useState(null);
  const progressIntervalRef = useRef(null);

  const searchTimeoutRef =
    useRef(null);`
);

// 3. Replace Audio Player Logic
const audioPlayerStart = `  /* =====================================================\n     AUDIO PLAYER\n  ===================================================== */`;
const audioPlayerEnd = `  const closePlayer = () => {\n    requestIdRef.current += 1;\n\n    if (audioRef.current) {\n      audioRef.current.pause();\n\n      audioRef.current.removeAttribute(\n        "src"\n      );\n\n      audioRef.current.load();\n    }\n\n    setCurrentSong(null);\n    setIsPlaying(false);\n    setIsLoadingTrack(false);\n    setPlayerError("");\n    setProgress(0);\n    setDuration(0);\n  };`;

const startIndex = content.indexOf(audioPlayerStart);
const endIndex = content.indexOf(audioPlayerEnd) + audioPlayerEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

  const handlePlay = (song) => {
    if (!song?.videoId) return;
    setPlayerError("");

    if (currentSong?.videoId === song.videoId) {
      if (ytPlayer) {
        if (!isPlaying) {
          ytPlayer.playVideo();
        } else {
          ytPlayer.pauseVideo();
        }
      }
      return;
    }

    setCurrentSong(song);
    setIsPlaying(false);
    setIsLoadingTrack(true);
    setProgress(0);
    setDuration(0);
    setPlayerError("");
  };

  const togglePlay = () => {
    if (!ytPlayer || !currentSong) return;

    if (!isPlaying) {
      ytPlayer.playVideo();
    } else {
      ytPlayer.pauseVideo();
    }
  };

  /* =====================================================
     YOUTUBE EVENTS
  ===================================================== */

  const onPlayerReady = (event) => {
    setYtPlayer(event.target);
    event.target.setVolume(isMuted ? 0 : volume);
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    const state = event.data;
    // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
    if (state === 1) {
      setIsPlaying(true);
      setIsLoadingTrack(false);
      setDuration(event.target.getDuration());
    } else if (state === 2) {
      setIsPlaying(false);
    } else if (state === 0) {
      setIsPlaying(false);
      handleNext();
    } else if (state === 3) {
      setIsLoadingTrack(true);
    }
  };

  const onPlayerError = (event) => {
    console.error("YouTube Player Error:", event.data);
    setIsPlaying(false);
    setIsLoadingTrack(false);
    setPlayerError("This audio stream is unavailable. Try another track.");
  };

  useEffect(() => {
    if (isPlaying && ytPlayer) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(ytPlayer.getCurrentTime() || 0);
      }, 500);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, ytPlayer]);

  /* =====================================================
     SEEK / VOLUME
  ===================================================== */

  const handleSeek = (event) => {
    const value = Number(event.target.value);
    setProgress(value);

    if (ytPlayer) {
      ytPlayer.seekTo(value, true);
    }
  };

  const handleVolume = (event) => {
    const value = Number(event.target.value);
    setVolume(value);
    setIsMuted(value === 0);

    if (ytPlayer) {
      ytPlayer.setVolume(value);
    }
  };

  const toggleMute = () => {
    if (!ytPlayer) return;

    if (isMuted) {
      const nextVolume = volume || 80;
      ytPlayer.setVolume(nextVolume);
      setVolume(nextVolume);
      setIsMuted(false);
    } else {
      ytPlayer.setVolume(0);
      setIsMuted(true);
    }
  };

  const closePlayer = () => {
    if (ytPlayer) {
      ytPlayer.stopVideo();
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setIsLoadingTrack(false);
    setPlayerError("");
    setProgress(0);
    setDuration(0);
  };`;
  content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
} else {
  console.error("Could not find audio player block!");
  process.exit(1);
}

// 4. Replace <audio> with <YouTube>
content = content.replace(
  `    <main className="music-page">\n      <audio\n        ref={audioRef}\n        preload="auto"\n        playsInline\n      />`,
  `    <main className="music-page">
      {currentSong && currentSong.videoId && (
        <YouTube
          videoId={currentSong.videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onError={onPlayerError}
          className="music-youtube-hidden"
        />
      )}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully replaced Music.js content!");
