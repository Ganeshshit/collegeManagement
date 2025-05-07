import React, { useState } from 'react';
import '../styles/Header.css';
import '../styles/Layout.css';
import '../styles/Components.css';
import fmsLogo from '../assets/fms-logo.svg';
import DarkModeToggle from './DarkModeToggle';

function Header({ title, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="dashboard-header">
      <div className="header-branding">
        <div className="fms-logo">
          <img src={fmsLogo} alt="Faculty Management System" className="fms-logo-image" />
        </div>
        <h1 className="dashboard-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-actions">
          <DarkModeToggle showLabel={true} />

          <div className="notification-bell">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </div>
        </div>

        {user && (
          <div className="dashboard-user-info">
            <div className="user-avatar" onClick={toggleUserMenu}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className="user-details">
              <span className="dashboard-username">
                {user.firstName} {user.lastName}
              </span>
              <span className="user-role">{user.role}</span>
            </div>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <span className="user-dropdown-name">{user.firstName} {user.lastName}</span>
                  <span className="user-dropdown-email">{user.email}</span>
                </div>
                <div className="user-dropdown-divider"></div>
                <ul className="user-dropdown-menu">
                  <li className="user-dropdown-item">
                    <span className="user-dropdown-icon">👤</span>
                    <span>My Profile</span>
                  </li>
                  <li className="user-dropdown-item">
                    <span className="user-dropdown-icon">⚙️</span>
                    <span>Settings</span>
                  </li>
                  <li className="user-dropdown-item">
                    <span className="user-dropdown-icon">📊</span>
                    <span>Activity Log</span>
                  </li>
                  <li className="user-dropdown-divider"></li>
                  <li className="user-dropdown-item logout-item" onClick={onLogout}>
                    <span className="user-dropdown-icon">⏻</span>
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}

            <button className="logout-button" onClick={onLogout}>
              <span className="logout-icon">⏻</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
