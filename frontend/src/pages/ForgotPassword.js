import { useState } from "react";
import axios from "axios";
import "./forgotreset.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email,
      });

      alert("✅ Please check your email for password reset instructions.");
      navigate("/"); // 🔥 Go to home/login
    } catch (err) {
      alert("❌ Email not found or error occurred");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
