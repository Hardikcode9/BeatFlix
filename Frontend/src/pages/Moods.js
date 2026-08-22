/* eslint-disable */
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
  FaMicrophone,
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
  const BASE_URL = `${process.env.REACT_APP_API_URL}/api/chat`;

  const welcomeMessages = [
  {
    sender: "ai",
    text:
      "Welcome to BeatFlix! ðŸ‘‹\n\nHow are you feeling today? Tell me what's on your mind, or let's use the camera to find the perfect movies for you.",
  },
];

const [chats, setChats] = useState([]);

const [activeChatId, setActiveChatId] = useState(null);

const activeChat =
  chats.find((chat) => chat._id === activeChatId) || chats[0];

  const createNewChat = async () => {
  if (creatingChatRef.current) return;
  creatingChatRef.current = true;

  try {
    const token = localStorage.getItem("token");

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

    setChats((prev) => {
      if (prev.find((chat) => chat._id === data.chat._id)) {
        return prev;
      }

      return [
        {
          ...data.chat,
          messages: [...welcomeMessages],
        },
        ...prev,
      ];
    });

    setActiveChatId(data.chat._id);
    setRecommendedMovies([]);
  } catch (err) {
    console.error(err);
  } finally {
    creatingChatRef.current = false;
  }
};

const loadChats = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    const response = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("Mongo Chats:", data.chats);
    console.log("Mongo Count:", data.chats.length);

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (data.chats.length === 0) {
        setChats([]);
        setActiveChatId(null);
        return;
    }

    const chatsWithWelcome = data.chats.map((chat) => ({
      ...chat,
      messages:
        chat.messages.length > 0
          ? chat.messages
          : [...welcomeMessages],
    }));

    setChats(chatsWithWelcome);
    setActiveChatId(chatsWithWelcome[0]._id);

  } catch (err) {
    console.error("Load Chats:", err);
  }
};

const saveMessage = async (chatId, message) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/${chatId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.error("Save Message:", err);
  }
};

const selectChat = (id) => {
  setActiveChatId(id);
};

const deleteChat = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setChats((prev) => prev.filter((chat) => chat._id !== id));

    if (activeChatId === id) {
      setActiveChatId(null);
    }
  } catch (err) {
    console.error(err);
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
  const creatingChatRef = useRef(false);
  const isDetectingRef = useRef(false);

  const hasLoadedChats = useRef(false);

  const [tokensLeft, setTokensLeft] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [envContext, setEnvContext] = useState("");
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        console.error("Speech Recognition Error:", event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Voice recognition is not supported in this browser.");
    }
  };

  useEffect(() => {
    // Try to get weather context in background
    const getContext = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const data = await res.json();
        const code = data.current_weather.weathercode;
        let weatherContext = "mild";
        if (code === 0) weatherContext = "clear and sunny";
        else if (code >= 1 && code <= 3) weatherContext = "a bit cloudy";
        else if (code >= 51 && code <= 67) weatherContext = "raining";
        else if (code >= 71 && code <= 77) weatherContext = "snowing";
        
        setEnvContext(weatherContext);
      } catch (e) {
        console.log("Could not get location for environment context.");
      }
    };
    getContext();
  }, []);

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        const t = data.user.aiTokens !== undefined ? data.user.aiTokens : 5;
        setTokensLeft(data.user.subscription === "ultimate" ? "Unlimited" : t);
      }
    } catch (err) {}
  };

