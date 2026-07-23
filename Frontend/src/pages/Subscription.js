import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaCheck, FaCrown, FaBolt, FaStar, FaArrowLeft } from "react-icons/fa";
import "../styles/Subscription.css"; // Adjust path as needed

export default function Subscription() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const plans = [
    {
      id: "basic",
      name: "Starter",
      icon: <FaStar className="plan-icon basic-icon" />,
      price: "Free",
      period: "forever",
      description: "Perfect for casual watchers.",
      features: ["1080p HD Resolution", "Ad-supported streaming", "1 Device at a time", "Standard audio"],
      isPro: false,
      buttonText: "Current Plan",
    },
    {
      id: "pro",
      name: "BeatFlix Pro",
      icon: <FaCrown className="plan-icon pro-icon" />,
      price: "$9.99",
      period: "/ month",
      description: "Endless cinematic brilliance.",
      features: ["4K Ultra HD Streaming", "Zero interruptions (No Ads)", "Up to 4 devices simultaneously", "Exclusive Director's Cuts"],
      isPro: true,
      buttonText: "Upgrade to Pro",
    },
    {
      id: "ultimate",
      name: "Ultimate",
      icon: <FaBolt className="plan-icon ultimate-icon" />,
      price: "$14.99",
      period: "/ month",
      description: "The absolute home theater experience.",
      features: ["8K HDR + Dolby Vision", "Dolby Atmos Spatial Audio", "Unlimited devices", "Offline downloads"],
      isPro: false,
      buttonText: "Get Ultimate",
    }
  ];

  return (
    <div className="subscription-page">
      {/* Ambient Background Orbs */}
      <div className="sub-glow-orb orb-left"></div>
      <div className="sub-glow-orb orb-right"></div>

      <div className="sub-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="sub-header animate-slide-up">
          <div className="pro-badge">
            <span className="dot"></span> BEATFLIX PLANS
          </div>
          <h1 className="sub-title">Unlock the <span>Ultimate</span> Experience.</h1>
          <p className="sub-subtitle">Choose the perfect plan for your cinematic journey. Cancel anytime.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`pricing-card animate-slide-up ${plan.isPro ? "pro-tier" : ""}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.isPro && <div className="popular-tag">MOST POPULAR</div>}
              
              <div className="card-top">
                {plan.icon}
                <h3>{plan.name}</h3>
                <p className="plan-desc">{plan.description}</p>
              </div>

              <div className="plan-price">
                <h2>{plan.price}</h2>
                <span>{plan.period}</span>
              </div>

              <ul className="feature-list">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <FaCheck className="check-icon" /> {feature}
                  </li>
                ))}
              </ul>

              <button className={`plan-btn ${plan.isPro ? "btn-pro" : "btn-standard"}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}