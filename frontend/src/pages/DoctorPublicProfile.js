// src/pages/DoctorPublicProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./DoctorPublicProfile.css";
import logo from "../assets/logo.png";

const DoctorPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/doctor/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleBack = () => {
    navigate("/patient/doctors");
  };

  const handleBook = () => {
  navigate(`/patient/book/${id}`);
};


  // split expertise into bullet list (comma or newline)
  const expertiseList = doctor?.expertise
    ? doctor.expertise
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="dpp-container">
        <div className="dpp-center-text">Loading doctor profile…</div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="dpp-container">
        <div className="dpp-center-text dpp-error">{error || "Not found"}</div>
      </div>
    );
  }

  return (
    <div className="dpp-container">
      {/* Header */}
      <header className="dpp-header">
        <div className="dpp-logo">
          <div className="nav-logo">
            <img src={logo} alt="MedVault Logo" className="logo-icon" />
            <span className="logo-text">MedVault</span>
          </div>
        </div>

        <div className="dpp-header-right">
          <button className="dpp-back-btn" onClick={handleBack}>
            ← Back to Doctors
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="dpp-main">
        <div className="dpp-card">
          {/* Top section – name + photo */}
          <div className="dpp-top">
            <div className="dpp-top-left">
              <h2 className="dpp-name">Dr. {doctor.fullName}</h2>
              <p className="dpp-spec">{doctor.specialization}</p>
              <p className="dpp-hospital">{doctor.hospitalName}</p>
            </div>

            <div className="dpp-top-right">
              <div className="dpp-photo-big">
                {doctor.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.fullName}
                    className="dpp-photo-img"
                  />
                ) : (
                  <div className="dpp-photo-fallback">
                    {doctor.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          {doctor.about && (
            <section className="dpp-section">
              <h3 className="dpp-section-title">About</h3>
              <p className="dpp-paragraph">{doctor.about}</p>
            </section>
          )}

          {/* Expertise */}
          {expertiseList.length > 0 && (
            <section className="dpp-section">
              <h3 className="dpp-section-title">Expertise &amp; Services</h3>
              <ul className="dpp-list">
                {expertiseList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Availability */}
          {doctor.availability && (
            <section className="dpp-section dpp-availability">
              <h3 className="dpp-section-title">Availability</h3>
              <p className="dpp-paragraph">{doctor.availability}</p>
            </section>
          )}

          {/* Contact + Book button */}
          <section className="dpp-section dpp-bottom-row">
            <div className="dpp-contact">
              <p>
                <strong>Email:</strong> {doctor.email}
              </p>
              <p>
                <strong>Phone:</strong> {doctor.phone}
              </p>
            </div>

            <button className="dpp-book-btn" onClick={handleBook}>
              Book Appointment with Dr. {doctor.fullName}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorPublicProfile;
