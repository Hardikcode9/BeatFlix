/* eslint-disable */
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState(() => {
    return JSON.parse(localStorage.getItem("beatflix_playlist")) || [];
  });
  const [queueIndex, setQueueIndex] = useState(-1);
  const [vibeContext, setVibeContext] = useState(null);
  const [isFetchingMoreVibe, setIsFetchingMoreVibe] = useState(false);

  const queueRef = useRef(queue);
  const queueIndexRef = useRef(-1);
  const isLoopRef = useRef(false);
  const isManualTrackChangeRef = useRef(false);

  useEffect(() => { isLoopRef.current = isLoop; }, [isLoop]);

  // Search Cache
  const [cachedSongs, setCachedSongs] = useState([]);
  const [cachedSearch, setCachedSearch] = useState("");
  const [cachedActiveSearch, setCachedActiveSearch] = useState("Arijit Singh");
  const [cachedSelectedMood, setCachedSelectedMood] = useState("All");

  const ytPlayerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && ytPlayerRef.current) {
      progressIntervalRef.current = setInterval(() => {
        try {
          setProgress(ytPlayerRef.current.getCurrentTime() || 0);
          setDuration(ytPlayerRef.current.getDuration() || 0);
        } catch(e) {}
      }, 500);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying]);

  const playSong = (song) => {
    setCurrentSong(song);
    // When playing a single song outside queue, ensure it plays via state change
    isManualTrackChangeRef.current = true;
  };

  const playQueue = (songs, startIndex = 0, newVibeContext = null) => {
    if (!songs || songs.length === 0) return;
    queueRef.current = songs;
    queueIndexRef.current = startIndex;
    isManualTrackChangeRef.current = true;
    
    setQueue(songs);
    setQueueIndex(startIndex);
    setCurrentSong(songs[startIndex]);
    setVibeContext(newVibeContext);
  };

  const playNext = () => {
    const q = queueRef.current;
    const qIdx = queueIndexRef.current;
    const loop = isLoopRef.current;
    
    if (!q || q.length === 0) return;
    let nextIndex = qIdx + 1;
    if (nextIndex >= q.length) {
      if (loop) {
        nextIndex = 0;
      } else {
        return;
      }
    }
    
    queueIndexRef.current = nextIndex;
    isManualTrackChangeRef.current = true;
    setQueueIndex(nextIndex);
    setCurrentSong(q[nextIndex]);
  };

  const playPrevious = () => {
    const q = queueRef.current;
    const qIdx = queueIndexRef.current;
    const loop = isLoopRef.current;

    if (!q || q.length === 0) return;
    let prevIndex = qIdx - 1;
    if (prevIndex < 0) {
      if (loop) {
        prevIndex = q.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    
    queueIndexRef.current = prevIndex;
    isManualTrackChangeRef.current = true;
    setQueueIndex(prevIndex);
    setCurrentSong(q[prevIndex]);
  };

  const closePlayer = () => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.stopVideo();
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlay = () => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!ytPlayerRef.current) return;
    if (isMuted) {
      ytPlayerRef.current.unMute();
      setIsMuted(false);
    } else {
      ytPlayerRef.current.mute();
      setIsMuted(true);
    }
  };

  const seekTo = (value) => {
    if (!ytPlayerRef.current) return;
    ytPlayerRef.current.seekTo(value, true);
    setProgress(value);
  };

  const handlePlayerReady = (event) => {
    ytPlayerRef.current = event.target;
    event.target.playVideo();
  };

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.UNSTARTED || event.data === window.YT.PlayerState.CUED) {
      if (isManualTrackChangeRef.current) {
        event.target.playVideo();
      }
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      isManualTrackChangeRef.current = false; // Successfully playing new track
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      
      if (isManualTrackChangeRef.current) {
        // Ignore this ENDED event, it's just the previous track stopping synchronously
        return;
      }

      const currentQueue = queueRef.current;
      const currentIndex = queueIndexRef.current;
      const loop = isLoopRef.current;

      if (currentQueue && currentQueue.length > 0) {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= currentQueue.length) {
          if (loop) {
            playNext();
          }
        } else {
          playNext();
        }
      } else {
        if (loop && ytPlayerRef.current) {
          ytPlayerRef.current.playVideo();
        }
      }
    }
  };

  const value = {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isLoop,
    isShuffle,
    setIsLoop,
    setIsShuffle,
    playSong,
    playQueue,
    playNext,
    playPrevious,
    queue,
    queueIndex,
    closePlayer,
    togglePlay,
    toggleMute,
    seekTo,
    ytPlayerRef,
    handlePlayerReady,
    handlePlayerStateChange,
    
    // Search Cache
    cachedSongs,
    setCachedSongs,
    cachedSearch,
    setCachedSearch,
    cachedActiveSearch,
    setCachedActiveSearch,
    cachedSelectedMood,
    setCachedSelectedMood,
    vibeContext,
    setVibeContext,
  };

  useEffect(() => {
    // Eagerly fetch more vibe songs if we are on the last or second to last song
    if (vibeContext && queue.length > 0 && queueIndex >= queue.length - 2 && !isFetchingMoreVibe) {
      const fetchMoreVibes = async () => {
        setIsFetchingMoreVibe(true);
        try {
          const token = localStorage.getItem("token");
          const excludeSongs = queue.map(s => s.title).slice(-15);
          
          const vibeRes = await fetch(`${process.env.REACT_APP_API_URL}/api/gemini/vibe-playlist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              ...vibeContext,
              excludeSongs
            })
          });
          const vibeData = await vibeRes.json();
          
          if (vibeData.songs && vibeData.songs.length > 0) {
            const songPromises = vibeData.songs.map(async (songQuery) => {
              try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/music/search?q=${encodeURIComponent(songQuery)}`);
                const searchData = await res.json();
                if (searchData.success && searchData.songs && searchData.songs.length > 0) {
                  return searchData.songs[0];
                }
              } catch (e) {}
              return null;
            });
            const fetchedSongs = (await Promise.all(songPromises)).filter(s => s !== null);
            
            if (fetchedSongs.length > 0) {
              const newQueue = [...queueRef.current, ...fetchedSongs];
              queueRef.current = newQueue;
              setQueue(newQueue);
              localStorage.setItem("beatflix_playlist", JSON.stringify(newQueue));
            }
          }
        } catch(e) {
          console.error("Eager vibe fetch failed", e);
        } finally {
          setIsFetchingMoreVibe(false);
        }
      };
      
      fetchMoreVibes();
    }
  }, [queueIndex, vibeContext, queue.length, isFetchingMoreVibe, queue]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