useEffect(() => {
  fetchMovies();
  loadModels();
  fetchTokens();

  if (!hasLoadedChats.current) {
    hasLoadedChats.current = true;
    loadChats();
  }

  return () => {
    stopScanner();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);

useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}, [messages, streamingText, isThinking]);

  const fetchMovies = async () => {
    try {
      const endpoints = [
        `${process.env.REACT_APP_API_URL}/api/movies/trending`,
        `${process.env.REACT_APP_API_URL}/api/movies/top-rated`,
        `${process.env.REACT_APP_API_URL}/api/movies/top-india`,
        `${process.env.REACT_APP_API_URL}/api/movies/top-global`,
        `${process.env.REACT_APP_API_URL}/api/movies/new-releases`
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

  const askGemini = async (userMessage, history) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/gemini/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: userMessage,
        history: history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      if (response.status === 403) {
        throw new Error(data.message || "You've reached your BeatFlix AI limit. Upgrade to Pro or Ultimate for more tokens!");
      }
      throw new Error(data.message || "Server Error");
    }

    return data;
  };

const streamReply = async (reply) => {
  setStreamingText("");

  for (let i = 0; i < reply.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 12));
    setStreamingText(reply.slice(0, i + 1));
  }

  return reply;
};

  const askBeatFlix = async (message, currentMessages) => {
    setIsThinking(true);
    try {
      const result = await askGemini(message, currentMessages);

      if (result.tokensLeft !== undefined) {
        setTokensLeft(result.tokensLeft);
      }

      console.log(result);

const finalReply = await streamReply(
  result.reply || "No recommendation available."
);

let matchedItems = [];
let matchedMusic = [];

if (result.domain === "music") {
  if (result.songs && Array.isArray(result.songs) && result.songs.length > 0) {
    const fetchPromises = result.songs.map(async (songName) => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/music/search?q=${encodeURIComponent(songName)}`);
        const data = await res.json();
        if (data && data.success && data.songs && data.songs.length > 0) {
            return data.songs[0];
        }
      } catch (e) {
        console.error("Music search error", e);
      }
      return null;
    });

    const fetchedSongs = (await Promise.all(fetchPromises)).filter(m => m !== null);
    if (fetchedSongs.length > 0) {
      matchedMusic = fetchedSongs;
    }
  } else {
    try {
      const q = (result.artists && result.artists.length > 0) ? result.artists[0] : (result.genres && result.genres.length > 0 ? result.genres[0] : "pop");
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/music/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success && data.songs) {
        matchedMusic = data.songs.slice(0, 6);
      }
    } catch(e) {
      console.error("Music fetch error", e);
    }
  }
} else if (result.domain === "movie" || result.domain === "mixed" || result.domain === "unknown") {
  if (result.movies && Array.isArray(result.movies) && result.movies.length > 0) {
    const fetchPromises = result.movies.map(async (movieName) => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/movies?search=${encodeURIComponent(movieName)}`);
        const data = await res.json();
        if (data && data.success && data.results && data.results.length > 0) {
            const movie = data.results[0]; // Take the top search result
            return {
                id: movie.id,
                title: movie.title,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster",
                genre: (movie.genre_ids || []).map((id) => genreMap[id]).filter(Boolean).slice(0, 2),
                rating: Number(movie.vote_average || 0).toFixed(1),
                year: movie.release_date?.split("-")[0] || "N/A",
                reason: `BeatFlix AI recommended this.`
            };
        }
      } catch (e) {
        console.error("Movie search error", e);
      }
      return null;
    });

    const fetchedMovies = (await Promise.all(fetchPromises)).filter(m => m !== null);
    if (fetchedMovies.length > 0) {
      matchedItems = fetchedMovies;
    }
  }

  // Fallback if specific search failed or AI didn't return movies array
  if (matchedItems.length === 0) {
    matchedItems = allMovies
      .filter((movie) =>
        movie.genre.some((genre) => result.genres?.includes(genre))
      )
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 6)
      .map((movie) => ({
        ...movie,
        reason: `Recommended because it matches your ${movie.genre[0]} preference.`,
      }));
  }
}

const aiMessage = {
  sender: "ai",
  text: finalReply,
  movies: matchedItems,
  music: matchedMusic
};

updateMessages([
  ...currentMessages,
  aiMessage,
]);

await saveMessage(activeChatId, aiMessage);

setStreamingText("");

// Optional: Text to speech if you want the AI to read the message out loud
if (window.speechSynthesis) {
  const utterance = new SpeechSynthesisUtterance(finalReply);
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

setRecommendedMovies(matchedItems);    } catch (err) {
      updateMessages([
        ...currentMessages,
        {
          sender: "ai",
          text: err.message || "Connection to BeatFlix servers lost. Try again.",
        },
      ]);
    }
    setIsThinking(false);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
const updatedMessages = [
  ...messages,
  userMessage,
];

updateMessages(updatedMessages);

