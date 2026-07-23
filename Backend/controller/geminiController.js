const axios = require("axios");

const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are BeatFlix AI, a cinematic movie expert.

The user says:
${message}

Respond ONLY in JSON like this:

{
  "reply": "your response",
  "genres": ["Action","Comedy"]
}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const text =
      response.data.candidates[0].content.parts[0].text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    res.json(JSON.parse(text));
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      message: "Gemini request failed",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = {
  chatWithGemini,
};