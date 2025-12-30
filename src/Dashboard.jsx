import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const supabase = createClient(
  "https://zcthupxqotcgbsztzivn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGh1cHhxb3RjZ2JzenR6aXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjQ2ODAsImV4cCI6MjA2NDQ0MDY4MH0.BHJ_5yN7ov9IdY572yNmXBnWACd9BNyEDcLEWDZ9FDY"
);

const ALLOWED_EMAILS = new Set(
  [
    "microdegree.work@gmail.com",
    "rakeshnk000@gmail.com",
    "brijesh@microdegree.work",
    "yashas@microdegree.work",
    "karthikacharya246@gmail.com",
    "karansshetty6@gmail.com",
    "prajneshpajju094@gmail.com",
    "akshathaba123@gmail.com"
  ].map((e) => e.trim().toLowerCase())
);

function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleClick = () => {
    window.open("https://teal-parfait-cc7fde.netlify.app", "_blank");
  };
  // ✅ Validate session
  const validateSession = async (session) => {
    const sessionEmail = session?.user?.email?.trim()?.toLowerCase();
    if (sessionEmail && ALLOWED_EMAILS.has(sessionEmail)) {
      localStorage.setItem("session", JSON.stringify(session));
      setIsLoggedIn(true);
    } else if (session) {
      // ❌ Logout if not the allowed email
      await supabase.auth.signOut();
      localStorage.removeItem("session");
      setIsLoggedIn(false);
      setErrorMessage("Access allowed only for official MicroDegree account.");
    } else {
      setIsLoggedIn(false);
    }
  };

  // ✅ Check session on page load and listen for OAuth logins
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      validateSession(session);
    });

    // Listen for future logins/logouts
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        validateSession(session);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ✅ Email/Password Login
  const handleEmailLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage(`Login failed: ${error.message}`);
    } else {
      validateSession(data.session);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setErrorMessage(`Google login failed: ${error.message}`);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("session");
    setIsLoggedIn(false);
  };

  // ✅ Login Screen
  if (!isLoggedIn) {
    return (
      <div className="container">
        <h2>MicroDegree Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className="fa-solid fa-eye toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        <button onClick={handleEmailLogin}>Login</button>
        <p>or</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleGoogleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              backgroundColor: "#6c4eff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              style={{ height: "20px", marginRight: "10px" }}
            />
            <span>Sign in with Google</span>
          </button>
        </div>

        {errorMessage && <div className="error">{errorMessage}</div>}
        <h2 style={{ marginTop: "30px", color: "#5d5b5bff" }}>OTHER TOOL</h2>
        <svg
          className="down-arrow"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 16L6 10H9V4H15V10H18L12 16Z" fill="currentColor" />
        </svg>
        <div
          className="gmail-link"
          onClick={handleClick}
          style={{
            marginTop: "10px",
            color: "#000000ff",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "200px",
            userSelect: "none",
            marginLeft: "23%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.backgroundColor = "#6c5ce7";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#f0f0f0";
            e.currentTarget.style.color = "#050505ff";
          }}
        >
          <span style={{ textDecoration: "none", color: "inherit" }}>
            Gmail Aggregator
          </span>
        </div>
      </div>
    );
  }

  // ✅ Dashboard Screen
  return (
    <div className="container">
      <h2>Welcome to Dashboard</h2>
      <div className="cards">
        <div className="card">
          <Link to="/checking">🔍 MicroDegree Checker</Link>
        </div>
        <div className="card">
          <a
            href="https://jobs.tools.microdegree.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            💼 Job Scraper Tool
          </a>
        </div>
      </div>
      <div className="back-button" onClick={handleLogout}>
        ← Logout
      </div>
    </div>
  );
}

export default Dashboard;