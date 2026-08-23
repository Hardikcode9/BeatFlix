import { createContext, useContext, useState, useEffect } from "react";

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const moodThemes = {
  // --- BASE 7 EMOTIONS (From face-api) ---
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

  // --- NEW EXPANDED MOODS ---
  romantic: {
    name: "romantic",
    emoji: "💖",
    bgGradient: "linear-gradient(135deg, #2a0816 0%, #4a0d24 30%, #68112e 60%, #2a0816 100%)",
    primaryAccent: "#ff1493",
    secondaryAccent: "#ff69b4",
    glowColor: "rgba(255, 20, 147, 0.4)",
    blob1: "rgba(255,20,147,.22)",
    blob2: "rgba(255,105,180,.18)",
    blob3: "rgba(220,20,60,.18)",
    imageTint: "rgba(255, 20, 147, 0.25)",
  },
  energetic: {
    name: "energetic",
    emoji: "⚡",
    bgGradient: "linear-gradient(135deg, #0a1c0a 0%, #123512 30%, #1a4f1a 60%, #0a1c0a 100%)",
    primaryAccent: "#39ff14",
    secondaryAccent: "#ffff00",
    glowColor: "rgba(57, 255, 20, 0.4)",
    blob1: "rgba(57,255,20,.22)",
    blob2: "rgba(255,255,0,.18)",
    blob3: "rgba(0,255,0,.18)",
    imageTint: "rgba(57, 255, 20, 0.2)",
  },
  relaxed: {
    name: "relaxed",
    emoji: "🍵",
    bgGradient: "linear-gradient(135deg, #0a161c 0%, #122833 30%, #1a3a4a 60%, #0a161c 100%)",
    primaryAccent: "#4fd1c5",
    secondaryAccent: "#81e6d9",
    glowColor: "rgba(79, 209, 197, 0.4)",
    blob1: "rgba(79,209,197,.22)",
    blob2: "rgba(129,230,217,.18)",
    blob3: "rgba(173,216,230,.18)",
    imageTint: "rgba(79, 209, 197, 0.2)",
  },
  mysterious: {
    name: "mysterious",
    emoji: "🕵️",
    bgGradient: "linear-gradient(135deg, #0a0014 0%, #140028 30%, #1f003d 60%, #0a0014 100%)",
    primaryAccent: "#9370db",
    secondaryAccent: "#dda0dd",
    glowColor: "rgba(147, 112, 219, 0.4)",
    blob1: "rgba(147,112,219,.22)",
    blob2: "rgba(221,160,221,.18)",
    blob3: "rgba(138,43,226,.18)",
    imageTint: "rgba(147, 112, 219, 0.25)",
  },
  nostalgic: {
    name: "nostalgic",
    emoji: "🕰️",
    bgGradient: "linear-gradient(135deg, #1c1510 0%, #30241b 30%, #453426 60%, #1c1510 100%)",
    primaryAccent: "#d2b48c",
    secondaryAccent: "#cd853f",
    glowColor: "rgba(210, 180, 140, 0.4)",
    blob1: "rgba(210,180,140,.22)",
    blob2: "rgba(205,133,63,.18)",
    blob3: "rgba(222,184,135,.18)",
    imageTint: "rgba(210, 180, 140, 0.2)",
  },
  cyberpunk: {
    name: "cyberpunk",
    emoji: "🤖",
    bgGradient: "linear-gradient(135deg, #0d1117 0%, #161b22 30%, #21262d 60%, #0d1117 100%)",
    primaryAccent: "#0ff",
    secondaryAccent: "#f0f",
    glowColor: "rgba(0, 255, 255, 0.4)",
    blob1: "rgba(0,255,255,.22)",
    blob2: "rgba(255,0,255,.18)",
    blob3: "rgba(0,206,209,.18)",
    imageTint: "rgba(0, 255, 255, 0.15)",
  },
  dreamy: {
    name: "dreamy",
    emoji: "☁️",
    bgGradient: "linear-gradient(135deg, #151020 0%, #221a35 30%, #2f254a 60%, #151020 100%)",
    primaryAccent: "#e6e6fa",
    secondaryAccent: "#ffb6c1",
    glowColor: "rgba(230, 230, 250, 0.4)",
    blob1: "rgba(230,230,250,.22)",
    blob2: "rgba(255,182,193,.18)",
    blob3: "rgba(216,191,216,.18)",
    imageTint: "rgba(230, 230, 250, 0.2)",
  },
  spooky: {
    name: "spooky",
    emoji: "👻",
    bgGradient: "linear-gradient(135deg, #05020a 0%, #0a0414 30%, #120824 60%, #05020a 100%)",
    primaryAccent: "#ff7518",
    secondaryAccent: "#8a2be2",
    glowColor: "rgba(255, 117, 24, 0.4)",
    blob1: "rgba(255,117,24,.22)",
    blob2: "rgba(138,43,226,.18)",
    blob3: "rgba(148,0,211,.18)",
    imageTint: "rgba(255, 117, 24, 0.2)",
  },
  triumphant: {
    name: "triumphant",
    emoji: "🏆",
    bgGradient: "linear-gradient(135deg, #1a1600 0%, #332a00 30%, #4d4000 60%, #1a1600 100%)",
    primaryAccent: "#ffd700",
    secondaryAccent: "#ffffff",
    glowColor: "rgba(255, 215, 0, 0.4)",
    blob1: "rgba(255,215,0,.22)",
    blob2: "rgba(255,255,255,.18)",
    blob3: "rgba(218,165,32,.18)",
    imageTint: "rgba(255, 215, 0, 0.2)",
  },
  cozy: {
    name: "cozy",
    emoji: "☕",
    bgGradient: "linear-gradient(135deg, #1c0d05 0%, #30160a 30%, #472110 60%, #1c0d05 100%)",
    primaryAccent: "#d2691e",
    secondaryAccent: "#f4a460",
    glowColor: "rgba(210, 105, 30, 0.4)",
    blob1: "rgba(210,105,30,.22)",
    blob2: "rgba(244,164,96,.18)",
    blob3: "rgba(139,69,19,.18)",
    imageTint: "rgba(210, 105, 30, 0.25)",
  }
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

  const setMood = (moodInput) => {
    // Normalize input string (could be a full sentence like "I am feeling very relaxed today")
    let normalized = moodInput.toLowerCase().trim();
    
    // Default fallback
    let foundMood = null;
    
    // 1. Direct match for keys
    const moodKeys = Object.keys(moodThemes);
    for (const key of moodKeys) {
        if (normalized.includes(key)) {
            foundMood = key;
        }
    }
    
    // 2. Alias mapping for advanced sentence parsing
    if (normalized.includes("chill") || normalized.includes("calm") || normalized.includes("peaceful")) foundMood = "relaxed";
    if (normalized.includes("excited") || normalized.includes("joy") || normalized.includes("pumped") || normalized.includes("hype")) foundMood = "energetic";
    if (normalized.includes("love") || normalized.includes("heart") || normalized.includes("cute") || normalized.includes("sweet")) foundMood = "romantic";
    if (normalized.includes("dark") || normalized.includes("secret") || normalized.includes("hidden")) foundMood = "mysterious";
    if (normalized.includes("old") || normalized.includes("retro") || normalized.includes("memory") || normalized.includes("classic")) foundMood = "nostalgic";
    if (normalized.includes("sci-fi") || normalized.includes("future") || normalized.includes("hacker") || normalized.includes("tech")) foundMood = "cyberpunk";
    if (normalized.includes("sleepy") || normalized.includes("cloud") || normalized.includes("soft")) foundMood = "dreamy";
    if (normalized.includes("scary") || normalized.includes("horror") || normalized.includes("halloween") || normalized.includes("fear")) foundMood = "spooky";
    if (normalized.includes("winner") || normalized.includes("victory") || normalized.includes("epic") || normalized.includes("glory")) foundMood = "triumphant";
    if (normalized.includes("warm") || normalized.includes("coffee") || normalized.includes("home") || normalized.includes("snug")) foundMood = "cozy";
    if (normalized.includes("good") || normalized.includes("great") || normalized.includes("awesome") || normalized.includes("fantastic")) foundMood = "happy";
    if (normalized.includes("bad") || normalized.includes("depressed") || normalized.includes("crying")) foundMood = "sad";
    if (normalized.includes("mad") || normalized.includes("furious") || normalized.includes("annoyed")) foundMood = "angry";

    // Set the state if valid
    if (foundMood && moodThemes[foundMood]) {
      setCurrentMood(foundMood);
    }
  };

  return (
    <MoodContext.Provider value={{ currentMood, setMood, themeData: moodThemes[currentMood] || moodThemes.neutral }}>
      {children}
    </MoodContext.Provider>
  );
};
