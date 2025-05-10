import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AttendanceStats.css';

const AttendanceStats = ({ courseId, date }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendancePercentage: 0
  });

  const courses = [
    { id: 'CS101', name: 'Introduction to Computer Science' },
    { id: 'CS201', name: 'Data Structures' },
    { id: 'CS301', name: 'Database Systems' }
  ];

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    // In a real app, this would fetch data from the API
    // For now, we'll simulate some data
    if (e.target.value) {
      setStats({
        totalStudents: 45,
        present: Math.floor(Math.random() * 35) + 5,
        absent: Math.floor(Math.random() * 10),
        late: Math.floor(Math.random() * 5),
        attendancePercentage: Math.floor(Math.random() * 30) + 70
      });
    } else {
      setStats({
        totalStudents: 0,
        present: 0,
        absent: 0,
        late: 0,
        attendancePercentage: 0
      });
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="date-picker">
          <label>Date:</label>
          <input 
            type="date" 
            value={date || new Date().toISOString().split('T')[0]}
            onChange={(e) => console.log(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="course-selector">
          <label>Course:</label>
          <select 
            value={selectedCourse} 
            onChange={handleCourseChange}
            className="course-input"
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h2>Attendance Statistics</h2>
      
      <div className="stats-grid">
        <motion.div 
          className="stat-card total-students"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Total Students</h3>
          <div className="stat-value">{stats.totalStudents}</div>
        </motion.div>

        <motion.div 
          className="stat-card present"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3>Present</h3>
          <div className="stat-value">{stats.present}</div>
        </motion.div>

        <motion.div 
          className="stat-card absent"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3>Absent</h3>
          <div className="stat-value">{stats.absent}</div>
        </motion.div>

        <motion.div 
          className="stat-card late"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3>Late</h3>
          <div className="stat-value">{stats.late}</div>
        </motion.div>

        <motion.div 
          className="stat-card attendance"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3>Attendance</h3>
          <div className="stat-value">{stats.attendancePercentage}%</div>
        </motion.div>
      </div>

      <div className="attendance-records">
        <h2>Attendance Records</h2>
        {stats.totalStudents === 0 ? (
          <p className="no-records">No attendance records found.</p>
        ) : (
          <div className="records-table">
            {/* Table implementation would go here */}
            <p>Attendance records will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceStats;
