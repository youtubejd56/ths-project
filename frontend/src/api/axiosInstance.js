import axios from "axios";
import API_BASE_URL from "./config";

const API_BASE = `${API_BASE_URL}/api`;

const api = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh or errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem("refresh");

            if (refresh) {
                try {
                    const response = await axios.post(`${API_BASE}/token/refresh/`, {
                        refresh,
                    });
                    const newToken = response.data.access;
                    localStorage.setItem("token", newToken);
                    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Session expired, logging out...");
                    localStorage.clear();
                    window.location.href = "/adminlogin";
                }
            } else {
                localStorage.clear();
                window.location.href = "/adminlogin";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
