// src/pages/PatientDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientDashboard.css";
import logo from "../assets/logo.png";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    recordsCount: 0, 
  });

  const [appointments, setAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]); 
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // LOAD PROFILE + REAL APPOINTMENTS
  // ---------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const id = localStorage.getItem("userId");
        if (!id) {
          setError("No patient ID found.");
          return;
        }

        // 1️⃣ LOAD PATIENT PROFILE
        const res1 = await axios.get(`http://localhost:8080/api/patient/${id}`);
        setProfile(res1.data);

        // 2️⃣ LOAD REAL APPOINTMENTS FROM BACKEND
        const res2 = await axios.get(
          `http://localhost:8080/api/appointments/patient/${id}`
        );

        const appts = res2.data;

        setAppointments(appts);

        // 3️⃣ UPDATE STATS BASED ON REAL DATA
        setStats({
          totalAppointments: appts.length,
          upcomingAppointments: appts.filter(
            (a) =>
              a.status !== "CANCELLED" &&
              a.status !== "COMPLETED"
          ).length,
          recordsCount: 18,
        });

        // 4️⃣ Mock recent records (unchanged)
        const recordRes = await axios.get(
          `http://localhost:8080/api/records/patient/${id}`
        );
        const allRecords = recordRes.data || [];

        setTotalRecords(allRecords.length);

        const latestThree = allRecords
          .sort(
            (a, b) =>
              new Date(b.uploadedDate) - new Date(a.uploadedDate)
          )
          .slice(0, 3);

        setRecentRecords(latestThree);

        setStats({
          totalAppointments: appts.length,
          upcomingAppointments: appts.filter(
            (a) =>
              a.status !== "CANCELLED" &&
              a.status !== "COMPLETED"
          ).length,
          recordsCount: allRecords.length,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ---------------------------------------------------------
  // DOCTOR ACCESS — Approve / Deny
  // ---------------------------------------------------------
  const handleApproveAccess = async (appointmentId) => {
  try {
    await axios.post(
      `http://localhost:8080/api/appointments/${appointmentId}/access`,
      { action: "APPROVE" }  // <-- FIXED
    );

    alert("Access granted. Appointment confirmed!");

    // update UI
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              accessStatus: "GRANTED",
              status: "CONFIRMED",
            }
          : a
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to approve access.");
  }
};


 const handleDenyAccess = async (appointmentId) => {
  try {
    await axios.post(
      `http://localhost:8080/api/appointments/${appointmentId}/access`,
      { action: "DENY" }  // <-- FIXED
    );

    alert("Access denied. Appointment cancelled.");

    // Remove cancelled appointment from UI
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
  } catch (err) {
    console.error(err);
    alert("Failed to deny access.");
  }
};

  // ---------------------------------------------------------
  // UI STATES
  // ---------------------------------------------------------
  if (loading)
    return (
      <div className="patient-dashboard-container">
        <div className="pd-loading">Loading your dashboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="patient-dashboard-container">
        <div className="pd-error">{error}</div>
      </div>
    );

  // ---------------------------------------------------------
  // FILTER APPOINTMENTS
  // ---------------------------------------------------------
  const accessRequests = appointments.filter(
  (a) => a.status === "AWAITING_PATIENT_CONFIRMATION"
);


  const upcoming = appointments.filter(
    (a) =>
      a.status !== "CANCELLED" &&
      a.status !== "COMPLETED"
  );

  // ---------------------------------------------------------
  // RENDER UI
  // ---------------------------------------------------------
  return (
    <div className="patient-dashboard-container">
      {/* Header */}
      <header className="pd-header">
        <div className="pd-logo">
          <div className="nav-logo">
            <img src={logo} alt="MedVault Logo" className="logo-icon" />
            <span className="logo-text">MedVault</span>
          </div>
        </div>

        <div className="pd-header-right">
          {profile && (
            <div className="pd-user-info">
              <div className="pd-avatar">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="pd-user-text">
                <span className="pd-user-name">Hi, {profile.fullName}</span>
                <span className="pd-user-role">Patient</span>
              </div>
            </div>
          )}

          <button
            className="pd-logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="pd-main">
        {/* LEFT SIDE */}
        <section className="pd-left">
          {/* OVERVIEW */}
          <div className="pd-section">
            <h2 className="pd-section-title">Overview</h2>
            <div className="pd-stats-grid">
              <div className="pd-stat-card">
                <p className="pd-stat-label">Total Appointments</p>
                <p className="pd-stat-value">{stats.totalAppointments}</p>
              </div>

              <div className="pd-stat-card">
                <p className="pd-stat-label">Upcoming</p>
                <p className="pd-stat-value">{stats.upcomingAppointments}</p>
              </div>

              <div className="pd-stat-card">
                <p className="pd-stat-label">Medical Records</p>
                <p className="pd-stat-value">{stats.recordsCount}</p>
              </div>
            </div>
          </div>

          {/* PROFILE SUMMARY */}
          <div className="pd-section">
            <h2 className="pd-section-title">Profile Summary</h2>

            <div className="pd-profile-card">
              <div className="pd-profile-row">
                <span className="pd-profile-label">Name</span>
                <span className="pd-profile-value">
                  {profile.fullName}
                </span>
              </div>

              <div className="pd-profile-row">
                <span className="pd-profile-label">Age</span>
                <span className="pd-profile-value">{profile.age}</span>
              </div>

              <div className="pd-profile-row">
                <span className="pd-profile-label">Gender</span>
                <span className="pd-profile-value">{profile.gender}</span>
              </div>

              <div className="pd-profile-row">
                <span className="pd-profile-label">Blood Group</span>
                <span className="pd-profile-value">
                  {profile.bloodGroup}
                </span>
              </div>

              <button
                className="pd-primary-btn"
                onClick={() => navigate("/patient/profile")}
              >
                View / Edit Full Profile
              </button>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="pd-section">
            <h2 className="pd-section-title">Quick Actions</h2>
            <div className="pd-actions">
              <button
                className="pd-action-btn pd-action-primary"
                onClick={() => navigate("/patient/doctors")}
              >
                📅 Book Appointment
              </button>

              <button
                className="pd-action-btn"
                onClick={() => navigate("/patient/records")}
              >
                📂 View & Add Medical Record
              </button>

              <button
                className="pd-action-btn"
                onClick={() => navigate("/patient/appointments")}
              >
                📋 View My Appointments
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="pd-right">
          {/* ACCESS REQUESTS */}
          <div className="pd-section">
            <div className="pd-section-header">
              <h2 className="pd-section-title">Doctor Access Requests</h2>
            </div>

            {accessRequests.length === 0 ? (
              <p className="pd-empty-text">No access requests right now.</p>
            ) : (
              <div className="pd-card-list">
                {accessRequests.map((appt) => (
                  <div key={appt.id} className="pd-access-card">
                    <div className="pd-access-main">
                      <h3>{appt.doctor.user.fullName}</h3>
                      <p>{appt.doctor.specialization}</p>

                      <p className="pd-access-note">
                        This doctor is requesting access to your medical
                        records for consultation.
                      </p>

                      {appt.finalConsultationTime && (
                        <p className="pd-time-proposal">
                          <strong>Suggested Time: </strong>
                          {appt.finalConsultationTime}
                        </p>
                      )}
                    </div>

                    <div className="pd-access-actions">
                      <button
                        className="pd-access-approve"
                        onClick={() =>  navigate("/patient/appointments")}
                      >
                        Approve Access & Accept Appointment
                      </button>

                      <button
                        className="pd-access-deny"
                        onClick={() => handleDenyAccess(appt.id)}
                      >
                        Deny & Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UPCOMING APPOINTMENTS */}
          <div className="pd-section">
            <div className="pd-section-header">
              <h2 className="pd-section-title">Upcoming Appointments</h2>
            </div>

            {upcoming.length === 0 ? (
              <p className="pd-empty-text">
                No upcoming appointments. Book your next consultation.
              </p>
            ) : (
              <div className="pd-card-list">
                {upcoming.map((appt) => (
                  <div key={appt.id} className="pd-appointment-card">
                    <div className="pd-appointment-main">
                      <h3>{appt.doctor.user.fullName}</h3>
                      <p className="pd-appointment-spec">
                        {appt.doctor.specialization}
                      </p>
                    </div>

                    <div className="pd-appointment-meta">
                      <span>{appt.appointmentDate}</span>
                      <span>
                        {appt.finalConsultationTime ||
                          appt.appointmentTime}
                      </span>
                      <span className="pd-appointment-mode">
                        {appt.mode}
                      </span>
                    </div>

                    <div
                      className={`pd-status-chip ${
                        appt.status === "CONFIRMED"
                          ? "pd-status-confirmed"
                          : "pd-status-pending"
                      }`}
                    >
                      {appt.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT MEDICAL RECORDS */}
          <div className="pd-section">
            <h2 className="pd-section-title">Recent Medical Records</h2>

            {recentRecords.length === 0 ? (
              <p className="pd-empty-text">No medical records found.</p>
            ) : (
              <>
                <div className="pd-card-list">
                  {recentRecords.map((rec) => {
                    const fileUrl = rec.filePath.startsWith("/")
                      ? `http://localhost:8080${rec.filePath}`
                      : `http://localhost:8080/${rec.filePath}`;

                    return (
                      <div key={rec.id} className="pd-record-card">
                        <div className="pd-record-main">
                          <h3>{rec.title}</h3>
                          <span className="pd-record-chip">
                            {rec.category.replace("_", " ")}
                          </span>
                        </div>
                        <p className="pd-record-date">
                          {rec.uploadedDate}
                        </p>

                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="pd-record-view-btn"
                        >
                          Open
                        </a>
                      </div>
                    );
                  })}
                </div>
                {totalRecords > 3 && (
                  <button
                    className="pd-record-view-btn"
                    style={{ marginTop: "10px" }}
                    onClick={() => navigate("/patient/records")}
                  >
                    View More
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;