const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { chatWithGemini } = require("../controller/geminiController");

router.post("/chat", auth, chatWithGemini);

module.exports = router;