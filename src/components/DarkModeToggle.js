import React, { useState, useEffect } from 'react';
import '../styles/DarkModeToggle.css';

function DarkModeToggle({ showLabel = false }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    // Check if user has a system preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode && savedMode === null) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        if (e.matches) {
          document.body.classList.add('dark-mode');
          setIsDarkMode(true);
        } else {
          document.body.classList.remove('dark-mode');
          setIsDarkMode(false);
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="theme-switcher">
      {showLabel && <span className="theme-label">{isDarkMode ? 'Dark' : 'Light'}</span>}
      <div className="dark-mode-toggle">
        <input
          type="checkbox"
          id="dark-mode-toggle"
          checked={isDarkMode}
          onChange={toggleDarkMode}
          className="dark-mode-toggle-checkbox"
          aria-label="Toggle dark mode"
        />
        <label htmlFor="dark-mode-toggle" className="dark-mode-toggle-label">
          <span className="dark-mode-toggle-inner"></span>
        </label>
      </div>
    </div>
  );
}

export default DarkModeToggle;
