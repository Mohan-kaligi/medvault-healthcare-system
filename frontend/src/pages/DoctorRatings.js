import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorRatings.css";

export default function DoctorRatings() {
  const doctorId = localStorage.getItem("userId");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [average, setAverage] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`
        );

        const completed = res.data.filter(
          (a) => a.status === "COMPLETED" && a.rating != null
        );

        setReviews(completed);

        if (completed.length > 0) {
          const avg =
            completed.reduce((sum, a) => sum + a.rating, 0) /
            completed.length;
          setAverage(avg.toFixed(1));
        }
      } catch (err) {
        setError("Failed to load ratings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doctorId]);

  if (loading) return <div className="dr-loading">Loading ratings...</div>;
  if (error) return <div className="dr-error">{error}</div>;

  return (
    <div className="dr-container">
      <h2>My Ratings & Reviews</h2>

      {/* SUMMARY CARD */}
      <div className="dr-summary-card">
        <h1 className="dr-average">{average}</h1>
        <p className="dr-stars">
          {"★".repeat(Math.round(average)) +
            "☆".repeat(5 - Math.round(average))}
        </p>
        <p className="dr-total">{reviews.length} Reviews</p>
      </div>

      <h3 className="dr-section-title">Patient Reviews</h3>

      {reviews.length === 0 ? (
        <p className="dr-empty">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="dr-review-card">
            <div className="dr-header">
              <div>
                <h4>{r.patient.user.fullName}</h4>
                <p className="dr-date">{r.appointmentDate}</p>
              </div>

              <div className="dr-rating">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
            </div>

            <p className="dr-feedback">
              {r.feedbackText || "No written feedback"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
