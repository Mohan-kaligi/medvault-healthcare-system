import { useState } from "react";
import axios from "axios";
import "./auth.css";

export default function PatientRegister() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z ]{3,}$/.test(form.fullName)) {
      newErrors.fullName = "Enter a valid full name (only letters, min 3 chars)";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) {
      newErrors.password =
        "Password must be at least 6 characters and include letters & numbers";
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Select your date of birth";
    }

    if (!form.gender) newErrors.gender = "Please select gender";
    if (!form.bloodGroup) newErrors.bloodGroup = "Please select blood group";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Construct backend JSON format (very important!)
    const requestData = {
      user: {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone
      },
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodGroup: form.bloodGroup
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/patient/register",
        requestData
      );

      alert(res.data.message); // show backend message
    } catch (error) {
      if (error.response) alert(error.response.data.message);
      else alert("Registration failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card large">
        <h2>Patient Registration</h2>

        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}

          <input name="email" placeholder="Email" onChange={handleChange} />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          <input name="dateOfBirth" type="date" onChange={handleChange} />
          {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}

          <select name="gender" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender}</p>}

          <select name="bloodGroup" onChange={handleChange}>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="Not Known">Not Known</option>
          </select>
          {errors.bloodGroup && <p className="error-text">{errors.bloodGroup}</p>}

          <button type="submit">Register</button>

          <p className="switch-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
