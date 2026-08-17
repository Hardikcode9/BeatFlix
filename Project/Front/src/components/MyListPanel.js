import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaTrash, FaStar, FaFilm } from "react-icons/fa";
import "../styles/MyListPanel.css";

const POSTER_URL = "https://image.tmdb.org/t/p/w500";

// Corrected 3D Tilt Logic for a natural "press" effect
const handleCardMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Natural tilt: pressing down where the mouse hovers
  const rotateX = ((y - centerY) / centerY) * -12; 
  const rotateY = ((x - centerX) / centerX) * 12;
  
  card.style.setProperty("--rotateX", `${rotateX}deg`);
  card.style.setProperty("--rotateY", `${rotateY}deg`);
};

const handleCardLeave = (e) => {
  const card = e.currentTarget;
  card.style.setProperty("--rotateX", "0deg");
  card.style.setProperty("--rotateY", "0deg");
};

export default function MyListPanel({ isOpen, onClose }) {
  const [savedMovies, setSavedMovies] = useState([]);
  const [isRemoving, setIsRemoving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = () => {
      const movies = JSON.parse(localStorage.getItem("myList")) || [];
      setSavedMovies(movies);
    };

    if (isOpen) loadMovies();

    window.addEventListener("myListUpdated", loadMovies);
    return () => window.removeEventListener("myListUpdated", loadMovies);
  }, [isOpen]);

  const handleRemove = (e, id) => {
    e.stopPropagation();
    setIsRemoving(id);
    
    setTimeout(() => {
      const updatedList = savedMovies.filter((movie) => movie.id !== id);
      setSavedMovies(updatedList);
      localStorage.setItem("myList", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("myListUpdated"));
      setIsRemoving(null);
    }, 400); 
  };

  if (!isOpen) return null;

  return (
    <div className="mylist-overlay glass-bg" onClick={onClose}>
      <div className="mylist-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Animated Background Mesh */}
        <div className="panel-glow-orb purple-orb"></div>
        <div className="panel-glow-orb blue-orb"></div>
        <div className="panel-glow-orb pink-orb"></div>

        <div className="mylist-content-wrapper">
          <div className="mylist-header">
            <h2>My Watchlist</h2>
            <button className="close-panel-btn" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>

          {savedMovies.length === 0 ? (
            <div className="empty-list">
              <div className="empty-icon-wrapper">
                <FaFilm className="floating-film-icon" />
              </div>
              <p className="gradient-text">Your vault is empty</p>
              <span>Explore the universe and click "Add to My List" to save movies here!</span>
            </div>
          ) : (
            <div className="mylist-grid">
              {savedMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className={`mylist-card-wrapper ${isRemoving === movie.id ? 'removing' : ''}`}
                  onMouseMove={handleCardMove}
                  onMouseLeave={handleCardLeave}
                  onClick={() => {
                    onClose();
                    navigate(`/movie/${movie.id}`);
                  }}
                >
                  {/* True 3D Container */}
                  <div className="mylist-card-3d">
                    
                    {/* Layer 1: Glass Background (Isolated to prevent 3D flattening) */}
                    <div className="card-glass-bg"></div>
                    
                    {/* Layer 2: Animated Diagonal Light Sweep */}
                    <div className="card-light-sweep"></div>
                    
                    {/* Layer 3: Popping Image */}
                    <img src={`${POSTER_URL}${movie.poster_path}`} alt={movie.title} className="card-poster" />
                    
                    {/* Layer 4: Floating Content */}
                    <div className="mylist-card-content">
                      <h4>{movie.title}</h4>
                      <div className="mylist-card-meta">
                        <span className="rating"><FaStar className="star-icon" /> {movie.vote_average?.toFixed(1)}</span>
                        <button 
                          className="remove-btn" 
                          onClick={(e) => handleRemove(e, movie.id)}
                          title="Remove from My List"
                        >
                          <FaTrash className="trash-icon" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}