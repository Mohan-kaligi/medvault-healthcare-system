// src/pages/PatientDoctorList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientDoctorList.css";
import logo from "../assets/logo.png";

const PatientDoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/doctor/public");
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((d) => {
    const text = (search || "").toLowerCase();
    const specFilter = (specializationFilter || "").toLowerCase();

    const matchesText =
      d.fullName?.toLowerCase().includes(text) ||
      d.specialization?.toLowerCase().includes(text) ||
      d.hospitalName?.toLowerCase().includes(text);

    const matchesSpec =
      !specFilter ||
      (d.specialization && d.specialization.toLowerCase().includes(specFilter));

    return matchesText && matchesSpec;
  });

  const handleViewProfile = (id) => {
    navigate(`/patient/doctors/${id}`);
  };

  const handleBack = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="pdl-container">
      {/* Top bar */}
      <header className="pdl-header">
        <div className="pdl-logo">
          <div className="nav-logo">
            <img src={logo} alt="MedVault Logo" className="logo-icon" />
            <span className="logo-text">MedVault</span>
          </div>
        </div>

        <div className="pdl-header-right">
          <button className="pdl-back-btn" onClick={handleBack}>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pdl-main">
        <div className="pdl-top-row">
          <div>
            <h1 className="pdl-title">Find a Doctor</h1>
            <p className="pdl-subtitle">
              Search and book an appointment with a specialist.
            </p>
          </div>
        </div>

        {/* Search + filter */}
        <div className="pdl-filters">
          <input
            className="pdl-search-input"
            type="text"
            placeholder="Search by name, specialization, or hospital…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            className="pdl-search-input"
            type="text"
            placeholder="Filter by specialization (e.g., Cardiologist)"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          />
        </div>

        {loading && <div className="pdl-loading">Loading doctors…</div>}

        {error && <div className="pdl-error">{error}</div>}

        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="pdl-empty">
            No doctors found. Try changing your search.
          </div>
        )}

        {/* Doctor cards – Option B (horizontal) */}
        <div className="pdl-list">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="pdl-card"
              onClick={() => handleViewProfile(doc.id)}
            >
              <div className="pdl-card-left">
                <div className="pdl-photo-wrapper">
                  {doc.photoUrl ? (
                    <img
                      src={doc.photoUrl}
                      alt={doc.fullName}
                      className="pdl-photo"
                    />
                  ) : (
                    <div className="pdl-photo-fallback">
                      {doc.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="pdl-card-middle">
                <h3 className="pdl-doc-name">{doc.fullName}</h3>
                <p className="pdl-doc-spec">{doc.specialization}</p>
                <p className="pdl-doc-hospital">{doc.hospitalName}</p>

                {doc.about && (
                  <p className="pdl-doc-about">
                    {doc.about.length > 120
                      ? doc.about.substring(0, 120) + "..."
                      : doc.about}
                  </p>
                )}

                {doc.availability && (
                  <p className="pdl-doc-availability">
                    ⏰ {doc.availability}
                  </p>
                )}
              </div>

              <div className="pdl-card-right">
                <button
                  className="pdl-view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(doc.id);
                  }}
                >
                  View Profile &amp; Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientDoctorList;
