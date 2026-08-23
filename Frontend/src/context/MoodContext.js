import { createContext, useContext, useState, useEffect } from "react";

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const moodThemes = {
  neutral: {
    name: "neutral",
    emoji: "😐",
    bgGradient: "linear-gradient(135deg, #02040b 0%, #050816 30%, #08111d 60%, #02040b 100%)",
    primaryAccent: "#38bdf8",
    secondaryAccent: "#5d5fef",
    glowColor: "rgba(56, 189, 248, 0.4)",
    blob1: "rgba(90,100,255,.22)",
    blob2: "rgba(0,195,255,.18)",
    blob3: "rgba(155,70,255,.18)",
    imageTint: "rgba(56, 189, 248, 0.15)",
  },
  happy: {
    name: "happy",
    emoji: "😊",
    bgGradient: "linear-gradient(135deg, #1f0b00 0%, #361700 30%, #4a2100 60%, #1f0b00 100%)",
    primaryAccent: "#ff8c00",
    secondaryAccent: "#fbbf24",
    glowColor: "rgba(255, 140, 0, 0.4)",
    blob1: "rgba(255,140,0,.22)",
    blob2: "rgba(251,191,36,.18)",
    blob3: "rgba(245,158,11,.18)",
    imageTint: "rgba(255, 140, 0, 0.2)",
  },
  sad: {
    name: "sad",
    emoji: "😢",
    bgGradient: "linear-gradient(135deg, #020a14 0%, #05162b 30%, #082346 60%, #020a14 100%)",
    primaryAccent: "#1d4ed8",
    secondaryAccent: "#60a5fa",
    glowColor: "rgba(29, 78, 216, 0.4)",
    blob1: "rgba(29,78,216,.22)",
    blob2: "rgba(96,165,250,.18)",
    blob3: "rgba(59,130,246,.18)",
    imageTint: "rgba(29, 78, 216, 0.25)",
  },
  angry: {
    name: "angry",
    emoji: "😡",
    bgGradient: "linear-gradient(135deg, #240000 0%, #3a0000 30%, #520000 60%, #240000 100%)",
    primaryAccent: "#ef4444",
    secondaryAccent: "#f97316",
    glowColor: "rgba(239, 68, 68, 0.4)",
    blob1: "rgba(239,68,68,.22)",
    blob2: "rgba(249,115,22,.18)",
    blob3: "rgba(220,38,38,.18)",
    imageTint: "rgba(239, 68, 68, 0.3)",
  },
  surprised: {
    name: "surprised",
    emoji: "😲",
    bgGradient: "linear-gradient(135deg, #100b1a 0%, #231245 30%, #351a68 60%, #100b1a 100%)",
    primaryAccent: "#a855f7",
    secondaryAccent: "#ec4899",
    glowColor: "rgba(168, 85, 247, 0.4)",
    blob1: "rgba(168,85,247,.22)",
    blob2: "rgba(236,72,153,.18)",
    blob3: "rgba(192,132,252,.18)",
    imageTint: "rgba(168, 85, 247, 0.25)",
  },
  fearful: {
    name: "fearful",
    emoji: "😨",
    bgGradient: "linear-gradient(135deg, #050a0a 0%, #0b1a1a 30%, #102a2a 60%, #050a0a 100%)",
    primaryAccent: "#14b8a6",
    secondaryAccent: "#10b981",
    glowColor: "rgba(20, 184, 166, 0.4)",
    blob1: "rgba(20,184,166,.22)",
    blob2: "rgba(16,185,129,.18)",
    blob3: "rgba(5,150,105,.18)",
    imageTint: "rgba(20, 184, 166, 0.2)",
  },
  disgusted: {
    name: "disgusted",
    emoji: "🤢",
    bgGradient: "linear-gradient(135deg, #0d1a08 0%, #18330f 30%, #244c16 60%, #0d1a08 100%)",
    primaryAccent: "#22c55e",
    secondaryAccent: "#84cc16",
    glowColor: "rgba(34, 197, 94, 0.4)",
    blob1: "rgba(34,197,94,.22)",
    blob2: "rgba(132,204,22,.18)",
    blob3: "rgba(21,128,61,.18)",
    imageTint: "rgba(132, 204, 22, 0.2)",
  },
};

export const MoodProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState(() => {
    return localStorage.getItem("beatflixMood") || "neutral";
  });

  useEffect(() => {
    const theme = moodThemes[currentMood] || moodThemes.neutral;
    const root = document.documentElement;
    
    // Apply CSS Variables globally
    root.style.setProperty("--theme-bg", theme.bgGradient);
    root.style.setProperty("--theme-accent", theme.primaryAccent);
    root.style.setProperty("--theme-accent-secondary", theme.secondaryAccent);
    root.style.setProperty("--theme-glow", theme.glowColor);
    root.style.setProperty("--theme-blob-1", theme.blob1);
    root.style.setProperty("--theme-blob-2", theme.blob2);
    root.style.setProperty("--theme-blob-3", theme.blob3);
    root.style.setProperty("--theme-image-tint", theme.imageTint);

    // Save to local storage
    localStorage.setItem("beatflixMood", currentMood);
  }, [currentMood]);

  const setMood = (moodName) => {
    // Normalize mood string
    let normalized = moodName.toLowerCase().trim();
    
    // Map common words to basic moods if needed
    if (normalized.includes("chill") || normalized.includes("relaxed") || normalized.includes("calm")) normalized = "neutral";
    if (normalized.includes("energetic") || normalized.includes("excited") || normalized.includes("joy")) normalized = "happy";
    
    if (moodThemes[normalized]) {
      setCurrentMood(normalized);
    } else {
      // Fallback
      setCurrentMood("neutral");
    }
  };

  return (
    <MoodContext.Provider value={{ currentMood, setMood, themeData: moodThemes[currentMood] || moodThemes.neutral }}>
      {children}
    </MoodContext.Provider>
  );
};
