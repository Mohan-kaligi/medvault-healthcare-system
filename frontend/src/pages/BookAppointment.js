// src/pages/BookAppointment.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookAppointment.css";

export default function BookAppointment() {
  const { id } = useParams(); // doctorId
  const navigate = useNavigate();

  const patientId = localStorage.getItem("userId");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);   // 🔥 stops duplicate bookings

  const [form, setForm] = useState({
    date: "",
    reason: "",
  });

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/doctor/${id}`);
        setDoctor(res.data);
      } catch (err) {
        alert("Unable to load doctor details");
      }
      setLoading(false);
    };

    loadDoctor();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FIXED: prevents double submissions
  const bookNow = async (e) => {
    e.preventDefault();

    if (submitting) return;      // PREVENT MULTIPLE CALLS
    setSubmitting(true);

    if (!form.date || !form.reason) {
      alert("Please fill all fields!");
      setSubmitting(false);
      return;
    }

    const payload = {
      patient: { id: patientId },
      doctor: { id },
      appointmentDate: form.date,
      appointmentTime: null, 
      mode: "ONLINE",
      reason: form.reason,
    };

    try {
      await axios.post("http://localhost:8080/api/appointments/book", payload);

      alert("Appointment request sent! Doctor will choose a time.");
      navigate("/patient/dashboard");

    } catch (err) {
      alert("You already have a pending appointment with this doctor.");
      navigate("/patient/dashboard");
    }

    setSubmitting(false);
  };

  if (loading) return <div className="ba-loading">Loading...</div>;

  return (
    <div className="ba-container">
      <div className="ba-card">

        {/* Doctor Header */}
        <div className="ba-doctor-header">
          <img src={doctor.photoUrl} alt="doctor" className="ba-doctor-img" />
          <div>
            <h2>Dr. {doctor.fullName}</h2>
            <p className="ba-spec">{doctor.specialization}</p>
            <p>{doctor.experienceYears} years experience</p>
            <p className="ba-hospital">{doctor.hospitalName}</p>
          </div>
        </div>

        {/* About */}
        <div className="ba-section">
          <h3>About Doctor</h3>
          <p>{doctor.about || "No biography added"}</p>
        </div>

        {/* Availability */}
        <div className="ba-section">
          <h3>Availability</h3>
          <p>{doctor.availability || "Doctor has not set availability"}</p>
        </div>

        {/* Date Picker */}
        <div className="ba-section">
          <h3>Select date</h3>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Reason */}
        <div className="ba-section">
          <h3>Reason for visit</h3>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Describe your symptoms..."
          />
        </div>

        <button
          className="ba-book-btn"
          onClick={bookNow}
          disabled={submitting}         // 🔥 important
        >
          {submitting ? "Please wait..." : "Request Appointment"}
        </button>

      </div>
    </div>
  );
}
