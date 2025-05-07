import React from 'react';
import '../styles/DashboardCard.css';

function DashboardCard({ title, value, description, icon, color, trend, trendValue, footer, onClick }) {
  const getIconBackground = () => {
    switch (color) {
      case 'primary':
        return 'var(--primary-color)';
      case 'accent':
        return 'var(--accent-color)';
      case 'success':
        return '#38a169';
      case 'danger':
        return '#e53e3e';
      case 'warning':
        return '#ed8936';
      case 'info':
        return '#4299e1';
      default:
        return 'var(--primary-color)';
    }
  };

  const getTrendClass = () => {
    if (!trend) return '';
    return trend === 'up' ? 'trend-up' : 'trend-down';
  };

  return (
    <div className={`dashboard-card dashboard-card-${color || 'primary'}`} onClick={onClick}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">{title}</h3>
        <div className="dashboard-card-icon" style={{ background: getIconBackground() }}>
          {icon}
        </div>
      </div>
      
      <div className="dashboard-card-content">
        <div className="dashboard-card-value">{value}</div>
        
        {trend && (
          <div className={`dashboard-card-trend ${getTrendClass()}`}>
            <span className="trend-icon">{trend === 'up' ? '↑' : '↓'}</span>
            <span className="trend-value">{trendValue}</span>
          </div>
        )}
        
        <div className="dashboard-card-description">{description}</div>
      </div>
      
      {footer && (
        <div className="dashboard-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
