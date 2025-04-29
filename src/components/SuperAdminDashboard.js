import React, { useState, useEffect } from 'react';
import Header from './Header';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import '../App.css';

function SuperAdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('admins');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get users from the API
      const data = await getUsers();
      console.log('Fetched users:', data);
      
      // Filter only admin and faculty users
      const adminUsers = data.filter(user => 
        user.role === 'admin' || user.role === 'faculty' || user.role === 'trainer' || user.role === 'student'
      );
      
      setAdmins(adminUsers);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddAdmin = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'admin'
    });
    setEditingAdmin(null);
    setShowAddAdminModal(true);
  };

  const handleEditAdmin = (admin) => {
    setFormData({
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      // Don't set password for editing
      password: ''
    });
    setEditingAdmin(admin);
    setShowAddAdminModal(true);
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        setError('');
        await deleteUser(adminId);
        
        // Update the local state
        setAdmins(admins.filter(admin => admin._id !== adminId));
        setSuccess('User deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      setError('All fields are required');
      return;
    }
    
    if (!editingAdmin && !formData.password) {
      setError('Password is required for new users');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      if (editingAdmin) {
        // Update existing admin
        console.log('Updating user:', editingAdmin._id, formData);
        const updatedAdmin = await updateUser(editingAdmin._id, formData);
        console.log('Update response:', updatedAdmin);
        
        setAdmins(admins.map(admin => 
          admin._id === editingAdmin._id ? updatedAdmin : admin
        ));
        setSuccess('User updated successfully');
      } else {
        // Create new admin
        console.log('Creating new user with data:', formData);
        const response = await createUser(formData);
        console.log('Create response:', response);
        
        if (response && response._id) {
          setAdmins([...admins, response]);
          setSuccess('User created successfully');
          setShowAddAdminModal(false);
          setTimeout(() => setSuccess(''), 3000);
          
          // Refresh the admin list to ensure we have the latest data
          fetchAdmins();
        } else {
          throw new Error('Failed to create user. Server response was invalid.');
        }
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="Super Admin Dashboard" user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <ul className="dashboard-nav-tabs">
            <li 
              className={`dashboard-nav-tab ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              User Management
            </li>
          </ul>
        </nav>

        {error && (
          <div className="alert alert-error" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
            {success}
          </div>
        )}

        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">User Management</h2>
            <div className="table-actions">
              <button className="btn btn-accent" onClick={handleAddAdmin}>Add New User</button>
            </div>
          </div>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin._id}>
                    <td>{admin.username}</td>
                    <td>{admin.firstName} {admin.lastName}</td>
                    <td>{admin.email}</td>
                    <td>
                      <span 
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: 
                            admin.role === 'admin' ? '#e3f2fd' : 
                            admin.role === 'faculty' ? '#fff3e0' :
                            admin.role === 'trainer' ? '#e8f5e9' :
                            '#f3e5f5',
                          color: 
                            admin.role === 'admin' ? '#0d47a1' : 
                            admin.role === 'faculty' ? '#e65100' :
                            admin.role === 'trainer' ? '#1b5e20' :
                            '#4a148c'
                        }}
                      >
                        {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => handleEditAdmin(admin)}
                        style={{ marginRight: '8px' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteAdmin(admin._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      No users found. Click "Add New User" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Admin Modal */}
      {showAddAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingAdmin ? 'Edit User' : 'Add New User'}</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowAddAdminModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitAdmin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {!editingAdmin && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingAdmin}
                  />
                  <small>Minimum 6 characters</small>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="trainer">Trainer</option>
                  <option value="student">Student</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddAdminModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-accent"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingAdmin ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
