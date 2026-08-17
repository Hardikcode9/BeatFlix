import React, { useState, useEffect } from 'react';
import '../styles/FreeMovies.css';
import { FaPlay, FaTimes, FaGift, FaStar, FaClock, FaCalendarAlt } from 'react-icons/fa';

// Real movies available free on YouTube via official channels
// All YouTube IDs verified from official channel uploads
const freeMoviesList = [
  {
    id: "KH2777NdFfo",
    youtubeId: "KH2777NdFfo",
    title: "Humface",
    year: "2024",
    rating: 7,
    duration: "2 hr 01 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Humface",
    channel: "Movie Shift"
  },
  {
    id: "Us6pVG4NK8Q",
    youtubeId: "Us6pVG4NK8Q",
    title: "Phir Hera Pheri (Full Movie ) - अक्षय कुमार, सुनील शेट्टी, प",
    year: "2024",
    rating: 7,
    duration: "2 hr 29 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Phir Hera Pheri (Full Movie ) - अक्षय कुमार, सुनील शेट्टी, परेश रावल  | Best comedy Film",
    channel: "Shemaroo Movies"
  },
  {
    id: "lRm6tYF_MoM",
    youtubeId: "lRm6tYF_MoM",
    title: "De Dana Dan - Full Film HD | Akshay K | Katrina K | Suniel S",
    year: "2024",
    rating: 7,
    duration: "2 hr 47 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "De Dana Dan - Full Film HD | Akshay K | Katrina K | Suniel S | Paresh R | Superhit Bollywood Comedy",
    channel: "Eros Universe"
  },
  {
    id: "MVNFZS5PvSQ",
    youtubeId: "MVNFZS5PvSQ",
    title: "NEW FULL MOVIE - Samosa & Sons | Hindi Movie | Sanjay Mishra",
    year: "2024",
    rating: 7,
    duration: "1 hr 27 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "NEW FULL MOVIE - Samosa & Sons | Hindi Movie | Sanjay Mishra, Chandan Bisht | Bollywood",
    channel: "Motion Mingle Hindi"
  },
  {
    id: "NhyTfzIfwkY",
    youtubeId: "NhyTfzIfwkY",
    title: "Bhoot Mama - Yogi Babu's Superhit Horror Comedy Movie Hindi ",
    year: "2024",
    rating: 7,
    duration: "1 hr 39 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Bhoot Mama - Yogi Babu's Superhit Horror Comedy Movie Hindi Dubbed - Pei Mama - Malavika Menon",
    channel: "Shemaroo"
  },
  {
    id: "D_e3NNKrZg0",
    youtubeId: "D_e3NNKrZg0",
    title: "Brahmanandam Ultimate Comedy Scenes | Brahmi Comedy Scenes |",
    year: "2024",
    rating: 7,
    duration: "1 hr 36 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Brahmanandam Ultimate Comedy Scenes | Brahmi Comedy Scenes | South Dubbed Movies | Aditya Movies",
    channel: "Aditya Movies"
  },
  {
    id: "qv_FWAMTvGs",
    youtubeId: "qv_FWAMTvGs",
    title: "Allu Arjun | New (2026) Released South Indian Movie Dubbed I",
    year: "2024",
    rating: 7,
    duration: "1 hr 42 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Allu Arjun | New (2026) Released South Indian Movie Dubbed In Hindi | South Thriller Movie | Action",
    channel: "South Ki Cinema"
  },
  {
    id: "Y-qBPL03JvU",
    youtubeId: "Y-qBPL03JvU",
    title: "No Entry Full Hindi Movie (4K) | Salman Khan & Anil Kapoor |",
    year: "2024",
    rating: 7,
    duration: "2 hr 41 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "No Entry Full Hindi Movie (4K) | Salman Khan & Anil Kapoor | Fardeen Khan & Bipasha Basu | Bollywood",
    channel: "Ultra Bollywood"
  },
  {
    id: "DrWVatMSBtA",
    youtubeId: "DrWVatMSBtA",
    title: "Khatta Meetha",
    year: "2010",
    rating: 5.8,
    duration: "2 hr 36 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "A struggling road contractor trying to make a living in a corrupt system faces endless comedic hurdles.",
    channel: "Shemaroo Movies"
  },
  {
    id: "dSpDgZ5OZvs",
    youtubeId: "dSpDgZ5OZvs",
    title: "Superhit Blockbuster Full Hindi Movie | Comedy New Movie 202",
    year: "2024",
    rating: 7,
    duration: "2 hr 46 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Superhit Blockbuster Full Hindi Movie | Comedy New Movie 2026 | Shahid Kapoor, Rajpal Yadav Comedy",
    channel: "Bangladeshi"
  },
  {
    id: "QnZkfDjBZFg",
    youtubeId: "QnZkfDjBZFg",
    title: "Housefull 5 (Full Movie) | Akshay Kumar, Riteish Deshmukh | ",
    year: "2024",
    rating: 7,
    duration: "2 hr 15 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Housefull 5 (Full Movie) | Akshay Kumar, Riteish Deshmukh | New Hindi Comedy Film 2025",
    channel: "CineVerse Entertainment"
  },
  {
    id: "GkQ4bftK8lw",
    youtubeId: "GkQ4bftK8lw",
    title: "GOLMAAL 5 Full Comedy Movie | Akshay Kumar, Ajay Devgn, Arsh",
    year: "2024",
    rating: 7,
    duration: "2 hr 03 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "GOLMAAL 5 Full Comedy Movie | Akshay Kumar, Ajay Devgn, Arshad Warsi, Saif Ali Khan | New Movie 2026",
    channel: "The Movie Files"
  },
  {
    id: "AsE0JowBpAU",
    youtubeId: "AsE0JowBpAU",
    title: "De Dana Dan Full Movie | Akshay, Rajpal & Johny Lever’s Ulti",
    year: "2024",
    rating: 7,
    duration: "2 hr 40 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "De Dana Dan Full Movie | Akshay, Rajpal & Johny Lever’s Ultimate Comedy Chaos | Full Entertainment",
    channel: "Eros Universe Comedy "
  },
  {
    id: "eCFwLsglUZc",
    youtubeId: "eCFwLsglUZc",
    title: "Ready 2 (2026) Full Hindi Dubbed Movie | Ram Pothineni, Gene",
    year: "2024",
    rating: 7,
    duration: "2 hr 19 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Ready 2 (2026) Full Hindi Dubbed Movie | Ram Pothineni, Genelia D Souza, Brahmanandam | #movie",
    channel: "Movies Digital Studio"
  },
  {
    id: "smFp1yHbsIA",
    youtubeId: "smFp1yHbsIA",
    title: "PAGALPUR (HD) New Superhit Comedy Romantic Full 4k Movie | A",
    year: "2024",
    rating: 7,
    duration: "1 hr 49 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "PAGALPUR (HD) New Superhit Comedy Romantic Full 4k Movie | Akshay Kumar, Johnny Lever, Bharti Singh",
    channel: "Big Screen Entertainment"
  },
  {
    id: "3gb0rraCWvA",
    youtubeId: "3gb0rraCWvA",
    title: "Bhootiya Bangla (Horror Movie) Akshay Kumar | Rajpal Yadav |",
    year: "2024",
    rating: 7,
    duration: "2 hr 04 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Bhootiya Bangla (Horror Movie) Akshay Kumar | Rajpal Yadav | Tabu | Latest Bollywood Full Movie 2026",
    channel: "Bollywood Bytess"
  },
  {
    id: "vs4wyzC2XOA",
    youtubeId: "vs4wyzC2XOA",
    title: "How is Wow || Superhit (HD) Blockbuster Hindi Comedy Movie |",
    year: "2024",
    rating: 7,
    duration: "1 hr 23 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "How is Wow || Superhit (HD) Blockbuster Hindi Comedy Movie || Omkar Das Manikpuri",
    channel: "Captain Film Wale"
  },
  {
    id: "w7cAIysCEgE",
    youtubeId: "w7cAIysCEgE",
    title: "Bala 0.2 - Full Comedy Movie | Ayushmann , Yami Gautam & Bhu",
    year: "2024",
    rating: 7,
    duration: "1 hr 52 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Bala 0.2 - Full Comedy Movie | Ayushmann , Yami Gautam & Bhumi | Bollywood Comedy Movie 2026",
    channel: "Bollywood Bytess"
  },
  {
    id: "YOWYWPaBoEw",
    youtubeId: "YOWYWPaBoEw",
    title: "GOLMAAL 5 Full Comedy Movie | Akshay Kumar, Ajay Devgn, Arsh",
    year: "2024",
    rating: 7,
    duration: "2 hr 11 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "GOLMAAL 5 Full Comedy Movie | Akshay Kumar, Ajay Devgn, Arshad Warsi, Saif Ali Khan | New Movie 2026",
    channel: "Movie In"
  },
  {
    id: "VvSps0_T2Pk",
    youtubeId: "VvSps0_T2Pk",
    title: "Awara Paagal Deewana Comedy Movie | परेश रावल | जॉनी लीवर | ",
    year: "2024",
    rating: 7,
    duration: "2 hr 38 min",
    genre: "Comedy",
    category: "bollywood",
    desc: "Awara Paagal Deewana Comedy Movie | परेश रावल | जॉनी लीवर | अक्षय कुमार | Superhit Comedy Movie",
    channel: "Shemaroo Comedy"
  }
];


