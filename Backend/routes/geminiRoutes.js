const express = require("express");
const router = express.Router();

const { chatWithGemini } = require("../controller/geminiController");

router.post("/chat", chatWithGemini);

module.exports = router;