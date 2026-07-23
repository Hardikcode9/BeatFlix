import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/common/Navbar";
import EntryScreen from "./components/EntryScreen";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Moods from "./pages/Moods";
import About from "./pages/About";
import MovieDetails from "./pages/MovieDetails";
import Footer from "./components/common/Footer";
import CollectionPage from "./pages/CollectionPage";
import Subscription from './pages/Subscription';

import "./App.css";

function App() {
  const [viewer, setViewer] = useState(() => {
    return localStorage.getItem("beatflixViewer") || null;
  });

  // Save logged-in user
  const handleEnter = (name) => {
    localStorage.setItem("beatflixViewer", name);
    setViewer(name);
  };

  // Logout / switch profile
  const handleLogout = () => {
    localStorage.removeItem("beatflixViewer");
    setViewer(null);
  };

  // Show Entry Screen when nobody is logged in
  if (!viewer) {
    return <EntryScreen onEnter={handleEnter} />;
  }

  return (
    <BrowserRouter>
      <div className="app-shell">

        <Navbar
          viewer={viewer}
          onSwitchProfile={handleLogout}
        />

        <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={<Home viewer={viewer} />}
          />

          <Route
            path="/movies"
            element={<Movies />}
          />

          <Route
            path="/moods"
            element={<Moods />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />

          <Route
            path="/collection/:slug"
            element={<CollectionPage />}
          />
          <Route
           path="/subscription"
           element={<Subscription />}
          />

        </Routes>

        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;