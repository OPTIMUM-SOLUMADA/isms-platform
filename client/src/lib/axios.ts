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
let failedQueue: Array<{ resolve: (token?: string) => void; reject: (error: any) => void }> = [];

// Helper to process queued requests after refresh
const processQueue = (error: any = null, token: string | null = null) => {
    console.log(`[AXIOS] Processing queue: ${failedQueue.length} requests, error:`, !!error, 'token:', !!token);
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token || undefined);
        }
    });
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
            console.log('[AXIOS] 401 error detected', {
                url: originalRequest?.url,
                hasAccessToken: !!accessToken,
                isRefreshing
            });

            // Don't try to refresh if:
            // 1. User is not logged in (no access token)
            // 2. Request is to auth endpoints (login, verify-account, verify-reset-token, etc.)
            const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                                   originalRequest?.url?.includes('/auth/verify') ||
                                   originalRequest?.url?.includes('/auth/verify-account') ||
                                   originalRequest?.url?.includes('/auth/verify-reset-token') ||
                                   originalRequest?.url?.includes('/auth/change-password') ||
                                   originalRequest?.url?.includes('/auth/reset-password');
            
            // If it's an auth endpoint, don't try to refresh
            if (isAuthEndpoint) {
                console.log('[AXIOS] Skipping refresh - auth endpoint');
                return Promise.reject(error);
            }

            // If no token in localStorage, redirect to login
            if (!accessToken) {
                console.log('[AXIOS] Skipping refresh - no access token, redirecting to login');
                window.location.href = '/#/login';
                return Promise.reject(error);
            }

            // If refresh is already in progress, queue this request
            if (isRefreshing) {
                console.log('[AXIOS] Queuing request while refresh in progress:', originalRequest?.url);
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token?: string) => {
                            if (token && originalRequest?.headers) {
                                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                                resolve(axios(originalRequest!));
                            } else {
                                reject(new Error('No token available'));
                            }
                        },
                        reject
                    });
                });
            }

            // Start refresh process
            console.log('[AXIOS] Starting refresh process for:', originalRequest?.url);
            originalRequest!._retry = true;
            isRefreshing = true;

            try {
                console.log('[AXIOS] Calling refresh token...');
                const response = await AuthService.refreshToken();
                const newToken = response.headers["authorization"]?.split(" ")[1];
                accessToken = newToken || null;

                console.log('[AXIOS] Refresh successful, got new token:', !!newToken);

                if (newToken) {
                    localStorage.setItem(env.ACCESS_TOKEN_KEY, newToken);
                }

                // Update queued requests with success
                processQueue(null, accessToken);

                if (originalRequest?.headers && newToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                }
                return axios(originalRequest!);
            } catch (refreshError: any) {
                console.error('[AXIOS] Refresh token error:', refreshError?.response?.status, refreshError?.response?.data);
                
                // Clear token and reject queued requests
                accessToken = null;
                localStorage.removeItem(env.ACCESS_TOKEN_KEY);
                processQueue(refreshError, null);
                
                // Only redirect if refresh token is invalid/expired
                if (refreshError?.response?.status === 401) {
                    console.log("[AXIOS] Session expired, redirecting to login");
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