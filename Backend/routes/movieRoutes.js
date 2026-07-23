const express = require("express");
const router = express.Router();

const {
  getMovies,
  searchMovies,
  getTrendingMovies,
  getTopIndiaMovies,
  getTopGlobalMovies,
  getTopRatedMovies,
  getNewReleases,
  getMovieDetails,
  getCollectionMovies,
} = require("../controller/movieController");

router.get("/", getMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/search", searchMovies);
router.get("/trending", getTrendingMovies);
router.get("/top-india", getTopIndiaMovies);
router.get("/top-global", getTopGlobalMovies);
router.get("/new-releases", getNewReleases);
router.get("/collections/:slug", getCollectionMovies);
router.get("/:id", getMovieDetails);

module.exports = router;