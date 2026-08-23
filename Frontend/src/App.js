import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/common/Navbar";
import EntryScreen from "./components/EntryScreen";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import MusicDetails from "./pages/MusicDetails";
import Playlist from "./pages/Playlist";
import Moods from "./pages/Moods";
import VoiceTester from "./pages/VoiceTester";
import About from "./pages/About";
import MovieDetails from "./pages/MovieDetails";
import Footer from "./components/common/Footer";
import CollectionPage from "./pages/CollectionPage";
import Subscription from "./pages/Subscription";
import AccountManagement from "./pages/AccountManagement";

import MyListPage from "./pages/MyListPage";
import AdminDashboard from "./pages/AdminDashboard";
import FreeMovies from "./pages/FreeMovies";

import { MusicProvider } from "./context/MusicContext";
import { MoodProvider } from "./context/MoodContext";
import GlobalMusicPlayer from "./components/GlobalMusicPlayer";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red", padding: "50px", background: "black", zIndex: 99999, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        <h1>Something went wrong.</h1>
        <pre>{this.state.error && this.state.error.toString()}</pre>
        <pre>{this.state.error && this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

function App() {
  const [viewer, setViewer] = useState(() => {
    return sessionStorage.getItem("beatflixViewer") || null;
  });

  const handleEnter = (name) => {
    sessionStorage.setItem("beatflixViewer", name);
    // Rewrite the URL to / so that when BrowserRouter mounts, it defaults to the home page.
    window.history.replaceState(null, "", "/");
    setViewer(name);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("beatflixViewer");
    // Clear the intro played state so it plays again upon next login
    sessionStorage.removeItem("beatflix_intro_played");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setViewer(null);
  };

  return (
    <ErrorBoundary>
      <MoodProvider>
        {!viewer ? (
          <EntryScreen onEnter={handleEnter} />
        ) : (
          <MusicProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="app-shell">
                <Navbar
                  viewer={viewer}
                  onSwitchProfile={handleLogout}
                />

                <main className="app-content">
                  <Routes>
                    <Route path="/" element={<Home viewer={viewer} />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/music/:id" element={<MusicDetails />} />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/moods" element={<Moods />} />
                    <Route path="/voice-tester" element={<VoiceTester />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/collection/:slug" element={<CollectionPage />} />
                    <Route path="/mylist" element={<MyListPage />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/free" element={<FreeMovies />} />
                    <Route path="/account" element={<AccountManagement />} />
                    <Route 
                      path="/admin" 
                      element={localStorage.getItem("userEmail") === "jeehardik2@gmail.com" ? <AdminDashboard /> : <Home viewer={viewer} />} 
                    />
                  </Routes>
                </main>

                <GlobalMusicPlayer />
                <Footer />
              </div>
            </BrowserRouter>
          </MusicProvider>
        )}
      </MoodProvider>
    </ErrorBoundary>
  );
}

export default App;