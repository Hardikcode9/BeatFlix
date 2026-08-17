const express = require("express");

const router = express.Router();

const {
  searchMusic,
  getMusicStream,
  streamMusicAudio,
} = require("../controller/musicController");

router.get(
  "/search",
  searchMusic
);

router.get(
  "/stream",
  getMusicStream
);

router.get(
  "/audio",
  streamMusicAudio
);

module.exports = router;