const axios = require("axios");
const User = require("../model/User");

const chatWithGemini = async (req, res) => {
  try {
    const { message, history } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let currentTokens = user.aiTokens !== undefined && user.aiTokens !== null ? user.aiTokens : 5;

    if (user.subscription !== "ultimate" && currentTokens <= 0) {
      return res.status(403).json({
        success: false,
        message: "You've reached your BeatFlix AI limit. Please upgrade your plan.",
      });
    }

    const previousConversation = (history || [])
      .map(msg => `${msg.sender === "user" ? "User" : "BeatFlix AI"}: ${msg.text}`)
      .join("\n\n");

    const fullMessage = previousConversation
      ? `Previous Conversation:\n${previousConversation}\n\nCurrent User Message: ${message}`
      : `User Message: ${message}`;

    const prompt = `
You are BeatFlix AI, but act exactly like a real human friend who is a massive movie and music buff.
You have a distinct personality: you're empathetic, chill, witty, and emotionally intelligent. 

Return ONLY valid JSON in this exact format:
{
  "reply":"string",
  "domain": "movie" | "music" | "unknown",
  "movies": ["Movie Name 1", "Movie Name 2"],
  "songs": ["Song Name 1", "Song Name 2"],
  "genres":["Genre1","Genre2"],
  "artists":["Artist1","Artist2"]
}

Rules for your reply:
- Talk like a real person. Use casual language, show empathy, and actually connect with the user.
- NEVER sound like a corporate bot or an AI. Never say "As an AI..." or "I am a virtual assistant".
- CRITICAL: Determine if the user wants to watch a movie, listen to music, or just chat. Set the "domain" field appropriately ("movie", "music", or "unknown").
- CRITICAL: If the user explicitly asks for songs, tracks, artists, albums, or a playlist, or if your recommendations are musical tracks (like the user provided in the screenshot), you MUST set "domain" to "music".
- If the user asks for music, extract up to 2 artists or genres and populate the "artists" and "genres" arrays.
- Keep it engaging. Ask them a short follow-up question sometimes to keep the conversation going.
- Match their energy. If they are hyped, be hyped. If they are sad, be gentle and comforting.
- Keep replies between 60 and 150 words.
- CRITICAL: Recommend exactly 3 to 6 specific movies/songs. Put their exact names in the "movies" or "songs" array.
- CRITICAL: In your text reply, ALWAYS list your specific movie/song recommendations using bullet points (starting with "- "). NEVER clump them in a single paragraph or sentence! 
- CRITICAL: When listing recommendations, you MUST wrap the movie/song name in double asterisks so it is bolded (e.g., "- **Movie Name**: Explanation"). Give a short sentence explaining why you recommended it.
- End naturally, like a friend would.

Movie Genres must ONLY be selected from:
Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Thriller, War, Western.
`;

    let response;
    let retries = 2;
    while (retries >= 0) {
      try {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}\n\n${fullMessage}`,
                  },
                ],
              },
            ],
          }
        );
        break; // Success, exit retry loop
      } catch (err) {
        if (retries === 0 || (err.response && err.response.status !== 503 && err.response.status !== 429)) {
          throw err; // Out of retries or not a rate limit / overloaded error
        }
        retries--;
        await new Promise(res => setTimeout(res, 1000)); // Wait 1s before retrying
      }
    }

    const text =
      response.data.candidates[0].content.parts[0].text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    if (user.subscription !== "ultimate") {
      currentTokens -= 1;
      user.aiTokens = currentTokens;
      await user.save();
    }

    let responseData;
    try {
      responseData = JSON.parse(text);
    } catch (parseError) {
      console.warn("Gemini did not return JSON:", text);
      responseData = {
        reply: text,
        domain: "unknown",
        genres: [],
        artists: []
      };
    }
    
    responseData.tokensLeft = user.subscription === "ultimate" ? "Unlimited" : currentTokens;

    res.json(responseData);
  } catch (err) {
    console.error(err.response?.data || err.message);

    const errorMessage = err.response?.data?.error?.message || err.message || "Gemini request failed";

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: err.response?.data || err.message,
    });
  }
};

const generateVibePlaylist = async (req, res) => {
  try {
    const { movieTitle, moviePlot, movieGenres, excludeSongs } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let currentTokens = user.aiTokens !== undefined && user.aiTokens !== null ? user.aiTokens : 5;

    if (user.subscription !== "ultimate" && currentTokens <= 0) {
      return res.status(403).json({
        success: false,
        message: "You've reached your BeatFlix AI limit. Please upgrade your plan.",
      });
    }

    const prompt = `
You are the BeatFlix Synesthesia Engine. Your job is to translate a movie into a musical playlist.
Given the movie title, plot, and genres, you must generate a list of 5 to 7 specific songs that perfectly match the "vibe", emotion, pacing, and theme of the movie. 
These should be real, popular songs (not necessarily the official soundtrack).

Movie Title: ${movieTitle}
Genres: ${movieGenres}
Plot: ${moviePlot}
${excludeSongs && excludeSongs.length > 0 ? `\nCRITICAL: DO NOT RECOMMEND ANY OF THE FOLLOWING SONGS: ${excludeSongs.join(", ")}` : ""}

Return ONLY valid JSON in this exact format:
{
  "songs": ["Song Name - Artist", "Song Name - Artist"]
}
`;

    let response;
    let retries = 2;
    while (retries >= 0) {
      try {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );
        break;
      } catch (err) {
        if (retries === 0 || (err.response && err.response.status !== 503 && err.response.status !== 429)) {
          throw err;
        }
        retries--;
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    const text = response.data.candidates[0].content.parts[0].text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (user.subscription !== "ultimate") {
      currentTokens -= 1;
      user.aiTokens = currentTokens;
      await user.save();
    }

    let responseData;
    try {
      responseData = JSON.parse(text);
    } catch (parseError) {
      console.warn("Gemini did not return JSON:", text);
      responseData = { songs: [] };
    }
    
    responseData.tokensLeft = user.subscription === "ultimate" ? "Unlimited" : currentTokens;

    res.json(responseData);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to generate playlist" });
  }
};

module.exports = {
  chatWithGemini,
  generateVibePlaylist,
};