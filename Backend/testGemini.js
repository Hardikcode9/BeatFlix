const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
  try {
    const prompt = "hello";
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    console.log("SUCCESS");
    console.log(response.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.log("ERROR");
    console.log(err.response?.data?.error?.message || err.message);
  }
}

test();
