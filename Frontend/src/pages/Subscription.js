import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheck, FaCrown, FaBolt, FaStar, FaArrowLeft } from "react-icons/fa";
import "../styles/Subscription.css"; // Adjust path as needed
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Subscription() {
  const navigate = useNavigate();

  const [currentPlan, setCurrentPlan] = useState("starter");
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

useEffect(() => {
  window.scrollTo(0, 0);
  fetchSubscription();
}, []);

const fetchSubscription = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE}/api/subscription/current`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setCurrentPlan(data.subscription || "starter");
    }
  } catch (err) {
    console.log(err);
  }

  setLoading(false);
};

const changePlan = async (plan) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to update your plan.");
      navigate("/account");
      return;
    }

    const response = await fetch(
      `${API_BASE}/api/subscription/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      }
    );

    const data = await response.json();

    if (data.success) {
      await fetchSubscription();
    } else {
      alert(data.message || "Failed to update subscription.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong updating your plan.");
  }
};

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: <FaStar className="plan-icon basic-icon" />,
      price: "Free",
      period: "forever",
      description: "Perfect for casual watchers.",
      features: ["5 BeatFlix AI Tokens", "1080p HD Resolution", "Ad-supported streaming", "1 Device at a time", "Standard audio"],
      isPro: false,
      buttonText: currentPlan === "starter"
  ? "Current Plan"
  : "Choose Starter",
    },
    {
      id: "pro",
      name: "BeatFlix Pro",
      icon: <FaCrown className="plan-icon pro-icon" />,
      price: "$9.99",
      period: "/ month",
      description: "Endless cinematic brilliance.",
      features: ["50 BeatFlix AI Tokens", "4K Ultra HD Streaming", "Zero interruptions (No Ads)", "Up to 4 devices simultaneously", "Exclusive Director's Cuts"],
      isPro: true,
      buttonText: currentPlan === "pro"
  ? "Current Plan"
  : "Upgrade to Pro",
    },
    {
      id: "ultimate",
      name: "Ultimate",
      icon: <FaBolt className="plan-icon ultimate-icon" />,
      price: "$14.99",
      period: "/ month",
      description: "The absolute home theater experience.",
      features: ["Unlimited BeatFlix AI Tokens", "8K HDR + Dolby Vision", "Dolby Atmos Spatial Audio", "Unlimited devices", "Offline downloads"],
      isPro: false,
      buttonText: currentPlan === "ultimate"
  ? "Current Plan"
  : "Get Ultimate",
    }
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async (plan, amount) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in or register before subscribing to a plan.");
      navigate("/account");
      return;
    }

    try {
      setIsPaying(true);

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
        setIsPaying(false);
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await response.json();

      if (!data.success || !data.order) {
        alert(data.message || "Failed to initialize payment order.");
        setIsPaying(false);
        return;
      }

      const razorpayKey =
        data.key_id ||
        process.env.REACT_APP_RAZORPAY_KEY_ID ||
        "rzp_test_THN6lHM5kstDgA";

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "BeatFlix",
        description: `${plan.toUpperCase()} Subscription`,
        order_id: data.order.id,

        handler: async function (paymentResponse) {
          try {
            await fetch(`${API_BASE}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });
          } catch (e) {
            console.warn("Payment verification notice:", e);
          }

          await changePlan(plan);
          alert(`🎉 Payment Successful! Welcome to BeatFlix ${plan.toUpperCase()}!`);
        },

        prefill: {
          email: localStorage.getItem("userEmail") || "",
          name: localStorage.getItem("beatflixViewer") || "BeatFlix Member",
        },

        theme: {
          color: "#e50914",
        },

        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (failResponse) {
        console.error("Payment failed:", failResponse.error);
        alert(
          `Payment Failed: ${
            failResponse.error?.description ||
            failResponse.error?.reason ||
            "Transaction declined."
          }`
        );
        setIsPaying(false);
      });

      razor.open();
    } catch (err) {
      console.error("Payment checkout error:", err);
      alert("Payment processing error. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

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

              <button
                type="button"
                className={`plan-btn ${plan.isPro ? "btn-pro" : "btn-standard"}`}
                disabled={currentPlan === plan.id || loading || isPaying}
                onClick={() => {
                  const userEmail = localStorage.getItem("userEmail");
                  if (plan.id === "starter" || userEmail === "jeehardik2@gmail.com") {
                    changePlan(plan.id);
                  } else {
                    openRazorpay(
                      plan.id,
                      plan.id === "pro" ? 199 : 499
                    );
                  }
                }}
              >
                {currentPlan === plan.id
                  ? "Current Plan"
                  : isPaying
                  ? "Loading Checkout..."
                  : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}