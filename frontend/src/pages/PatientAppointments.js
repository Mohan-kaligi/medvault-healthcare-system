// src/pages/PatientAppointments.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PatientAppointments.css";

export default function PatientAppointments() {
  const patientId = localStorage.getItem("userId");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        if (!patientId) {
          setError("No patient logged in.");
          return;
        }

        const res = await axios.get(
          `http://localhost:8080/api/appointments/patient/${patientId}`
        );
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [patientId]);

  // ===========================
  // PATIENT ACTIONS (Accept / Deny)
  // ===========================
  const handlePatientAction = async (apptId, action) => {
    try {
      await axios.post(
        `http://localhost:8080/api/appointments/${apptId}/patient-confirm`,
        { action }
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === apptId
            ? {
                ...a,
                status: action === "CONFIRM" ? "CONFIRMED" : "CANCELLED",
                accessStatus: action === "CONFIRM" ? "GRANTED" : "DENIED",
              }
            : a
        )
      );

      alert(
        action === "CONFIRM"
          ? "Appointment confirmed and access approved!"
          : "Appointment cancelled!"
      );
    } catch (err) {
      alert("Failed to update appointment.");
    }
  };

  const grouped = {
    pending: appointments.filter((a) => a.status === "PENDING"),
    awaiting: appointments.filter(
      (a) => a.status === "AWAITING_PATIENT_CONFIRMATION"
    ),
    confirmed: appointments.filter((a) => a.status === "CONFIRMED"),
    completed: appointments.filter((a) => a.status === "COMPLETED"),
    cancelled: appointments.filter((a) => a.status === "CANCELLED"),
  };

  if (loading) return <div className="pa-loading">Loading appointments...</div>;
  if (error) return <div className="pa-error">{error}</div>;

  return (
    <div className="pa-container">
      <h2 className="pa-title">My Appointments</h2>

      {/* =======================
          Doctor Access Requests
      ======================= */}
      <section className="pa-section">
        <h3 className="pa-section-title">Doctor Access Requests</h3>

        {grouped.awaiting.length === 0 ? (
          <p className="pa-empty">No access requests right now.</p>
        ) : (
          grouped.awaiting.map((appt) => (
            <div key={appt.id} className="pa-card access-card">
              <div className="pa-card-header">
                <div>
                  <h4>{appt.doctor?.user?.fullName}</h4>
                  <p className="pa-spec">{appt.doctor?.specialization}</p>
                </div>
                <span className="pa-status-chip awaiting">
                  Awaiting Your Approval
                </span>
              </div>

              <div className="pa-meta">
                <strong>Requested Date:</strong> {appt.appointmentDate}
              </div>

              <div className="pa-meta">
                <strong>Suggested Time:</strong>{" "}
                {appt.finalConsultationTime || "Not provided"}
              </div>

              <p className="pa-note">
                This doctor is requesting access to your medical records for
                consultation.
              </p>

              <div className="pa-action-row">
                <button
                  className="pa-btn approve"
                  onClick={() => handlePatientAction(appt.id, "CONFIRM")}
                >
                  Approve Access & Accept
                </button>

                <button
                  className="pa-btn deny"
                  onClick={() => handlePatientAction(appt.id, "DENY")}
                >
                  Deny & Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* =======================
          Pending Appointments
      ======================= */}
      <section className="pa-section">
        <h3 className="pa-section-title">Pending (Waiting for Doctor)</h3>

        {grouped.pending.length === 0 ? (
          <p className="pa-empty">No pending appointments.</p>
        ) : (
          grouped.pending.map((appt) => (
            <div key={appt.id} className="pa-card">
              <div className="pa-card-header">
                <div>
                  <h4>{appt.doctor?.user?.fullName}</h4>
                  <p className="pa-spec">{appt.doctor?.specialization}</p>
                </div>
                <span className="pa-status-chip pending">Pending</span>
              </div>

              <div className="pa-meta">
                <strong>Date:</strong> {appt.appointmentDate}
              </div>

              <p className="pa-meta">
                <strong>Your Note:</strong> {appt.reason}
              </p>
            </div>
          ))
        )}
      </section>

      {/* =======================
          Confirmed
      ======================= */}
      <section className="pa-section">
        <h3 className="pa-section-title">Confirmed Appointments</h3>

        {grouped.confirmed.length === 0 ? (
          <p className="pa-empty">No confirmed appointments.</p>
        ) : (
          grouped.confirmed.map((appt) => (
            <div key={appt.id} className="pa-card">
              <div className="pa-card-header">
                <div>
                  <h4>{appt.doctor?.user?.fullName}</h4>
                  <p className="pa-spec">{appt.doctor?.specialization}</p>
                </div>
                <span className="pa-status-chip confirmed">Confirmed</span>
              </div>

              <div className="pa-meta">
                <strong>Date:</strong> {appt.appointmentDate}
              </div>
              <div className="pa-meta">
                <strong>Time:</strong>{" "}
                {appt.finalConsultationTime || appt.appointmentTime}
              </div>
            </div>
          ))
        )}
      </section>

      {/* =======================
          Completed
      ======================= */}
      <section className="pa-section">
        <h3 className="pa-section-title">Completed Appointments</h3>

        {grouped.completed.length === 0 ? (
          <p className="pa-empty">No completed appointments yet.</p>
        ) : (
          grouped.completed.map((appt) => (
            <div key={appt.id} className="pa-card">
  <div className="pa-card-header">
    <div>
      <h4>{appt.doctor?.user?.fullName}</h4>
      <p className="pa-spec">{appt.doctor?.specialization}</p>
    </div>
    <span className="pa-status-chip completed">Completed</span>
  </div>

  <div className="pa-meta">
    <strong>Date:</strong> {appt.appointmentDate}
  </div>

  <div className="pa-meta">
    <strong>Final Time:</strong> {appt.finalConsultationTime}
  </div>

  <p className="pa-meta">
    <strong>Your Feedback:</strong>{" "}
    {appt.feedbackText || "No feedback given yet"}
  </p>

  {/* ⭐ New Feedback Button ⭐ */}
  {!appt.feedbackText && (
    <button
      className="pa-btn feedback-btn"
      onClick={() => window.location.href = `/patient/appointments/${appt.id}/feedback`}
    >
      Give Feedback
    </button>
  )}
</div>

          ))
        )}
      </section>

      {/* =======================
          Cancelled
      ======================= */}
      <section className="pa-section">
        <h3 className="pa-section-title">Cancelled Appointments</h3>

        {grouped.cancelled.length === 0 ? (
          <p className="pa-empty">No cancelled appointments.</p>
        ) : (
          grouped.cancelled.map((appt) => (
            <div key={appt.id} className="pa-card">
              <div className="pa-card-header">
                <div>
                  <h4>{appt.doctor?.user?.fullName}</h4>
                  <p className="pa-spec">{appt.doctor?.specialization}</p>
                </div>
                <span className="pa-status-chip cancelled">Cancelled</span>
              </div>

              <div className="pa-meta">
                <strong>Date:</strong> {appt.appointmentDate}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