await saveMessage(activeChatId, userMessage);
    setInput("");
    setIsThinking(true); 

    let timeContext = "daytime";
    const hour = new Date().getHours();
    if (hour < 12) timeContext = "morning";
    else if (hour < 18) timeContext = "afternoon";
    else if (hour < 22) timeContext = "evening";
    else timeContext = "late night";

    let contextString = "";
    if (envContext) {
      contextString = ` (System Note: The user's current environment is ${envContext} and it is ${timeContext}. Please tailor your recommendation to this environmental vibe if appropriate.)`;
    } else {
      contextString = ` (System Note: It is currently ${timeContext}.)`;
    }

    askBeatFlix(userMessage.text + contextString, updatedMessages);
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

  if (scanIntervalRef.current) {
    clearInterval(scanIntervalRef.current);
  }

  scanIntervalRef.current = setInterval(async () => {
    if (!videoRef.current) return;
    if (isDetectingRef.current) return;

    isDetectingRef.current = true;

    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.5,
          })
        )
        .withFaceExpressions();

      if (!detection) {
        setScanPhase("Searching for face...");
        emotionHistoryRef.current = [];
        return;
      }

      const expressions = detection.expressions;

      const strongestEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      if (expressions[strongestEmotion] < 0.45) return;

      emotionHistoryRef.current.push(strongestEmotion);

      if (emotionHistoryRef.current.length > 5) {
        emotionHistoryRef.current.shift();
      }

      const counts = {};

      emotionHistoryRef.current.forEach((e) => {
        counts[e] = (counts[e] || 0) + 1;
      });

      const stableEmotion = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );

      if (counts[stableEmotion] >= 4 && !scanLockedRef.current) {
scanLockedRef.current = true;

clearInterval(scanIntervalRef.current);
stopScanner();

const detectedEmotion = stableEmotion;

updateMessages([
  ...messages,
  {
    sender: "user",
    text: `[Biometric Scan: ${detectedEmotion.toUpperCase()}]`,
  },
]);

askBeatFlix(
  `I am feeling ${detectedEmotion}. Ask me if I want to watch a movie or listen to music.`
);
      }
    } catch (err) {
      console.error(err);
    } finally {
      isDetectingRef.current = false;
    }
  }, 300);
};

  const stopScanner = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach((track) => track.stop()); streamRef.current = null; }
    emotionHistoryRef.current = [];
    setIsScanning(false);
  };

  const formatMessage = (text) => {
  return text.split("\n").map((line, index) => {
    let trimmed = line.trim();

    if (!trimmed) {
      return <br key={index} />;
    }
    
    // Parse bold text
    const renderBold = (str) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} style={{color: '#38bdf8'}}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    if (/^\d+\./.test(trimmed)) {
      return (
        <div key={index} className="message-list-item">
          {renderBold(trimmed)}
        </div>
      );
    }

    if (trimmed.startsWith("â€¢") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      // Remove bullet char
      trimmed = trimmed.replace(/^[-â€¢*]\s*/, "");
      
      // Auto-bold the title if there's a colon but no existing bold
      if (!trimmed.includes("**") && trimmed.includes(":")) {
          const parts = trimmed.split(":");
          trimmed = `**${parts[0]}**:${parts.slice(1).join(":")}`;
      }
      // Or if they used single quotes like 'Movie Name'
      else if (!trimmed.includes("**") && /^'[^']+'/.test(trimmed)) {
          trimmed = trimmed.replace(/^'([^']+)'/, "**$1**");
      }

      return (
        <div key={index} className="message-list-item">
          {renderBold(trimmed)}
        </div>
      );
    }

    if (trimmed.endsWith(":")) {
      return (
        <div key={index} className="message-heading">
          {renderBold(trimmed)}
        </div>
      );
    }

    return <div key={index}>{renderBold(trimmed)}</div>;
  });
};

  return (
    <div className="beatflix-moods">
      <div
        className="mood-container"
      >
        <section className="moods-hero">
          {/* ðŸš€ RESTORED PULSING BADGE */}
          <span className="hero-label">
            <span className="badge-dot"></span> BEATFLIX ASSISTANT
          </span>
          <h1 className="hero-movie-title"><span>What are you in the mood for?</span></h1>
          <p className="mood-subtitle">Tell us how you're feeling, or let the camera find the perfect movies and music for your mood.</p>
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
                                            <span>â­ {movie.rating}</span>
                                          </div>

                                          <div className="chat-movie-genres">
                                            {movie.genre?.join(" â€¢ ") || "Unknown"}
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
                                {msg.music?.length > 0 && (
                                  <div className="chat-movie-carousel">
                                    {msg.music.map((song) => (
                                      <div
                                        key={song.videoId}
                                        className="chat-movie-card"
                                        onClick={() => navigate(`/music/${song.videoId}`, { state: { song } })}
                                      >
                                        <img
                                          src={song.thumbnail || `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`}
                                          alt={song.title}
                                          className="chat-movie-poster"
                                        />
                                        <div className="chat-movie-info">
                                          <h4>{song.title}</h4>
                                          <div className="chat-movie-genres">
                                            {song.channelTitle || "Artist"}
                                          </div>
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
              
              <button
                type="button"
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                title="Speak your mood"
                style={{
                  background: 'none', border: 'none', color: isListening ? '#ff416c' : '#aaa', 
                  fontSize: '1.2rem', cursor: 'pointer', padding: '0 10px', transition: 'color 0.2s'
                }}
              >
                <FaMicrophone />
              </button>

              {tokensLeft !== null && (
                <div className="input-token-counter" title={`${tokensLeft} Tokens Left`}>
                  <span className="token-icon">âš¡</span> 
                  <span className="token-text">{tokensLeft}</span>
                </div>
              )}
              <button className="watch-btn mood-send-btn" type="submit">Send</button>
            </form>

            <div className="fancy-divider">
              <span className="line"></span>
              <span>OR</span>
              <span className="line"></span>
            </div>

            {/* ðŸš€ ADDED GLOW WRAPPER */}
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
                <h2>ðŸŽ¬ Recommended For You</h2>
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
                      
                      {/* ðŸš€ UPGRADED 3D OVERLAY WITH PLAY BUTTON */}
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
                      <span>{movie.genre?.length > 0
  ? movie.genre.join(" â€¢ ")
  : "Unknown"}</span>
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
