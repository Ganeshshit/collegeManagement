import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../styles/global.css';
import '../styles/Navigation.css';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'student',
    department: '',
    specialization: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const studentsResponse = await fetch('http://localhost:5000/api/students');
      const studentsData = await studentsResponse.json();
      setStudents(studentsData);

      const facultyResponse = await fetch('http://localhost:5000/api/faculty');
      const facultyData = await facultyResponse.json();
      setFaculty(facultyData);

      const trainersResponse = await fetch('http://localhost:5000/api/trainers');
      const trainersData = await trainersResponse.json();
      setTrainers(trainersData);

      const coursesResponse = await fetch('http://localhost:5000/api/courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    try {
      logout(); // Clear storage in api service
      onLogout(); // Update app state
      navigate('/login', { replace: true }); // Redirect to login
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      ...(editMode ? { id: editId } : { id: Date.now() }),
      ...formData
    };

    try {
      const url = `http://localhost:5000/api/${selectedRole}s${editMode ? `/${editId}` : ''}`;
      const method = editMode ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Failed to save user');

      // Update state based on role
      if (selectedRole === 'student') {
        if (editMode) {
          setStudents(students.map(s => s.id === editId ? userData : s));
        } else {
          setStudents([...students, userData]);
        }
      } else if (selectedRole === 'faculty') {
        if (editMode) {
          setFaculty(faculty.map(f => f.id === editId ? userData : f));
        } else {
          setFaculty([...faculty, userData]);
        }
      } else if (selectedRole === 'trainer') {
        if (editMode) {
          setTrainers(trainers.map(t => t.id === editId ? userData : t));
        } else {
          setTrainers([...trainers, userData]);
        }
      }

      setShowAddModal(false);
      setEditMode(false);
      setEditId(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'student',
        department: '',
        specialization: ''
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (item, type) => {
    setEditMode(true);
    setEditId(item.id);
    setSelectedRole(type.slice(0, -1)); // Remove 's' from end
    setFormData({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      role: type.slice(0, -1),
      department: item.department || '',
      specialization: item.specialization || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id, type) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${type}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete');

      // Update state based on type
      if (type === 'students') {
        setStudents(students.filter(s => s.id !== id));
      } else if (type === 'faculty') {
        setFaculty(faculty.filter(f => f.id !== id));
      } else if (type === 'trainers') {
        setTrainers(trainers.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <nav className="nav-tabs">
          <div 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </div>
          <div 
            className={`nav-tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </div>
          <div 
            className={`nav-tab ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            Faculty
          </div>
          <div 
            className={`nav-tab ${activeTab === 'trainers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainers')}
          >
            Trainers
          </div>
          <div 
            className={`nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Click to logout"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <div className="overview-card-header">
                  <h3>Total Students</h3>
                  <span className="count">{students.length}</span>
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-card-header">
                  <h3>Total Faculty</h3>
                  <span className="count">{faculty.length}</span>
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-card-header">
                  <h3>Total Trainers</h3>
                  <span className="count">{trainers.length}</span>
                </div>
              </div>
              <div className="overview-card">
                <div className="overview-card-header">
                  <h3>Total Courses</h3>
                  <span className="count">{courses.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="user-management-section">
            <div className="section-header">
              <h2>Students</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedRole('student');
                  setShowAddModal(true);
                }}
              >
                Add Student
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.department}</td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleEdit(student, 'students')}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{marginLeft: '0.5rem'}}
                          onClick={() => handleDelete(student.id, 'students')}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="user-management-section">
            <div className="section-header">
              <h2>Faculty</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedRole('faculty');
                  setShowAddModal(true);
                }}
              >
                Add Faculty
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((member) => (
                    <tr key={member.id}>
                      <td>{member.firstName} {member.lastName}</td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                      <td>{member.department}</td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleEdit(member, 'faculty')}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{marginLeft: '0.5rem'}}
                          onClick={() => handleDelete(member.id, 'faculty')}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'trainers' && (
          <div className="user-management-section">
            <div className="section-header">
              <h2>Trainers</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedRole('trainer');
                  setShowAddModal(true);
                }}
              >
                Add Trainer
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((trainer) => (
                    <tr key={trainer.id}>
                      <td>{trainer.firstName} {trainer.lastName}</td>
                      <td>{trainer.email}</td>
                      <td>{trainer.phone}</td>
                      <td>{trainer.specialization}</td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleEdit(trainer, 'trainers')}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{marginLeft: '0.5rem'}}
                          onClick={() => handleDelete(trainer.id, 'trainers')}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="user-management-section">
            <div className="section-header">
              <h2>Course Management</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedRole('course');
                  setShowAddModal(true);
                }}
              >
                Add Course
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Department</th>
                    <th>Duration</th>
                    <th>Instructor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>{course.department}</td>
                      <td>{course.duration}</td>
                      <td>{course.instructor}</td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleEdit(course, 'courses')}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{marginLeft: '0.5rem'}}
                          onClick={() => handleDelete(course.id, 'courses')}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setEditMode(false);
                  setEditId(null);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    role: 'student',
                    department: '',
                    specialization: ''
                  });
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              <form onSubmit={handleSubmit}>
                <h2>{editMode ? `Edit ${selectedRole}` : `Add New ${selectedRole}`}</h2>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                {selectedRole !== 'course' && (
                  <div className="form-group">
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ddd'
                      }}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                )}
                {selectedRole === 'trainer' && (
                  <div className="form-group">
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ddd'
                      }}
                    >
                      <option value="">Select Specialization</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                )}
                <div className="modal-actions">
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditMode(false);
                        setEditId(null);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          role: 'student',
                          department: '',
                          specialization: ''
                        });
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px'
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px'
                      }}
                    >
                      {editMode ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
