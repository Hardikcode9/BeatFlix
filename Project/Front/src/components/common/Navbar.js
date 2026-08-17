import { useState } from "react";
import "../../styles/Navbar.css";
import { NavLink, Link } from "react-router-dom";
import { 
  FaBars, 
  FaFilm, 
  FaHome, 
  FaInfoCircle, 
  FaSignOutAlt, 
  FaTheaterMasks, 
  FaBookmark,
  FaUserCog /* <-- NEW ICON IMPORT */
} from "react-icons/fa";
import MyListPanel from "../MyListPanel"; 

function Navbar({ viewer, onSwitchProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMyListOpen, setIsMyListOpen] = useState(false);
  
  const links = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/movies", label: "Browse movies", icon: <FaFilm /> },
    { to: "/moods", label: "Mood match", icon: <FaTheaterMasks /> },
    { to: "/about", label: "About BeatFlix", icon: <FaInfoCircle /> },
  ];

  return (
    <>
      <nav className={`side-nav ${isOpen ? "is-open" : ""}`} aria-label="Main navigation">
        <div className="nav-ambient-glow"></div>

        <div className="side-brand-row">
          <Link to="/" className="side-logo" aria-label="BeatFlix home">
            <div className="brand-mark-wrapper">
              <img src="/beatflix_logo (1).png" alt="BeatFlix Logo" className="brand-icon" />
            </div>
            <strong>BeatFlix</strong>
          </Link>
          <button 
            className="nav-toggle" 
            onClick={() => setIsOpen((open) => !open)} 
          >
            <FaBars />
          </button>
        </div>

        <div className="side-section-label">DISCOVER</div>
        
        <div className="side-links">
          {links.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              end={link.to === "/"} 
              onClick={() => setIsOpen(false)} 
              className={({ isActive }) => `side-link ${isActive ? "is-active" : ""}`}
            >
              <span className="side-icon">{link.icon}</span>
              <span className="side-link-label">{link.label}</span>
              <div className="nav-tooltip">{link.label}</div>
            </NavLink>
          ))}

          {/* MY LIST BUTTON */}
          <div 
            className="side-link my-list-btn" 
            onClick={() => {
              setIsMyListOpen(true);
              setIsOpen(false);
            }}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <span className="side-icon"><FaBookmark /></span>
            <span className="side-link-label">My List</span>
            <div className="nav-tooltip">My List</div>
          </div>

          {/* NEW: ACCOUNT MANAGEMENT BUTTON */}
          <NavLink 
            to="/account" 
            onClick={() => setIsOpen(false)} 
            className={({ isActive }) => `side-link ${isActive ? "is-active" : ""}`}
          >
            <span className="side-icon"><FaUserCog /></span>
            <span className="side-link-label">Account</span>
            <div className="nav-tooltip">Account</div>
          </NavLink>
        </div>

        <div className="side-bottom">
          <div className="viewer-chip">
            <div className="viewer-avatar-wrapper">
              <span className="viewer-avatar">{viewer?.charAt(0).toUpperCase() || "U"}</span>
              <span className="online-dot"></span>
            </div>
            <div className="viewer-info">
              <small>WATCHING AS</small>
              <b>{viewer || "Guest"}</b>
            </div>
          </div>
          <button className="switch-profile" onClick={onSwitchProfile}>
            <FaSignOutAlt className="logout-icon" />
            <span>Disconnect</span>
            <div className="nav-tooltip">Disconnect</div>
          </button>
        </div>
        
      </nav>

      <MyListPanel 
        isOpen={isMyListOpen} 
        onClose={() => setIsMyListOpen(false)} 
      />
    </>
  );
}

export default Navbar;