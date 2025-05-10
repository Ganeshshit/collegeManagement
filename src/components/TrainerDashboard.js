import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

function TrainerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [trainings, setTrainings] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <img src="/medini-logo.png" alt="Medini" className="dashboard-logo" />
        <div className="dashboard-header-right">
          <span>Welcome, {user?.firstName || 'Trainer'}</span>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </header>
      
      <nav className="dashboard-nav">
        <ul className="nav-tabs">
            <li 
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </li>
            <li 
              className={`nav-tab ${activeTab === 'trainings' ? 'active' : ''}`}
              onClick={() => setActiveTab('trainings')}
            >
              My Trainings
            </li>
            <li 
              className={`nav-tab ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </li>
            <li 
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
            <li className="nav-tab">
              <Link to="/reports" style={{ color: 'inherit', textDecoration: 'none' }}>
                Reports
              </Link>
            </li>
          </ul>
        </nav>
        <main className="dashboard-content">

        {activeTab === 'overview' && (
          <div>
            <div className="overview-grid">
              <div className="overview-card">
                <div className="overview-card-header">
                  <h3 className="overview-card-title">Total Trainings</h3>
                  <div className="overview-card-icon icon-courses">📊</div>
                </div>
                <div className="overview-card-value">{trainings.length}</div>
                <div className="overview-card-description">All trainings (ongoing, upcoming, completed)</div>
              </div>

              <div className="overview-card">
                <div className="overview-card-header">
                  <h3 className="overview-card-title">Active Participants</h3>
                  <div className="overview-card-icon icon-users">👥</div>
                </div>
                <div className="overview-card-value">
                  {participants.filter(p => p.progress !== '0%' && p.progress !== '100%').length}
                </div>
                <div className="overview-card-description">Currently active participants</div>
              </div>

              <div className="overview-card">
                <div className="overview-card-header">
                  <h3 className="overview-card-title">Completion Rate</h3>
                  <div className="overview-card-icon icon-attendance">📈</div>
                </div>
                <div className="overview-card-value">
                  {Math.round((participants.filter(p => p.progress === '100%').length / participants.length) * 100)}%
                </div>
                <div className="overview-card-description">Average completion rate across all trainings</div>
              </div>

              <div className="overview-card">
                <div className="overview-card-header">
                  <h3 className="overview-card-title">Upcoming Sessions</h3>
                  <div className="overview-card-icon icon-assignments">📅</div>
                </div>
                <div className="overview-card-value">
                  {trainings.filter(t => t.status === 'Upcoming').length}
                </div>
                <div className="overview-card-description">Sessions scheduled for next week</div>
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
            <div className="card" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '600' }}>My Trainings</h2>
                <button className="btn btn-primary">New Training</button>
              </div>
              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Training Title</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Duration</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Participants</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainings.map(training => (
                      <tr key={training.id} style={{ transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{training.title}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{training.duration}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{training.participants}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            backgroundColor: 
                              training.status === 'Ongoing' ? 'var(--success-color)' :
                              training.status === 'Upcoming' ? 'var(--warning-color)' : 'var(--secondary-color)',
                            color: 'white'
                          }}>
                            {training.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                          <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }}>View</button>
                          <button className="btn btn-accent" style={{ padding: '0.4rem 0.8rem' }}>Edit</button>
                          <button className="btn btn-danger" style={{ marginLeft: '0.5rem', padding: '0.4rem 0.8rem' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
        </main>
    </div>
  );
}

export default TrainerDashboard;
