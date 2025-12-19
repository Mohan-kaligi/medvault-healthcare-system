// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorAppointmentDetail from "./pages/DoctorAppointmentDetails";
import GiveFeedback from "./pages/GiveFeedback";
import DoctorRatings from "./pages/DoctorRatings";

import Home from "./Home";
import SetPassword from "./pages/SetPassword";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import PatientRegister from "./pages/PatientRegister";
import DoctorRegister from "./pages/DoctorRegister";
// imports at top:
import PatientAppointments from "./pages/PatientAppointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAppointmentDetails from "./pages/DoctorAppointmentDetails";

import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientAppointmentConfirm from "./pages/PatientAppointmentConfirm";
// NEW
import PatientDoctorList from "./pages/PatientDoctorList";
import DoctorPublicProfile from "./pages/DoctorPublicProfile";

// 🔥 ADD THIS
import DoctorProfileSettings from "./pages/DoctorProfileSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/patient/register" element={<PatientRegister />} />

        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Doctor Profile Editing Page */}
        <Route
          path="/doctor/profile-settings"
          element={<DoctorProfileSettings />}
        />

        {/* Patient viewing doctor list */}
        <Route path="/patient/doctors" element={<PatientDoctorList />} />
        <Route path="/patient/doctors/:id" element={<DoctorPublicProfile />} />

        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/patient/book/:id" element={<BookAppointment />} />
        <Route path="/doctor/appointments/:id" element={<DoctorAppointmentDetail />} />
        <Route path="/patient/appointment/confirm/:id" element={<PatientAppointmentConfirm />} />
      <Route path="/patient/appointments" element={<PatientAppointments />} />

<Route path="/doctor/appointments" element={<DoctorAppointments />} />
<Route path="/doctor/appointments/:id" element={<DoctorAppointmentDetails />} />
<Route path="/patient/appointments/:id/feedback" element={<GiveFeedback />} />
<Route path="/doctor/ratings" element={<DoctorRatings />} />

      </Routes>
    </Router>
  );
}

export default App;
