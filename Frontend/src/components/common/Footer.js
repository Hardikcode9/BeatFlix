import "../../styles/Footer.css";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFilm,
  FaHeart,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      {/* Top gradient line */}
      <div className="footer-glow-line"></div>

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">
              <FaFilm />
            </span>

            <span>BeatFlix</span>
          </Link>

          <p>
            Discover movies that match your mood.
            Stop scrolling endlessly and find your
            next unforgettable story.
          </p>

          <span className="footer-tagline">
            Your mood. Your movie. Your moment.
          </span>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-column">

          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/moods">Moods</Link>
          <Link to="/about">About</Link>

        </div>


        {/* MOVIE LINKS */}
        <div className="footer-column">

          <h3>Discover</h3>

          <Link to="/movies">Action</Link>
          <Link to="/movies">Sci-Fi</Link>
          <Link to="/movies">Drama</Link>
          <Link to="/movies">Adventure</Link>

        </div>


        {/* SOCIAL */}
        <div className="footer-column footer-social">

          <h3>Connect</h3>

          <a href="#" aria-label="GitHub">
            <FaGithub />
            GitHub
          </a>

          <a href="#" aria-label="LinkedIn">
            <FaLinkedin />
            LinkedIn
          </a>

          <a href="mailto:hello@beatflix.com">
            <FaEnvelope />
            Contact
          </a>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © 2026 BeatFlix. All Rights Reserved.
        </p>

        <p className="footer-made">
          Made with <FaHeart /> for movie lovers
        </p>

      </div>

    </footer>
  );
}

export default Footer;