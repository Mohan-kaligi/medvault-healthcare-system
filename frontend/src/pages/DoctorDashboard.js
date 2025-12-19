// src/pages/DoctorDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorDashboard.css";
import logo from "../assets/logo.png";

const DEFAULT_DOCTOR_PHOTO =
  "https://cdn-icons-png.flaticon.com/512/387/387561.png";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const goToProfileSettings = () => navigate("/doctor/profile-settings");
  const goToAppointmentDetail = (id) =>
    navigate(`/doctor/appointments/${id}`);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    pendingAppointments: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [patients] = useState([]); // (future enhancement)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorId = localStorage.getItem("userId");

        if (!doctorId) {
          setError("No doctor session found. Please login again.");
          navigate("/login");
          return;
        }

        // Load doctor profile
        const res = await axios.get(
          `http://localhost:8080/api/doctor/${doctorId}`
        );
        const d = res.data;

        setProfile({
          id: d.id,
          name: d.fullName,
          email: d.email,
          phone: d.phone,
          specialization: d.specialization,
          hospitalName: d.hospitalName,
          experienceYears: d.experienceYears,
          licenseNumber: d.licenseNumber,
          photoUrl: d.photoUrl || DEFAULT_DOCTOR_PHOTO,
        });

        setStats({
          totalPatients: d.totalPatients,
          todaysAppointments: d.todaysAppointments,
          pendingAppointments: d.pendingAppointments,
        });

        // Load REAL appointments
        const apptRes = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`
        );
        setAppointments(apptRes.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load doctor dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToSchedule = () => navigate("/doctor/appointments");
  const goToPatients = () => navigate("/doctor/patients");
  const goToProfile = () => navigate("/doctor/profile");
  const goToRecords = () => navigate("/doctor/records");

  // Loading screen
  if (loading) {
    return (
      <div className="doctor-dashboard-container">
        <div className="dd-loading">Loading your dashboard...</div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="doctor-dashboard-container">
        <div className="dd-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-container">
      {/* Header */}
      <header className="dd-header">
        <div className="dd-logo">
          <div className="nav-logo">
            <img src={logo} alt="MedVault Logo" className="logo-icon" />
            <span className="logo-text">MedVault</span>
          </div>
        </div>

        <div className="dd-header-right">
          {profile && (
            <div className="dd-user-info">
              <div className="dd-avatar-wrapper">
                <img
                  src={profile.photoUrl}
                  alt="Doctor"
                  className="dd-avatar-img"
                />
              </div>

              <div className="dd-user-text">
                <span className="dd-user-name">Dr. {profile.name}</span>
                <span className="dd-user-role">
                  {profile.specialization || "Consultant"}
                </span>
              </div>
            </div>
          )}

          <button className="dd-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="dd-main">
        {/* LEFT SIDE */}
        <section className="dd-left">
          {/* Stats */}
          <div className="dd-section">
            <h2 className="dd-section-title">Today&apos;s Overview</h2>
            <div className="dd-stats-grid">
              <div className="dd-stat-card">
                <p className="dd-stat-label">Today&apos;s Appointments</p>
                <p className="dd-stat-value">{stats.todaysAppointments}</p>
              </div>
              <div className="dd-stat-card">
                <p className="dd-stat-label">Pending Approvals</p>
                <p className="dd-stat-value">{stats.pendingAppointments}</p>
              </div>
              <div className="dd-stat-card">
                <p className="dd-stat-label">Total Patients</p>
                <p className="dd-stat-value">{stats.totalPatients}</p>
              </div>
            </div>
          </div>

          {/* Edit professional info */}
          <div className="dd-edit-section" onClick={goToProfileSettings}>
            <div className="dd-edit-icon">📝</div>
            <div className="dd-edit-text">
              <h3>Edit Professional Info</h3>
              <p>
                Update your biography, expertise, and availability so patients
                can view your profile clearly.
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="dd-section">
            <h2 className="dd-section-title">Profile</h2>

            {profile && (
              <div className="dd-profile-card">
                <div className="dd-profile-top">
                  <div className="dd-profile-photo-big">
                    <img
                      src={profile.photoUrl}
                      alt="Doctor"
                      className="dd-profile-photo-img"
                    />
                  </div>

                  <div className="dd-profile-info-main">
                    <h3>Dr. {profile.name}</h3>
                    <p>{profile.specialization}</p>
                    <p className="dd-profile-hospital">
                      {profile.hospitalName}
                    </p>
                  </div>
                </div>

                <div className="dd-profile-grid">
                  <div className="dd-profile-row">
                    <span className="dd-profile-label">Experience</span>
                    <span className="dd-profile-value">
                      {profile.experienceYears} years
                    </span>
                  </div>

                  <div className="dd-profile-row">
                    <span className="dd-profile-label">License No.</span>
                    <span className="dd-profile-value">
                      {profile.licenseNumber}
                    </span>
                  </div>

                  <div className="dd-profile-row">
                    <span className="dd-profile-label">Email</span>
                    <span className="dd-profile-value">{profile.email}</span>
                  </div>

                  <div className="dd-profile-row">
                    <span className="dd-profile-label">Phone</span>
                    <span className="dd-profile-value">{profile.phone}</span>
                  </div>
                </div>

                <button className="dd-primary-btn" onClick={goToProfile}>
                  View / Edit Profile
                </button>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="dd-right">
          <div className="dd-section">
            <div className="dd-section-header">
              <h2 className="dd-section-title">Upcoming Appointments</h2>
              <button className="dd-link-btn" onClick={goToSchedule}>
                View all
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="dd-empty-text">
                No upcoming appointments. Your schedule is free.
              </p>
            ) : (
              <div className="dd-card-list">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="dd-appointment-card"
                    onClick={() => goToAppointmentDetail(appt.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="dd-appointment-main">
                      <h3>{appt.patient?.user?.fullName}</h3>
                      <p className="dd-appointment-reason">{appt.reason}</p>
                    </div>

                    <div className="dd-appointment-meta">
                      <span>{appt.appointmentDate}</span>
                      <span>{appt.appointmentTime}</span>

                      <span
                        className={`dd-status-chip ${
                          appt.status === "CONFIRMED"
                            ? "dd-status-confirmed"
                            : "dd-status-pending"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="dd-appointment-footer">
                      <span
                        className={`dd-access-chip ${
                          appt.accessStatus === "GRANTED"
                            ? "dd-access-granted"
                            : "dd-access-requested"
                        }`}
                      >
                        Records: {appt.accessStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Future feature (patients list) */}
          <div className="dd-section">
            <div className="dd-section-header">
              <h2 className="dd-section-title">Recent Patients</h2>
            </div>

            <p className="dd-empty-text">
              Patient history feature coming soon.
            </p>
          </div>
          <button
  className="dd-btn"
  onClick={() => navigate("/doctor/ratings")}
>
  ⭐ View My Ratings
</button>

        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;
