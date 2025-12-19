import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GiveFeedback.css";

export default function GiveFeedback() {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/${id}`
        );
        setAppointment(res.data);
      } catch (err) {
        alert("Failed to load appointment details.");
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating.");

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:8080/api/appointments/${id}/feedback`,
        {
          feedback,
          rating,
        }
      );

      alert("Feedback submitted successfully!");
      navigate("/patient/appointments");
    } catch (err) {
      alert("Failed to submit feedback.");
    }

    setLoading(false);
  };

  if (!appointment) return <div className="gf-loading">Loading...</div>;

  return (
    <div className="gf-container">
      <h2>Give Feedback</h2>

      <div className="gf-card">
        <h3>{appointment.doctor?.user?.fullName}</h3>
        <p>{appointment.doctor?.specialization}</p>
      </div>

      <div className="gf-section">
        <label className="gf-label">Rate Your Consultation</label>
        <div className="gf-stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`gf-star ${rating >= num ? "selected" : ""}`}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="gf-section">
        <label className="gf-label">Write Feedback</label>
        <textarea
          className="gf-textarea"
          placeholder="Share your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <button
        className="gf-submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        Submit Feedback
      </button>
    </div>
  );
}
