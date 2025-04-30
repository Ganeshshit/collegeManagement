import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import Header from './Header';
import '../App.css';

function AdminDashboard({ user, onLogout }) {
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
      // Use the real API service
      console.log('Fetching users from API');
      const data = await getUsers();
      console.log('Fetched users:', data);

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
        // Use the real API service
        console.log('Deleting user with ID:', userId);
        await deleteUser(userId);

        // Update the UI after successful deletion
        setUsers(users.filter(user => user._id !== userId));
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
        // Use the real API service for updating
        console.log('Updating user with ID:', editingUser._id, 'and data:', formData);
        const updatedUser = await updateUser(editingUser._id, formData);

        // Update the UI with the response from the API
        setUsers(users.map(user =>
          user._id === editingUser._id ? updatedUser : user
        ));
        setSuccess('User updated successfully');
      } else {
        // Use the real API service for creating
        console.log('Creating new user with data:', formData);
        const newUser = await createUser(formData);

        // Add the new user to the UI
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
              className={`dashboard-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </li>
            <li
              className={`dashboard-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </li>
            <li
              className={`dashboard-nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              Course Management
            </li>
            <li
              className={`dashboard-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
            <li className="dashboard-nav-tab">
              <Link to="/reports" style={{ color: 'inherit', textDecoration: 'none' }}>
                Reports
              </Link>
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

        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Total Users</h3>
                  <div className="dashboard-card-icon">👥</div>
                </div>
                <div className="dashboard-card-value">{users.length}</div>
                <div className="dashboard-card-description">All registered users in the system</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Students</h3>
                  <div className="dashboard-card-icon">🎓</div>
                </div>
                <div className="dashboard-card-value">
                  {users.filter(u => u.role === 'student').length}
                </div>
                <div className="dashboard-card-description">Registered students</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Faculty</h3>
                  <div className="dashboard-card-icon">👨‍🏫</div>
                </div>
                <div className="dashboard-card-value">
                  {users.filter(u => u.role === 'faculty').length}
                </div>
                <div className="dashboard-card-description">Faculty members</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Trainers</h3>
                  <div className="dashboard-card-icon">👨‍💼</div>
                </div>
                <div className="dashboard-card-value">
                  {users.filter(u => u.role === 'trainer').length}
                </div>
                <div className="dashboard-card-description">Training staff</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Recent Users</h2>
                <div className="table-actions">
                  <button className="btn btn-accent" onClick={handleAddUser}>Add New User</button>
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
                  {users.slice(0, 5).map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor:
                              user.role === 'admin' ? '#f44336' :
                              user.role === 'faculty' ? '#2196f3' :
                              user.role === 'trainer' ? '#ff9800' :
                              '#4caf50',
                            color: 'white',
                            fontSize: '12px',
                            textTransform: 'capitalize'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button className="table-action-button" onClick={() => handleEditUser(user)}>Edit</button>
                        <button className="table-action-button delete-button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">User Management</h2>
              <div className="table-actions">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="form-control"
                  style={{ width: '250px', marginRight: '16px' }}
                />
                <button className="btn btn-accent" onClick={handleAddUser}>Add New User</button>
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
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            user.role === 'admin' ? '#f44336' :
                            user.role === 'faculty' ? '#2196f3' :
                            user.role === 'trainer' ? '#ff9800' :
                            '#4caf50',
                          color: 'white',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="table-action-button" onClick={() => handleEditUser(user)}>Edit</button>
                      <button className="table-action-button delete-button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Course Management</h2>
              <div className="table-actions">
                <button className="btn btn-accent">Add New Course</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CS101</td>
                  <td>Introduction to Computer Science</td>
                  <td>Computer Science</td>
                  <td>3</td>
                  <td>Dr. Smith</td>
                  <td>
                    <button className="table-action-button">Edit</button>
                    <button className="table-action-button delete-button">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>CS201</td>
                  <td>Data Structures</td>
                  <td>Computer Science</td>
                  <td>4</td>
                  <td>Dr. Johnson</td>
                  <td>
                    <button className="table-action-button">Edit</button>
                    <button className="table-action-button delete-button">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>CS301</td>
                  <td>Database Systems</td>
                  <td>Computer Science</td>
                  <td>3</td>
                  <td>Dr. Williams</td>
                  <td>
                    <button className="table-action-button">Edit</button>
                    <button className="table-action-button delete-button">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="form-container">
            <h2 className="form-title">Admin Profile</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.firstName}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.lastName}
                  readOnly
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.username}
                  readOnly
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.role}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Access Level</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.adminInfo?.accessLevel || 'Full'}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmitUser}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
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
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      name="role"
                      className="form-control"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password {editingUser && '(Leave blank to keep current)'}</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent" disabled={loading}>
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
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
