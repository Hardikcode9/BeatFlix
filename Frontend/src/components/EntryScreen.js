import { useState } from "react";
import logo from "../assets/images/logo.png";
import {
  FaArrowRight,
  FaCompass,
  FaUserPlus,
  FaUserShield,
  FaFilm
} from "react-icons/fa";

import "../styles/EntryScreen.css";

function EntryScreen({ onEnter }) {

  const [formType, setFormType] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const submitForm = async (event) => {
    event.preventDefault();

    if (!name.trim() || !password.trim()) {
      setMessage("Please enter a name and password to continue.");
      return;
    }

    // CREATE PROFILE
    if (formType === "signup") {
        setMessage("");
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          return;
        } 
      try {
        const response = await fetch(
          "http://localhost:4000/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              password,
              confirmPassword,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Could not create profile.");
          return;
        }

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);

          setFormType("login");

          setName("");

          setPassword("");

          setConfirmPassword("");

          setMessage("");
        }, 2200);
      } catch (error) {
        console.error("Signup Error:", error);
        setMessage("Could not connect to the BeatFlix server.");
      }
      return;
    }

    // LOGIN
    if (formType === "login") {
      try {
        setMessage("");
        const response = await fetch(
          "http://localhost:4000/api/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
            setMessage(data.message || "Could not log in.");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onEnter(data.user.name);

      } catch (error) {
        console.error("Login Error:", error);
        setMessage("Could not connect to the BeatFlix server.");
      }
    }
  };

  return (
    <section className="entry-screen">

      {/* CINEMATIC POSTER BACKGROUND */}
      <div className="entry-poster-wall" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* BACKGROUND OVERLAYS */}
      <div className="entry-dark-overlay" />
      <div className="entry-glow entry-glow-one" />
      <div className="entry-glow entry-glow-two" />
      <div className="entry-glow entry-glow-three" />

      {/* DECORATIVE LIGHT */}
      <div className="entry-light-orbit orbit-one" />
      <div className="entry-light-orbit orbit-two" />

      <div className="entry-content">

        {!formType ? (
          <>
            <div className="netflix-entry">
              <div className="entry-brand">
    <div className="entry-brand-icon">
        <img src={logo} alt="BeatFlix" />
    </div>

    <div className="entry-brand-name">
        <span className="brand-white">Beat</span>
        <span className="brand-blue">Flix</span>
    </div>
</div>

              <h1 className="who-title">
                <span>Who's Watching?</span>
              </h1>

              <div className="netflix-profiles">
                {/* Guest */}
                <button
                  className="netflix-profile"
                  style={{ animationDelay: "0.1s" }}
                  onClick={() => onEnter("Guest")}
                >
                  <div className="netflix-avatar guest-avatar">
                    <FaCompass />
                  </div>
                  <span>Guest</span>
                </button>

                {/* Login */}
                <button
                  className="netflix-profile"
                  style={{ animationDelay: "0.2s" }}
                  onClick={() => setFormType("login")}
                >
                  <div className="netflix-avatar login-avatar">
                    <FaUserShield />
                  </div>
                  <span>Login</span>
                </button>

                {/* Signup */}
                <button
                  className="netflix-profile"
                  style={{ animationDelay: "0.3s" }}
                  onClick={() => setFormType("signup")}
                >
                  <div className="netflix-avatar signup-avatar">
                    <FaUserPlus />
                  </div>
                  <span>Create Profile</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* LOGIN / SIGNUP FORM */
          <form className="entry-form" onSubmit={submitForm}>
            <button
              className="back-choice"
              type="button"
              onClick={() => {
                setFormType("");
                setName("");
                setPassword("");
                setConfirmPassword("");
                setMessage("");
              }}
            >
              ← Back
            </button>

            <div className="form-icon">
              {formType === "login" ? <FaUserShield /> : <FaUserPlus />}
            </div>

            <p className="entry-kicker">BEATFLIX PROFILE</p>

            <h1>{formType === "login" ? "Welcome back." : "Create your profile."}</h1>

            <p className="form-description">
              {formType === "login"
                ? "Enter your details and continue discovering movies made for your mood."
                : "Create your BeatFlix profile and start building a more personal movie experience."
              }
            </p>

            <label>
              Display name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoFocus
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />
            </label>

            {formType === "signup" && (
              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm Password"
                />
              </label>
            )}

            {message && (
              <p className="entry-message">{message}</p>
            )}

            <button className="enter-button" type="submit">
              {formType === "login" ? "Enter BeatFlix" : "Create Profile"}
              <FaArrowRight />
            </button>

            <p className="demo-note">
              Your BeatFlix profile is securely stored for a personalized movie experience.
            </p>
          </form>
        )}
      </div>
      {showSuccess && (
  <div className="success-overlay">
    <div className="success-card">

      <div className="success-check">
        ✓
      </div>

      <h2>Profile Created!</h2>

      <p>
        Your BeatFlix account is ready.
      </p>

      <span>
        Redirecting to Login...
      </span>

    </div>
  </div>
)}
    </section>
  );
}

export default EntryScreen;