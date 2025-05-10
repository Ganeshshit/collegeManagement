import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Login.css';
import mediniLogo from '../assets/client-1.png';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Validate input length
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login(trimmedUsername, trimmedPassword);
      if (!response) {
        throw new Error('No response from login service');
      }
      console.log('Login response:', response);
      onLogin(response.user);
      navigate('/');
    } catch (err) {
      console.error('Full login error:', err);
      
      if (err.response) {
        console.error('Response error details:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        console.error('Request error:', err.request);
        setError('No response from server. Please check your network connection.');
      } else {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
  );
}

export default Login;
