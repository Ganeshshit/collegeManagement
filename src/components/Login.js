import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Login.css';
import mediniLogo from '../assets/client-1.png';
import loginImage from '../assets/login1.jpg';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { username, password });
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simple login attempt with exact credentials
      console.log('Attempting login with credentials:', { username, password });
      const response = await login({ username, password });
      
      if (!response) {
        throw new Error('No response from login service');
      }
      
      console.log('Login response:', response);
      
      // Update the user state in App.js
      onLogin(response.user);
      
      // Navigate to root first (which will handle redirection based on role)
      console.log('Navigating to root, which will redirect based on role');
      navigate('/');
      
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated bubbles */}
      <div className="bubble" style={{ left: '5%', animationDelay: '0s', width: '30px', height: '30px' }}></div>
      <div className="bubble" style={{ left: '10%', animationDelay: '1s', width: '15px', height: '15px' }}></div>
      <div className="bubble" style={{ left: '15%', animationDelay: '2s', width: '80px', height: '80px' }}></div>
      <div className="bubble" style={{ left: '20%', animationDelay: '3s', width: '25px', height: '25px' }}></div>
      <div className="bubble" style={{ left: '25%', animationDelay: '4s', width: '35px', height: '35px' }}></div>
      <div className="bubble" style={{ left: '30%', animationDelay: '5s', width: '50px', height: '50px' }}></div>
      <div className="bubble" style={{ left: '35%', animationDelay: '6s', width: '40px', height: '40px' }}></div>
      <div className="bubble" style={{ left: '40%', animationDelay: '7s', width: '20px', height: '20px' }}></div>
      <div className="bubble" style={{ left: '45%', animationDelay: '8s', width: '60px', height: '60px' }}></div>
      <div className="bubble" style={{ left: '50%', animationDelay: '9s', width: '20px', height: '20px' }}></div>
      <div className="bubble" style={{ left: '55%', animationDelay: '10s', width: '45px', height: '45px' }}></div>
      <div className="bubble" style={{ left: '60%', animationDelay: '11s', width: '30px', height: '30px' }}></div>
      <div className="bubble" style={{ left: '65%', animationDelay: '12s', width: '55px', height: '55px' }}></div>
      <div className="bubble" style={{ left: '70%', animationDelay: '13s', width: '25px', height: '25px' }}></div>
      <div className="bubble" style={{ left: '75%', animationDelay: '14s', width: '70px', height: '70px' }}></div>
      <div className="bubble" style={{ left: '80%', animationDelay: '15s', width: '30px', height: '30px' }}></div>
      <div className="bubble" style={{ left: '85%', animationDelay: '16s', width: '40px', height: '40px' }}></div>
      <div className="bubble" style={{ left: '90%', animationDelay: '17s', width: '20px', height: '20px' }}></div>
      <div className="bubble" style={{ left: '95%', animationDelay: '18s', width: '35px', height: '35px' }}></div>
      
      {/* Pulsing shapes */}
      <div className="shape circle" style={{ top: '15%', left: '10%' }}></div>
      <div className="shape square" style={{ top: '80%', left: '20%' }}></div>
      <div className="shape triangle" style={{ top: '30%', left: '80%' }}></div>
      <div className="login-container">
      <div className="login-illustration">
        <img src={loginImage} alt="College Management" className="login-image" />
      </div>
      <div className="login-content">
        <div className="login-logo">
          <img src={mediniLogo} alt="Medini Technologies" />
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={loading}
              required
              className="improved-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={loading}
              required
              className="improved-input"
            />
          </div>
          
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          
          <div className="create-account">
            <a href="#">Create Account</a>
          </div>
        </form>
        
        <div className="divider"></div>
        
        <footer className="login-footer">
          <div className="copyright">
            © 2025 Medini Technologies
          </div>
          
          <div className="test-credentials">
            <h4>Test Credentials:</h4>
            <p>Student: <span className="credential">student/student123</span></p>
            <p>Faculty: <span className="credential">faculty/faculty123</span></p>
            <p>Trainer: <span className="credential">trainer/trainer123</span></p>
            <p>Admin: <span className="credential">admin/admin123</span></p>
            <p>SuperAdmin: <span className="credential">superadmin/super123</span></p>
          </div>
        </footer>
      </div>
      </div>
    </div>
  );
}

export default Login;
