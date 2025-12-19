// src/pages/DoctorAppointments.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorAppointments.css";
import { useNavigate } from "react-router-dom";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("userId");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`
        );
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, [doctorId]);

  const handleComplete = async (id) => {
    try {
      await axios.post(`http://localhost:8080/api/appointments/${id}/complete`);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "COMPLETED" } : a
        )
      );

      alert("Marked as completed.");
    } catch (err) {
      alert("Failed to mark completed.");
    }
  };

  const grouped = {
    pending: appointments.filter((a) => a.status === "PENDING"),
    waiting: appointments.filter(
      (a) => a.status === "AWAITING_PATIENT_CONFIRMATION"
    ),
    confirmed: appointments.filter((a) => a.status === "CONFIRMED"),
    completed: appointments.filter((a) => a.status === "COMPLETED"),
    cancelled: appointments.filter((a) => a.status === "CANCELLED"),
  };

  if (loading) return <div className="da-loading">Loading...</div>;

  return (
    <div className="da-container">
      <h2 className="da-title">All Appointments</h2>

      {/* ------- Pending Requests ------- */}
      <AppointmentSection
        title="New Requests (Pending)"
        items={grouped.pending}
        emptyText="No pending appointments."
        clickable
        navigate={navigate}
      />

      {/* ------- Awaiting Patient Confirmation ------- */}
      <AppointmentSection
        title="Awaiting Patient Confirmation"
        items={grouped.waiting}
        emptyText="None waiting."
      />

      {/* ------- Confirmed ------- */}
      <AppointmentSection
        title="Confirmed Appointments"
        items={grouped.confirmed}
        emptyText="No confirmed appointments."
        showComplete
        onComplete={handleComplete}
      />

      {/* ------- Completed ------- */}
      <AppointmentSection
        title="Completed"
        items={grouped.completed}
        emptyText="No completed appointments."
        showFeedback
      />

      {/* ------- Cancelled ------- */}
      <AppointmentSection
        title="Cancelled"
        items={grouped.cancelled}
        emptyText="No cancelled appointments."
      />
    </div>
  );
}

// ------------------- REUSABLE COMPONENT ------------------- //

function AppointmentSection({
  title,
  items,
  emptyText,
  clickable,
  navigate,
  showComplete,
  onComplete,
  showFeedback,
}) {
  return (
    <section className="da-section">
      <h3 className="da-section-title">{title}</h3>

      {items.length === 0 ? (
        <p className="da-empty">{emptyText}</p>
      ) : (
        items.map((a) => (
          <div
            key={a.id}
            className={`da-card ${clickable ? "da-clickable" : ""}`}
            onClick={() =>
              clickable && navigate(`/doctor/appointments/${a.id}`)
            }
          >
            <div className="da-card-header">
              <h4 className="da-name">{a.patient?.user?.fullName}</h4>
              <span className={`da-status da-${a.status}`}>
                {a.status.replace(/_/g, " ")}
              </span>
            </div>

            <p><strong>Date:</strong> {a.appointmentDate}</p>
            {a.reason && <p><strong>Reason:</strong> {a.reason}</p>}
            {a.finalConsultationTime && (
              <p><strong>Time:</strong> {a.finalConsultationTime}</p>
            )}

            {showFeedback && (
              <p>
                <strong>Feedback:</strong>{" "}
                {a.feedbackText ? a.feedbackText : "No feedback yet"}
              </p>
            )}

            {showComplete && (
              <button
                className="da-complete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(a.id);
                }}
              >
                Mark Completed
              </button>
            )}
          </div>
        ))
      )}
    </section>
  );
}
