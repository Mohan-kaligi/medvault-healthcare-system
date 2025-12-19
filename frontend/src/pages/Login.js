import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    let newErrors = {};

    if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);

      const { id, fullName, role } = res.data;

      // CLEAR all old data
      localStorage.clear();

      // SAVE clean session data
      localStorage.setItem("userId", id);
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "PATIENT") navigate("/patient/dashboard");
      else if (role === "DOCTOR") navigate("/doctor/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit">Login</button>

          <p className="switch-text">
            New User? <a href="/patient/register">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
}
