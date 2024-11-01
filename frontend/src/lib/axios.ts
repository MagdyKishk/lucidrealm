import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      const parsedToken = JSON.parse(token).state.token;
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 