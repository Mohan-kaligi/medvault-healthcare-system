import { useState } from "react";
import "../admin-styles.css";

export default function AdminNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">

        {/* Logo Left */}
        <div className="admin-nav-logo">
          <span className="logo-icon">MV</span>
          <span className="logo-text">MedVault Admin</span>
        </div>

        {/* Profile Dropdown Right */}
        <div className="admin-profile-wrapper">
          <div className="admin-profile-btn" onClick={() => setOpen(!open)}>
            <div className="admin-avatar">AD</div>
            <div className="admin-profile-info">
              <span className="admin-name">Admin</span>
              <span className="admin-role">Administrator</span>
            </div>
            <span className="admin-arrow">▼</span>
          </div>

          {open && (
  <div className="admin-profile-dropdown">
    <button className="dropdown-item">👤 View Profile</button>
    <button className="dropdown-item logout-btn">🚪 Logout</button>
  </div>
)}

        </div>

      </div>
    </nav>
  );
}
