import axios from 'axios';
console.log('API URL:', import.meta.env.VITE_API_URL);
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for attaching auth tokens can be added here

export default axiosClient;
