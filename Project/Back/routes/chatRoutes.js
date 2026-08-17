const express = require("express");
const auth = require("../middleware/auth");

const {
  createChat,
  getChats,
  saveMessage,
  deleteChat,
  renameChat,
} = require("../controller/chatController");

const router = express.Router();

router.post("/", auth, createChat);

router.get("/", auth, getChats);

router.post("/:chatId/message", auth, saveMessage);

router.delete("/:chatId", auth, deleteChat);

router.put("/:chatId/title", auth, renameChat);

module.exports = router;