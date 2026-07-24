import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaEnvelope, FaCrown, FaShieldAlt, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import "../styles/AccountManagement.css";

export default function AccountManagement() {
  const navigate = useNavigate();
  
  // Simulated User Data (Replace with real context/Google Auth data)
  const [userData, setUserData] = useState({
    name: "Alex",
    email: "",
    // 👇 Swapped to a much more reliable, great-looking avatar generator
    avatar: "https://ui-avatars.com/api/?name=Alex&background=6366f1&color=fff&size=150&bold=true",
    plan: "Starter",
    memberSince: "",  
    authProvider: "Google"
  });

useEffect(() => {
  window.scrollTo(0, 0);

  fetchUser();
  fetchSubscription();
}, []);

const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://192.168.0.100:4000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data);

setUserData((prev) => ({
  ...prev,
  name: data.user.name,
  email: data.user.email || "",

  memberSince: new Date(data.user.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  ),

  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
    data.user.name
  )}&background=6366f1&color=fff&size=150&bold=true`,
}));
  } catch (err) {
    console.log(err);
  }
};

const fetchSubscription = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://192.168.0.100:4000/api/subscription/current",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setUserData((prev) => ({
      ...prev,
plan:
"BeatFlix " +
data.subscription.charAt(0).toUpperCase() +
data.subscription.slice(1),
    }));
  } catch (err) {
    console.log(err);
  }
};

  const handleSignOut = () => {
    // Add real sign out logic here
    alert("Signing out...");
    navigate("/");
  };

  const handleDeleteData = () => {
    if (window.confirm("Are you sure you want to delete your watch history and saved lists? This cannot be undone.")) {
      localStorage.removeItem("myList");
      window.dispatchEvent(new Event("myListUpdated"));
      alert("Your local data has been cleared.");
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
              <img src={userData.avatar} alt="User Avatar" className="profile-avatar" />
              {/* THE BADGE WAS REMOVED FROM HERE */}
            </div>
            <h2>{userData.name}</h2>
            <p className="user-email">{userData.email}</p>
            <div className="member-date">Member since {userData.memberSince}</div>
            
            <button className="edit-profile-btn">
              <FaUserEdit /> Edit Profile
            </button>
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
              <p className="security-note">You are signed in via {userData.authProvider}. Password changes are managed through your provider.</p>
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