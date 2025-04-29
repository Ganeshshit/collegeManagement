import React from 'react';
import '../styles/Header.css';
import mediniLogo from '../assets/medini-logo.svg';

function Header({ title, user, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-branding">
        <div className="medini-logo">
          <img src={mediniLogo} alt="Medini School of Design" className="medini-logo-image" />
        </div>
        <h1 className="dashboard-title">{title}</h1>
      </div>
      <div className="header-right">
        {user && (
          <div className="dashboard-user-info">
            <span className="dashboard-username">
              Welcome, {user.firstName} {user.lastName}
            </span>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
