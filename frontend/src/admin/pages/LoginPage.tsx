import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const { login, loginError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);

    if (success) {
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="Future AI Skills" className="login-logo" />
          <span>Future AI Skills</span>
        </div>
        <h1>Admin Panel</h1>
        <p>Sign in to manage courses, announcements, blogs and more.</p>

        {loginError && <div className="login-error">{loginError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="vision"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}