import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Login.css';
import fmsLogo from '../assets/fms-logo.svg';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login({ username, password });
      localStorage.setItem('token', response.token);
      onLogin(response.user);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={fmsLogo} alt="Faculty Management System" className="fms-logo-image" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 Faculty Management System</p>
          <div className="test-credentials">
            <div className="test-credentials-header">
              <span className="test-icon">🔑</span>
              <p><strong>Test Credentials</strong></p>
            </div>
            <div className="credentials-grid">
              <div className="credential-item">
                <span className="role-badge student">Student</span>
                <span className="credential-text">student/student123</span>
              </div>
              <div className="credential-item">
                <span className="role-badge faculty">Faculty</span>
                <span className="credential-text">faculty/faculty123</span>
              </div>
              <div className="credential-item">
                <span className="role-badge trainer">Trainer</span>
                <span className="credential-text">trainer/trainer123</span>
              </div>
              <div className="credential-item">
                <span className="role-badge admin">Admin</span>
                <span className="credential-text">admin/admin123</span>
              </div>
              <div className="credential-item">
                <span className="role-badge superadmin">SuperAdmin</span>
                <span className="credential-text">superadmin/super123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
