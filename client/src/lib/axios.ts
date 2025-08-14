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

        // Skip refresh for login request
        if (originalRequest?.url?.includes("/auth")) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest?._retry // prevent infinite loop
        ) {
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

                localStorage.setItem(env.ACCESS_TOKEN_KEY, accessToken || "");

                // Update queued requests
                processQueue(accessToken || undefined);

                if (originalRequest?.headers && newToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                }
                return axios(originalRequest!);
            } catch (refreshError) {
                processQueue(undefined);
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