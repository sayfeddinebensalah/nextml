// src/axiosinstance.js
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API || "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Set to true if you're using cookies for auth
});

// Global flag for refreshing token to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Request Interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to token expiry (401) and request hasn't been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If refresh is already happening, enqueue the request to retry after refresh
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => axiosInstance(originalRequest)).catch(err => Promise.reject(err));
            }

            // Lock the refresh mechanism
            isRefreshing = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.warn("No refresh token found. Logging out.");
                handleLogout();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${baseURL}/token/refresh`, { refresh: refreshToken });
                const newAccessToken = response?.data?.access;

                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Retry all failed requests in the queue
                    failedQueue.forEach(({ resolve }) => resolve());
                    failedQueue = [];

                    return axiosInstance(originalRequest);
                } else {
                    throw new Error("No access token in refresh response");
                }
            } catch (err) {
                console.error("Refresh token failed:", err.response?.data || err.message);
                handleLogout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirect user to login page
}

export default axiosInstance;
