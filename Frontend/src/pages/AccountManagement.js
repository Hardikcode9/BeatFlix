import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaEnvelope, FaCrown, FaShieldAlt, FaTrashAlt, FaSignOutAlt, FaCamera, FaSave, FaTimes, FaGoogle, FaCheck, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/AccountManagement.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function AccountManagement() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    plan: "Starter",
    memberSince: "",
    authProvider: "Email",
    googleId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success || !data.user) return;

      const user = data.user;
      setUserData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        googleId: user.googleId || "",
        authProvider: user.googleId ? "Google" : "Email",
        plan: user.subscription
          ? `BeatFlix ${user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}`
          : "BeatFlix Starter",
        memberSince: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "",
      });
      setEditName(user.name || "");
      setEditAvatarUrl(user.avatar || "");
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const getAvatarSrc = (name, customAvatar) => {
    if (customAvatar && customAvatar.trim()) return customAvatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=6366f1&color=fff&size=150&bold=true`;
  };

  const handleStartEdit = () => {
    setEditName(userData.name);
    setEditAvatarUrl(userData.avatar);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(userData.name);
    setEditAvatarUrl(userData.avatar);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarUrl(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }

    if (!editName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          avatar: editAvatarUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Profile updated successfully!");
      setUserData((prev) => ({
        ...prev,
        name: data.user.name,
        avatar: data.user.avatar || "",
      }));
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("beatflixViewer");
    sessionStorage.removeItem("beatflix_intro_played");
    window.location.href = "/";
  };

  const handleDeleteData = () => {
    if (window.confirm("Are you sure you want to delete your watch history and saved lists? This cannot be undone.")) {
      localStorage.removeItem("myList");
      window.dispatchEvent(new Event("myListUpdated"));
      toast.success("Your local data has been cleared.");
    }
  };

  return (
    <div className="account-page">
      {/* Ambient Background Glows */}
      <div className="acc-glow-orb purple-orb"></div>
      <div className="acc-glow-orb blue-orb"></div>

      <div className="acc-container animate-slide-up">
        <h1 className="acc-title">Account Settings</h1>

        <div className="acc-grid">
          {/* LEFT COLUMN: Profile Summary */}
          <div className="acc-card profile-card">
            <div className="avatar-wrapper">
              <img
                src={isEditing ? getAvatarSrc(editName, editAvatarUrl) : getAvatarSrc(userData.name, userData.avatar)}
                alt="User Avatar"
                className="profile-avatar"
              />
              {isEditing && (
                <div className="avatar-edit-hint"><FaCamera /> Change</div>
              )}
            </div>

            {!isEditing ? (
              <>
                <h2>{userData.name}</h2>
                <p className="user-email">{userData.email}</p>
                <div className="member-date">Member since {userData.memberSince}</div>
                <button className="edit-profile-btn" onClick={handleStartEdit}>
                  <FaUserEdit /> Edit Profile
                </button>
              </>
            ) : (
              <div className="edit-form">
                <div className="edit-field">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={30}
                  />
                </div>
                <div className="edit-field">
                  <label>Profile Photo</label>
                  <div className="avatar-input-group">
                    <input
                      type="text"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="avatar-url-input"
                    />
                    <span className="or-text">OR</span>
                    <label className="upload-btn">
                      <FaUpload /> Upload
                      <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                    </label>
                  </div>
                  <span className="edit-hint">Paste a link or upload from your device (Max 2MB). Leave empty for auto-generated avatar.</span>
                </div>
                <div className="edit-actions">
                  <button className="save-profile-btn" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving..." : <><FaSave /> Save</>}
                  </button>
                  <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Settings & Details */}
          <div className="acc-details-col">
            
            {/* Subscription Box */}
            <div className="acc-card plan-card">
              <div className="card-header">
                <h3><FaCrown className="icon-gold" /> Current Plan</h3>
                <span className="plan-badge">{userData.plan}</span>
              </div>
              <p>You have access to 4K streaming, zero ads, and exclusive content.</p>
              <button className="manage-plan-btn" onClick={() => navigate("/subscription")}>
                Manage Subscription
              </button>
            </div>

            {/* Security Box */}
            <div className="acc-card security-card">
              <div className="card-header">
                <h3><FaShieldAlt className="icon-blue" /> Security & Auth</h3>
              </div>
              <div className="info-row">
                <FaEnvelope className="row-icon" />
                <div>
                  <h4>Email Address</h4>
                  <p>{userData.email}</p>
                </div>
              </div>
              <div className="info-row">
                {userData.authProvider === "Google" ? <FaGoogle className="row-icon" style={{color: '#4285F4'}} /> : <FaCheck className="row-icon" />}
                <div>
                  <h4>Auth Provider</h4>
                  <p>{userData.authProvider === "Google" ? "Google OAuth" : "Email & Password"}</p>
                </div>
              </div>
              {userData.authProvider === "Google" && (
                <p className="security-note">You are signed in via Google. Password changes are managed through your Google account.</p>
              )}
            </div>

            {/* Danger Zone */}
            <div className="acc-card danger-card">
              <div className="card-header">
                <h3 className="danger-title">Danger Zone</h3>
              </div>
              <div className="danger-actions">
                <button className="action-btn clear-btn" onClick={handleDeleteData}>
                  <FaTrashAlt /> Clear Local Data
                </button>
                <button className="action-btn logout-btn" onClick={handleSignOut}>
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}