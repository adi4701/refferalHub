import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../constants';
import { useAuthStore } from '../store/auth.store';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for cookies (refreshToken)
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
// (This is a skeleton, you'd typically handle 401s and token refresh logic here)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.message === 'Network Error' || !error.response) {
            toast.error('Network error. Please check your connection.');
        }

        // Show user-friendly message for 403 (wrong role)
        if (error.response?.status === 403) {
            toast.error('Access denied. Make sure you are logged in with the correct role (Referrer).');
        }

        // If not 401, just reject
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // On 401, logout user by clearing the store
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }

        return Promise.reject(error);
    }
);

export default api;
