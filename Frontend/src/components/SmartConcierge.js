import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaRobot, FaTimes, FaCloudSunRain, FaPlay } from 'react-icons/fa';
import movies from '../data/movies';
import './SmartConcierge.css';

const SmartConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Hi! I'm your AI Concierge.");
  const [recommendation, setRecommendation] = useState(null);
  
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  
  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatus("Listening...");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setStatus(`You said: "${transcript}"`);
        processRequest(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setStatus("Error: " + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setStatus("Your browser doesn't support Voice Recognition.");
    }
  }, []);

  const getWeatherString = (weatherCode) => {
    if (weatherCode === 0) return "clear and sunny";
    if (weatherCode >= 1 && weatherCode <= 3) return "a bit cloudy";
    if (weatherCode >= 51 && weatherCode <= 67) return "raining";
    if (weatherCode >= 71 && weatherCode <= 77) return "snowing";
    return "mild";
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    if (hour < 22) return "evening";
    return "late night";
  };

  const processRequest = async (spokenText) => {
    setStatus("Analyzing environment & mood...");
    
    let weatherContext = "mild";
    
    // Try to get Geolocation
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const data = await response.json();
      weatherContext = getWeatherString(data.current_weather.weathercode);
    } catch (err) {
      console.log("Could not get location/weather. Defaulting.");
    }

    const timeOfDay = getTimeOfDay();
    
    // Simple AI matching algorithm based on keywords
    const lowerText = spokenText.toLowerCase();
    let bestMatch = movies[0];
    let aiReason = "";

    if (lowerText.includes("laugh") || lowerText.includes("funny") || lowerText.includes("happy")) {
      bestMatch = movies.find(m => m.genre.includes("Comedy") || m.mood === "Fun") || movies.find(m => m.title === "Spider-Man");
      aiReason = `Since it's a ${weatherContext} ${timeOfDay} and you want a laugh, this is perfect.`;
    } else if (lowerText.includes("sad") || lowerText.includes("cry")) {
      bestMatch = movies.find(m => m.genre.includes("Drama")) || movies[0];
      aiReason = `To match your mood on this ${timeOfDay}, here's something deeply emotional.`;
    } else if (lowerText.includes("action") || lowerText.includes("exciting") || lowerText.includes("bored")) {
      bestMatch = movies.find(m => m.genre.includes("Action")) || movies[0];
      aiReason = `You sound like you need some adrenaline for this ${timeOfDay}!`;
    } else if (weatherContext === "raining") {
      bestMatch = movies.find(m => m.mood === "Mind-Blowing") || movies[0];
      aiReason = `Because it's raining outside, a mind-bending movie is the best choice.`;
    } else {
      // Random fallback
      bestMatch = movies[Math.floor(Math.random() * movies.length)];
      aiReason = `Based on your vibe this ${timeOfDay}, I highly recommend this.`;
    }

    setRecommendation({ ...bestMatch, reason: aiReason });
    setStatus("I found the perfect movie for you!");
    
    // Text to Speech
    const utterance = new SpeechSynthesisUtterance(`I recommend ${bestMatch.title}. ${aiReason}`);
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    setRecommendation(null);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="concierge-container">
      {isOpen && (
        <div className="concierge-panel">
          <div className="concierge-header">
            <h3><FaRobot /> AI Concierge</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="concierge-content">
            <div className="status-text">{status}</div>
            
            {!isListening && !recommendation && (
              <button className="mic-prompt-btn" onClick={startListening}>
                <FaMicrophone /> Tap to speak your mood
              </button>
            )}

            {recommendation && (
              <div 
                className="recommendation-card" 
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/movie/${recommendation.id}`);
                }}
              >
                <img src={recommendation.poster} alt="poster" className="rec-poster" />
                <div className="rec-info">
                  <h4 className="rec-title">{recommendation.title}</h4>
                  <p className="rec-genre">{recommendation.genre.join(', ')}</p>
                  <p className="rec-reason">{recommendation.reason}</p>
                </div>
              </div>
            )}
            
            {recommendation && (
              <button className="mic-prompt-btn" onClick={startListening} style={{marginTop: '10px'}}>
                <FaMicrophone /> Try again
              </button>
            )}
          </div>
        </div>
      )}

      <button 
        className={`concierge-button ${isListening ? 'listening' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="AI Concierge"
      >
        <FaRobot />
      </button>
    </div>
  );
};

export default SmartConcierge;
