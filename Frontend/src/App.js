import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, lazy, Suspense } from "react";

import Navbar from "./components/common/Navbar";
import EntryScreen from "./components/EntryScreen";
import Footer from "./components/common/Footer";
import GlobalMusicPlayer from "./components/GlobalMusicPlayer";
import ScrollToTop from "./components/ScrollToTop";

import { MusicProvider } from "./context/MusicContext";
import { MoodProvider } from "./context/MoodContext";

import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Movies = lazy(() => import("./pages/Movies"));
const Music = lazy(() => import("./pages/Music"));
const MusicDetails = lazy(() => import("./pages/MusicDetails"));
const Playlist = lazy(() => import("./pages/Playlist"));
const Moods = lazy(() => import("./pages/Moods"));
const About = lazy(() => import("./pages/About"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const MyListPage = lazy(() => import("./pages/MyListPage"));
const Subscription = lazy(() => import("./pages/Subscription"));
const FreeMovies = lazy(() => import("./pages/FreeMovies"));
const AccountManagement = lazy(() => import("./pages/AccountManagement"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#060a14",
          color: "#f7f9ff",
          padding: "40px",
          textAlign: "center",
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9aa7c7", marginBottom: "24px", maxWidth: "400px" }}>
            BeatFlix ran into an unexpected problem. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #5d5fef, #38bdf8)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingFallback = () => (
  <div style={{
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5d5fef",
    fontSize: "1.1rem",
    fontWeight: 500,
  }}>
    Loading…
  </div>
);

function App() {
  const [viewer, setViewer] = useState(() => {
    return sessionStorage.getItem("beatflixViewer") || null;
  });

  const handleEnter = (name) => {
    sessionStorage.setItem("beatflixViewer", name);
    window.history.replaceState(null, "", "/");
    setViewer(name);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("beatflixViewer");
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
                <Navbar viewer={viewer} onSwitchProfile={handleLogout} />

                <main className="app-content">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home viewer={viewer} />} />
                      <Route path="/movies" element={<Movies />} />
                      <Route path="/music" element={<Music />} />
                      <Route path="/music/:id" element={<MusicDetails />} />
                      <Route path="/playlist" element={<Playlist />} />
                      <Route path="/moods" element={<Moods />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/movie/:id" element={<MovieDetails />} />
                      <Route path="/collection/:slug" element={<CollectionPage />} />
                      <Route path="/mylist" element={<MyListPage />} />
                      <Route path="/subscription" element={<Subscription />} />
                      <Route path="/free" element={<FreeMovies />} />
                      <Route path="/account" element={<AccountManagement />} />
                      <Route
                        path="/admin"
                        element={
                          localStorage.getItem("userEmail") === "jeehardik2@gmail.com"
                            ? <AdminDashboard />
                            : <Home viewer={viewer} />
                        }
                      />
                    </Routes>
                  </Suspense>
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