import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./PatientRecords.css";

export default function PatientRecords() {
  const patientId = localStorage.getItem("userId");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("PRESCRIPTION");
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // LOAD RECORDS
  // ---------------------------------------
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/records/patient/${patientId}`
      );
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ---------------------------------------
  // UPLOAD
  // ---------------------------------------
  const handleUpload = async () => {
    if (!title || !file) {
      alert("Please provide title and file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("file", file);
    formData.append("patientId", patientId);

    try {
      await axios.post(
        "http://localhost:8080/api/records/upload",
        formData
      );
      alert("Record uploaded successfully");
      setTitle("");
      setFile(null);
      loadRecords();
    } catch (err) {
      alert("Upload failed");
    }
  };

  // ---------------------------------------
  // DELETE RECORD
  // ---------------------------------------
  const handleDelete = async (recordId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/records/${recordId}`
      );
      alert("Record deleted");
      loadRecords();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  // ---------------------------------------
  // FILTER
  // ---------------------------------------
  const filteredRecords =
    filter === "ALL"
      ? records
      : records.filter((r) => r.category === filter);

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="pr-container">
      <h2 className="pr-title">My Medical Records</h2>

      {/* Upload */}
      <div className="pr-upload-card">
        <input
          type="text"
          placeholder="Record Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="PRESCRIPTION">Prescription</option>
          <option value="LAB_REPORT">Lab Report</option>
          <option value="SCAN">Scan</option>
          <option value="DIAGNOSIS">Diagnosis</option>
          <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload Record</button>
      </div>

      {/* Filters */}
      <div className="pr-filters">
        {[
          "ALL",
          "PRESCRIPTION",
          "LAB_REPORT",
          "SCAN",
          "DIAGNOSIS",
          "DISCHARGE_SUMMARY",
          "OTHER",
        ].map((c) => (
          <button
            key={c}
            className={filter === c ? "active" : ""}
            onClick={() => setFilter(c)}
          >
            {c.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="pr-grid">
        {loading ? (
          <p className="pr-empty">Loading records...</p>
        ) : filteredRecords.length === 0 ? (
          <p className="pr-empty">No records found.</p>
        ) : (
          filteredRecords.map((rec) => {
            const fileUrl = rec.filePath.startsWith("/")
              ? `http://localhost:8080${rec.filePath}`
              : `http://localhost:8080/${rec.filePath}`;

            return (
              <div key={rec.id} className="pr-card">
                <h4>{rec.title}</h4>

                <span className="pr-chip">
                  {rec.category.replace("_", " ")}
                </span>

                <p className="pr-date">{rec.uploadedDate}</p>

                <div className="pr-actions">
                  {/* VIEW */}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pr-view"
                  >
                    View
                  </a>

                  {/* DOWNLOAD */}
                  <a
                    href={fileUrl}
                    download
                    className="pr-download"
                  >
                    Download
                  </a>

                  {/* DELETE */}
                  <button
                    className="pr-delete"
                    onClick={() => handleDelete(rec.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
