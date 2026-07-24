  import { useEffect, useMemo, useState, useRef } from "react";
  import {
    FaPlay,
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
    FaEye,
    FaStar,
  } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  import "../styles/Home.css";
  import dhurandharPoster from "../assets/images/movies/dhurandhar.jpg";

  // Decoder Ring
  const genreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
  };

  function Home() {
    const navigate = useNavigate();
    
    // ==========================================
    // BOOT SEQUENCE STATE & TIMER
    // ==========================================
    const [isBooting, setIsBooting] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsBooting(false);
      }, 2600); // Intro lasts 2.6s
      return () => clearTimeout(timer);
    }, []);

    // ==========================================
    // MOVIE DATA STATES
    // ==========================================
    const [topIndia, setTopIndia] = useState([]);
    const [topGlobal, setTopGlobal] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [newReleases, setNewReleases] = useState([]);

    useEffect(() => {
      const formatData = (data) => data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://placehold.co/500x750/1a1a1a/ffffff?text=No+Poster",
        genre: (movie.genre_ids || []).map(id => genreMap[id]).filter(Boolean).slice(0, 2),
        rating: movie.vote_average?.toFixed(1) || "0.0",
        year: movie.release_date?.split("-")[0] || "N/A",
        description: movie.overview || "No description available."
      }));

      const fetchAll = async () => {
        try {
          const [r1, r2, r3, r4, r5] = await Promise.all([
            fetch("http://192.168.0.100:4000/api/movies/top-india").then(res => res.json()),
            fetch("http://192.168.0.100:4000/api/movies/top-global").then(res => res.json()),
            fetch("http://192.168.0.100:4000/api/movies/trending").then(res => res.json()),
            fetch("http://192.168.0.100:4000/api/movies/top-rated").then(res => res.json()),
            fetch("http://192.168.0.100:4000/api/movies/new-releases").then(res => res.json())
          ]);
          setTopIndia(formatData(r1));
          setTopGlobal(formatData(r2));
          setTrendingMovies(formatData(r3));
          setTopRatedMovies(formatData(r4));
          setNewReleases(formatData(r5));
        } catch (err) { console.error("Error fetching data:", err); }
      };
      fetchAll();
    }, []);

    const [activeSlide, setActiveSlide] = useState(0);

    // Use Trending movies for the hero if available
    const heroMovies = trendingMovies.slice(0, 5);
    const currentMovie = heroMovies[activeSlide] || {};

    useEffect(() => {
      if (heroMovies.length === 0) return;
      const timer = setInterval(() => {
        setActiveSlide((current) => (current + 1) % heroMovies.length);
      }, 7000);
      return () => clearInterval(timer);
    }, [heroMovies.length]);

    const handlePosterMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 6;
      const rotateX = (((rect.height / 2) - y) / (rect.height / 2)) * 6;
      card.style.setProperty("--rotateX", `${rotateX}deg`);
      card.style.setProperty("--rotateY", `${rotateY}deg`);
    };

    const handlePosterLeave = (e) => {
      e.currentTarget.style.setProperty("--rotateX", "0deg");
      e.currentTarget.style.setProperty("--rotateY", "0deg");
    };

    return (
      <>
        {/* ==========================================
            ULTRA-PREMIUM INTRO BOOT SCREEN
        ========================================== */}
        {isBooting && (
          <div className="boot-sequence">
            <div className="boot-bg-glow"></div>
            
            <div className="boot-card">
              {/* 🚀 THE NEW GLOWING INTRO LOGO */}
              <img src="/beatflix_logo (1).png" alt="BeatFlix Logo" className="boot-logo" />

              <div className="boot-badge">
                <span className="boot-badge-dot"></span>
                <span>✦ NEXT-GEN CINEMA</span>
              </div>

              <h1 className="boot-title">
                <span className="boot-welcome">WELCOME TO</span>
                <span className="boot-brand">BEATFLIX</span>
              </h1>

              <div className="boot-progress-wrapper">
                <div className="boot-progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            THE MAIN HOMEPAGE
        ========================================== */}
        <div className={`beatflix-home ${!isBooting ? "page-revealed" : ""}`}>
          <section className="hero">
            <div className="hero-left" key={currentMovie.id}>
              <span className="hero-label">🔥 FEATURED TONIGHT</span>
              <h1 className="hero-movie-title"><span>{currentMovie.title || "Loading..."}</span></h1>
              <div className="hero-meta">
                <span>⭐ {currentMovie.rating || "0.0"}</span>
                <span>📅 {currentMovie.year || "N/A"}</span>
                <span>🎬 {currentMovie.genre ? currentMovie.genre.join(" • ") : "..."}</span>
              </div>
              <p>{currentMovie.description ? currentMovie.description.slice(0, 110) : ""}...</p>
              <div className="hero-divider"></div>
              <div className="hero-buttons">
                <button className="watch-btn" onClick={() => currentMovie.id && navigate(`/movie/${currentMovie.id}`)}>
                  <FaEye /> View Details
                </button>
                <button className="list-btn"><FaPlus /> My List</button>
              </div>
            </div>

            <div className="hero-right">
              {heroMovies.map((movie, index) => {
                let className = index === activeSlide ? "hero-card active-card" :
                  index === (activeSlide + 1) % heroMovies.length ? "hero-card next-card" :
                    index === (activeSlide + 2) % heroMovies.length ? "hero-card last-card" : "hero-card hidden-card";
                return (
                  <div key={movie.id} className={className} onMouseMove={index === activeSlide ? handlePosterMove : undefined} onMouseLeave={index === activeSlide ? handlePosterLeave : undefined}>
                    <img src={movie.poster} alt={movie.title} />
                    <div className="hero-overlay">
                      {index === activeSlide && (
                        <div className="hero-top">
                          <span>🔥 Trending</span>
                          <span>⭐ {movie.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="content-section">
            <MovieRail title="🇮🇳 Top 10 in India" subtitle="Most popular Indian movies" movies={topIndia} onSelect={(id) => navigate(`/movie/${id}`)} />
            <MovieRail title="🌍 Top 10 Worldwide" subtitle="Most popular movies around the world" movies={topGlobal} onSelect={(id) => navigate(`/movie/${id}`)} />
            <MovieRail title="🔥 Trending This Week" subtitle="Most watched this week" movies={trendingMovies} onSelect={(id) => navigate(`/movie/${id}`)} />
            <MovieRail title="⭐ Top Rated" subtitle="Highest rated movies of all time" movies={topRatedMovies} onSelect={(id) => navigate(`/movie/${id}`)} />
            <MovieRail title="🎬 New Releases" subtitle="Fresh movies now playing" movies={newReleases} onSelect={(id) => navigate(`/movie/${id}`)} />
            <CollectionSection navigate={navigate} />
            <PremiumBanner />
          </section>
        </div>
      </>
    );
  }

  function MovieRail({ title, subtitle, movies, onSelect }) {
    const rowRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const handleCardMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
      const rotateX = (((rect.height / 2) - y) / (rect.height / 2)) * 8;
      card.style.setProperty("--rotateX", `${rotateX}deg`);
      card.style.setProperty("--rotateY", `${rotateY}deg`);
    };

    const handleCardLeave = (e) => {
      e.currentTarget.style.setProperty("--rotateX", "0deg");
      e.currentTarget.style.setProperty("--rotateY", "0deg");
    };

    const handleScrollEvent = () => {
      if (rowRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
      }
    };

    const handleScroll = (direction) => {
      if (rowRef.current) {
        const { clientWidth } = rowRef.current;
        rowRef.current.scrollBy({ left: direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75, behavior: "smooth" });
      }
    };

    if (!movies || movies.length === 0) return null;

    return (
      <section className="movie-rail">
        <div className="rail-header"><h2>{title}</h2><p>{subtitle}</p></div>
        <div className="rail-wrapper">
          {!isAtStart && <button className="slider-arrow left-arrow" onClick={() => handleScroll("left")}><FaChevronLeft /></button>}
          <div className="rail-container" ref={rowRef} onScroll={handleScrollEvent}>
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="movie-card"
                style={{ animationDelay: `${index * 80}ms` }}
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
                onClick={() => onSelect(movie.id)}
              >
                {title.includes("Top 10") && index < 10 && <div className={`champion-badge ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "standard"}`}>#{index + 1}</div>}
                <div className="movie-poster"><img src={movie.poster} alt={movie.title} /><div className="movie-view-overlay"><div className="movie-view-action"><FaEye /><span>View Details</span></div></div></div>
                <div className="movie-details"><h4>{movie.title}</h4><span>{movie.genre.length > 0 ? movie.genre.join(" • ") : "N/A"}</span><div className="movie-meta"><p>{movie.year}</p><p><FaStar />{movie.rating}</p></div></div>
              </div>
            ))}
          </div>
          {!isAtEnd && <button className="slider-arrow right-arrow" onClick={() => handleScroll("right")}><FaChevronRight /></button>}
        </div>
      </section>
    );
  }

  function CollectionSection({ navigate }) {
    const sliderRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const handleScrollEvent = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
      }
    };

    const handleScroll = (direction) => {
      if (sliderRef.current) {
        const { clientWidth } = sliderRef.current;
        sliderRef.current.scrollBy({
          left: direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75,
          behavior: "smooth",
        });
      }
    };

    const collections = [
      { id: 1, title: "Oscar Winners", subtitle: "15 Movies", image: "https://image.tmdb.org/t/p/original/8I37NtDffNV7AZlDa7uDvvqhovU.jpg", slug: "oscar-winners" },
      { id: 2, title: "Anime Collection", subtitle: "18 Movies", image: "https://image.tmdb.org/t/p/original/q719jXXEzOoYaps6babgKnONONX.jpg", slug: "anime" },
      { id: 3, title: "Superhero Universe", subtitle: "25 Movies", image: "https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg", slug: "superhero" },
      { id: 4, title: "Sci-Fi Adventures", subtitle: "20 Movies", image: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg", slug: "superhero" },
      { id: 5, title: "Bollywood Hits", subtitle: "12 Movies", image: dhurandharPoster, slug: "bollywood" },
      { id: 6, title: "Horror Nights", subtitle: "14 Movies", image: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", slug: "horror" },
    ];

    return (
      <section className="collection-section">
        <div className="rail-header">
          <div>
            <h2>🎬 Featured Collections</h2>
            <p>Browse hand-picked movie collections</p>
          </div>
        </div>

        <div className="rail-wrapper">
          {!isAtStart && (
            <button className="slider-arrow left-arrow" onClick={() => handleScroll("left")}>
              <FaChevronLeft />
            </button>
          )}

          <div className="collection-grid" ref={sliderRef} onScroll={handleScrollEvent}>
            {collections.map((item) => (
              <div
                key={item.id}
                className="collection-card"
                onClick={() => navigate(`/collection/${item.slug}`)}
              >
                <img src={item.image} alt={item.title} />

                <div className="collection-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {!isAtEnd && (
            <button className="slider-arrow right-arrow" onClick={() => handleScroll("right")}>
              <FaChevronRight />
            </button>
          )}
        </div>
      </section>
    );
  }

  function PremiumBanner() {
    const navigate = useNavigate();
    return (
      <section className="premium-banner">
        <div className="premium-glow"></div>
        
        <div className="premium-content">
          <div className="premium-badge">
            <span className="badge-dot"></span> BEATFLIX PRO
          </div>
          <h2>Endless Cinematic<br/>Brilliance.</h2>
          <p>Unlock 4K streaming, exclusive director cuts, and zero ads. Your home theater awaits.</p>
        </div>
        
        <div className="premium-action">
          {/* 👉 ROUTE CHANGED HERE */}
          <button className="premium-button" onClick={() => navigate("/subscription")}>
            Upgrade Now <FaChevronRight />
          </button>
        </div>
      </section>
    );
  }

  export default Home;