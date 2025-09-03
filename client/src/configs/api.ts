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
        DOCUMENTS: {
            BASE: "/documents",
            STATS: "/documents/statistics",
            GET: (id: string | number) => `/documents/${id}`,
            DOWNLOAD: (id: string | number) => `/documents/download/${id}`,
            PUBLISH: (id: string | number) => `/documents/publish/${id}`,
        },
        ISO_CLAUSES: '/iso-clauses',
        DOCUMENT_TYPES: '/document-types',
        EXCEL_IMAGE: '/excel/image',
    },
} as const;

export const apiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;