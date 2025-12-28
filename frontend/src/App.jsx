// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load saved session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatSessionId');
    if (saved) {
      setSessionId(saved);
      fetchHistory(saved);
    }
  }, []);

  const fetchHistory = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/chat/history/${id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('History load failed:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Optimistic UI
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);

    try {
      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId: sessionId || undefined })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { sender: 'bot', content: data.reply }]);

        if (!sessionId) {
          const newId = data.sessionId;
          setSessionId(newId);
          localStorage.setItem('chatSessionId', newId);
        }
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Spur AI Support</h2>
        <p>Ask about shipping, returns, orders...</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            👋 Hello! How can I help you today?
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div className="message bot typing">...</div>}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message... (Enter to send)"
          rows={1}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>

      {sessionId && (
        <div className="session-info">
          Session: <code>{sessionId.slice(0, 8)}...</code>
        </div>
      )}
    </div>
  );
}

export default App;