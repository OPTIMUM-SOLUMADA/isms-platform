import { env } from "./env";

export const API_CONFIG = {
    BASE_URL: env.BASE_URL,
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            CHANGE_PASSWORD: '/auth/change-password',
            RESET_PASSWORD: '/auth/reset-password',
            REFRESH: '/auth/refresh',
            VERIFY: '/auth/verify',
            LOGOUT: '/auth/logout',
            VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
        },
        USERS: '/users',
        DEPARTMENTS: '/departments',
        DOCUMENTS: "/documents",
        DOCUMENTS_STATS: "/documents/statistics",
        ISO_CLAUSES: '/iso-clauses',
        DOCUMENT_TYPES: '/document-types',
    },
} as const;

export const apiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;