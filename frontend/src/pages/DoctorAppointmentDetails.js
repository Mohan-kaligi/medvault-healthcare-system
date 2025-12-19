// src/pages/DoctorAppointmentDetails.js

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./DoctorAppointmentDetail.css";

export default function DoctorAppointmentDetails() {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [time, setTime] = useState(""); // doctor manually typed time
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Helper → Calculate age
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  };

  // Load appointment details
  useEffect(() => {
  const loadAppointment = async () => {
    try {
      const res = await axios.get(
  `http://localhost:8080/api/appointments/${id}`
);

      setAppt(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load appointment details.");
    }
    setLoading(false);
  };

  loadAppointment();
}, [id]);


  // Doctor Accept Action
  const handleAccept = async () => {
    if (!time.trim()) {
      alert("Please enter consultation time.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `http://localhost:8080/api/appointments/${id}/doctor-response`,
        {
          action: "ACCEPT",
          time: time.trim(),
        }
      );

      alert("Appointment sent to patient for confirmation.");
      navigate("/doctor/dashboard");
    } catch (err) {
      console.log(err);
      alert("Failed to accept appointment. Try again.");
    }

    setSubmitting(false);
  };

  // Doctor Reject Action
  const handleReject = async () => {
    setSubmitting(true);

    try {
      await axios.post(
        `http://localhost:8080/api/appointments/${id}/doctor-response`,
        {
          action: "REJECT",
        }
      );

      alert("Appointment rejected.");
      navigate("/doctor/dashboard");
    } catch (err) {
      alert("Failed to reject appointment.");
    }

    setSubmitting(false);
  };

  if (loading || !appt) {
    return <div className="dad-loading">Loading...</div>;
  }

  const patientUser = appt.patient?.user || {};
  const patientDetails = appt.patient || {};
  const age = calculateAge(patientDetails.dateOfBirth);

  return (
    <div className="dad-container">
      <div className="dad-card">
        <h2 className="dad-title">Appointment Request</h2>

        {/* Patient Details */}
        <section className="dad-section">
          <h3 className="dad-section-title">Patient Information</h3>

          <div className="dad-info-row">
            <strong>Name:</strong> {patientUser.fullName}
          </div>

          <div className="dad-info-row">
            <strong>Email:</strong> {patientUser.email}
          </div>

          <div className="dad-info-row">
            <strong>Phone:</strong> {patientUser.phone}
          </div>

          <div className="dad-info-row">
            <strong>Age:</strong> {age} years
          </div>

          <div className="dad-info-row">
            <strong>Blood Group:</strong> {patientDetails.bloodGroup}
          </div>
        </section>

        {/* Appointment Info */}
        <section className="dad-section">
          <h3 className="dad-section-title">Appointment Details</h3>

          <div className="dad-info-row">
            <strong>Date:</strong> {appt.appointmentDate}
          </div>

          <div className="dad-info-row">
            <strong>Reason:</strong> {appt.reason}
          </div>

          <div className="dad-info-row">
            <strong>Mode:</strong> {appt.mode}
          </div>
        </section>

        {/* Time Input */}
        <section className="dad-section">
          <h3 className="dad-section-title">Set Consultation Time</h3>

          <input
            type="text"
            className="dad-time-input"
            placeholder="Example: 10:30 AM or Evening or After 5 PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </section>

        {/* Buttons */}
        <div className="dad-actions">
          <button
            className="dad-reject-btn"
            onClick={handleReject}
            disabled={submitting}
          >
            Reject Appointment
          </button>

          <button
            className="dad-accept-btn"
            onClick={handleAccept}
            disabled={submitting}
          >
            Accept & Request for Records
          </button>
        </div>
      </div>
    </div>
  );
}
