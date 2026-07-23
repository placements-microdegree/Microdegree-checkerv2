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
    "jobs.microdegree@gmail.com",
    "rakeshnk000@gmail.com",
    "brijesh@microdegree.work",
    "yashas@microdegree.work",
    "karthikacharya246@gmail.com",
    "karansshetty6@gmail.com",
    "prajneshpajju094@gmail.com",
    "akshathaba123@gmail.com",
    "kushishettymicrodegree@gmail.com",
    "vimarsha.microdegree@gmail.com",
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
        redirectTo: window.location.origin,
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
        <img src="/Logo.png" alt="MicroDegree" className="logo" />
        <h2>Sign in</h2>

        <div className="field-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field-group password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button className="primary-button" onClick={handleEmailLogin}>
          Login
        </button>

        <div className="divider">or</div>

        <button className="google-button" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={{ height: "18px" }}
          />
          <span>Sign in with Google</span>
        </button>

        {errorMessage && <div className="error">{errorMessage}</div>}

        <div className="other-tool-divider">Other Tool</div>
        <button className="secondary-link-button" onClick={handleClick}>
          Gmail Aggregator
        </button>
      </div>
    );
  }

  // ✅ Dashboard Screen
  return (
    <div className="container">
      <img src="/Logo.png" alt="MicroDegree" className="logo" />
      <h2>Welcome back</h2>
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
      <button className="back-button" onClick={handleLogout}>
        ← Logout
      </button>
    </div>
  );
}

export default Dashboard;