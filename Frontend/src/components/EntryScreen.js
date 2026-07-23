import { useState } from "react";
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

        onEnter(data.user.name);
      } catch (error) {
        console.error("Signup Error:", error);

        setMessage(
          "Could not connect to the BeatFlix server."
        );
      }

      return;
    }

    // LOGIN
    // We will connect this to the login API next.
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

          console.log(data);

          if (!response.ok) {
              setMessage(data.message || "Could not log in.");
              return;
          }

          localStorage.setItem("token", data.token);

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          onEnter(data.user.name);

        } catch (error) {
          console.error("Login Error:", error);

          setMessage(
            "Could not connect to the BeatFlix server."
          );
        }
      }
  };


  return (
    <section className="entry-screen">

      {/* CINEMATIC POSTER BACKGROUND */}

      <div
        className="entry-poster-wall"
        aria-hidden="true"
      >
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

        {/* LOGO */}

        <div className="entry-brand">

          <span className="entry-brand-icon">
            <FaFilm />
          </span>

          <span className="entry-brand-name">
            Beat<span>Flix</span>
          </span>

        </div>


        {!formType ? (

          <>

            {/* HERO TEXT */}

            <div className="entry-heading">

              <p className="entry-kicker">
                ✦ YOUR NEXT FAVORITE MOVIE IS WAITING
              </p>

              <h1>
                Discover movies
                <span> made for your mood.</span>
              </h1>

              <p className="entry-intro">
                Step into BeatFlix and discover movies that match
                your taste, your mood, and your moment.
              </p>

            </div>


            {/* PROFILE OPTIONS */}

            <div className="profile-options">


              {/* GUEST */}

              <button
                className="profile-option guest-option"
                onClick={() => onEnter("Guest")}
              >

                <div className="profile-card-glow" />

                <span className="profile-icon">
                  <FaCompass />
                </span>

                <div className="profile-text">

                  <strong>
                    Explore as Guest
                  </strong>

                  <small>
                    Start discovering instantly
                  </small>

                </div>

                <span className="profile-arrow">
                  <FaArrowRight />
                </span>

              </button>


              {/* LOGIN */}

              <button
                className="profile-option login-option"
                onClick={() => setFormType("login")}
              >

                <div className="profile-card-glow" />

                <span className="profile-icon">
                  <FaUserShield />
                </span>

                <div className="profile-text">

                  <strong>
                    Welcome Back
                  </strong>

                  <small>
                    Continue your discovery
                  </small>

                </div>

                <span className="profile-arrow">
                  <FaArrowRight />
                </span>

              </button>


              {/* SIGN UP */}

              <button
                className="profile-option signup-option"
                onClick={() => setFormType("signup")}
              >

                <div className="profile-card-glow" />

                <span className="profile-icon">
                  <FaUserPlus />
                </span>

                <div className="profile-text">

                  <strong>
                    Create Profile
                  </strong>

                  <small>
                    Personalize your movie picks
                  </small>

                </div>

                <span className="profile-arrow">
                  <FaArrowRight />
                </span>

              </button>

            </div>


            {/* BOTTOM HINT */}

            <p className="entry-hint">
              No endless scrolling. Just better movie discoveries.
            </p>

          </>

        ) : (

          /* LOGIN / SIGNUP FORM */

          <form
            className="entry-form"
            onSubmit={submitForm}
          >

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

              {formType === "login"
                ? <FaUserShield />
                : <FaUserPlus />
              }

            </div>


            <p className="entry-kicker">
              BEATFLIX PROFILE
            </p>


            <h1>

              {formType === "login"
                ? "Welcome back."
                : "Create your profile."
              }

            </h1>


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
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                autoFocus
              />

            </label>


            <label>

              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Password"
              />

            </label>

            {formType === "signup" && (
              <label>

                Confirm Password

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm Password"
                />

              </label>
            )}


            {message && (

              <p className="entry-message">
                {message}
              </p>

            )}


            <button
              className="enter-button"
              type="submit"
            >

              {formType === "login"
                ? "Enter BeatFlix"
                : "Create Profile"
              }

              <FaArrowRight />

            </button>


            <p className="demo-note">
              Your BeatFlix profile is securely stored for a personalized movie experience.
            </p>

          </form>

        )}

      </div>

    </section>
  );
}

export default EntryScreen;