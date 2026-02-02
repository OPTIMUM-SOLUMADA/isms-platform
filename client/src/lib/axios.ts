import { API_CONFIG } from '@/configs/api';
import { env } from '@/configs/env';
import AuthService from '@/services/authService';
import originalAxios, { AxiosError, AxiosRequestConfig } from 'axios';

const axios = originalAxios.create({
    baseURL: API_CONFIG.BASE_URL,
    withCredentials: true,
});


let accessToken: string | null = localStorage.getItem(env.ACCESS_TOKEN_KEY) || null;
let isRefreshing = false;
let failedQueue: ((token?: string) => void)[] = [];

// Helper to process queued requests after refresh
const processQueue = (newToken?: string) => {
    failedQueue.forEach((cb) => cb(newToken));
    failedQueue = [];
};

// Response interceptor to catch token from headers
axios.interceptors.response.use(
    (response) => {
        const authHeader = response.headers["authorization"];
        if (authHeader?.startsWith("Bearer ")) {
            accessToken = authHeader.split(" ")[1];
            localStorage.setItem(env.ACCESS_TOKEN_KEY, accessToken || "");
        }

        return response;
    },
    async (error: AxiosError & { config?: AxiosRequestConfig }) => {

        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Check if it's a 401 error
        if (error.response?.status === 401 && !originalRequest?._retry) {
            // Don't try to refresh if:
            // 1. User is not logged in (no access token)
            // 2. Request is to auth endpoints (login, verify-account, verify-reset-token, etc.)
            const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                                   originalRequest?.url?.includes('/auth/verify') ||
                                   originalRequest?.url?.includes('/auth/verify-account') ||
                                   originalRequest?.url?.includes('/auth/verify-reset-token') ||
                                   originalRequest?.url?.includes('/auth/change-password') ||
                                   originalRequest?.url?.includes('/auth/reset-password');
            
            // If no token in localStorage or it's an auth endpoint, don't try to refresh
            if (!accessToken || isAuthEndpoint) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue the request until token is refreshed
                return new Promise((resolve) => {
                    failedQueue.push((token?: string) => {
                        if (token && originalRequest?.headers) {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        }
                        resolve(axios(originalRequest!));
                    });
                });
            }

            originalRequest!._retry = true;
            isRefreshing = true;

            try {
                const response = await AuthService.refreshToken();
                const newToken = response.headers["authorization"]?.split(" ")[1];
                accessToken = newToken || null;

                // Update queued requests
                processQueue(accessToken || undefined);

                if (originalRequest?.headers && newToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    localStorage.setItem(env.ACCESS_TOKEN_KEY, accessToken || "");
                    console.log("Get new token", newToken)
                }
                return axios(originalRequest!);
            } catch (refreshError: any) {
                console.log("Refresh token error", refreshError);
                // Clear token and process queue
                accessToken = null;
                localStorage.removeItem(env.ACCESS_TOKEN_KEY);
                processQueue(undefined);
                
                // Only logout if refresh token is invalid/expired, not on network errors
                if (refreshError?.response?.status === 401) {
                    // Don't call logout with invalid token to avoid loops
                    console.log("Session expired, redirecting to login");
                    window.location.href = '/#/login';
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Request interceptor to attach token automatically
axios.interceptors.request.use((config) => {
    if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        localStorage.setItem(env.ACCESS_TOKEN_KEY, accessToken || "");
    }
    return config;
});


export default axios;