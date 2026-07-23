import React from "react";
import "../styles/About.css";

import about1 from "../assets/images/about/about1.jpeg";
import about2 from "../assets/images/about/about2.jpeg";
import about3 from "../assets/images/about/about3.jpeg";
import about4 from "../assets/images/about/about4.jpeg";
import about5 from "../assets/images/about/about5.jpeg";
import about6 from "../assets/images/about/about6.jpeg";
import about7 from "../assets/images/about/about7.jpeg";

function About() {
  return (
    <div className="about-page">
      {/* KINETIC AURORA BACKGROUND */}
      <div className="about-ambient-bg">
        <div className="ambient-blob color-1"></div>
        <div className="ambient-blob color-2"></div>
        <div className="ambient-blob color-3"></div>
      </div>

      <div className="about-container">
        
        {/* HERO SECTION */}
        <div className="about-hero">
          {/* THE NEW GLOWING LOGO CREST */}
          <img src="/beatflix_logo (1).png" alt="BeatFlix Logo" className="about-hero-logo animate-0" />
          
          <div className="about-badge animate-1">
            <span className="badge-dot"></span>
            <span>✦ THE BEATFLIX STORY</span>
          </div>
          <h1 className="animate-2">
            <span className="title-line">Redefining How You</span>
            <span className="text-gradient">Discover Cinema</span>
          </h1>
          <p className="intro animate-3">
            BeatFlix is an AI-powered movie recommendation platform that helps
            users discover movies based on their mood instead of endlessly
            scrolling through thousands of titles.
          </p>
        </div>

        {/* SECTION 1: AI POWERED */}
        <div className="about-section glass-panel fade-in-up">
          <div className="about-text">
            <div className="section-icon-badge">🤖</div>
            <h2>AI Powered Recommendations</h2>
            <p>
              BeatFlix understands your mood and instantly recommends
              movies that perfectly match your emotions.
              Whether you're feeling happy, romantic,
              adventurous or looking for an action-packed thriller,
              BeatFlix makes discovering movies effortless.
            </p>
          </div>
          <div className="about-image">
            <div className="image-glow-wrapper">
              <img src={about1} alt="AI Recommendation" />
            </div>
          </div>
        </div>

        {/* SECTION 2: HUGE COLLECTION */}
        <div className="about-section reverse glass-panel fade-in-up">
          <div className="about-text">
            <div className="section-icon-badge">🎬</div>
            <h2>Huge Movie Collection</h2>
            <p>
              BeatFlix features Hollywood, Bollywood,
              Korean and Japanese movies with ratings,
              genres, release year, trailers and detailed
              descriptions to help users choose the perfect film.
            </p>
          </div>
          <div className="about-image">
            <div className="image-glow-wrapper">
              <img src={about2} alt="Movies" />
            </div>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="features">
          {[
            { icon: "🤖", title: "AI Mood Search", desc: "Get movie recommendations based on your emotions." },
            { icon: "❤️", title: "Favorites", desc: "Save your favourite movies for later." },
            { icon: "🎥", title: "Trailers", desc: "Watch official trailers before choosing a movie." },
            { icon: "📖", title: "Movie Details", desc: "Read descriptions, genres, ratings and more." },
            { icon: "⭐", title: "Top Rated", desc: "Explore highly-rated movies from different industries." },
            { icon: "⚡", title: "Fast Experience", desc: "Simple, clean and responsive user interface." }
          ].map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* SECTION 3: EXPERIENCE */}
        <div className="about-section glass-panel fade-in-up">
          <div className="about-image">
            <div className="image-glow-wrapper">
              <img src={about3} alt="Movie Experience" />
            </div>
          </div>
          <div className="about-text">
            <div className="section-icon-badge">🎞</div>
            <h2>Better Movie Experience</h2>
            <p>
              Every movie includes detailed information,
              release year, genres, trailers and AI-powered
              recommendations to improve the overall user
              experience.
            </p>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-glow"></div>
            <h2>12K+</h2>
            <p>Movies Added</p>
          </div>
          <div className="stat-card">
            <div className="stat-glow"></div>
            <h2>8</h2>
            <p>Mood Categories</p>
          </div>
          <div className="stat-card">
            <div className="stat-glow"></div>
            <h2>100%</h2>
            <p>Free to Use</p>
          </div>
          <div className="stat-card">
            <div className="stat-glow"></div>
            <h2>AI</h2>
            <p>Powered Core</p>
          </div>
        </div>

        {/* SECTION 4: FUTURE */}
        <div className="about-section reverse glass-panel fade-in-up">
          <div className="about-text">
            <div className="section-icon-badge">🚀</div>
            <h2>Future Enhancements</h2>
            <p>
              BeatFlix will soon include user authentication,
              MongoDB integration, cloud storage,
              personalized watchlists, advanced AI,
              search functionality and many exciting features.
            </p>
          </div>
          <div className="about-image">
            <div className="image-glow-wrapper">
              <img src={about4} alt="Future" />
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <div className="gallery-grid">
          <div className="gallery-card"><img src={about5} alt="Gallery 1" /></div>
          <div className="gallery-card"><img src={about6} alt="Gallery 2" /></div>
          <div className="gallery-card"><img src={about7} alt="Gallery 3" /></div>
        </div>

        {/* MISSION STATEMENT */}
        <div className="mission-container">
          <div className="mission-liquid-bg"></div>
          <div className="mission-content">
            <h2>💜 Our Mission</h2>
            <p>
              BeatFlix aims to eliminate endless scrolling and
              help movie lovers instantly discover films that
              perfectly match their mood using intelligent
              recommendations and a modern streaming experience.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;