import React, { useState, useEffect } from 'react';
import '../App.css';
import '../styles/AttendanceSystem.css';

function AttendanceSystem({ userRole, courseId, students }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  // Mock attendance data
  useEffect(() => {
    // In a real app, you would fetch this from your API
    const mockAttendance = students.map(student => ({
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber || student.id,
      dates: {
        '2025-05-01': Math.random() > 0.2,
        '2025-05-02': Math.random() > 0.2,
        '2025-05-03': Math.random() > 0.2,
        '2025-05-04': Math.random() > 0.2,
        '2025-05-05': Math.random() > 0.2,
        '2025-05-06': Math.random() > 0.2,
      }
    }));
    
    setAttendance(mockAttendance);
    setLoading(false);
  }, [students]);

  const handleAttendanceChange = (studentId, isPresent) => {
    if (userRole !== 'trainer') {
      setMessage('Only trainers can modify attendance records.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setAttendance(prevAttendance => 
      prevAttendance.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              dates: { 
                ...student.dates, 
                [selectedDate]: isPresent 
              } 
            } 
          : student
      )
    );
    setMessage('Attendance updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const calculateAttendancePercentage = (studentDates) => {
    const totalDays = Object.keys(studentDates).length;
    if (totalDays === 0) return '0%';
    
    const presentDays = Object.values(studentDates).filter(present => present).length;
    return Math.round((presentDays / totalDays) * 100) + '%';
  };

  if (loading) {
    return <div className="loading">Loading attendance data...</div>;
  }

  return (
    <div className="attendance-system">
      <div className="attendance-header">
        <h3>Attendance Records</h3>
        <div className="date-selector">
          <label htmlFor="attendanceDate">Select Date: </label>
          <input 
            type="date" 
            id="attendanceDate" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Only') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Status</th>
              <th>Overall Attendance</th>
              {userRole === 'trainer' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {attendance.map(student => {
              const attendancePercentage = calculateAttendancePercentage(student.dates);
              const percentageValue = parseInt(attendancePercentage);
              let attendanceClass = 'good';
              
              if (percentageValue < 75) {
                attendanceClass = 'poor';
              } else if (percentageValue < 85) {
                attendanceClass = 'average';
              }
              
              return (
                <tr key={student.id}>
                  <td className="roll-number">{student.rollNumber}</td>
                  <td className="student-name">{student.name}</td>
                  <td>
                    <span className={`attendance-status ${student.dates[selectedDate] ? 'present' : 'absent'}`}>
                      {student.dates[selectedDate] ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td>
                    <div className="attendance-percentage">
                      <div className={`percentage-value ${attendanceClass}`}>{attendancePercentage}</div>
                      <div className="percentage-bar-container">
                        <div 
                          className={`percentage-bar ${attendanceClass}`}
                          style={{ width: attendancePercentage }}
                        ></div>
                      </div>
                    </div>
                  </td>
                {userRole === 'trainer' && (
                  <td className="attendance-actions">
                    <div className="action-buttons">
                      <button 
                        className={`action-btn present-btn ${student.dates[selectedDate] ? 'active' : ''}`}
                        onClick={() => handleAttendanceChange(student.id, true)}
                        disabled={student.dates[selectedDate] === true}
                        title="Mark as Present"
                      >
                        <span className="action-icon">✓</span>
                        <span className="action-text">Present</span>
                      </button>
                      <button 
                        className={`action-btn absent-btn ${!student.dates[selectedDate] ? 'active' : ''}`}
                        onClick={() => handleAttendanceChange(student.id, false)}
                        disabled={student.dates[selectedDate] === false}
                        title="Mark as Absent"
                      >
                        <span className="action-icon">✗</span>
                        <span className="action-text">Absent</span>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {userRole !== 'trainer' && (
        <div className="attendance-note">
          <p>Note: Only trainers can modify attendance records. Please contact your trainer if you notice any discrepancies.</p>
        </div>
      )}
    </div>
  );
}

export default AttendanceSystem;
