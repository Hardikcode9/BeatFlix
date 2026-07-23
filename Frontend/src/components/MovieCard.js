import React, { useRef } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/MovieCard.css";

const MovieCard = ({ id, title, poster, rating, year, genre, index = 0 }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 17;
    const rotateX = ((rect.height / 2 - y) / rect.height) * 17;

    card.style.setProperty("--rotateX", `${rotateX}deg`);
    card.style.setProperty("--rotateY", `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
  };

  const genreDisplay = Array.isArray(genre)
    ? genre.slice(0, 2).join(" • ")
    : genre || "Unknown";

  return (
    <div
      className="movie-card-entrance"
      style={{ animationDelay: `${(index % 20) * 50}ms` }}
    >
      <div
        ref={cardRef}
        className="premium-movie-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/movie/${id}`)}
      >
        <div className="card-image-container">
          <img src={poster} alt={title} className="card-poster-img" />

          {/* BADGES */}
          <div className="badge-system">
            <span className="rating-badge">
              <FaStar className="star-icon" style={{ color: "#f5c518", marginRight: "4px" }} />
              {rating}
            </span>
            <span className="year-badge">{year}</span>
          </div>
        </div>

        <div className="card-details">
          <h3 className="movie-title">{title}</h3>
          <p className="movie-genres">{genreDisplay}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;