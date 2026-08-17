const axios = require("axios");

const genreMap = {
  Action: 28,
  Animation: 16,
  Comedy: 35,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  History: 36,
  Horror: 27,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
};

const mergeMovies = (indianMovies, globalMovies) => {
  const seen = new Set();

  const uniqueIndian = indianMovies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });

  const uniqueGlobal = globalMovies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });

  // Keep both lists sorted by popularity
  uniqueIndian.sort((a, b) => b.popularity - a.popularity);
  uniqueGlobal.sort((a, b) => b.popularity - a.popularity);

  // Show Indian movies first
  return [...uniqueIndian, ...uniqueGlobal];
};

const getMovies = async (req, res) => {
  try {
    const { page = 1, genre = "All", search = "" } = req.query;

    // Search movies
    if (search.trim()) {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: "en-US",
            query: search.trim(),
            page,
            include_adult: false,
          },
        }
      );

      return res.status(200).json({
        success: true,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
        results: response.data.results,
      });
    }

    // Common params
    const commonParams = {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      page,
      include_adult: false,
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
    };

    // Indian request
    const indianParams = {
      ...commonParams,
      with_origin_country: "IN",
    };

    // Global request
    const globalParams = {
      ...commonParams,
    };

    // Genre filter
    if (genre !== "All" && genreMap[genre]) {
      indianParams.with_genres = genreMap[genre];
      globalParams.with_genres = genreMap[genre];
    }

    // Fetch both together
    const [indianResponse, globalResponse] = await Promise.all([
      axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: indianParams,
      }),
      axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: globalParams,
      }),
    ]);

    // Remove duplicate movies
    const movies = mergeMovies(
      indianResponse.data.results,
      globalResponse.data.results
    );

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.max(
        indianResponse.data.total_pages,
        globalResponse.data.total_pages
      ),
      results: movies,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/top_rated",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page,
        },
      }
    );

    res.status(200).json({
      success: true,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      results: response.data.results,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top rated movies",
    });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
          language: "en-US",
          page,
        },
      }
    );

    res.status(200).json({
      success: true,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      results: response.data.results,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to search movies",
    });
  }
};

const getTrendingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/week",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          page,
        },
      }
    );

    res.status(200).json({
      success: true,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      results: response.data.results,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trending movies",
    });
  }
};

const getTopIndiaMovies = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          sort_by: "popularity.desc",
          with_origin_country: "IN",
          "vote_count.gte": 100,
          page: 1,
        },
      }
    );

    res.status(200).json({
      success: true,
      results: response.data.results.slice(0, 10),
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Top India movies",
    });
  }
};

const getTopGlobalMovies = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }
    );

    res.status(200).json({
      success: true,
      results: response.data.results.slice(0, 10),
    });
  } catch (error) {
  console.log("========== AXIOS ERROR ==========");
  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);
  console.log("Code:", error.code);
  console.log("Message:", error.message);
  console.log("=================================");

  res.status(500).json({
    success: false,
    message: "Failed to fetch Top Global movies",
  });
}
};

const getNewReleases = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching new releases:", error.message);
    res.status(500).json({ message: "Failed to fetch new releases" });
  }
};

const getMovieDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const [movieRes, creditsRes, similarRes, videosRes, watchProvidersRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
        },
      }),

      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }),

      axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
        },
      }),

      axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
        },
      }),

      axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }),

    ]);

    // Find the official YouTube trailer
    const trailer =
      videosRes.data.results.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official
      ) ||
      videosRes.data.results.find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer"
      ) ||
      null;

      res.status(200).json({
        success: true,
        movie: movieRes.data,
        cast: creditsRes.data.cast.slice(0, 10),
        similar: similarRes.data.results,
        trailer,
        watchProviders: watchProvidersRes.data.results.IN || null,
      });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movie details",
    });
  }
};

const getCollectionMovies = async (req, res) => {
  const { slug } = req.params;

  const collections = {
    "oscar-winners": {
      title: "Oscar Winners",
      params: {
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
      },
    },

    anime: {
      title: "Anime",
      params: {
        with_genres: 16,
        with_original_language: "ja",
      },
    },

    superhero: {
      title: "Superhero",
      params: {
        with_keywords: 9715,
      },
    },

    scifi: {
      title: "Sci-Fi",
      params: {
        with_genres: 878,
      },
    },

    bollywood: {
      title: "Bollywood",
      params: {
        with_origin_country: "IN",
      },
    },

    horror: {
      title: "Horror",
      params: {
        with_genres: 27,
      },
    },
  };

  const collection = collections[slug];

  if (!collection) {
    return res.status(404).json({
      success: false,
      message: "Collection not found",
    });
  }

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: 1,
          include_adult: false,
          ...collection.params,
        },
      }
    );

    res.json({
      success: true,
      title: collection.title,
      movies: response.data.results,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collection",
    });
  }
};
module.exports = {
  getMovies,
  getTopRatedMovies,
  getTrendingMovies,
  searchMovies,
  getTopIndiaMovies,
  getTopGlobalMovies,
  getNewReleases,
  getMovieDetails,
  getCollectionMovies,
};