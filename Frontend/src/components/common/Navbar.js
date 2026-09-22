import { useState } from "react";
import "../../styles/Navbar.css";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import {
  FaBars,
  FaFilm,
  FaMusic,
  FaHome,
  FaInfoCircle,
  FaSignOutAlt,
  FaTheaterMasks,
  FaBookmark,
  FaUserCircle,
  FaCrown,
  FaGift,
  FaStar,
} from "react-icons/fa";

function Navbar({ viewer, onSwitchProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/movies", label: "Browse movies", icon: <FaFilm /> },
    { to: "/music", label: "Music", icon: <FaMusic /> },
    { to: "/moods", label: "Mood match", icon: <FaTheaterMasks /> },
    { to: "/free", label: "Free Movies", icon: <FaGift /> },
    { to: "/subscription", label: "Subscription", icon: <FaStar /> },
  ];

  return (
    <nav className={`side-nav ${isOpen ? "is-open" : ""}`} aria-label="Main navigation">
      <div className="nav-ambient-glow"></div>

      <div className="side-brand-row">
        <Link to="/" className="side-logo" aria-label="BeatFlix home">
          <div className="brand-mark-wrapper">
            <img src={logo} alt="BeatFlix Logo" className="brand-icon" />
          </div>
          <strong>BeatFlix</strong>
        </Link>
        <button className="nav-toggle" onClick={() => setIsOpen((open) => !open)}>
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

        <NavLink
          to="/mylist"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) => `side-link ${isActive ? "is-active" : ""}`}
        >
          <span className="side-icon"><FaBookmark /></span>
          <span className="side-link-label">My List</span>
          <div className="nav-tooltip">My List</div>
        </NavLink>

        <NavLink
          to="/account"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) => `side-link ${isActive ? "is-active" : ""}`}
        >
          <span className="side-icon"><FaUserCircle /></span>
          <span className="side-link-label">Account</span>
          <div className="nav-tooltip">Account</div>
        </NavLink>

        {localStorage.getItem("userEmail") === "jeehardik2@gmail.com" && (
          <NavLink
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `side-link ${isActive ? "is-active" : ""}`}
          >
            <span className="side-icon"><FaCrown /></span>
            <span className="side-link-label">Admin</span>
            <div className="nav-tooltip">Admin Panel</div>
          </NavLink>
        )}

        <NavLink
          to="/about"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) => `side-link ${isActive ? "is-active" : ""}`}
        >
          <span className="side-icon"><FaInfoCircle /></span>
          <span className="side-link-label">About BeatFlix</span>
          <div className="nav-tooltip">About BeatFlix</div>
        </NavLink>

        <button className="side-link mobile-logout-btn" onClick={onSwitchProfile}>
          <span className="side-icon logout-icon-color"><FaSignOutAlt /></span>
          <span className="side-link-label logout-label-color">Disconnect</span>
        </button>
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
  );
}

export default Navbar;