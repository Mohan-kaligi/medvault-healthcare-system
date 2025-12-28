// src/pages/DoctorPatientRecords.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./DoctorPatientRecords.css";

export default function DoctorPatientRecords() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/records/patient/${patientId}`
        );
        setRecords(res.data);
      } catch {
        alert("Failed to load records.");
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, [patientId]);

  if (loading) return <p className="dr-loading">Loading records...</p>;

  return (
    <div className="dr-container">
      <h2>Patient Medical Records</h2>

      {records.length === 0 ? (
        <p className="dr-empty">No medical records available.</p>
      ) : (
        records.map((rec) => {
          const fileUrl = rec.filePath.startsWith("/")
            ? `http://localhost:8080${rec.filePath}`
            : `http://localhost:8080/${rec.filePath}`;

          return (
            <div key={rec.id} className="dr-card">
              <h4>{rec.title}</h4>
              <span className="dr-chip">
                {rec.category.replace("_", " ")}
              </span>
              <p className="dr-date">{rec.uploadedDate}</p>

              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="dr-open-btn"
              >
                Open / Download
              </a>
            </div>
          );
        })
      )}

      <button
        className="dr-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </div>
  );
}
