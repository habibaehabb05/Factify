import axios from 'axios';

// Backend URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('[API] Base URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Important: don't send cookies to avoid CORS issues
});

// Interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        console.log('[API] Request:', config.method?.toUpperCase(), config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('[API] Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('[API] Response Error:', error.message);
        console.error('[API] Error Details:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
