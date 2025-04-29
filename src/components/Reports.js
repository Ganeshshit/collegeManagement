import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../App.css';

function Reports({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('student');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'student',
    description: '',
    file: null
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewReportModal, setShowViewReportModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const studentReports = [
        { id: 1, title: 'Semester Progress Report', type: 'student', submittedBy: 'John Doe', date: '2025-04-15', status: 'Approved' },
        { id: 2, title: 'Course Completion Certificate', type: 'student', submittedBy: 'Jane Smith', date: '2025-04-10', status: 'Pending' },
        { id: 3, title: 'Project Submission', type: 'student', submittedBy: 'Mike Johnson', date: '2025-04-05', status: 'Rejected' },
      ];
      
      const facultyReports = [
        { id: 4, title: 'Course Evaluation Summary', type: 'faculty', submittedBy: 'Dr. Williams', date: '2025-04-12', status: 'Approved' },
        { id: 5, title: 'Research Progress Report', type: 'faculty', submittedBy: 'Dr. Brown', date: '2025-04-08', status: 'Pending' },
      ];
      
      const trainerReports = [
        { id: 6, title: 'Training Completion Report', type: 'trainer', submittedBy: 'Alex Wilson', date: '2025-04-14', status: 'Approved' },
        { id: 7, title: 'Workshop Feedback Summary', type: 'trainer', submittedBy: 'Sarah Davis', date: '2025-04-07', status: 'Pending' },
      ];
      
      const adminReports = [
        { id: 8, title: 'Monthly System Usage', type: 'admin', submittedBy: 'Admin', date: '2025-04-01', status: 'Approved' },
        { id: 9, title: 'User Registration Statistics', type: 'admin', submittedBy: 'Admin', date: '2025-03-30', status: 'Approved' },
      ];
      
      switch (activeTab) {
        case 'student':
          setReports(studentReports);
          break;
        case 'faculty':
          setReports(facultyReports);
          break;
        case 'trainer':
          setReports(trainerReports);
          break;
        case 'admin':
          setReports(adminReports);
          break;
        default:
          setReports([]);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleAddReport = () => {
    setFormData({
      title: '',
      type: activeTab,
      description: '',
      file: null
    });
    setShowAddReportModal(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewReportModal(true);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.type || !formData.description) {
      setError('All fields are required');
      return;
    }
    
    if (!formData.file) {
      setError('Please upload a file');
      return;
    }
    
    try {
      setLoading(true);
      
      // Mock creation
      const newReport = {
        id: reports.length + 1,
        title: formData.title,
        type: formData.type,
        submittedBy: `${user.firstName} ${user.lastName}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      setReports([newReport, ...reports]);
      setShowAddReportModal(false);
      
    } catch (err) {
      setError('Failed to submit report');
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'Approved':
        color = '#4caf50';
        break;
      case 'Pending':
        color = '#ff9800';
        break;
      case 'Rejected':
        color = '#f44336';
        break;
      default:
        color = '#999';
    }
    
    return (
      <span 
        style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: color, 
          color: 'white',
          fontSize: '12px'
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <Header title="Reports" user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <ul className="dashboard-nav-tabs">
            <li 
              className={`dashboard-nav-tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              Student Reports
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'faculty' ? 'active' : ''}`}
              onClick={() => setActiveTab('faculty')}
            >
              Faculty Reports
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'trainer' ? 'active' : ''}`}
              onClick={() => setActiveTab('trainer')}
            >
              Trainer Reports
            </li>
            <li 
              className={`dashboard-nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Reports
            </li>
          </ul>
        </nav>

        {error && (
          <div className="alert alert-error" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reports</h2>
            <div className="table-actions">
              <button className="btn btn-accent" onClick={handleAddReport}>Add New Report</button>
            </div>
          </div>
          
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>No reports found. Click "Add New Report" to create one.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td>{report.title}</td>
                    <td>{report.submittedBy}</td>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td>
                      <button className="table-action-button" onClick={() => handleViewReport(report)}>View</button>
                      <button className="table-action-button">Download</button>
                      {report.status === 'Pending' && (
                        <>
                          <button className="table-action-button" style={{ color: '#4caf50' }}>Approve</button>
                          <button className="table-action-button" style={{ color: '#f44336' }}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Report</h2>
              <button className="modal-close" onClick={() => setShowAddReportModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmitReport}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title">Report Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Report Type</label>
                  <select
                    id="type"
                    name="type"
                    className="form-control"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="student">Student Report</option>
                    <option value="faculty">Faculty Report</option>
                    <option value="trainer">Trainer Report</option>
                    <option value="admin">Admin Report</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="file">Upload File</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    className="form-control"
                    onChange={handleFileChange}
                    required
                  />
                  <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                    Accepted formats: PDF, DOC, DOCX, XLS, XLSX (Max size: 10MB)
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddReportModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewReportModal && selectedReport && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Report Details</h2>
              <button className="modal-close" onClick={() => setShowViewReportModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{selectedReport.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Submitted by {selectedReport.submittedBy} on {new Date(selectedReport.date).toLocaleDateString()}
                </p>
                <p style={{ marginTop: '10px' }}>Status: {getStatusBadge(selectedReport.status)}</p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '5px' }}>Description</h4>
                <p>
                  This is a sample description for the report. In a real application, this would contain the actual description of the report.
                </p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '5px' }}>File</h4>
                <div style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>report-{selectedReport.id}.pdf</span>
                  <button className="btn btn-primary" style={{ padding: '5px 10px' }}>Download</button>
                </div>
              </div>
              
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '5px' }}>Comments</h4>
                <div style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Admin</p>
                  <p style={{ margin: '0 0 5px 0' }}>Please revise section 3 of the report.</p>
                  <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>2025-04-16 10:30 AM</p>
                </div>
                
                <textarea
                  className="form-control"
                  placeholder="Add a comment..."
                  rows="2"
                  style={{ marginBottom: '10px' }}
                ></textarea>
                <button className="btn btn-primary" style={{ padding: '5px 10px' }}>Add Comment</button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowViewReportModal(false)}>Close</button>
              {selectedReport.status === 'Pending' && (
                <>
                  <button className="btn btn-primary" style={{ backgroundColor: '#4caf50' }}>Approve</button>
                  <button className="btn btn-primary" style={{ backgroundColor: '#f44336' }}>Reject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
