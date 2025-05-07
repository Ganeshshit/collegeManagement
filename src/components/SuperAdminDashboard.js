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
              <button 
                className="btn btn-accent" 
                onClick={handleAddAdmin}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: '2px solid #4f46e5',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '18px' }}>+</span> Add New User
              </button>
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
        <div className="modal-backdrop" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
          <div className="modal" style={{ position: 'relative', margin: 'auto', width: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', backgroundColor: 'white', maxHeight: '90vh', overflow: 'hidden' }}>
            <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{editingAdmin ? 'Edit User' : 'Add New User'}</h2>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#666' }} 
                onClick={() => setShowAddAdminModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitAdmin}>
              <div className="modal-body" style={{ padding: '20px' }}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {!editingAdmin && (
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingAdmin}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Minimum 6 characters</div>
                </div>
              )}
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23333\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="trainer">Trainer</option>
                  <option value="student">Student</option>
                </select>
              </div>
              
              </div>
              <div className="modal-footer" style={{
                padding: '15px 20px',
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid #eee',
                gap: '10px'
              }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddAdminModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-accent" 
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
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
