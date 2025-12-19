

// This is a complete React application for MedVault
// Save this as your main React app (e.g., App.jsx or index.jsx)
import React, { useState } from "react";
import "./styles.css";
import logo from "./assets/logo.png";
import heroImg from "./assets/hero.png";
import { Link } from "react-router-dom";




// Navigation Component
function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
            <img src={logo} alt="MedVault Logo" className="logo-icon" />

          <span className="logo-text">MedVault</span>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/patient/register">Register</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="floating-element element-1">💊</div>
        <div className="floating-element element-2">🔬</div>
        <div className="floating-element element-3">❤️</div>
        <div className="floating-element element-4">⚕️</div>
        <div className="animated-pulse"></div>
        <div className="animated-pulse pulse-2"></div>
      </div>
      <div className="hero-content">
        <h1>Your Digital Health Partner</h1>
        <p>Securely manage your medical records, appointments, and consultations</p>
        <Link to="/patient/register" className="cta-button">
  Get Started
</Link>

        <button
  className="doctor-cta-secondary"
  onClick={() => document.getElementById("doctors").scrollIntoView({ behavior: "smooth" })}
>
  Doctor Registration
</button>
      </div>
      <div className="hero-image">
  <img src={heroImg} alt="MedVault Illustration" className="hero-illustration" />

</div>

    </section>
  )
}

// About Section
function About() {
  return (
    <section className="about" id="about">
      <div className="about-background">
        <div className="floating-molecule mol-1"></div>
        <div className="floating-molecule mol-2"></div>
        <div className="floating-molecule mol-3"></div>
      </div>
      <h2>About MedVault</h2>
      <p className="about-description">
        MedVault is a comprehensive digital medical records and appointment management platform designed to
        revolutionize patient care. We provide secure, accessible healthcare solutions for patients and doctors alike.
      </p>
      <div className="info-cards">
        <div className="info-card card-animation">
          <div className="card-icon">🔒</div>
          <h3>Secure Medical Records</h3>
          <p>Your health data is encrypted and protected with enterprise-grade security</p>
        </div>
        <div className="info-card card-animation">
          <div className="card-icon">👨‍⚕️</div>
          <h3>Easy Doctor Consultations</h3>
          <p>Connect with verified healthcare professionals with just a few clicks</p>
        </div>
        <div className="info-card card-animation">
          <div className="card-icon">📊</div>
          <h3>Patient-Centric Dashboard</h3>
          <p>Manage all your health information in one intuitive, easy-to-use platform</p>
        </div>
      </div>
    </section>
  )
}

// Features Section
function Features() {
  const features = [
    {
      id: 1,
      title: "Secure Medical Records Storage",
      icon: "📁",
      desc: "Store all your medical documents safely in one place",
    },
    {
      id: 2,
      title: "Appointment Booking System",
      icon: "🗓️",
      desc: "Book appointments easily with automated scheduling",
    },
    {
      id: 3,
      title: "Permission-Based Record Sharing",
      icon: "🔐",
      desc: "Control who can access your medical information",
    },
    { id: 4, title: "Medical History Tracking", icon: "📈", desc: "Monitor your health progress over time" },
  ]

  return (
    <section className="features" id="features">
      <div className="features-background">
        <div className="animated-gradient-bg"></div>
      </div>
      <h2>Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={feature.id} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Doctor Section
function DoctorSection() {
  return (
    <section className="doctor-section" id="doctors">
      <div className="doctor-background">
        <div className="heartbeat-pulse"></div>
        <div className="heartbeat-pulse pulse-variant"></div>
      </div>
      <h2>For Doctors</h2>
      <div className="doctor-content">
        <div className="doctor-description">
          <p>Healthcare professionals can leverage MedVault to streamline their practice:</p>
          <ul className="doctor-features">
            <li>✓ Respond to appointment requests efficiently</li>
            <li>✓ Request and access authorized patient medical records</li>
            <li>✓ Manage and organize consultation slots</li>
            <li>✓ View patient details after receiving permission</li>
          </ul>
        </div>
        <button className="doctor-cta" onClick={() => (window.location.href = "/doctor/register")}>Doctor Registration Request</button>
      </div>
    </section>
  )
}

// Hospital List Section
// Doctors Across Hospitals Section
function HospitalList() {
  const hospitals = [
    { id: 1, name: "Apollo Hospitals",  icon: "🏥" },
    { id: 2, name: "Rainbow Children's Hospital",  icon: "🏥" },
    { id: 3, name: "KIMS Hospital", icon: "🏥" },
    { id: 4, name: "NIMS Hospital", icon: "🏥" },
    { id: 5, name: "Fortis Healthcare ", icon: "🏥" },
    { id: 6, name: "Max Healthcare", icon: "🏥" },
    { id: 7, name: "Manipal Hospitals", icon: "🏥" },

    { id: 8, name: "And Many more",  icon: "🏥" }
  ];

  return (
    <section className="hospitals">
      <div className="hospitals-background">
        <div className="floating-hospital float-1">🏥</div>
        <div className="floating-hospital float-2">🏨</div>
        <div className="floating-hospital float-3">💊</div>
      </div>

      <h2>Doctors Across Hospitals</h2>

      <div className="hospital-grid">
        {hospitals.map((hospital, index) => (
          <div
            key={hospital.id}
            className="hospital-card"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="hospital-icon">{hospital.icon}</div>
            <h3>{hospital.name}</h3>
            
          </div>
        ))}
      </div>
    </section>
  );
}


// Security Section

// Contact Section

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 MedVault. All rights reserved.</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
export default function Home() 
 {
  return (
    <div className="app">
      <Navigation />
      <main>
        <section id="home">
          <Hero />
        </section>
        <About />
        <Features />
        <DoctorSection />
        <HospitalList />
        
        
      </main>
      <Footer />

    </div>
  )
}
