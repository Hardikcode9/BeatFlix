/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
import '../styles/AdminDashboard.css';
import { 
  FaUsers, FaFilm, FaCog, FaEdit, FaTrashAlt,
  FaSearch, FaStar, FaChevronLeft, FaChevronRight,
  FaGoogle, FaEnvelope, FaCheckCircle, FaChartPie,
  FaBars, FaTimes
} from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const POSTER_URL = "https://image.tmdb.org/t/p/w92";

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topIndiaMovies, setTopIndiaMovies] = useState([]);
  const [topGlobalMovies, setTopGlobalMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [movieSearch, setMovieSearch] = useState('');
  const [moviePage, setMoviePage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [movieCategory, setMovieCategory] = useState('trending');

  const MOVIES_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [trendRes, topRatedRes, newRelRes, topIndiaRes, topGlobalRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/api/movies/trending`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/top-rated`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/new-releases`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/top-india`).then(r => r.json()),
          fetch(`${API_URL}/api/movies/top-global`).then(r => r.json()),
          fetch(`${API_URL}/api/users/all`).then(r => r.json()),
        ]);

        if (trendRes.success) setTrendingMovies(trendRes.results || []);
        if (topRatedRes.success) setTopRatedMovies(topRatedRes.results || []);
        if (newRelRes.results) setNewReleases(newRelRes.results || []);
        if (topIndiaRes.success) setTopIndiaMovies(topIndiaRes.results || []);
        if (topGlobalRes.success) setTopGlobalMovies(topGlobalRes.results || []);
        if (usersRes.success) setUsers(usersRes.users || []);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const allMovies = useMemo(() => {
    const map = {
      trending: trendingMovies, 'top-rated': topRatedMovies, 'new-releases': newReleases,
      'top-india': topIndiaMovies, 'top-global': topGlobalMovies,
    };
    return map[movieCategory] || trendingMovies;
  }, [movieCategory, trendingMovies, topRatedMovies, newReleases, topIndiaMovies, topGlobalMovies]);

  const totalMovieCount = trendingMovies.length + topRatedMovies.length + newReleases.length + topIndiaMovies.length + topGlobalMovies.length;

  const filteredMovies = useMemo(() => {
    if (!movieSearch.trim()) return allMovies;
    return allMovies.filter(m => (m.title || m.name || '').toLowerCase().includes(movieSearch.toLowerCase()));
  }, [allMovies, movieSearch]);

  const totalMoviePages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  const paginatedMovies = filteredMovies.slice((moviePage - 1) * MOVIES_PER_PAGE, moviePage * MOVIES_PER_PAGE);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    return users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  }, [users, userSearch]);

  const activeUsers = users.filter(u => u.subscriptionStatus === 'active').length;
  const premiumUsers = users.filter(u => u.subscription !== 'starter').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderOverview = () => (
    <div className="admin-content-fade">
      <div className="metrics-grid">
        <div className="metric-card">
          <h3 className="metric-title">Total Users</h3>
          <div className="metric-value">{users.length.toLocaleString()}</div>
          <div className="metric-sub">Registered accounts</div>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Active Subscriptions</h3>
          <div className="metric-value">{activeUsers.toLocaleString()}</div>
          <div className="metric-sub">Currently active billing</div>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Premium Users</h3>
          <div className="metric-value">{premiumUsers.toLocaleString()}</div>
          <div className="metric-sub">Pro & Ultimate tiers</div>
        </div>
        <div className="metric-card">
          <h3 className="metric-title">Content Library</h3>
          <div className="metric-value">{totalMovieCount.toLocaleString()}</div>
          <div className="metric-sub">Titles across all categories</div>
        </div>
      </div>

      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
        </div>
        <div className="trending-simple-grid">
          {trendingMovies.slice(0, 6).map((movie) => (
            <div className="trending-simple-card" key={movie.id}>
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://placehold.co/300x450/1a1a1a/ffffff?text=No+Poster'}
                alt={movie.title || movie.name} 
                className="trending-poster"
              />
              <div className="trending-info">
                <h4>{movie.title || movie.name}</h4>
                <div className="trending-rating">
                  <FaStar className="star-icon"/> {movie.vote_average?.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMovies = () => (
    <div className="admin-content-fade">
      <div className="section-block">
        <div className="section-header flex-between">
          <h2 className="section-title">Content Library</h2>
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search content..." 
              value={movieSearch} 
              onChange={e => { setMovieSearch(e.target.value); setMoviePage(1); }} 
            />
          </div>
        </div>

        <div className="tabs-simple">
          {[
            { key: 'trending', label: 'Trending' }, { key: 'top-rated', label: 'Top Rated' },
            { key: 'new-releases', label: 'New Releases' }, { key: 'top-india', label: 'India' },
            { key: 'top-global', label: 'Global' },
          ].map(cat => (
            <button
              key={cat.key}
              className={`tab-simple ${movieCategory === cat.key ? 'active' : ''}`}
              onClick={() => { setMovieCategory(cat.key); setMoviePage(1); }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genres</th>
                <th>Release Date</th>
                <th>Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-8 text-muted">Loading content...</td></tr>
              ) : paginatedMovies.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-muted">No content found.</td></tr>
              ) : (
                paginatedMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <div className="table-cell-title">
                        <span className="font-medium text-white">{movie.title || movie.name}</span>
                        <span className="text-xs text-muted">ID: {movie.id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tag-list">
                        {(movie.genre_ids || []).slice(0, 2).map(gid => (
                          <span key={gid} className="tag-simple">{genreMap[gid] || gid}</span>
                        ))}
                      </div>
                    </td>
                    <td className="text-muted">{movie.release_date || 'N/A'}</td>
                    <td>
                      <div className="flex-align-center gap-2 font-medium">
                        <FaStar className="star-icon text-xs" /> {movie.vote_average?.toFixed(1) || 'N/A'}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="btn-icon"><FaEdit /></button>
                        <button className="btn-icon danger"><FaTrashAlt /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalMoviePages > 1 && (
          <div className="pagination-simple">
            <button disabled={moviePage === 1} onClick={() => setMoviePage(p => p - 1)} className="btn-page"><FaChevronLeft /></button>
            <span className="page-text">{moviePage} / {totalMoviePages}</span>
            <button disabled={moviePage === totalMoviePages} onClick={() => setMoviePage(p => p + 1)} className="btn-page"><FaChevronRight /></button>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-content-fade">
      <div className="section-block">
        <div className="section-header flex-between">
          <h2 className="section-title">Users</h2>
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={userSearch} 
              onChange={e => setUserSearch(e.target.value)} 
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Auth</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="text-center py-8 text-muted">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-muted">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex-align-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="avatar-simple" />
                        ) : (
                          <div className="avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
                        )}
                        <span className="font-medium text-white">{user.name}</span>
                        {user.emailVerified && <FaCheckCircle className="text-success text-xs" />}
                      </div>
                    </td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                      {user.googleId ? (
                        <span className="auth-label"><FaGoogle className="text-xs" /> Google</span>
                      ) : (
                        <span className="auth-label"><FaEnvelope className="text-xs" /> Email</span>
                      )}
                    </td>
                    <td>
                      <span className="plan-label">{(user.subscription || 'starter').toUpperCase()}</span>
                    </td>
                    <td>
                      <span className={`status-label ${user.subscriptionStatus === 'active' ? 'active' : ''}`}>
                        {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-muted">{formatDate(user.createdAt)}</td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="btn-icon"><FaEdit /></button>
                        <button className="btn-icon danger"><FaTrashAlt /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-content-fade">
      <div className="section-block max-w-3xl">
        <div className="section-header">
          <h2 className="section-title">Settings</h2>
        </div>

        <div className="settings-group">
          <h3 className="settings-group-title">General</h3>
          <div className="form-row">
            <label>Platform Name</label>
            <input type="text" defaultValue="BeatFlix" className="input-simple" />
          </div>
          <div className="form-row">
            <label>Support Email</label>
            <input type="email" defaultValue="support@beatflix.com" className="input-simple" />
          </div>
        </div>

        <div className="settings-group mt-8">
          <h3 className="settings-group-title">Security & Auth</h3>
          
          <div className="toggle-row">
            <div>
              <div className="toggle-title">Require Email Verification</div>
              <div className="toggle-desc">Users must verify their email address.</div>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div>
              <div className="toggle-title">Google OAuth</div>
              <div className="toggle-desc">Allow signing in with Google accounts.</div>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div>
              <div className="toggle-title">Maintenance Mode</div>
              <div className="toggle-desc">Disable public access to the platform.</div>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="mt-8">
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );

  return (
    
    <div className="admin-layout-simple">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={`sidebar-simple ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">BeatFlix</div>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}><FaTimes /></button>
        </div>

        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}>
            <FaChartPie /> Overview
          </button>
          <button className={`menu-item ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => { setActiveTab('movies'); setIsSidebarOpen(false); }}>
            <FaFilm /> Content
          </button>
          <button className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}>
            <FaUsers /> Users
          </button>
          <button className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}>
            <FaCog /> Settings
          </button>
        </nav>
      </aside>

      <main className="main-simple">
        
        <header className="header-simple">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <FaBars />
            </button>
            <div className="header-title">

            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'movies' && 'Content Management'}
            {activeTab === 'users' && 'User Management'}
            
            {activeTab === 'settings' && 'Platform Settings'}
            </div>
          </div>
          <div className="header-profile">

            <div className="avatar-small">A</div>
          </div>
        </header>

        <div className="content-simple">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'movies' && renderMovies()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
