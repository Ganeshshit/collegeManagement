import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Header.css';
import mediniLogo from '../assets/client-1.png';

function Header({ title, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="dashboard-header">
      <div className="header-branding">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="medini-logo">
          <img 
            src={mediniLogo} 
            alt="Medini Technologies" 
            className="medini-logo-image" 
          />
        </div>
        <h1 className="dashboard-title">{title}</h1>
      </div>
      <div className="header-right">
        <motion.div 
          className="settings-icon-container"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Dashboard Settings"
        >
          <i className="fas fa-cog settings-icon"></i>
        </motion.div>
        {user && (
          <div className="dashboard-user-info">
            <span className="dashboard-username">
              Welcome, {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
            </span>
            <button 
              className="logout-button" 
              onClick={(e) => {
                e.preventDefault();
                try {
                  onLogout();
                } catch (error) {
                  console.error('Logout failed:', error);
                  alert('An error occurred during logout. Please try again.');
                }
              }}
            >
              <i className="logout-icon"></i>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul>
            <li><a href="#"><i className="dashboard-icon"></i> Dashboard</a></li>
            <li><a href="#"><i className="users-icon"></i> Users</a></li>
            <li><a href="#"><i className="reports-icon"></i> Reports</a></li>
            <li><a href="#"><i className="settings-icon"></i> Settings</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
