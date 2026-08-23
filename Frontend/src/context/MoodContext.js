import { createContext, useContext, useState, useEffect } from "react";

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const moodThemes = {
  neutral: {
    name: "neutral",
    emoji: "😐",
    bgGradient: "linear-gradient(135deg, #060a14, #12182b)",
    primaryAccent: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.4)",
  },
  happy: {
    name: "happy",
    emoji: "😊",
    bgGradient: "linear-gradient(135deg, #1f0b00, #361700)",
    primaryAccent: "#ff8c00",
    glowColor: "rgba(255, 140, 0, 0.4)",
  },
  sad: {
    name: "sad",
    emoji: "😢",
    bgGradient: "linear-gradient(135deg, #020a14, #05162b)",
    primaryAccent: "#1d4ed8",
    glowColor: "rgba(29, 78, 216, 0.4)",
  },
  angry: {
    name: "angry",
    emoji: "😡",
    bgGradient: "linear-gradient(135deg, #240000, #3a0000)",
    primaryAccent: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.4)",
  },
  surprised: {
    name: "surprised",
    emoji: "😲",
    bgGradient: "linear-gradient(135deg, #100b1a, #231245)",
    primaryAccent: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  fearful: {
    name: "fearful",
    emoji: "😨",
    bgGradient: "linear-gradient(135deg, #050a0a, #0b1a1a)",
    primaryAccent: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.4)",
  },
  disgusted: {
    name: "disgusted",
    emoji: "🤢",
    bgGradient: "linear-gradient(135deg, #0d1a08, #18330f)",
    primaryAccent: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.4)",
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
    root.style.setProperty("--theme-glow", theme.glowColor);

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
