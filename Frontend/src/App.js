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
import About from "./pages/About";
import MovieDetails from "./pages/MovieDetails";
import Footer from "./components/common/Footer";
import CollectionPage from "./pages/CollectionPage";
import Subscription from "./pages/Subscription";
import AccountManagement from "./pages/AccountManagement";
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
import GlobalMusicPlayer from "./components/GlobalMusicPlayer";
import ScrollToTop from "./components/ScrollToTop";
import SmartConcierge from "./components/SmartConcierge";

import "./App.css";

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

  if (!viewer) {
    return <EntryScreen onEnter={handleEnter} />;
  }

  return (
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
        <SmartConcierge />
        <Footer />
      </div>
    </BrowserRouter>
    </MusicProvider>
  );
}

export default App;