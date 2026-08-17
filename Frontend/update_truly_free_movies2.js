const fs = require('fs');

const trulyFreeMovies = JSON.parse(fs.readFileSync('truly_free_movies.json', 'utf8'));

// Insert Khatta Meetha at index 8 (the 9th movie, as they mentioned "after Khatta Meetha")
trulyFreeMovies.splice(8, 0, {
  "id": "DrWVatMSBtA",
  "youtubeId": "DrWVatMSBtA",
  "title": "Khatta Meetha",
  "year": "2010",
  "rating": 5.8,
  "duration": "2 hr 36 min",
  "genre": "Comedy",
  "category": "bollywood",
  "desc": "A struggling road contractor trying to make a living in a corrupt system faces endless comedic hurdles.",
  "channel": "Shemaroo Movies"
});

// Generate the JS array text
let moviesJs = ``;
for (let i = 0; i < 20; i++) {
  const m = trulyFreeMovies[i];
  if (!m) break;
  // clean up description and title
  const cleanTitle = m.title.replace(/"/g, "'").replace(/\n/g, "");
  const cleanDesc = m.desc.replace(/"/g, "'").replace(/\n/g, "");
  
  moviesJs += `  {
    id: "${m.id}",
    youtubeId: "${m.youtubeId}",
    title: "${cleanTitle}",
    year: "${m.year}",
    rating: ${m.rating},
    duration: "${m.duration}",
    genre: "${m.genre}",
    category: "${m.category}",
    desc: "${cleanDesc}",
    channel: "${m.channel}"
  }`;
  if (i < trulyFreeMovies.length - 1 && i < 19) moviesJs += ",\n";
  else moviesJs += "\n];\n";
}

const fileContent = `import React, { useState, useEffect } from 'react';
import '../styles/FreeMovies.css';
import { FaPlay, FaTimes, FaGift, FaStar, FaClock, FaCalendarAlt } from 'react-icons/fa';

// Real movies available free on YouTube via official channels
// All YouTube IDs verified from official channel uploads
const freeMoviesList = [
${moviesJs}

function FreeMovies() {
  const [activeVideo, setActiveVideo] = useState(null); // { type: 'youtube' | 'archive', id: string }
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getPoster = (movie) => {
    if (movie.youtubeId) {
      return \`https://img.youtube.com/vi/\${movie.youtubeId}/hqdefault.jpg\`;
    }
    return \`https://placehold.co/1280x720/0c1225/9aa7c7?text=\${encodeURIComponent(movie.title)}\`;
  };

  const handlePlay = (movie) => {
    if (movie.youtubeId) {
      setActiveVideo({ type: 'youtube', id: movie.youtubeId });
    } else {
      window.open(\`https://www.youtube.com/results?search_query=\${encodeURIComponent(movie.title + ' ' + movie.year + ' full movie')}\`, '_blank');
    }
  };

  const filteredMovies = filter === 'all' 
    ? freeMoviesList 
    : freeMoviesList.filter(m => m.category === filter);

  const getEmbedUrl = () => {
    if (!activeVideo) return '';
    if (activeVideo.type === 'youtube') {
      return \`https://www.youtube.com/embed/\${activeVideo.id}?autoplay=1&rel=0\`;
    }
    return \`https://archive.org/embed/\${activeVideo.id}\`;
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
        <button className={\`filter-tab \${filter === 'all' ? 'active' : ''}\`} onClick={() => setFilter('all')}>
          All Movies
        </button>
        <button className={\`filter-tab \${filter === 'bollywood' ? 'active' : ''}\`} onClick={() => setFilter('bollywood')}>
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
                onError={(e) => { e.target.src = \`https://placehold.co/1280x720/0c1225/9aa7c7?text=\${encodeURIComponent(movie.title)}\`; }}
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
                If the video is unavailable, <a href={\`https://www.youtube.com/watch?v=\${activeVideo.id}\`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d2ff', textDecoration: 'underline' }}>watch it directly on YouTube</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreeMovies;
`;

fs.writeFileSync('./src/pages/FreeMovies.js', fileContent);
console.log('Successfully updated FreeMovies.js cleanly');
