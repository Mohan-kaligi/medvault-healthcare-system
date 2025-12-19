import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DoctorProfileSettings.css";

export default function DoctorProfileSettings() {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    about: "",
    expertise: "",
    availability: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const res = await axios.get(`http://localhost:8080/api/doctor/${doctorId}`);
      setForm({
        about: res.data.about || "",
        expertise: res.data.expertise || "",
        availability: res.data.availability || "",
      });
    };
    loadProfile();
  }, [doctorId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/doctor/${doctorId}/update-profile`,
        form
      );
      alert("Profile updated successfully!");
      navigate("/doctor/dashboard");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="dps-container">
      <h2>Edit Professional Profile</h2>

      <label>About You</label>
      <textarea
        name="about"
        value={form.about}
        onChange={handleChange}
        placeholder="Write your professional biography..."
      />

      <label>Expertise & Services</label>
      <textarea
        name="expertise"
        value={form.expertise}
        onChange={handleChange}
        placeholder="E.g. Diabetes Treatment, Heart Checkup, Pregnancy Care"
      />

      <label>Availability</label>
      <input
        type="text"
        name="availability"
        value={form.availability}
        onChange={handleChange}
        placeholder="Mon–Sat (10 AM – 5 PM)"
      />

      <button className="dps-save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}
