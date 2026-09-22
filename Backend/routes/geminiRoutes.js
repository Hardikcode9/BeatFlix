const express = require("express");
const router = express.Router();
const { optionalAuth } = require("../middleware/auth");

const { chatWithGemini, generateVibePlaylist } = require("../controller/geminiController");

router.post("/chat", optionalAuth, chatWithGemini);
router.post("/vibe-playlist", optionalAuth, generateVibePlaylist);

module.exports = router;