import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./DoctorAppointments.css";

export default function DoctorAddPrescription() {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("appointmentId", id);
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/records/prescription",
        formData
      );

      alert("Prescription uploaded successfully");
      navigate("/doctor/appointments");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="da-container">
      <h2>Add Prescription</h2>

      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button
        className="da-complete-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Prescription"}
      </button>
    </div>
  );
}
