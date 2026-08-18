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
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

import ScrollBackground from "./ScrollBackground";

gsap.registerPlugin(ScrollTrigger);

const Particles = ({ isMobileDevice }) => (
  <div className="particle-container">
    {[...Array(isMobileDevice ? 12 : 60)].map((_, i) => (
      <div key={i} className={`particle particle-${i % 3}`} style={{ left: `${Math.random() * 100}%`, animationDelay: `${-(Math.random() * 30)}s` }} />
    ))}
  </div>
);

// ==========================================
// COMPONENT: Particle Effect
// ==========================================
const ParticleEffect = ({ isMobileDevice }) => (
  <div className="local-particles">
    {[...Array(isMobileDevice ? 4 : 15)].map((_, i) => (
      <div key={i} className="local-particle" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${-(Math.random() * 10)}s`
      }} />
    ))}
  </div>
);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function EntryScreen({ onEnter }) {
  // ==========================================
  // EXISTING AUTH STATE
  // ==========================================
  const [formType, setFormType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobileDevice(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      const response = await fetch(`${API_URL}/api/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          googleId: result.user.uid,
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      toast.success(`Welcome back, ${data.user.name}!`);
      onEnter(data.user.name || "User");
    } catch (error) {
      toast.error(error.message || "Google login failed.");
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
          setLoading(false); return;
        }
        
        const response = await fetch(`${API_URL}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: name, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        toast.success("Welcome back!");
        onEnter(data.user.name || "User");
      } else {
        if (!name || !email || !password || !confirmPassword) {
          setMessage("Please fill in all fields.");
          setLoading(false); return;
        }
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          setLoading(false); return;
        }

        const response = await fetch(`${API_URL}/api/users/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
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
      const verifyRes = await fetch(`${API_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message);

      const registerRes = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword })
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
      const response = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
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
      const response = await fetch(`${API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, password: newPassword })
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

  // ==========================================
  // LENIS SMOOTH SCROLL
  // ==========================================
  useEffect(() => {
    // Skip Lenis on mobile — native momentum scrolling is smoother
    // and Lenis's rAF loop causes jank on low-end phones
    if (isMobileDevice) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  // ==========================================
  // GSAP 3D SCROLL MASTER TIMELINE
  // ==========================================
  useEffect(() => {
    // Lock scrolling if a form or modal is open
    document.body.style.overflow = formType || showOtpModal || showForgotModal || showSuccess ? "hidden" : "auto";

    // Skip building the timeline if form is active to prevent conflicts, OR if it's mobile (for ultra smooth performance)
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
          scrub: 1.5, // Adds fluid momentum to the 3D cards so they don't jump suddenly
          snap: {
            snapTo: (value) => {
              // Custom snapping logic based exactly on when the next card visually appears
              if (value < 0.10) return 0;       // Snap back to Welcome if Guest hasn't appeared yet
              if (value < 0.45) return 0.333;   // Snap to Guest if Login hasn't appeared yet
              if (value < 0.80) return 0.666;   // Snap to Login if Create Profile hasn't appeared yet
              return 1;                         // Snap to Create Profile
            },
            duration: { min: 0.5, max: 1.0 },
            ease: "power3.inOut",
            delay: 0.1 // Wait a tiny bit for Lenis momentum to stop before grabbing the scroll
          }
        }
      });

      // Normalize timeline duration to 100 to map percentages easily
      tl.to({}, { duration: 100 });

      // STAGE 0 -> 10: Intro settles, Title moves up and back
      tl.to(".who-title-container", { 
        y: -250, 
        z: -300, 
        autoAlpha: 0, 
        scale: 0.95,
        duration: 10, 
        ease: "power2.inOut" 
      }, 0);

      // GUEST CARD: Enters 10->25, Stable at 33.3, Exits 42->54
      tl.fromTo(".guest-card", 
        { y: 250, z: -400, rotateX: -15, autoAlpha: 0 },
        { y: 0, z: 0, rotateX: 0, autoAlpha: 1, duration: 15, ease: "power2.out" }, 10
      );
      tl.to(".guest-card", 
        { y: -250, z: -400, rotateX: 15, autoAlpha: 0, duration: 12, ease: "power2.in" }, 42
      );

      // LOGIN CARD: Enters 45->60, Stable at 66.6, Exits 75->87
      tl.fromTo(".login-card", 
        { y: 250, z: -400, rotateX: -15, autoAlpha: 0 },
        { y: 0, z: 0, rotateX: 0, autoAlpha: 1, duration: 15, ease: "power2.out" }, 45
      );
      tl.to(".login-card", 
        { y: -250, z: -400, rotateX: 15, autoAlpha: 0, duration: 12, ease: "power2.in" }, 75
      );

      // SIGNUP CARD: Enters 85->100, Stable at 100
      tl.fromTo(".signup-card", 
        { y: 250, z: -400, rotateX: -15, autoAlpha: 0 },
        { y: 0, z: 0, rotateX: 0, autoAlpha: 1, duration: 15, ease: "power2.out" }, 85
      );
      
      // SCROLL INDICATOR PROGRESS
      tl.fromTo(".scroll-progress-fill",
        { scaleY: 0 },
        { scaleY: 1, duration: 100, ease: "none" }, 0
      );
      
    });

    return () => {
      ctx.revert(); // Proper cleanup for React Strict Mode
      document.body.style.overflow = "auto"; // Always restore scrolling when unmounting
    };
  }, [formType, showOtpModal, showForgotModal, showSuccess]);

  // ==========================================
  // FORM TRANSITION VARIANTS (No X-Axis Movement)
  // ==========================================
  const pageVariants = {
    initial: { opacity: 0, filter: "blur(15px)", z: -300 },
    in: { opacity: 1, filter: "blur(0px)", z: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    out: { opacity: 0, filter: "blur(15px)", z: -300, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const formVariants = {
    initial: { x: "-50%", y: "-30%", opacity: 0, scale: 0.95, rotateX: -10, filter: "blur(15px)" },
    in: { x: "-50%", y: "-50%", opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
    out: { x: "-50%", y: "-40%", opacity: 0, scale: 0.95, filter: "blur(15px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="beatflix-entry-wrapper">
      
      {/* BACKGROUND CANVAS SYSTEM - Disabled on mobile for max performance */}
      {!isMobileDevice && <ScrollBackground totalFrames={200} />}

      {/* INVISIBLE SCROLL TIMELINE TRACK (400vh) */}
      <section className="scroll-background-section" />

      {/* 3D UI OVERLAY */}
      <div className="scroll-container">
        
        <Particles isMobileDevice={isMobileDevice} />

        {/* VISUAL SCROLL PROGRESS INDICATOR */}
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
              <div className="who-title-container" style={{ position: 'relative', top: '0', left: '0', transform: 'none', margin: '0 auto 40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                <ParticleEffect isMobileDevice={false} />
                <div className="entry-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                  <div className="entry-brand-icon"><img src={logo} alt="BeatFlix" style={{ display: 'block', margin: '0 auto' }} /></div>
                  <div className="entry-brand-name" style={{ textAlign: 'center' }}><span className="brand-white">Beat</span><span className="brand-blue">Flix</span></div>
                </div>
                <h1 className="who-title" style={{ fontSize: 'clamp(36px, 9vw, 52px)', textAlign: 'center', width: '100%', margin: '15px 0 0' }}>Who's Watching?</h1>
              </div>

              {!formType && (
                <div className="mobile-premium-slider">
                  <button className="mobile-premium-card mc-guest" onClick={() => onEnter("Guest")}>
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
                pointerEvents: formType ? "none" : "auto"
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* STAGE 0: BRAND & HEADING */}
              <div className="who-title-container">
                <ParticleEffect isMobileDevice={isMobileDevice} />
                <div className="entry-brand">
                  <div className="entry-brand-icon"><img src={logo} alt="BeatFlix" /></div>
                  <div className="entry-brand-name"><span className="brand-white">Beat</span><span className="brand-blue">Flix</span></div>
                </div>
                <h1 className="who-title">Who's Watching?</h1>
              </div>

              {/* STAGES 1-3: PREMIUM 3D PROFILE CARDS */}
              <div className="netflix-profiles">
                
                {/* GUEST CARD */}
                <button className="cinematic-card guest-card" onClick={() => onEnter("Guest")}>
                  <ParticleEffect isMobileDevice={isMobileDevice} />
                  <div className="card-ambient-glow guest-glow" />
                  <div className="card-glass-surface">
                    <div className="card-icon-capsule guest-capsule">
                      <FaCompass />
                    </div>
                    <div className="card-text-content">
                      <span>Guest</span>
                      <small>Continue instantly</small>
                    </div>
                  </div>
                </button>

                {/* LOGIN CARD */}
                <button className="cinematic-card login-card" onClick={() => setFormType("login")}>
                  <ParticleEffect isMobileDevice={isMobileDevice} />
                  <div className="card-ambient-glow login-glow" />
                  <div className="card-glass-surface">
                    <div className="card-icon-capsule login-capsule">
                      <FaUserShield />
                    </div>
                    <div className="card-text-content">
                      <span>Login</span>
                      <small>Welcome back</small>
                    </div>
                  </div>
                </button>

                {/* SIGNUP CARD */}
                <button className="cinematic-card signup-card" onClick={() => setFormType("signup")}>
                  <ParticleEffect isMobileDevice={isMobileDevice} />
                  <div className="card-ambient-glow signup-glow" />
                  <div className="card-glass-surface">
                    <div className="card-icon-capsule signup-capsule">
                      <FaUserPlus />
                    </div>
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
                <div className="form-icon">{formType === "login" ? <FaUserShield /> : <FaUserPlus />}</div>
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
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </label>

                {formType === "signup" && (
                  <label>Confirm Password
                    <div className="input-box">
                      <span className="input-icon"><FaLock /></span>
                      <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                      <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
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
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* MODALS */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-check">✓</div>
            <h2>Profile Created!</h2><p>Your BeatFlix account is ready.</p><span>Redirecting to Login...</span>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="otp-overlay">
          <div className="otp-card">
            <h2>Email Verification</h2><p>We sent a 6-digit verification code to</p><strong>{email}</strong>
            <input className="otp-input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} />
            <button className="enter-button" type="button" onClick={verifyAndRegister}>{loading ? "Verifying..." : "Verify OTP"}</button>
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
                <input className="otp-input" type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={{ letterSpacing: "normal", fontSize: "16px", textAlign: "left" }} />
                <button className="enter-button" type="button" onClick={sendForgotOtp}>{loading ? "Sending..." : "Send OTP"}</button>
              </>
            ) : (
              <>
                <p>Enter the 6-digit OTP sent to your email and your new password.</p>
                <input className="otp-input" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} />
                <input className="otp-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" style={{ letterSpacing: "normal", fontSize: "16px", textAlign: "left", marginTop: "10px" }} />
                <button className="enter-button" type="button" onClick={resetPassword} style={{ marginTop: "15px" }}>{loading ? "Resetting..." : "Reset Password"}</button>
              </>
            )}
            <button type="button" className="back-choice" onClick={() => { setShowForgotModal(false); setForgotStep(1); }}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default EntryScreen;

// ==========================================
// Hello! Look, it is saved directly in VS Code by me! :) 
// - Your AI Assistant
// ==========================================