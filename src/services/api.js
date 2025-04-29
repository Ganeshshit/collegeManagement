import axios from 'axios';

// Set USE_MOCK_DATA to false to use real API
const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', token);
      console.log('Request headers:', config.headers);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (credentials) => {
  try {
    console.log('Attempting login with:', credentials);
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = async () => {
  try {
    // First try to get from localStorage to avoid unnecessary API calls
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // If not in localStorage, get from API
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('token');
    return null;
  }
};

// User management API functions
export const getUsers = async () => {
  try {
    console.log('Fetching users with token:', localStorage.getItem('token'));
    const response = await api.get('/admin/users');
    console.log('Users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    console.log('Creating user with data:', userData);
    console.log('Auth token:', localStorage.getItem('token'));
    
    // Make sure we're sending the request with the token
    const token = localStorage.getItem('token');
    const response = await api.post('/admin/users', userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Create user response:', response.data);
    if (response.data && response.data.user) {
      return response.data.user;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    console.log('Updating user with data:', userData);
    console.log('Auth token:', localStorage.getItem('token'));
    
    // Make sure we're sending the request with the token
    const token = localStorage.getItem('token');
    const response = await api.put(`/admin/users/${id}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Update user response:', response.data);
    if (response.data && response.data.user) {
      return response.data.user;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    console.log('Deleting user with ID:', id);
    console.log('Auth token:', localStorage.getItem('token'));
    
    // Make sure we're sending the request with the token
    const token = localStorage.getItem('token');
    const response = await api.delete(`/admin/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Delete user response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Report API functions
export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    console.error('Get reports error:', error);
    throw error;
  }
};

export const getReport = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get report error:', error);
    throw error;
  }
};

export const createReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Create report error:', error);
    throw error;
  }
};

export const updateReport = async (id, reportData) => {
  try {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  } catch (error) {
    console.error('Update report error:', error);
    throw error;
  }
};

export const deleteReport = async (id) => {
  try {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete report error:', error);
    throw error;
  }
};

export const downloadReport = async (id) => {
  try {
    const response = await api.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Download report error:', error);
    throw error;
  }
};

// Student profile API functions
export const getStudentProfile = async (id) => {
  try {
    const response = await api.get(`/student/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get student profile error:', error);
    throw error;
  }
};

export const updateStudentProfile = async (id, profileData) => {
  try {
    const response = await api.put(`/student/profile/${id}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Update student profile error:', error);
    throw error;
  }
};

export { api };
