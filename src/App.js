import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/api';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Reports from './components/Reports';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error verifying user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} 
          />
          <Route 
            path="/reports" 
            element={
              user ? <Reports user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={
              user ? (
                (() => {
                  switch (user.role) {
                    case 'student':
                      return <StudentDashboard user={user} onLogout={handleLogout} />;
                    case 'faculty':
                      return <FacultyDashboard user={user} onLogout={handleLogout} />;
                    case 'trainer':
                      return <TrainerDashboard user={user} onLogout={handleLogout} />;
                    case 'admin':
                      return <AdminDashboard user={user} onLogout={handleLogout} />;
                    case 'superadmin':
                      return <SuperAdminDashboard user={user} onLogout={handleLogout} />;
                    default:
                      return <Navigate to="/login" />;
                  }
                })()
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
