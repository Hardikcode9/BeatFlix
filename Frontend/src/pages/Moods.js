import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaTimes,
  FaStar,
  FaMagic,
  FaPlay,
  FaEye,
} from "react-icons/fa";
import * as faceapi from "face-api.js";
import ChatSidebar from "../components/ChatSidebar";
import "../styles/Moods.css";

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

function Moods() {
  const navigate = useNavigate();

  const [allMovies, setAllMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [input, setInput] = useState("");
  const BASE_URL = "http://localhost:4000/api/chat";

  const welcomeMessages = [
  {
    sender: "ai",
    text:
      "Welcome to BeatFlix AI. ✦\n\nHow are you feeling today? Tell me what's on your mind, or let's scan your face with the camera to find perfect movies for your vibe.",
  },
];

const [chats, setChats] = useState([]);

const [activeChatId, setActiveChatId] = useState(null);

const activeChat =
  chats.find((chat) => chat._id === activeChatId) || chats[0];

const createNewChat = async () => {
  try {
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first.");
  return;
}

const response = await fetch(BASE_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const newChat = {
      ...data.chat,
      messages: [...welcomeMessages],
    };

    setChats((prev) => [newChat, ...prev]);

    setActiveChatId(newChat._id);

    setRecommendedMovies([]);

  } catch (error) {
    console.error(error);
    alert("Unable to create chat.");
  }
};

const selectChat = (id) => {
  setActiveChatId(id);
};

const deleteChat = (id) => {
  const updatedChats = chats.filter(chat => chat._id !== id);

  if (updatedChats.length === 0) {
    createNewChat();
    return;
  }

  setChats(updatedChats);

  if (activeChatId === id) {
    setActiveChatId(updatedChats[0]._id);
  }
};

const renameChat = (id, newTitle) => {
  if (!newTitle.trim()) return;

  setChats((prev) =>
    prev.map((chat) =>
      chat._id === id
        ? {
            ...chat,
            title: newTitle.trim(),
          }
        : chat
    )
  );
};

const getChatTitle = (text) => {
  if (!text) return "New Chat";

  const cleaned = text
    .replace(/\[.*?\]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();

  if (!cleaned) return "New Chat";

  const words = cleaned.split(" ").slice(0, 4);

  return words.join(" ");
};

const updateMessages = (newMessages) => {
  setChats((prev) =>
    prev.map((chat) => {
      if (chat._id !== activeChatId) return chat;

      let title = chat.title;

      if (
        title === "New Chat" &&
        newMessages.length > 1
      ) {
        const firstUser = newMessages.find(
          (msg) => msg.sender === "user"
        );

        if (firstUser) {
          title = getChatTitle(firstUser.text);
        }
      }
      return {
        ...chat,
        title,
        messages: newMessages,
      };
    })
  );
};

  const messages = activeChat?.messages || [];
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState("Warming up the lens...");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const recommendationRef = useRef(null);
  const chatEndRef = useRef(null);
  const emotionHistoryRef = useRef([]);
  const abortControllerRef = useRef(null);
  const scanLockedRef = useRef(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isThinking]);

  useEffect(() => {
    fetchMovies();
    loadModels();
    return () => {
      stopScanner();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchMovies = async () => {
    try {
      const endpoints = [
        "http://localhost:4000/api/movies/trending",
        "http://localhost:4000/api/movies/top-rated",
        "http://localhost:4000/api/movies/top-india",
        "http://localhost:4000/api/movies/top-global",
        "http://localhost:4000/api/movies/new-releases"
      ];

      const responses = await Promise.all(
        endpoints.map((url) =>
          fetch(url).then((res) => (res.ok ? res.json() : { results: [] })).catch(() => ({ results: [] }))
        )
      );

      const movieMap = new Map();
      responses.forEach((data) => {
        if (data && data.results) {
          data.results.forEach((movie) => {
            if (!movieMap.has(movie.id)) {
              movieMap.set(movie.id, {
                id: movie.id,
                title: movie.title,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster",
                genre: (movie.genre_ids || []).map((id) => genreMap[id]).filter(Boolean).slice(0, 2),
                rating: Number(movie.vote_average || 0).toFixed(1),
                year: movie.release_date?.split("-")[0] || "N/A",
              });
            }
          });
        }
      });

      setAllMovies(Array.from(movieMap.values()));
    } catch (err) {
      console.error("Error building master movie list:", err);
    }
  };

  const filterMovies = (genres) => {
    if (!genres || genres.length === 0) {
      setRecommendedMovies([]);
      return;
    }

    let primaryMatches = allMovies.filter((movie) => {
      if (!movie.genre || movie.genre.length === 0) return false;
      return movie.genre.some((g) => genres.includes(g));
    });

    primaryMatches.sort((a, b) => b.rating - a.rating);
    let finalRecommendations = [...primaryMatches];

    if (finalRecommendations.length < 50) {
      const primaryIds = new Set(finalRecommendations.map((m) => m.id));
      const remainingMovies = allMovies.filter((m) => !primaryIds.has(m.id)).sort((a, b) => b.rating - a.rating);
      finalRecommendations = [...finalRecommendations, ...remainingMovies];
    }

    setRecommendedMovies(finalRecommendations.slice(0, 50));
    setTimeout(() => {
      recommendationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  const loadModels = async () => {
    const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (err) { console.error(err); }
  };

  const handleCardMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = (((rect.height / 2) - y) / (rect.height / 2)) * 8;
    card.style.setProperty("--rotateX", `${rotateX}deg`);
    card.style.setProperty("--rotateY", `${rotateY}deg`);
  }, []);

  const handleCardLeave = useCallback((e) => {
    e.currentTarget.style.setProperty("--rotateX", "0deg");
    e.currentTarget.style.setProperty("--rotateY", "0deg");
  }, []);

  const askGemini = async (userMessage) => {
    const response = await fetch("http://localhost:4000/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      throw new Error(data.message || "Server Error");
    }

    return data;
  };

const streamReply = async (reply) => {

  setStreamingText("");

  for (let i = 0; i < reply.length; i++) {

    await new Promise(resolve => setTimeout(resolve, 12));

    setStreamingText(reply.slice(0, i + 1));

  }

};

  const askBeatFlix = async (message) => {
    setIsThinking(true);
    try {const result = await askGemini(message);

await streamReply(result.reply);

const matchedMovies = allMovies
  .filter((movie) =>
    movie.genre.some((genre) => result.genres.includes(genre))
  )
  .sort((a, b) => Number(b.rating) - Number(a.rating))
  .slice(0, 6)
.map(movie => ({
    ...movie,
    reason: `Recommended because it matches your ${movie.genre[0]} preference.`
}));
  console.log("Matched Movies:", matchedMovies);

updateMessages([
  ...messages,
  {
    sender: "ai",
    text: result.reply,
    movies: matchedMovies,
  },
]);

setStreamingText("");

setRecommendedMovies(matchedMovies);} 
    catch (err) {
        updateMessages([
          ...messages,
          {
            sender: "ai",
            text: "Connection to BeatFlix servers lost. Try again.",
          },
        ]);
    }
    setIsThinking(false);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    updateMessages([
      ...messages,
      userMessage,
    ]);
    setInput("");
    setIsThinking(true); 
    askBeatFlix(userMessage.text);
  };

  const startScanner = async () => {
    if (!modelsLoaded) return alert("Initializing lenses...");
    try {
      scanLockedRef.current = false;
      setIsScanning(true);
      setScanPhase("Reading your vibe...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      stopScanner();
    }
  };

  const handleVideoPlay = () => {
    setScanPhase("Analyzing micro-expressions...");
    emotionHistoryRef.current = [];
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        if (!detection) {
          setScanPhase("Searching for face...");
          emotionHistoryRef.current = [];
          return;
        }

        const expressions = detection.expressions;
        const strongestEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
        if (expressions[strongestEmotion] < 0.55) return;

        emotionHistoryRef.current.push(strongestEmotion);
        if (emotionHistoryRef.current.length > 10) emotionHistoryRef.current.shift();

        const counts = {};
        emotionHistoryRef.current.forEach((e) => { counts[e] = (counts[e] || 0) + 1; });
        const stableEmotion = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

        if (counts[stableEmotion] >= 7 && !scanLockedRef.current) {
          scanLockedRef.current = true;
          clearInterval(scanIntervalRef.current);
          setScanPhase(`Got it! Mood detected: ${stableEmotion.toUpperCase()}`);
          setTimeout(() => {
            stopScanner();
            updateMessages([
              ...messages,
              {
                sender: "user",
                text: `[Biometric Scan: ${stableEmotion.toUpperCase()}]`,
              },
            ]);
            askBeatFlix(`My camera scan showed I'm feeling ${stableEmotion}. Pick great movies for me!`);
          }, 1500);
        }
      } catch (err) { console.error(err); }
    }, 200);
  };

  const stopScanner = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach((track) => track.stop()); streamRef.current = null; }
    emotionHistoryRef.current = [];
    setIsScanning(false);
  };

  const formatMessage = (text) => {
  return text.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <br key={index} />;
    }

    if (/^\d+\./.test(trimmed)) {
      return (
        <div key={index} className="message-list-item">
          {trimmed}
        </div>
      );
    }

    if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      return (
        <div key={index} className="message-list-item">
          {trimmed}
        </div>
      );
    }

    if (trimmed.endsWith(":")) {
      return (
        <div key={index} className="message-heading">
          {trimmed}
        </div>
      );
    }

    return <div key={index}>{trimmed}</div>;
  });
};

  return (
    <div className="beatflix-moods">
      <div
        className="mood-container"
      >
        <section className="moods-hero">
          {/* 🚀 RESTORED PULSING BADGE */}
          <span className="hero-label">
            <span className="badge-dot"></span> BEATFLIX AI ONLINE
          </span>
          <h1 className="hero-movie-title"><span>Curate Your Vibe</span></h1>
          <p className="mood-subtitle">Speak to our cinematic AI or let the biometric lens read your micro-expressions to craft the perfect watchlist.</p>
        </section>

        <div className="chat-layout">

        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={createNewChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
        />

          <div className="chat-section">
              <section className="ai-control-center">
            <div className="chat-window">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender} message-enter`}
                >
                  <div className={`chat-avatar ${msg.sender}`}>
                    {msg.sender === "ai" ? "B" : "Y"}
                  </div>
                                <div className="chat-bubble">

                                <div className="message-text">
                                  {formatMessage(msg.text)}
                                </div>

                                {msg.movies?.length > 0 && (
                                  <div className="chat-movie-carousel">
                                    {msg.movies.map((movie) => (
                                      <div
                                        key={movie.id}
                                        className="chat-movie-card"
                                        onClick={() => navigate(`/movie/${movie.id}`)}
                                      >
                                        <img
                                          src={movie.poster}
                                          alt={movie.title}
                                          className="chat-movie-poster"
                                        />

                                        <div className="chat-movie-info">
                                          <h4>{movie.title}</h4>

                                          <div className="chat-movie-meta">
                                            <span>{movie.year}</span>
                                            <span>⭐ {movie.rating}</span>
                                          </div>

                                          <div className="chat-movie-genres">
                                            {movie.genre.join(" • ")}
                                          </div>
                                          <p className="chat-movie-reason">
                                            {movie.reason ||
                                              `Recommended because it matches your ${
                                                movie.genre[0]
                                              } preference.`}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                  <div className="message-footer">

                                    <span className="sender-name">
                                      {msg.sender === "ai" ? "BeatFlix AI" : "You"}
                                    </span>

                                    <span className="message-time">
                                      {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>

                                  </div>

                                  </div>
                                  </div>
              ))}
              {isThinking && (

                <div className="chat-message ai">

                <div className="chat-avatar ai">
                  B
                </div>

                  <div className="chat-bubble">

                    {streamingText.length > 0 ? (

                    <div className="message-text">
                      {formatMessage(streamingText)}
                    </div>

                    ) : (

                      <div className="typing">

                        <span></span>
                        <span></span>
                        <span></span>

                      </div>

                    )}

                  </div>

                </div>

              )}
              <div ref={chatEndRef}></div>
            </div>

            <form className="search-box mood-search-box" onSubmit={handleChatSubmit}>
              <FaMagic className="search-icon" />
              <input placeholder="Tell BeatFlix AI how you're feeling right now..." value={input} onChange={(e) => setInput(e.target.value)} />
              <button className="watch-btn mood-send-btn" type="submit">Send</button>
            </form>

            <div className="fancy-divider">
              <span className="line"></span>
              <span>OR</span>
              <span className="line"></span>
            </div>

            {/* 🚀 ADDED GLOW WRAPPER */}
            <div className="premium-scan-wrapper">
              <button className="premium-scan-btn" onClick={startScanner} type="button">
                <div className="btn-content">
                  <div className="cam-icon-box">
                    <FaCamera />
                  </div>
                  <div className="btn-text-group">
                    <strong>FaceID Emotion Scan</strong>
                    <span>Enable neural optics for real-time mood analysis</span>
                  </div>
                </div>
              </button>
            </div>
          </section>

        </div>

      </div>

        <section className="recommendations" ref={recommendationRef}>
          {recommendedMovies.length > 0 && (
            <div className="movie-rail">
              <div className="rail-header">
                <h2>🎬 Recommended For You</h2>
                <p>Based on your current mood</p>
              </div>
              <div className="mood-grid-container">
                {recommendedMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    style={{ animationDelay: `${(index % 12) * 80}ms` }}
                    onMouseMove={handleCardMove}
                    onMouseLeave={handleCardLeave}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <div className="movie-poster">
                      <img src={movie.poster} alt={movie.title} />
                      
                      {/* 🚀 UPGRADED 3D OVERLAY WITH PLAY BUTTON */}
                      <div className="movie-view-overlay">
                        <div className="movie-play-btn">
                          <FaPlay />
                        </div>
                        <div className="movie-view-action">
                          <FaEye /><span>View Details</span>
                        </div>
                      </div>
                      
                    </div>
                    <div className="movie-details">
                      <h4>{movie.title}</h4>
                      <span>{movie.genre.length > 0 ? movie.genre.join(" • ") : "N/A"}</span>
                      <div className="movie-meta">
                        <p>{movie.year}</p>
                        <p><FaStar />{movie.rating}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* BIOMETRIC SCANNER MODAL */}
      {isScanning && (
        <div className="scanner-modal-overlay">
          <div className="scanner-bg"></div>
          <div className="scanner-content">
            <button className="close-scanner" onClick={stopScanner}><FaTimes /></button>
            <div className="scanner-frame-wrapper">
              <div className="conic-glow-bg"></div>
              <div className="face-id-frame">
                <video ref={videoRef} autoPlay playsInline muted disablePictureInPicture className="camera-feed" onPlay={handleVideoPlay} />
                <div className="face-id-sweep"></div>
              </div>
            </div>
            <div className="hero-label mt-4">{scanPhase}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Moods;