const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { chatWithGemini, generateVibePlaylist } = require("../controller/geminiController");

router.post("/chat", auth, chatWithGemini);
router.post("/vibe-playlist", auth, generateVibePlaylist);

module.exports = router;