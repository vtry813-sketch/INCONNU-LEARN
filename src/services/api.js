import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User services
export const userService = {
  getProfile: () => api.get('/users/profile').then(res => res.data),
  
  updateProgress: (levelId, score, timeSpent = 0, exercises = []) => 
    api.post(`/users/progress/${levelId}`, { score, timeSpent, exercises }).then(res => res.data),
  
  unlockLevel: (levelId) => 
    api.post(`/users/unlock-level/${levelId}`).then(res => res.data),
  
  getUnlockedLevels: () => 
    api.get('/users/unlocked-levels').then(res => res.data),
  
  updateProfile: (profileData) => 
    api.put('/users/profile', profileData).then(res => res.data),
};

// Level services
export const levelService = {
  getAllLevels: () => api.get('/levels').then(res => res.data),
  
  getLevel: (id) => api.get(`/levels/${id}`).then(res => res.data),
  
  getLevelByNumber: (number) => api.get(`/levels/number/${number}`).then(res => res.data),
  
  completeExercise: (levelId, exerciseData) => 
    api.post(`/levels/${levelId}/complete-exercise`, exerciseData).then(res => res.data),
  
  getLevelProgress: (levelId) => 
    api.get(`/levels/${levelId}/progress`).then(res => res.data),
};

// Coin services
export const coinService = {
  transfer: (recipientEmail, amount, note = '') => 
    api.post('/coins/transfer', { recipientEmail, amount, note }).then(res => res.data),
  
  getHistory: () => api.get('/coins/transactions').then(res => res.data),
  
  getBalance: () => api.get('/coins/balance').then(res => res.data),
  
  addReferralCoins: (referralCode) => 
    api.post('/coins/add-referral', { referralCode }).then(res => res.data),
};

// Admin services
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard').then(res => res.data),
  
  addCoins: (userId, amount, note = '') => 
    api.post('/admin/add-coins', { userId, amount, note }).then(res => res.data),
  
  getUsers: (page = 1, limit = 20, search = '') => 
    api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`).then(res => res.data),
  
  getUser: (id) => api.get(`/admin/users/${id}`).then(res => res.data),
  
  createLevel: (levelData) => api.post('/admin/levels', levelData).then(res => res.data),
  
  initAdmin: () => api.post('/admin/init-admin').then(res => res.data),
};

export default api;
