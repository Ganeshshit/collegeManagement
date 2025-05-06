import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import AttendanceSystem from './AttendanceSystem';
import '../App.css';

function TrainerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [trainings, setTrainings] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  useEffect(() => {
    // Mock data - in a real app, you would fetch this from your API
    setTrainings([
      { id: 1, title: 'Web Development Fundamentals', duration: '4 weeks', participants: 25, status: 'Ongoing' },
      { id: 2, title: 'Mobile App Development', duration: '6 weeks', participants: 18, status: 'Upcoming' },
      { id: 3, title: 'Advanced JavaScript', duration: '3 weeks', participants: 22, status: 'Completed' },
    ]);

    setParticipants([
      { id: 1, name: 'John Doe', department: 'IT', training: 'Web Development Fundamentals', progress: '65%' },
      { id: 2, name: 'Jane Smith', department: 'CS', training: 'Web Development Fundamentals', progress: '78%' },
      { id: 3, name: 'Mike Johnson', department: 'IT', training: 'Advanced JavaScript', progress: '92%' },
      { id: 4, name: 'Emily Brown', department: 'CS', training: 'Mobile App Development', progress: '0%' },
      { id: 5, name: 'Alex Wilson', department: 'IT', training: 'Web Development Fundamentals', progress: '45%' },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <Header title="Trainer Dashboard" user={user} onLogout={onLogout} />

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
              className={`dashboard-nav-tab ${activeTab === 'trainings' ? 'active' : ''}`}
              onClick={() => setActiveTab('trainings')}
            >
              My Trainings
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
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
            <li className="dashboard-nav-tab">
              <Link to="/reports" style={{ color: 'inherit', textDecoration: 'none' }}>
                Reports
              </Link>
            </li>
          </ul>
        </nav>

        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Total Trainings</h3>
                  <div className="dashboard-card-icon">📊</div>
                </div>
                <div className="dashboard-card-value">{trainings.length}</div>
                <div className="dashboard-card-description">All trainings (ongoing, upcoming, completed)</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Active Participants</h3>
                  <div className="dashboard-card-icon">👨‍🎓</div>
                </div>
                <div className="dashboard-card-value">
                  {participants.filter(p => p.progress !== '0%' && p.progress !== '100%').length}
                </div>
                <div className="dashboard-card-description">Currently active participants</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Ongoing Trainings</h3>
                  <div className="dashboard-card-icon">🔄</div>
                </div>
                <div className="dashboard-card-value">
                  {trainings.filter(t => t.status === 'Ongoing').length}
                </div>
                <div className="dashboard-card-description">Trainings currently in progress</div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Recent Trainings</h2>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Participants</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map(training => (
                    <tr key={training.id}>
                      <td>{training.title}</td>
                      <td>{training.duration}</td>
                      <td>{training.participants}</td>
                      <td>
                        <span 
                          style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: 
                              training.status === 'Ongoing' ? '#4caf50' : 
                              training.status === 'Upcoming' ? '#2196f3' : 
                              '#ff9800',
                            color: 'white',
                            fontSize: '12px'
                          }}
                        >
                          {training.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'trainings' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">My Trainings</h2>
              <div className="table-actions">
                <button className="btn btn-accent">Add New Training</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map(training => (
                  <tr key={training.id}>
                    <td>{training.title}</td>
                    <td>{training.duration}</td>
                    <td>{training.participants}</td>
                    <td>
                      <span 
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: 
                            training.status === 'Ongoing' ? '#4caf50' : 
                            training.status === 'Upcoming' ? '#2196f3' : 
                            '#ff9800',
                          color: 'white',
                          fontSize: '12px'
                        }}
                      >
                        {training.status}
                      </span>
                    </td>
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

        {activeTab === 'participants' && (
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Participants</h2>
              <div className="table-actions">
                <input 
                  type="text" 
                  placeholder="Search participants..." 
                  className="form-control" 
                  style={{ width: '250px' }}
                />
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Training</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(participant => (
                  <tr key={participant.id}>
                    <td>{participant.name}</td>
                    <td>{participant.department}</td>
                    <td>{participant.training}</td>
                    <td>
                      <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', height: '8px' }}>
                        <div 
                          style={{ 
                            width: participant.progress, 
                            backgroundColor: '#ff8c42', 
                            height: '8px',
                            borderRadius: '4px'
                          }} 
                        />
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>{participant.progress}</div>
                    </td>
                    <td>
                      <button className="table-action-button">View</button>
                      <button className="table-action-button">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-container">
            <div className="section-header">
              <h2>Manage Attendance</h2>
              <p>As a trainer, you can view and modify attendance records for all participants.</p>
            </div>
            
            <div className="training-selector">
              <label htmlFor="trainingSelect">Select Training: </label>
              <select 
                id="trainingSelect" 
                value={selectedTraining ? selectedTraining.id : ''}
                onChange={(e) => {
                  const selected = trainings.find(t => t.id === parseInt(e.target.value));
                  setSelectedTraining(selected);
                }}
              >
                <option value="">-- Select a Training --</option>
                {trainings.map(training => (
                  <option key={training.id} value={training.id}>
                    {training.title}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedTraining ? (
              <AttendanceSystem 
                userRole="trainer" 
                courseId={selectedTraining.id} 
                students={participants.filter(p => p.training === selectedTraining.title)}
              />
            ) : (
              <div className="select-training-message">
                <p>Please select a training to view and manage attendance.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="form-container">
            <h2 className="form-title">Trainer Profile</h2>
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
                  value={user.trainerInfo?.employeeId || 'TR001'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.trainerInfo?.experience || '5'} 
                  readOnly 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Specializations</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.trainerInfo?.specializations?.join(', ') || 'Web Development, Mobile Apps'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Qualifications</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={user.trainerInfo?.qualifications?.join(', ') || 'MSc Computer Science, Certified Trainer'} 
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

export default TrainerDashboard;
