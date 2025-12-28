import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "../admin-styles.css";
import logo from "../assets/logo.png";

const API = "http://localhost:8080/api/admin";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
  patients: 0,
  doctors: 0,
  appointments: 0,
});

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("All");

  const [profileOpen, setProfileOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);


  // Fetch all lists
  const loadData = async () => {
    try {
      const [p, a, r, c, s] = await Promise.all([
        axios.get(API + "/doctors/pending"),
        axios.get(API + "/doctors/approved"),
        axios.get(API + "/doctors/rejected"),
        axios.get(API + "/appointments/completed"), // NEW
        axios.get(API + "/stats"),
      ]);

      setPending(p.data);
      setApproved(a.data);
      setRejected(r.data);
      setConfirmedAppointments(c.data); // NEW
      setStats(s.data);
    } catch (err) {
      alert("Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Approve Doctor
  const approveDoctor = async (id) => {
    try {
      await axios.put(`${API}/doctor/approve/${id}`);

      const doc = pending.find((d) => d.id === id);
      if (doc) {
        doc.status = "APPROVED";
        setPending(pending.filter((d) => d.id !== id));
        setApproved([...approved, doc]);
      }
    } catch (err) {
      alert("Approval failed");
    }
  };

  // Reject Doctor
  const rejectDoctor = async (id) => {
    try {
      await axios.put(`${API}/doctor/reject/${id}`);

      const doc = pending.find((d) => d.id === id);
      if (doc) {
        doc.status = "REJECTED";
        setPending(pending.filter((d) => d.id !== id));
        setRejected([...rejected, doc]);
      }
    } catch (err) {
      alert("Rejection failed");
    }
  };

  // Filtering logic
  const filterList = (list) => {
    return list.filter((d) => {
      const name = d.user?.fullName?.toLowerCase() || "";
      const email = d.user?.email?.toLowerCase() || "";
      const license = d.licenseNumber?.toLowerCase() || "";
      const spec = d.specialization || "";

      const matchSearch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        license.includes(search.toLowerCase());

      const matchSpec = filterSpec === "All" || spec === filterSpec;

      return matchSearch && matchSpec;
    });
  };

 const openFile = (doctorId, type) => {
  const url = `${API}/doctor/file/${doctorId}/${type}`;
  setPreviewUrl(url);
};


  return (
    <div className="admin-dashboard">
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="admin-nav-container">
          <div className="admin-nav-left">
            <div className="nav-logo">
            <img src={logo} alt="MedVault Logo" className="logo-icon" />

          <span className="logo-text">MedVault</span>
        </div>
            <span className="admin-logo-text">MedVault Admin</span>
          </div>

          <div className="admin-nav-right">
  <div className="profile-wrapper">
    <button
      className="admin-profile-btn"
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <div className="admin-avatar">AD</div>
      <div className="profile-text">
        <p className="admin-profile-name">Admin</p>
        <p className="admin-profile-role">Administrator</p>
      </div>
      <span className="admin-profile-caret">▾</span>
    </button>

    {profileOpen && (
      <div className="profile-dropdown">
        <button className="dropdown-item">👤 View Profile</button>
        <button className="dropdown-item logout" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    )}
  </div>
</div>

        </div>
      </nav>
    {/* ================= ADMIN OVERVIEW STATS ================= */}
<section className="admin-stats">
  <div className="stat-card stat-accepted">
    <h3>Total Patients</h3>
    <p className="stat-count">{stats.patients}</p>
  </div>

  <div className="stat-card stat-pending">
    <h3>Total Doctors</h3>
    <p className="stat-count">{stats.doctors}</p>
  </div>

  <div className="stat-card stat-rejected">
    <h3>Total Appointments</h3>
    <p className="stat-count">{stats.appointments}</p>
  </div>
</section>

      {/* HEADER */}
      <div className="admin-main">
        <section className="admin-header">
          <h1>Doctor Verification Dashboard</h1>
          <p>Review and manage doctor registrations</p>
        </section>

        {/* STATS */}
        <section className="admin-stats">
          <div className="stat-card stat-pending">
            <h3>Pending</h3>
            <p className="stat-count">{pending.length}</p>
          </div>

          <div className="stat-card stat-accepted">
            <h3>Approved</h3>
            <p className="stat-count">{approved.length}</p>
          </div>

          <div className="stat-card stat-rejected">
            <h3>Rejected</h3>
            <p className="stat-count">{rejected.length}</p>
          </div>
        </section>

        {/* FILTER */}
        <section className="filter-section">
          <input
            placeholder="Search doctor by name / email / license..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {/* ---------------------- PENDING ----------------------- */}
        <section className="requests-section pending-section">
          <div className="section-header">
            <h2>⏳ Pending Requests</h2>
            <span className="section-count">{pending.length}</span>
          </div>

          <div className="requests-container">
            {filterList(pending).map((doc) => (
              <div key={doc.id} className="request-card">
                <h3>{doc.user.fullName}</h3>
                    <p>
                      <strong>Email: </strong>
                      {doc.user.email}
                    </p>
<p>
  <strong>Experience: </strong>
  {doc.experienceYears} years
</p>
                    <p>
                      <strong>Specialization: </strong>
                      {doc.specialization}
                    </p>

                    <p>
                      <strong>Hospital: </strong>
                      {doc.hospitalName}
                    </p>
                <h4>Documents:</h4>
                <button onClick={() => openFile(doc.id, "degree")} className="document-link">
                  📄 Degree
                </button>
                <button
                  onClick={() => openFile(doc.id, "registration")}
                  className="document-link"
                >
                  📄 Registration
                </button>
                <button
                  onClick={() => openFile(doc.id, "experience")}
                  className="document-link"
                >
                  📄 Experience
                </button>
                <button onClick={() => openFile(doc.id, "idproof")} className="document-link">
                  🪪 ID Proof
                </button>
                <button onClick={() => openFile(doc.id, "photo")} className="document-link">
                  🖼️ Photo
                </button>

                <div className="request-actions">
                  <button
                    className="approve-btn"
                    onClick={() => approveDoctor(doc.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rejectDoctor(doc.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------- APPROVED ----------------------- */}
        <section className="requests-section accepted-section">
          <div className="section-header">
            <h2>✔️ Approved Doctors</h2>
            <span className="section-count">{approved.length}</span>
          </div>

          <div className="requests-container">
            {filterList(approved).map((doc) => (
              <div key={doc.id} className="request-card">
                <h3>{doc.user.fullName}</h3>

                  <p>
                    <strong>Email: </strong>
                    {doc.user.email}
                  </p>
              <p>
  <strong>Experience: </strong>
  {doc.experienceYears} years
</p>
                  <p>
                    <strong>Specialization: </strong>
                    {doc.specialization}
                  </p>

                  <p>
                    <strong>Hospital: </strong>
                    {doc.hospitalName}
                  </p>

              </div>
            ))}
          </div>
        </section>

        {/* ---------------------- REJECTED ----------------------- */}
        <section className="requests-section rejected-section">
          <div className="section-header">
            <h2>❌ Rejected Requests</h2>
            <span className="section-count">{rejected.length}</span>
          </div>

          <div className="requests-container">
            {filterList(rejected).map((doc) => (
              <div key={doc.id} className="request-card">
                <h3>{doc.user.fullName}</h3>

                <p>
                  <strong>Email: </strong>
                  {doc.user.email}
                </p>
                <p>
  <strong>Experience: </strong>
  {doc.experienceYears} years
</p>

                <p>
                  <strong>Specialization: </strong>
                  {doc.specialization}
                </p>

                <p>
                  <strong>Hospital: </strong>
                  {doc.hospitalName}
                </p>

              </div>
            ))}
          </div>
        </section>
      </div>
      {/* ---------------- CONFIRMED APPOINTMENTS (READ-ONLY) ---------------- */}
<section className="requests-section accepted-section">
  <div className="section-header">
    <h2>🔒 Completed Appointments</h2>
    <span className="section-count">{confirmedAppointments.length}</span>
  </div>

  <div className="requests-container">
    {confirmedAppointments.map((appt) => (
      <div key={appt.id} className="request-card">
        <h3>{appt.patient?.user?.fullName}</h3>

        <p><strong>Patient Email:</strong> {appt.patient?.user?.email}</p>

        <p><strong>Doctor:</strong> {appt.doctor?.user?.fullName}</p>
        <p><strong>Specialization:</strong> {appt.doctor?.specialization}</p>

        <p><strong>Date:</strong> {appt.appointmentDate}</p>
        <p><strong>Time:</strong> {appt.finalConsultationTime}</p>
        <p><strong>Mode:</strong> {appt.mode}</p>

        <span className="status-chip confirmed">CONFIRMED</span>
      </div>
    ))}
  </div>
</section>


      {/* FOOTER */}
      <footer className="admin-footer">
        <p>© 2025 MedVault Admin — Secure Healthcare</p>
      </footer>
    {previewUrl && (
  <div className="preview-modal">
    <div className="preview-box">
      <button className="close-btn" onClick={() => setPreviewUrl(null)}>✖</button>
      <img src={previewUrl} alt="Document Preview" className="preview-image"/>
    </div>
  </div>
)}

    </div>
    
  );
}
