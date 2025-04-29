import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../App.css';

function FacultyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    // Mock data - in a real app, you would fetch this from your API
    setCourses([
      { id: 1, code: 'CS101', name: 'Introduction to Computer Science', students: 45, schedule: 'Mon, Wed 10:00-11:30' },
      { id: 2, code: 'CS201', name: 'Data Structures', students: 38, schedule: 'Tue, Thu 13:00-14:30' },
      { id: 3, code: 'CS301', name: 'Database Systems', students: 32, schedule: 'Mon, Fri 15:00-16:30' },
    ]);

    setStudents([
      { id: 1, name: 'John Doe', rollNumber: 'CS2021001', course: 'CS101', attendance: '85%', performance: 'Good', email: 'john.doe@example.com', phone: '555-123-4567' },
      { id: 2, name: 'Jane Smith', rollNumber: 'CS2021002', course: 'CS101', attendance: '92%', performance: 'Excellent', email: 'jane.smith@example.com', phone: '555-234-5678' },
      { id: 3, name: 'Mike Johnson', rollNumber: 'CS2021003', course: 'CS201', attendance: '78%', performance: 'Average', email: 'mike.johnson@example.com', phone: '555-345-6789' },
      { id: 4, name: 'Emily Brown', rollNumber: 'CS2021004', course: 'CS201', attendance: '90%', performance: 'Good', email: 'emily.brown@example.com', phone: '555-456-7890' },
      { id: 5, name: 'Alex Wilson', rollNumber: 'CS2021005', course: 'CS301', attendance: '95%', performance: 'Excellent', email: 'alex.wilson@example.com', phone: '555-567-8901' },
      { id: 6, name: 'Sarah Davis', rollNumber: 'CS2021006', course: 'CS101', attendance: '88%', performance: 'Good', email: 'sarah.davis@example.com', phone: '555-678-9012' },
      { id: 7, name: 'David Miller', rollNumber: 'CS2021007', course: 'CS201', attendance: '82%', performance: 'Good', email: 'david.miller@example.com', phone: '555-789-0123' },
      { id: 8, name: 'Lisa Taylor', rollNumber: 'CS2021008', course: 'CS301', attendance: '91%', performance: 'Excellent', email: 'lisa.taylor@example.com', phone: '555-890-1234' },
    ]);

    setReports([
      { id: 1, title: 'Mid-term Performance Report', course: 'CS101', date: '2025-03-15', status: 'Completed' },
      { id: 2, title: 'Attendance Summary', course: 'CS101', date: '2025-04-01', status: 'Completed' },
      { id: 3, title: 'Project Evaluation', course: 'CS201', date: '2025-03-22', status: 'Completed' },
      { id: 4, title: 'Final Exam Results', course: 'CS301', date: '2025-04-10', status: 'Pending' },
    ]);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="dashboard-container">
      <Header title="Faculty Dashboard" user={user} onLogout={onLogout} />

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
              className={`dashboard-nav-tab ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
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
                  <h3 className="dashboard-card-title">My Courses</h3>
                  <div className="dashboard-card-icon">📚</div>
                </div>
                <div className="dashboard-card-value">{courses.length}</div>
                <div className="dashboard-card-description">Total courses you are teaching</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Students</h3>
                  <div className="dashboard-card-icon">👨‍🎓</div>
                </div>
                <div className="dashboard-card-value">
                  {students.length}
                </div>
                <div className="dashboard-card-description">Students under your courses</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Upcoming Classes</h3>
                  <div className="dashboard-card-icon">🗓️</div>
                </div>
                <div className="dashboard-card-value">
                  2
                </div>
                <div className="dashboard-card-description">Classes scheduled for today</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Reports</h3>
                  <div className="dashboard-card-icon">📊</div>
                </div>
                <div className="dashboard-card-value">
                  {reports.length}
                </div>
                <div className="dashboard-card-description">Available reports</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Today's Schedule</h2>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Time</th>
                    <th>Students</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CS101</td>
                    <td>Introduction to Computer Science</td>
                    <td>10:00 - 11:30</td>
                    <td>45</td>
                  </tr>
                  <tr>
                    <td>CS301</td>
                    <td>Database Systems</td>
                    <td>15:00 - 16:30</td>
                    <td>32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">My Courses</h2>
              <div className="table-actions">
                <button className="btn btn-accent">Add New Course</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Students</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.students}</td>
                    <td>{course.schedule}</td>
                    <td>
                      <button className="table-action-button">View</button>
                      <button className="table-action-button">Edit</button>
                      <button className="table-action-button delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Students</h2>
              <div className="table-actions">
                <select 
                  className="form-control" 
                  style={{ width: '150px', marginRight: '10px' }}
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.code}>{course.code}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="form-control" 
                  style={{ width: '250px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Course</th>
                  <th>Attendance</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.course}</td>
                    <td>{student.attendance}</td>
                    <td>
                      <span 
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: 
                            student.performance === 'Excellent' ? '#4caf50' : 
                            student.performance === 'Good' ? '#2196f3' : 
                            student.performance === 'Average' ? '#ff9800' : '#f44336',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      >
                        {student.performance}
                      </span>
                    </td>
                    <td>
                      <button className="table-action-button" onClick={() => alert(`Viewing details for ${student.name}`)}>View</button>
                      <button className="table-action-button" onClick={() => alert(`Grading ${student.name}`)}>Grade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No students found matching your search criteria.
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Attendance Reports</h3>
                  <div className="dashboard-card-icon">📋</div>
                </div>
                <div className="dashboard-card-value">2</div>
                <div className="dashboard-card-description">View attendance reports</div>
                <button className="btn btn-sm" style={{ marginTop: '10px' }}>View Reports</button>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Performance Reports</h3>
                  <div className="dashboard-card-icon">📈</div>
                </div>
                <div className="dashboard-card-value">1</div>
                <div className="dashboard-card-description">View performance reports</div>
                <button className="btn btn-sm" style={{ marginTop: '10px' }}>View Reports</button>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Exam Results</h3>
                  <div className="dashboard-card-icon">🎓</div>
                </div>
                <div className="dashboard-card-value">1</div>
                <div className="dashboard-card-description">View exam results</div>
                <button className="btn btn-sm" style={{ marginTop: '10px' }}>View Reports</button>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Available Reports</h2>
                <div className="table-actions">
                  <select className="form-control" style={{ width: '150px' }}>
                    <option value="all">All Reports</option>
                    <option value="attendance">Attendance</option>
                    <option value="performance">Performance</option>
                    <option value="exams">Exams</option>
                  </select>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Report Title</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{report.course}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>
                        <span 
                          style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: report.status === 'Completed' ? '#4caf50' : '#ff9800',
                            color: 'white',
                            fontSize: '12px'
                          }}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <button className="table-action-button">View</button>
                        <button className="table-action-button">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="form-container">
            <h2 className="form-title">Faculty Profile</h2>
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
                <label>Employee ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.facultyInfo?.employeeId || 'FAC001'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.facultyInfo?.department || 'Computer Science'} 
                  readOnly 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Designation</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.facultyInfo?.designation || 'Professor'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.facultyInfo?.specialization || 'Artificial Intelligence'} 
                  readOnly 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
