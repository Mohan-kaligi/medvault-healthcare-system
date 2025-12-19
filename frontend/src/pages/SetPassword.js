import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function SetPassword() {
  const token = new URLSearchParams(window.location.search).get("token");
  // 👈 read token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/set-password", {
        token,
        password,
      });

      alert("Password set successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to set password. The link may be invalid or expired.";
      setError(msg);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Invalid Link</h2>
          <p>This password setup link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Save Password</button>
        </form>
      </div>
    </div>
  );
}
