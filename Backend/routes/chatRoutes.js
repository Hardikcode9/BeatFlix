const express = require("express");
const auth = require("../middleware/auth");

const {
  createChat,
  getChats,
  saveMessage,
} = require("../controller/chatController");

const router = express.Router();

router.post("/", auth, createChat);

router.get("/", auth, getChats);

router.post("/:chatId/message", auth, saveMessage);

module.exports = router;