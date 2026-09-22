import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import logo from "../assets/images/logo.png";
import {
  FaArrowRight, FaCompass, FaUserPlus, FaUserShield,
  FaEye, FaEyeSlash, FaGoogle, FaUser, FaEnvelope, FaLock
} from "react-icons/fa";

import "../styles/EntryScreen.css";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { useMood } from "../context/MoodContext";
import { API_BASE } from "../utils/constants";

import ScrollBackground from "./ScrollBackground";

gsap.registerPlugin(ScrollTrigger);

const Particles = ({ count }) => (
  <div className="particle-container">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className={`particle particle-${i % 3}`}
        style={{ left: `${Math.random() * 100}%`, animationDelay: `${-(Math.random() * 30)}s` }}
      />
    ))}
  </div>
);

const ParticleEffect = ({ count }) => (
  <div className="local-particles">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="local-particle" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${-(Math.random() * 10)}s`,
      }} />
    ))}
  </div>
);

function EntryScreen({ onEnter }) {
  const [formType, setFormType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(window.innerWidth <= 1024);
  const { setMood, themeData } = useMood();
  const [pendingName, setPendingName] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [moodInput, setMoodInput] = useState("");

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const emotionHistoryRef = useRef([]);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileDevice(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const particleCount = isMobileDevice ? 12 : 30;
  const localParticleCount = isMobileDevice ? 4 : 10;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      const response = await fetch(`${API_BASE}/api/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          googleId: result.user.uid,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      toast.success(`Welcome back, ${data.user.name}!`);
      setPendingName(data.user.name || "User");
      setFormType("mood");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
        toast.error(error.message || "Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (formType === "login") {
        if (!name || !password) {
          setMessage("Please enter both email and password.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: name, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        toast.success("Welcome back!");
        setPendingName(data.user.name || "User");
        setFormType("mood");
      } else {
        if (!name || !email || !password || !confirmPassword) {
          setMessage("Please fill in all fields.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/api/users/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setShowOtpModal(true);
      }
    } catch (error) {
      setMessage(error.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const verifyRes = await fetch(`${API_BASE}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message);

      const registerRes = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.message);

      setShowOtpModal(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setFormType("login");
        setName(email);
        setPassword("");
        setConfirmPassword("");
        setOtp("");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const sendForgotOtp = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("OTP sent! Check your inbox.");
      setForgotStep(2);
    } catch (error) {
      toast.error(error.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!forgotOtp || !newPassword) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Password reset successfully! You can now login.");
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotOtp("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const submitMood = (moodName) => {
    setMood(moodName);
    setShowEmoji(true);
    setTimeout(() => {
      onEnter(pendingName);
    }, 2000);
  };

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setScanPhase("Warming up the lens...");
      const faceapi = await import("face-api.js");
      const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Camera access denied or failed to load models.");
      stopScanner();
    }
  };

  const stopScanner = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    emotionHistoryRef.current = [];
    setIsScanning(false);
  };

  const handleVideoPlay = async () => {
    setScanPhase("Analyzing micro-expressions...");
    emotionHistoryRef.current = [];
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    const faceapi = await import("face-api.js");

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 }))
          .withFaceExpressions();

        if (!detection) {
          setScanPhase("Searching for face...");
          return;
        }

        const expressions = detection.expressions;
        const strongestEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        if (expressions[strongestEmotion] < 0.70) return;

        emotionHistoryRef.current.push(strongestEmotion);
        if (emotionHistoryRef.current.length > 5) emotionHistoryRef.current.shift();

        const counts = {};
        emotionHistoryRef.current.forEach((e) => {
          counts[e] = (counts[e] || 0) + 1;
        });

        const stableEmotion = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );

        if (counts[stableEmotion] >= 4) {
          clearInterval(scanIntervalRef.current);
          stopScanner();
          submitMood(stableEmotion);
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    }, 300);
  };

  // Smooth scrolling (desktop only — mobile uses native momentum)
  useEffect(() => {
    if (isMobileDevice) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [isMobileDevice]);

  // GSAP 3D scroll timeline
  useEffect(() => {
    document.body.style.overflow = formType || showOtpModal || showForgotModal || showSuccess ? "hidden" : "auto";

    if (formType || isMobileDevice) {
      return () => {
        document.body.style.overflow = "auto";
      };
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-background-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          snap: {
            snapTo: (value) => {
              if (value < 0.10) return 0;
              if (value < 0.45) return 0.333;
              if (value < 0.80) return 0.666;
              return 1;
            },
            duration: { min: 0.5, max: 1.0 },
            ease: "power3.inOut",
            delay: 0.1,
          },
        },
      });

      tl.to({}, { duration: 100 });

      tl.to(".who-title-container", {
        y: -250, z: -300, autoAlpha: 0, scale: 0.95, duration: 10, ease: "power2.inOut",
      }, 0);

      tl.fromTo(".guest-card",
        { y: 250, z: -400, rotateX: -15, autoAlpha: 0 },
        { y: 0, z: 0, rotateX: 0, autoAlpha: 1, duration: 15, ease: "power2.out" }, 10
      );
      tl.to(".guest-card",
        { y: -250, z: -400, rotateX: 15, autoAlpha: 0, duration: 12, ease: "power2.in" }, 42
      );

      tl.fromTo(".login-card",
        { y: 250, z: -400, rotateX: -15, autoAlpha: 0 },
        { y: 0, z: 0, rotateX: 0, autoAlpha: 1, duration: 15, ease: "power2.out" }, 45
      );
      tl.to(".login-card",
        { y: -250, z: -400, rotateX: 15, autoAlpha: 0, duration: 12, ease: "power2.in" }, 75
      );

      tl.fromTo(".signup-card",
        { y: 250, z: -400, rotateX: -15, autoAlpha: 0 },
        { y: 0, z: 0, rotateX: 0, autoAlpha: 1, duration: 15, ease: "power2.out" }, 85
      );

      tl.fromTo(".scroll-progress-fill",
        { scaleY: 0 },
        { scaleY: 1, duration: 100, ease: "none" }, 0
      );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "auto";
    };
  }, [formType, showOtpModal, showForgotModal, showSuccess, isMobileDevice]);

  const formVariants = {
    initial: { x: "-50%", y: "-30%", opacity: 0, scale: 0.95, rotateX: -10, filter: "blur(15px)" },
    in: { x: "-50%", y: "-50%", opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
    out: { x: "-50%", y: "-40%", opacity: 0, scale: 0.95, filter: "blur(15px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main className="beatflix-entry-wrapper">
      {!isMobileDevice && <ScrollBackground totalFrames={200} />}

      <section className="scroll-background-section" />

      <div className="scroll-container">
        <Particles count={particleCount} />

        {!formType && (
          <div className="scroll-progress-container">
            <div className="scroll-progress-track">
              <div className="scroll-progress-fill" />
            </div>
            <div className="scroll-labels">
              <span>Welcome</span>
              <span>Guest</span>
              <span>Login</span>
              <span>Create Profile</span>
            </div>
          </div>
        )}

        <section className="entry-content">
          {isMobileDevice ? (
            <div className="mobile-premium-view">
              <div className="who-title-container mobile-who-title">
                <ParticleEffect count={localParticleCount} />
                <div className="entry-brand">
                  <div className="entry-brand-icon"><img src={logo} alt="BeatFlix" /></div>
                  <div className="entry-brand-name"><span className="brand-white">Beat</span><span className="brand-blue">Flix</span></div>
                </div>
                <h1 className="who-title mobile-who-heading">Who's Watching?</h1>
              </div>

              {!formType && (
                <div className="mobile-premium-slider">
                  <button className="mobile-premium-card mc-guest" onClick={() => { setPendingName("Guest"); setFormType("mood"); }}>
                    <div className="mc-glow" />
                    <div className="mc-icon"><FaCompass /></div>
                    <h3>Guest</h3>
                    <p>Continue instantly</p>
                  </button>
                  <button className="mobile-premium-card mc-login" onClick={() => setFormType("login")}>
                    <div className="mc-glow" />
                    <div className="mc-icon"><FaUserShield /></div>
                    <h3>Login</h3>
                    <p>Welcome back</p>
                  </button>
                  <button className="mobile-premium-card mc-signup" onClick={() => setFormType("signup")}>
                    <div className="mc-glow" />
                    <div className="mc-icon"><FaUserPlus /></div>
                    <h3>Create Profile</h3>
                    <p>Make BeatFlix yours</p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              className="netflix-entry"
              initial={false}
              animate={{
                opacity: formType ? 0 : 1,
                filter: formType ? "blur(15px)" : "blur(0px)",
                z: formType ? -300 : 0,
                pointerEvents: formType ? "none" : "auto",
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="who-title-container">
                <ParticleEffect count={localParticleCount} />
                <div className="entry-brand">
                  <div className="entry-brand-icon"><img src={logo} alt="BeatFlix" /></div>
                  <div className="entry-brand-name"><span className="brand-white">Beat</span><span className="brand-blue">Flix</span></div>
                </div>
                <h1 className="who-title">Who's Watching?</h1>
              </div>

              <div className="netflix-profiles">
                <button className="cinematic-card guest-card" onClick={() => { setPendingName("Guest"); setFormType("mood"); }}>
                  <ParticleEffect count={localParticleCount} />
                  <div className="card-ambient-glow guest-glow" />
                  <div className="card-glass-surface">
                    <div className="card-icon-capsule guest-capsule"><FaCompass /></div>
                    <div className="card-text-content">
                      <span>Guest</span>
                      <small>Continue instantly</small>
                    </div>
                  </div>
                </button>

                <button className="cinematic-card login-card" onClick={() => setFormType("login")}>
                  <ParticleEffect count={localParticleCount} />
                  <div className="card-ambient-glow login-glow" />
                  <div className="card-glass-surface">
                    <div className="card-icon-capsule login-capsule"><FaUserShield /></div>
                    <div className="card-text-content">
                      <span>Login</span>
                      <small>Welcome back</small>
                    </div>
                  </div>
                </button>

                <button className="cinematic-card signup-card" onClick={() => setFormType("signup")}>
                  <ParticleEffect count={localParticleCount} />
                  <div className="card-ambient-glow signup-glow" />
                  <div className="card-glass-surface">
                    <div className="card-icon-capsule signup-capsule"><FaUserPlus /></div>
                    <div className="card-text-content">
                      <span>Create Profile</span>
                      <small>Make BeatFlix yours</small>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {formType && (
              <motion.form
                key="form"
                variants={formVariants}
                initial="initial"
                animate="in"
                exit="out"
                className={`entry-form ${isMobileDevice ? "mobile-entry-form" : ""}`}
                onSubmit={submitForm}
                data-lenis-prevent
              >
                <button className="back-choice" type="button" onClick={() => { setFormType(""); setMessage(""); }}>
                  ← Back
                </button>
                <div className="form-icon">
                  {formType === "mood" ? "🎭" : formType === "login" ? <FaUserShield /> : <FaUserPlus />}
                </div>

                {formType === "mood" ? (
                  <>
                    <p className="entry-kicker">SET THE VIBE</p>
                    <h1>How are you feeling?</h1>
                    <p className="form-description">We will tailor the entire BeatFlix experience to your current mood.</p>

                    {!isScanning ? (
                      <>
                        <label>Your Mood
                          <div className="input-box">
                            <input
                              value={moodInput}
                              onChange={(e) => setMoodInput(e.target.value)}
                              placeholder="e.g. happy, sad, energetic, chill..."
                              autoFocus
                            />
                          </div>
                        </label>
                        <button className="enter-button" type="button" onClick={() => submitMood(moodInput || "neutral")}>
                          Set Mood <FaArrowRight />
                        </button>

                        <div className="entry-divider"><span></span><p>OR</p><span></span></div>

                        <button type="button" className="google-button scan-face-btn" onClick={startScanner}>
                          📷 Scan Face Instead
                        </button>
                      </>
                    ) : (
                      <div className="scanner-container">
                        <div className="video-wrapper">
                          <video ref={videoRef} autoPlay muted playsInline onPlay={handleVideoPlay} />
                          <div className="scan-overlay" />
                        </div>
                        <p className="scan-phase">{scanPhase}</p>
                        <button type="button" className="back-choice" onClick={stopScanner}>
                          Cancel Scan
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="entry-kicker">BEATFLIX PROFILE</p>
                    <h1>{formType === "login" ? "Welcome back." : "Create your profile."}</h1>
                    <p className="form-description">
                      {formType === "login"
                        ? "Enter your details and continue discovering movies made for your mood."
                        : "Create your BeatFlix profile and start building a more personal movie experience."}
                    </p>

                    <label>{formType === "login" ? "Email or Username" : "Username"}
                      <div className="input-box">
                        <span className="input-icon"><FaUser /></span>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={formType === "login" ? "Enter email or username" : "Choose a username"} autoFocus />
                      </div>
                    </label>

                    {formType === "signup" && (
                      <label>Email
                        <div className="input-box">
                          <span className="input-icon"><FaEnvelope /></span>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                        </div>
                      </label>
                    )}

                    <label>Password
                      <div className="input-box">
                        <span className="input-icon"><FaLock /></span>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </label>

                    {formType === "signup" && (
                      <label>Confirm Password
                        <div className="input-box">
                          <span className="input-icon"><FaLock /></span>
                          <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                          <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </label>
                    )}

                    {message && <p className="entry-message">{message}</p>}

                    <button className="enter-button" type="submit">
                      {loading ? "Please wait..." : formType === "login" ? "Enter BeatFlix" : "Create Profile"} <FaArrowRight />
                    </button>

                    <div className="entry-divider"><span></span><p>OR</p><span></span></div>

                    <button type="button" className="google-button" onClick={handleGoogleLogin} disabled={loading}>
                      <FaGoogle /> {loading ? "Connecting..." : "Continue with Google"}
                    </button>

                    {formType === "login" && (
                      <button type="button" className="forgot-password" onClick={() => { setForgotEmail(""); setMessage(""); setShowForgotModal(true); }}>
                        Forgot Password?
                      </button>
                    )}
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Modals */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-check">✓</div>
            <h2>Profile Created!</h2>
            <p>Your BeatFlix account is ready.</p>
            <span>Redirecting to Login...</span>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="otp-overlay">
          <div className="otp-card">
            <h2>Email Verification</h2>
            <p>We sent a 6-digit verification code to</p>
            <strong>{email}</strong>
            <input className="otp-input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} />
            <button className="enter-button" type="button" onClick={verifyAndRegister}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}

      {showForgotModal && (
        <div className="otp-overlay">
          <div className="otp-card">
            <h2>Forgot Password</h2>
            {forgotStep === 1 ? (
              <>
                <p>Enter the email associated with your BeatFlix account.</p>
                <input className="otp-input forgot-email-input" type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                <button className="enter-button" type="button" onClick={sendForgotOtp}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <p>Enter the 6-digit OTP sent to your email and your new password.</p>
                <input className="otp-input" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} />
                <input className="otp-input forgot-password-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                <button className="enter-button forgot-reset-btn" type="button" onClick={resetPassword}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
            <button type="button" className="back-choice" onClick={() => { setShowForgotModal(false); setForgotStep(1); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showEmoji && (
          <motion.div
            className="mood-transition-overlay"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="mood-transition-emoji">{themeData?.emoji}</div>
            <h2 className="mood-transition-text">Setting up {themeData?.name} vibe...</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default EntryScreen;