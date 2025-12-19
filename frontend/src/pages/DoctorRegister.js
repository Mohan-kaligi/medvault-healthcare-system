import { useState } from "react";
import axios from "axios";
import "./auth.css";
import { useNavigate } from "react-router-dom";

export default function DoctorRegister() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    experienceYears: "",
    hospitalName: "",
    licenseNumber: "",
    declarationAccepted: false,
  });

  const [files, setFiles] = useState({
    degreeCert: null,
    registrationCert: null,
    experienceCert: null,
    idProof: null,
    photo: null,
  });

  const [errors, setErrors] = useState({});

  // -------------------------------
  // Handle text input changes
  // -------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  // -------------------------------
  // Handle file uploads
  // -------------------------------
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    setFiles({
      ...files,
      [name]: selectedFiles[0],
    });

    setErrors({ ...errors, [name]: "" });
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z ]{3,}$/.test(form.fullName))
      newErrors.fullName = "Enter a valid full name";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter valid email";

    if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter valid 10-digit phone number";

    if (!form.specialization)
      newErrors.specialization = "Enter specialization";

    if (!(form.experienceYears >= 1 && form.experienceYears <= 60))
      newErrors.experienceYears = "Experience must be 1–60 years";

    if (form.hospitalName.length < 2)
      newErrors.hospitalName = "Enter valid hospital name";

    if (!/^[A-Za-z0-9]{6,}$/.test(form.licenseNumber))
      newErrors.licenseNumber = "License must be at least 6 characters";

    // File validations
    if (!files.degreeCert) newErrors.degreeCert = "Upload MBBS certificate";
    if (!files.registrationCert)
      newErrors.registrationCert = "Upload Registration certificate";
    if (!files.experienceCert)
      newErrors.experienceCert = "Upload Experience certificate";
    if (!files.idProof) newErrors.idProof = "Upload ID proof";
    if (!files.photo) newErrors.photo = "Upload passport photo";

    if (!form.declarationAccepted)
      newErrors.declarationAccepted = "You must accept the declaration";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // Submit Handler 
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();

    // User JSON
    const userData = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
    };

    // Doctor JSON
    const doctorData = {
      specialization: form.specialization,
      experienceYears: form.experienceYears,
      hospitalName: form.hospitalName,
      licenseNumber: form.licenseNumber,
      declarationAccepted: form.declarationAccepted,
    };

    formData.append("user", JSON.stringify(userData));
    formData.append("doctor", JSON.stringify(doctorData));

    // Append all files
    formData.append("degreeCert", files.degreeCert);
    formData.append("registrationCert", files.registrationCert);
    formData.append("experienceCert", files.experienceCert);
    formData.append("idProof", files.idProof);
    formData.append("photo", files.photo);
   

    try {
      await axios.post(
        "http://localhost:8080/api/auth/doctor/register",   // ✔ FIXED ENDPOINT
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Doctor registration submitted! Await admin approval.");
      
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed Please check the Details!");
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card large">
        <h2>Doctor Registration Request</h2>

        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}

          {/* EMAIL */}
          <input name="email" placeholder="Email" onChange={handleChange} />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* PHONE */}
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          {/* SPECIALIZATION */}
          <input
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
          />
          {errors.specialization && <p className="error-text">{errors.specialization}</p>}

          {/* EXPERIENCE */}
          <input
            name="experienceYears"
            type="number"
            placeholder="Years of Experience"
            onChange={handleChange}
          />
          {errors.experienceYears && (
            <p className="error-text">{errors.experienceYears}</p>
          )}

          {/* HOSPITAL */}
          <input
            name="hospitalName"
            placeholder="Hospital Name"
            onChange={handleChange}
          />
          {errors.hospitalName && <p className="error-text">{errors.hospitalName}</p>}

          {/* LICENSE NUMBER */}
          <input
            name="licenseNumber"
            placeholder="License Number"
            onChange={handleChange}
          />
          {errors.licenseNumber && (
            <p className="error-text">{errors.licenseNumber}</p>
          )}

          {/* FILE UPLOADS */}
          <label>MBBS Degree Certificate</label>
          <input type="file" name="degreeCert" onChange={handleFileChange} />
          {errors.degreeCert && <p className="error-text">{errors.degreeCert}</p>}

          <label>Registration Certificate</label>
          <input type="file" name="registrationCert" onChange={handleFileChange} />
          {errors.registrationCert && (
            <p className="error-text">{errors.registrationCert}</p>
          )}

          <label>Experience Certificate</label>
          <input type="file" name="experienceCert" onChange={handleFileChange} />
          {errors.experienceCert && (
            <p className="error-text">{errors.experienceCert}</p>
          )}

          <label>ID Proof</label>
          <input type="file" name="idProof" onChange={handleFileChange} />
          {errors.idProof && <p className="error-text">{errors.idProof}</p>}

          <label>Passport Photo</label>
          <input type="file" name="photo" onChange={handleFileChange} />
          {errors.photo && <p className="error-text">{errors.photo}</p>}

          {/* DECLARATION */}
          <div className="declaration-box">
            <input
              type="checkbox"
              name="declarationAccepted"
              onChange={handleChange}
            />
            <span>I declare the information is true</span>
          </div>
          {errors.declarationAccepted && (
            <p className="error-text">{errors.declarationAccepted}</p>
          )}

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
