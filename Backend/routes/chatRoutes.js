const express = require("express");
const auth = require("../middleware/auth");

const {
  createChat,
  getChats,
  saveMessage,
  deleteChat,
} = require("../controller/chatController");

const router = express.Router();

router.post("/", auth, createChat);

router.get("/", auth, getChats);

router.post("/:chatId/message", auth, saveMessage);

router.delete("/:chatId", auth, deleteChat);

module.exports = router;