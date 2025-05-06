import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { 
  getStudentProfile, 
  updateStudentProfile, 
  getStudentAttendance,
  getDetailedStudentAttendance 
} from '../services/api';
import '../App.css';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [detailedAttendance, setDetailedAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourseAttendance, setSelectedCourseAttendance] = useState(null);
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
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        // Fetch standard attendance
        const attendanceData = await getStudentAttendance(user?.id);
        setAttendance(attendanceData);

        // Fetch detailed attendance
        const detailedData = await getDetailedStudentAttendance(user?.id);
        setDetailedAttendance(detailedData);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    // Existing mock data setup
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

    if (user?.id) {
      fetchAttendanceData();
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

  const handleCourseAttendanceDetails = (course) => {
    setSelectedCourseAttendance(course);
  };

  const closeCourseAttendanceDetails = () => {
    setSelectedCourseAttendance(null);
  };

  return (
    <div className="dashboard-container">
      <Header title="Student Dashboard" user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <ul className="dashboard-nav-tabs">
            <li 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </li>
            <li 
              className={activeTab === 'attendance' ? 'active' : ''}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </li>
            <li 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
          </ul>
        </nav>

        {activeTab === 'overview' && (
          <div className="dashboard-section overview-section">
            <h2>My Courses</h2>
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.code} - {course.name}</h3>
                  <p>Instructor: {course.instructor}</p>
                  <p>Credits: {course.credits}</p>
                </div>
              ))}
            </div>

            <h2>Assignments</h2>
            <div className="assignments-list">
              {assignments.map(assignment => (
                <div key={assignment.id} className="assignment-card">
                  <h3>{assignment.title}</h3>
                  <p>Course: {assignment.course}</p>
                  <p>Due Date: {assignment.dueDate}</p>
                  <p>Status: {assignment.status} {assignment.grade && `(${assignment.grade})`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="dashboard-section attendance-section">
            {detailedAttendance && (
              <div className="attendance-summary-overview">
                <h2>Attendance Overview</h2>
                <div className="attendance-summary-stats">
                  <div className="summary-card">
                    <h3>Total Courses</h3>
                    <p>{detailedAttendance.overall.totalCourses}</p>
                  </div>
                  <div className="summary-card">
                    <h3>Average Attendance</h3>
                    <p>{detailedAttendance.overall.averageAttendance.toFixed(2)}%</p>
                  </div>
                  <div className="summary-card">
                    <h3>Courses with Warning</h3>
                    <p>{detailedAttendance.overall.coursesWithWarning}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="attendance-grid">
              {attendance.map(course => (
                <div 
                  key={course.id} 
                  className={`attendance-card ${course.percentage < 75 ? 'low-attendance' : ''}`}
                  onClick={() => handleCourseAttendanceDetails(course)}
                >
                  <h3>{course.code} - {course.name}</h3>
                  <div className="attendance-details">
                    <div className="attendance-stats">
                      <p>Total Classes: {course.totalClasses}</p>
                      <p>Attended Classes: {course.attendedClasses}</p>
                    </div>
                    <div className="attendance-percentage">
                      <div 
                        className="attendance-bar" 
                        style={{
                          width: `${course.percentage}%`, 
                          backgroundColor: course.percentage >= 75 ? '#4CAF50' : '#FF5722'
                        }}
                      >
                        <span>{course.percentage.toFixed(2)}%</span>
                      </div>
                    </div>
                    {course.percentage < 75 && (
                      <div className="attendance-warning">
                        ⚠️ Low Attendance Alert
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Attendance Modal */}
            {selectedCourseAttendance && (
              <div className="attendance-modal">
                <div className="attendance-modal-content">
                  <h2>{selectedCourseAttendance.code} - {selectedCourseAttendance.name} Attendance</h2>
                  <div className="attendance-modal-details">
                    <div className="attendance-summary">
                      <p>Total Classes: {selectedCourseAttendance.totalClasses}</p>
                      <p>Attended Classes: {selectedCourseAttendance.attendedClasses}</p>
                      <p>Attendance Percentage: {selectedCourseAttendance.percentage.toFixed(2)}%</p>
                      <p>Status: {selectedCourseAttendance.attendanceStatus}</p>
                    </div>
                    {selectedCourseAttendance.details && (
                      <div className="attendance-record-list">
                        <h3>Detailed Attendance Record</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Topic</th>
                              <th>Reason (if Absent)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCourseAttendance.details.map((record, index) => (
                              <tr 
                                key={index} 
                                className={record.status === 'Present' ? 'present' : 'absent'}
                              >
                                <td>{record.date}</td>
                                <td>{record.status}</td>
                                <td>{record.topic}</td>
                                <td>{record.reason || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <button 
                    className="close-modal-btn" 
                    onClick={closeCourseAttendanceDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-section profile-section">
            <h2>My Profile</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              {profileSaved && <div className="success-message">Profile saved successfully!</div>}
              {profileError && <div className="error-message">{profileError}</div>}
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={profileData.firstName} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={profileData.lastName} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>College</label>
                  <input 
                    type="text" 
                    name="college" 
                    value={profileData.college} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>USN (University Seat Number)</label>
                  <input 
                    type="text" 
                    name="usn" 
                    value={profileData.usn} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Course</label>
                  <input 
                    type="text" 
                    name="course" 
                    value={profileData.course} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <input 
                    type="text" 
                    name="branch" 
                    value={profileData.branch} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Year</label>
                  <select 
                    name="year" 
                    value={profileData.year} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Batch Number</label>
                  <input 
                    type="text" 
                    name="batchNo" 
                    value={profileData.batchNo} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{ width: '100%' }}>
                  <label>About Me</label>
                  <textarea 
                    name="about" 
                    value={profileData.about} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                    rows="4"
                  ></textarea>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Certifications</label>
                  <textarea 
                    name="certifications" 
                    value={profileData.certifications} 
                    onChange={handleProfileChange} 
                    disabled={!isEditingProfile}
                    rows="4"
                    placeholder="List your certifications, one per line"
                  ></textarea>
                </div>
              </div>
              
              {isEditingProfile ? (
                <button type="submit" className="btn-save-profile">Save Profile</button>
              ) : (
                <button 
                  type="button" 
                  className="btn-edit-profile"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
