import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PatientAppointmentConfirm.css";

export default function PatientAppointmentConfirm() {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/appointments/${id}`);
        setAppt(res.data);
      } catch (err) {
        alert("Failed to load appointment details");
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const accept = async () => {
    try {
      await axios.post(`http://localhost:8080/api/appointments/${id}/access`, "GRANT");
      alert("Appointment confirmed successfully!");
      navigate("/patient/dashboard");
    } catch {
      alert("Failed to confirm appointment");
    }
  };

  const deny = async () => {
    try {
      await axios.post(`http://localhost:8080/api/appointments/${id}/access`, "DENY");
      alert("Appointment cancelled");
      navigate("/patient/dashboard");
    } catch {
      alert("Failed to cancel appointment");
    }
  };

  if (loading || !appt)
    return <div className="pac-loading">Loading appointment…</div>;

  const doctor = appt.doctor?.user || {};
  const details = appt.doctor || {};

  return (
    <div className="pac-container">
      <div className="pac-card">

        <h2 className="pac-title">Appointment Confirmation</h2>

        {/* Doctor Info */}
        <section className="pac-section">
          <h3 className="pac-section-title">Doctor Information</h3>
          <p><strong>Doctor:</strong> Dr. {doctor.fullName}</p>
          <p><strong>Specialization:</strong> {details.specialization}</p>
          <p><strong>Hospital:</strong> {details.hospitalName}</p>
        </section>

        {/* Appointment Details */}
        <section className="pac-section">
          <h3 className="pac-section-title">Your Appointment</h3>
          <p><strong>Reason:</strong> {appt.reason}</p>
          <p><strong>Date:</strong> {appt.appointmentDate}</p>
          <p><strong>Consultation Time (selected by doctor):</strong></p>
          <p className="pac-highlight">{appt.finalConsultationTime}</p>
        </section>

        {/* Medical Records Access */}
        <section className="pac-section">
          <h3 className="pac-section-title">Medical Record Access</h3>
          <p>
            The doctor wants permission to view your medical records for consultation.
          </p>
        </section>

        {/* Buttons */}
        <div className="pac-actions">
          <button className="pac-deny-btn" onClick={deny}>
            Deny & Cancel Appointment
          </button>

          <button className="pac-accept-btn" onClick={accept}>
            Approve Access & Accept Appointment
          </button>
        </div>

      </div>
    </div>
  );
}
