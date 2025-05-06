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
      console.log('Verifying user...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, not logged in');
        setLoading(false);
        return;
      }

      try {
        console.log('Token found, getting user data...');
        const userData = await getCurrentUser();
        console.log('User data retrieved:', userData);
        if (userData) {
          setUser(userData);
        } else {
          console.log('No user data found, clearing token');
          localStorage.removeItem('token');
        }
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
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const handleLogin = (userData) => {
    console.log('Setting user data in App.js:', userData);
    setUser(userData);
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
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/reports" 
            element={
              user ? <Reports user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          {/* Dashboard routes */}
          <Route path="/student" element={user && user.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/faculty" element={user && user.role === 'faculty' ? <FacultyDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/trainer" element={user && user.role === 'trainer' ? <TrainerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/superadmin" element={user && user.role === 'superadmin' ? <SuperAdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          
          {/* Root route with role-based redirection */}
          <Route 
            path="/" 
            element={
              user ? (
                (() => {
                  console.log('Redirecting based on role:', user.role);
                  switch (user.role) {
                    case 'student':
                      return <Navigate to="/student" />;
                    case 'faculty':
                      return <Navigate to="/faculty" />;
                    case 'trainer':
                      return <Navigate to="/trainer" />;
                    case 'admin':
                      return <Navigate to="/admin" />;
                    case 'superadmin':
                      return <Navigate to="/superadmin" />;
                    default:
                      console.log('Unknown role, redirecting to login');
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
