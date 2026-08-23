import React, { useState } from 'react';
import './VoiceTester.css';

const VoiceTester = () => {
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_ELEVENLABS_API_KEY || "");
  const [voiceId, setVoiceId] = useState(process.env.REACT_APP_ELEVENLABS_VOICE_ID || "Ah9BYzLpolyTAW6DAm7L");
  const [text, setText] = useState("Hello! I am your AI assistant. How do I sound today?");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const testVoice = async () => {
    if (!apiKey.trim() || !voiceId.trim()) {
      setStatus("Error: Please provide both API Key and Voice ID.");
      return;
    }

    setLoading(true);
    setStatus("Generating audio via ElevenLabs API...");

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId.trim()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey.trim()
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        setStatus("Success! Audio playing...");
      } else {
        const errText = await response.text();
        setStatus(`Error from ElevenLabs: ${errText}`);
      }
    } catch (error) {
      setStatus(`Network/Connection Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voice-tester-container">
      <h2>ElevenLabs Voice Debugger</h2>
      <p>Use this page to manually test your API key and Voice ID without any cache getting in the way!</p>
      
      <div className="tester-form">
        <label>
          ElevenLabs API Key:
          <input 
            type="text" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk_..."
          />
        </label>
        
        <label>
          Custom Voice ID:
          <input 
            type="text" 
            value={voiceId} 
            onChange={(e) => setVoiceId(e.target.value)} 
            placeholder="e.g. Ah9BYzLpolyTAW6DAm7L"
          />
        </label>
        
        <label>
          Test Text:
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            rows="3"
          />
        </label>
        
        <button 
          className="test-btn" 
          onClick={testVoice}
          disabled={loading}
        >
          {loading ? "Generating..." : "Test Audio"}
        </button>
        
        {status && (
          <div className={`status-box ${status.includes('Error') ? 'error' : 'success'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceTester;
