import "../../styles/Footer.css";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
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
            <div className="footer-brand-mark-wrapper">
              <img src="/beatflix_logo (1).png" alt="BeatFlix Logo" className="footer-brand-icon" />
            </div>
            <span>BeatFlix</span>
          </Link>

          <p>
            Discover movies and music that match your mood.
            Stop scrolling endlessly and find your
            next unforgettable experience.
          </p>

          <span className="footer-tagline">
            Your mood. Your media. Your moment.
          </span>

        </div>


        {/* EXPLORE LINKS */}
        <div className="footer-column">

          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/movies">Browse Movies</Link>
          <Link to="/music">Music Hub</Link>
          <Link to="/moods">Mood Match</Link>

        </div>


        {/* PREMIUM LINKS */}
        <div className="footer-column">

          <h3>Exclusive</h3>

          <Link to="/free">Free Movies</Link>
          <Link to="/subscription">Subscription</Link>
          <Link to="/playlist">My Playlist</Link>

        </div>


        {/* SOCIAL */}
        <div className="footer-column footer-social">

          <h3>Connect</h3>

          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
            GitHub
          </a>

          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
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
          Made with <FaHeart /> for entertainment lovers
        </p>

      </div>

    </footer>
  );
}

export default Footer;