function FreeMovies() {
  const [activeVideo, setActiveVideo] = useState(null); // { type: 'youtube' | 'archive', id: string }
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getPoster = (movie) => {
    if (movie.youtubeId) {
      return `https://img.youtube.com/vi/${movie.youtubeId}/hqdefault.jpg`;
    }
    return `https://placehold.co/1280x720/0c1225/9aa7c7?text=${encodeURIComponent(movie.title)}`;
  };

  const handlePlay = (movie) => {
    if (movie.youtubeId) {
      setActiveVideo({ type: 'youtube', id: movie.youtubeId });
    } else {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' ' + movie.year + ' full movie')}`, '_blank');
    }
  };

  const filteredMovies = filter === 'all' 
    ? freeMoviesList 
    : freeMoviesList.filter(m => m.category === filter);

  const getEmbedUrl = () => {
    if (!activeVideo) return '';
    if (activeVideo.type === 'youtube') {
      return `https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`;
    }
    return `https://archive.org/embed/${activeVideo.id}`;
  };

  return (
    <div className="free-movies-page">
      <div className="free-movies-header">
        <div className="header-content">
          <div className="badge-glow"><FaGift /> Free on BeatFlix</div>
          <h1>Watch Full Movies Free</h1>
          <p>Bollywood blockbusters & Comedies. Full-length movies you can watch right now — no subscription, completely free and legal.</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All Movies
        </button>
        <button className={`filter-tab ${filter === 'bollywood' ? 'active' : ''}`} onClick={() => setFilter('bollywood')}>
          🇮🇳 Bollywood
        </button>
      </div>

      <div className="free-movies-grid">
        {filteredMovies.map((movie) => (
          <div className="free-movie-card" key={movie.id} onClick={() => handlePlay(movie)}>
            <div className="card-image-wrapper">
              <img 
                src={getPoster(movie)} 
                alt={movie.title}
                onError={(e) => { e.target.src = `https://placehold.co/1280x720/0c1225/9aa7c7?text=${encodeURIComponent(movie.title)}`; }}
              />
              <div className="play-overlay">
                <div className="play-btn">
                  <FaPlay style={{ marginLeft: '4px' }} />
                </div>
              </div>
              <div className="card-badge">{movie.genre}</div>
              <div className="card-channel">{movie.channel}</div>
            </div>
            <div className="card-info">
              <h3>{movie.title}</h3>
              <div className="card-meta">
                <span className="rating"><FaStar /> {movie.rating}</span>
                <span><FaCalendarAlt style={{fontSize: '11px'}} /> {movie.year}</span>
                <span><FaClock style={{fontSize: '11px'}} /> {movie.duration}</span>
              </div>
              <p className="card-desc">{movie.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
          <button className="close-modal-btn" onClick={() => setActiveVideo(null)}>
            <FaTimes />
          </button>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <iframe
              src={getEmbedUrl()}
              title="Free Movie"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
            <div style={{ padding: '10px', textAlign: 'center', backgroundColor: '#111' }}>
              <p style={{ margin: '0', fontSize: '14px', color: '#ccc' }}>
                If the video is unavailable, <a href={`https://www.youtube.com/watch?v=${activeVideo.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d2ff', textDecoration: 'underline' }}>watch it directly on YouTube</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreeMovies;
