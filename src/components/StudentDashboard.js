import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { getStudentProfile, updateStudentProfile } from '../services/api';
import AttendanceSystem from './AttendanceSystem';
import '../App.css';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourseForAttendance, setSelectedCourseForAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    college: '',
    usn: '',
    year: '',
    about: '',
    certifications: '',
    course: '',
    branch: '',
    batchNo: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    // Mock data - in a real app, you would fetch this from your API
    setCourses([
      { id: 1, code: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. Smith', credits: 3 },
      { id: 2, code: 'CS201', name: 'Data Structures', instructor: 'Dr. Johnson', credits: 4 },
      { id: 3, code: 'CS301', name: 'Database Systems', instructor: 'Dr. Williams', credits: 3 },
    ]);

    setAssignments([
      { id: 1, title: 'Algorithm Analysis', course: 'CS201', dueDate: '2025-05-10', status: 'Pending' },
      { id: 2, title: 'Database Design', course: 'CS301', dueDate: '2025-05-15', status: 'Submitted' },
      { id: 3, title: 'Programming Basics', course: 'CS101', dueDate: '2025-04-30', status: 'Graded', grade: 'A' },
    ]);

    // Fetch student profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await getStudentProfile(user?.id);
        if (data) {
          setProfileData(data);
          setIsEditingProfile(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If we can't fetch profile, we'll use the initial state and allow editing
        setIsEditingProfile(true);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileError(null);
    
    try {
      // Send profile data to the API
      await updateStudentProfile(user.id, profileData);
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="Student Dashboard" user={user} onLogout={onLogout} />

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
              className={`dashboard-nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              My Courses
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
          </ul>
        </nav>

        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Enrolled Courses</h3>
                  <div className="dashboard-card-icon">📚</div>
                </div>
                <div className="dashboard-card-value">{courses.length}</div>
                <div className="dashboard-card-description">Total courses you are enrolled in</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Pending Assignments</h3>
                  <div className="dashboard-card-icon">📝</div>
                </div>
                <div className="dashboard-card-value">
                  {assignments.filter(a => a.status === 'Pending').length}
                </div>
                <div className="dashboard-card-description">Assignments due soon</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Completed Assignments</h3>
                  <div className="dashboard-card-icon">✅</div>
                </div>
                <div className="dashboard-card-value">
                  {assignments.filter(a => a.status === 'Submitted' || a.status === 'Graded').length}
                </div>
                <div className="dashboard-card-description">Assignments submitted or graded</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Upcoming Assignments</h2>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Course</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments
                    .filter(a => a.status === 'Pending')
                    .map(assignment => (
                      <tr key={assignment.id}>
                        <td>{assignment.title}</td>
                        <td>{assignment.course}</td>
                        <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                        <td>{assignment.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">My Courses</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Instructor</th>
                  <th>Credits</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.instructor}</td>
                    <td>{course.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-container">
            <div className="section-header">
              <h2>My Attendance</h2>
              <p>View your attendance records for all enrolled courses.</p>
            </div>
            
            <div className="course-selector">
              <label htmlFor="courseSelect">Select Course: </label>
              <select 
                id="courseSelect" 
                value={selectedCourseForAttendance ? selectedCourseForAttendance.id : ''}
                onChange={(e) => {
                  const selected = courses.find(c => c.id === parseInt(e.target.value));
                  setSelectedCourseForAttendance(selected);
                }}
              >
                <option value="">-- Select a Course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code}: {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCourseForAttendance ? (
              <AttendanceSystem 
                userRole="student" 
                courseId={selectedCourseForAttendance.id} 
                students={[{
                  id: user.id,
                  rollNumber: user.studentInfo?.rollNumber || 'S001',
                  name: `${user.firstName} ${user.lastName}`,
                  course: selectedCourseForAttendance.code
                }]}
              />
            ) : (
              <div className="select-course-message">
                <p>Please select a course to view your attendance records.</p>
              </div>
            )}
            
            <div className="attendance-note">
              <p><strong>Note:</strong> If you notice any discrepancies in your attendance records, please contact your course instructor or the academic office.</p>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">My Assignments</h2>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>{assignment.title}</td>
                    <td>{assignment.course}</td>
                    <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td>{assignment.status}</td>
                    <td>{assignment.grade || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="form-container">
            <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="form-title">Student Profile</h2>
              {!isEditingProfile && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsEditingProfile(true)}
                  style={{ marginLeft: 'auto' }}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {profileSaved && (
              <div className="alert alert-success" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                Profile saved successfully!
              </div>
            )}

            {profileError && (
              <div className="alert alert-danger" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                {profileError}
              </div>
            )}

            {loading ? (
              <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner" style={{ 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 2s linear infinite',
                  margin: '0 auto'
                }}></div>
                <p>Loading profile data...</p>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                <div className="form-section">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input 
                        type="text" 
                        id="firstName"
                        name="firstName"
                        className="form-control" 
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
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
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        className="form-control" 
                        value={profileData.email}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        className="form-control" 
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Academic Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="college">College</label>
                      <input 
                        type="text" 
                        id="college"
                        name="college"
                        className="form-control" 
                        value={profileData.college}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="usn">USN (University Seat Number)</label>
                      <input 
                        type="text" 
                        id="usn"
                        name="usn"
                        className="form-control" 
                        value={profileData.usn}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="course">Course</label>
                      <input 
                        type="text" 
                        id="course"
                        name="course"
                        className="form-control" 
                        value={profileData.course}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="branch">Branch</label>
                      <input 
                        type="text" 
                        id="branch"
                        name="branch"
                        className="form-control" 
                        value={profileData.branch}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="year">Year</label>
                      <select 
                        id="year"
                        name="year"
                        className="form-control" 
                        value={profileData.year}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="batchNo">Batch Number</label>
                      <input 
                        type="text" 
                        id="batchNo"
                        name="batchNo"
                        className="form-control" 
                        value={profileData.batchNo}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Additional Information</h3>
                  <div className="form-row">
                    <div className="form-group" style={{ width: '100%' }}>
                      <label htmlFor="about">About Me</label>
                      <textarea 
                        id="about"
                        name="about"
                        className="form-control" 
                        value={profileData.about}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        rows="4"
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ width: '100%' }}>
                      <label htmlFor="certifications">Certifications</label>
                      <textarea 
                        id="certifications"
                        name="certifications"
                        className="form-control" 
                        value={profileData.certifications}
                        onChange={handleProfileChange}
                        readOnly={!isEditingProfile}
                        rows="4"
                        placeholder="List your certifications, one per line"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="form-actions" style={{ marginTop: '20px' }}>
                    <button 
                      type="submit" 
                      className="btn btn-accent" 
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setIsEditingProfile(false)}
                      style={{ marginLeft: '10px' }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
