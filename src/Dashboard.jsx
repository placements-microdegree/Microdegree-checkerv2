// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './Dashboard.css';
import { useNavigate, Link } from 'react-router-dom';

const supabase = createClient(
  "https://zcthupxqotcgbsztzivn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGh1cHhxb3RjZ2JzenR6aXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjQ2ODAsImV4cCI6MjA2NDQ0MDY4MH0.BHJ_5yN7ov9IdY572yNmXBnWACd9BNyEDcLEWDZ9FDY"
);

function Dashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
        setIsLoggedIn(true);
      }
    });
  }, []);

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(`Login failed: ${error.message}`);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // options: { redirectTo: window.location.origin },
    
    });
    if (error) {
      setErrorMessage(`Google login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("session");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h2>MicroDegree Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fa-solid fa-eye toggle-password" onClick={() => setShowPassword(!showPassword)}></i>
        </div>
        <button onClick={handleEmailLogin}>Login</button>
        <p>or</p>
        <button onClick={handleGoogleLogin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={{ height: '20px', marginRight: '10px' }}
          />
          <span>Sign in with Google</span>
        </button>
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Welcome to Dashboard</h2>
      <div className="cards">
        <div className="card">
          <Link to="/checking">🔍 MicroDegree Checker</Link>
        </div>
        <div className="card">
          <a href="https://jobs.tools.microdegree.in" target="_blank" rel="noopener noreferrer">
            💼 Job Scraper Tool
          </a>
        </div>
      </div>
      <div className="back-button" onClick={handleLogout}>← Logout</div>
    </div>
  );
}

export default Dashboard;
