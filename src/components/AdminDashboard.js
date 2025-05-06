import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import Header from './Header';
import '../App.css';

function AdminDashboard({ user, onLogout }) {
  console.log('AdminDashboard rendered with user:', user);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app, you would use the API service
      // const data = await getUsers();
      
      // Mock data for demonstration
      const data = [
        { id: 1, username: 'student', email: 'student@example.com', firstName: 'Student', lastName: 'User', role: 'student' },
        { id: 2, username: 'faculty', email: 'faculty@example.com', firstName: 'Faculty', lastName: 'Member', role: 'faculty' },
        { id: 3, username: 'trainer', email: 'trainer@example.com', firstName: 'Trainer', lastName: 'Expert', role: 'trainer' },
        { id: 4, username: 'admin', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
      ];
      
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
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

  const handleAddUser = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'student'
    });
    setEditingUser(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      // Don't set password for editing
      password: ''
    });
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // In a real app, you would use the API service
        // await deleteUser(userId);
        
        // Mock deletion
        setUsers(users.filter(user => user.id !== userId));
        setSuccess('User deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      setError('All fields are required');
      return;
    }
    
    if (!editingUser && !formData.password) {
      setError('Password is required for new users');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingUser) {
        // In a real app, you would use the API service
        // await updateUser(editingUser.id, formData);
        
        // Mock update
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...formData } : user
        ));
        setSuccess('User updated successfully');
      } else {
        // In a real app, you would use the API service
        // const response = await createUser(formData);
        
        // Mock creation
        const newUser = {
          id: users.length + 1,
          ...formData
        };
        setUsers([...users, newUser]);
        setSuccess('User created successfully');
      }
      
      setShowAddUserModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(editingUser ? 'Failed to update user' : 'Failed to create user');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="Admin Dashboard" user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <ul className="dashboard-nav-tabs">
            <li 
              className="dashboard-nav-tab active"
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
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="form-control" 
                  style={{ width: '250px', marginRight: '16px', overflow: 'hidden' }}
                />
                <button 
                  className="btn btn-accent" 
                  onClick={handleAddUser}
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
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="table-action-button" onClick={() => handleEditUser(user)}>Edit</button>
                      <button className="table-action-button delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      
      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="modal-backdrop" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal" style={{ position: 'relative', margin: 'auto', width: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
            <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#666' }} 
                onClick={() => setShowAddUserModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitUser}>
              <div className="modal-body" style={{ padding: '20px' }}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
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
                
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
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
                
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
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
                  onClick={() => setShowAddUserModal(false)}
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
                  {loading ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
