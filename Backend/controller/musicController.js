const axios = require("axios");

const VEROME_API_URL = (
  process.env.VEROME_API_URL ||
  "https://verome-api.hardikcode9.deno.net"
).replace(/\/$/, "");

/* =========================================================
   HELPERS
========================================================= */

const getThumbnail = (song) => {
  if (song?.videoId) {
    return `https://i.ytimg.com/vi/${song.videoId}/maxresdefault.jpg`;
  }

  return (
    song?.thumbnail ||
    song?.thumbnails?.[0]?.url ||
    ""
  );
};

const getArtist = (song) => {
  if (Array.isArray(song?.artists)) {
    const artists = song.artists
      .map((artist) => artist?.name)
      .filter(Boolean);

    if (artists.length) {
      return artists.join(", ");
    }
  }

  return (
    song?.artist ||
    song?.channel?.name ||
    "Unknown artist"
  );
};

/* =========================================================
   GET VEROME STREAM INFORMATION
========================================================= */

const getVeromeStreams = async (videoId) => {
  const response = await axios.get(
    `${VEROME_API_URL}/api/stream`,
    {
      params: {
        id: videoId,
      },

      timeout: 30000,

      headers: {
        Accept: "application/json",
      },
    }
  );

  const rawStreams = Array.isArray(
    response.data?.streamingUrls
  )
    ? response.data.streamingUrls
    : [];

  const streams = rawStreams
    .filter((stream) => stream?.url)
    .filter((stream) => {
      const mime = String(
        stream.mimeType ||
          stream.type ||
          ""
      ).toLowerCase();

      return (
        mime === "" ||
        mime.startsWith("audio/")
      );
    })
    .map((stream) => ({
      sourceUrl: stream.url,
      directUrl: stream.directUrl,

      mimeType:
        stream.mimeType ||
        stream.type ||
        "audio/mp4",

      bitrate:
        Number(stream.bitrate || 0),

      quality:
        stream.quality ||
        stream.audioQuality ||
        "",
    }));

  /*
   * Prefer browser-friendly MP4/M4A first.
   * Then use WebM/Opus.
   * Higher bitrate wins within the same format.
   */
  streams.sort((a, b) => {
    const aType =
      a.mimeType.toLowerCase();

    const bType =
      b.mimeType.toLowerCase();

    const aMp4 =
      aType.includes("mp4") ||
      aType.includes("m4a")
        ? 1
        : 0;

    const bMp4 =
      bType.includes("mp4") ||
      bType.includes("m4a")
        ? 1
        : 0;

    if (aMp4 !== bMp4) {
      return bMp4 - aMp4;
    }

    return (
      b.bitrate -
      a.bitrate
    );
  });

  return {
    streams,
    metadata:
      response.data?.metadata ||
      null,
  };
};

/* =========================================================
   SEARCH
========================================================= */

const searchMusic = async (req, res) => {
  try {
    const query = String(
      req.query.q || ""
    ).trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message:
          "Search query is required.",
      });
    }

    const response = await axios.get(
      `${VEROME_API_URL}/api/search`,
      {
        params: {
          q: query,
          filter: "songs",
        },

        timeout: 20000,

        headers: {
          Accept:
            "application/json",
        },
      }
    );

    const results =
      Array.isArray(
        response.data?.results
      )
        ? response.data.results
        : [];

    const songs = results
      .filter(
        (song) => song?.videoId
      )
      .slice(0, 30)
      .map((song) => ({
        videoId:
          song.videoId,

        title:
          song.title ||
          "Untitled",

        channelTitle:
          getArtist(song),

        thumbnail:
          getThumbnail(song),

        duration:
          song.duration ||
          song.durationText ||
          "",
      }));

    return res.json({
      success: true,

      source:
        "Verome / YouTube Music",

      songs,
    });
  } catch (error) {
    console.error(
      "Music search error:",
      error.response?.data ||
        error.message
    );

    return res.status(502).json({
      success: false,

      message:
        "Music search service is unavailable right now.",
    });
  }
};

/* =========================================================
   STREAM INFO
========================================================= */

const getMusicStream = async (
  req,
  res
) => {
  try {
    const videoId = String(
      req.query.id || ""
    ).trim();

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message:
          "Song id is required.",
      });
    }

    const {
      streams,
      metadata,
    } =
      await getVeromeStreams(
        videoId
      );

    if (!streams.length) {
      return res.status(404).json({
        success: false,

        message:
          "No playable audio stream was returned for this song.",

        metadata,
      });
    }

    /*
     * Convert every raw Verome stream into
     * a Verome proxy URL.
     *
     * The browser will be able to request
     * the proxy directly.
     */
    const audioStreams =
      streams.map(
        (stream) => ({
          audioUrl:
            stream.sourceUrl,

          mimeType:
            stream.mimeType,

          bitrate:
            stream.bitrate,

          quality:
            stream.quality,
        })
      );

    return res.json({
      success: true,

      audioUrl:
        audioStreams[0]
          .audioUrl,

      mimeType:
        audioStreams[0]
          .mimeType,

      bitrate:
        audioStreams[0]
          .bitrate,

      audioStreams,

      metadata,
    });
  } catch (error) {
    console.error(
      "Music stream info error:",
      error.response?.data ||
        error.message
    );

    return res.status(502).json({
      success: false,

      message:
        "Unable to create an audio stream for this song.",
    });
  }
};

/* =========================================================
   AUDIO ENDPOINT
   Browser -> /api/music/audio
   Node -> finds Verome stream
   Node -> REDIRECTS browser to Verome proxy
========================================================= */

const streamMusicAudio = async (
  req,
  res
) => {
  try {
    const videoId = String(
      req.query.id || ""
    ).trim();

    if (!videoId) {
      return res.status(400).json({
        success: false,

        message:
          "Song id is required.",
      });
    }

    const {
      streams,
    } =
      await getVeromeStreams(
        videoId
      );

    if (!streams.length) {
      return res.status(404).json({
        success: false,

        message:
          "No playable audio stream was returned for this song.",
      });
    }

    /*
     * Use the best stream.
     */
    const selected =
      streams[0];

    /*
     * Bypass the broken proxy and redirect 
     * the browser directly to the stream directUrl.
     */
    return res.redirect(
      302,
      selected.directUrl || selected.sourceUrl
    );
  } catch (error) {
    console.error(
      "Audio endpoint error:",
      error.response?.data ||
        error.message
    );

    return res.status(502).json({
      success: false,

      message:
        "Audio service is unavailable right now.",
    });
  }
};

module.exports = {
  searchMusic,
  getMusicStream,
  streamMusicAudio,
};