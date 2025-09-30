import { env } from "./env";

export const API_CONFIG = {
    BASE_URL: env.BASE_URL,
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/auth/login",
            CHANGE_PASSWORD: "/auth/change-password",
            RESET_PASSWORD: "/auth/reset-password",
            REFRESH: "/auth/refresh",
            VERIFY: "/auth/verify",
            LOGOUT: "/auth/logout",
            VERIFY_RESET_TOKEN: "/auth/verify-reset-token",
            VERIFY_ACCOUNT: "/auth/verify-account",
        },
        USERS: {
            BASE: "/users",
            GET: (id: string | number) => `/users/${id}`,
            UPDATE: (id: string | number) => `/users/${id}`,
            DELETE: (id: string | number) => `/users/${id}`,
            INVITE: (id: string | number) => `/users/${id}/invite`,
            DEACTIVATE: (id: string | number) => `/users/${id}/deactivate`,
            ACTIVATE: (id: string | number) => `/users/${id}/activate`,
            GET_USER_BY_IDS: "/users/by-ids",
            SEARCH: "/users/search",
        },
        DEPARTMENTS: {
            BASE: "/departments",
            GET: (id: string | number) => `/departments/${id}`,
            UPDATE: (id: string | number) => `/departments/${id}`,
            DELETE: (id: string | number) => `/departments/${id}`,
            SEARCH: "/departments/search",
            GET_ROLES: (id: string | number) => `/departments/${id}/roles`,
            SEARCH_ROLES: "/users/search",
            // UPDATE_ROLES: (id: string | number) => `/departments/${id}/roles`,
            // DELETE_ROLES: (id: string | number) => `/departments/${id}/roles`,
        },
        DOCUMENTS: {
            BASE: "/documents",
            STATS: "/documents/statistics",
            REVIEWS: '/document-reviews',
            GET: (id: string | number) => `/documents/${id}`,
            DOWNLOAD: (id: string | number) => `/documents/download/${id}`,
            PUBLISH: (id: string | number) => `/documents/publish/${id}`,
            UNPUBLISH: (id: string | number) => `/documents/unpublish/${id}`,
        },
        ISO_CLAUSES: {
            BASE: "/iso-clauses",
            GET: (id: string | number) => `/iso-clauses/${id}`,
            UPDATE: (id: string | number) => `/iso-clauses/${id}`,
            DELETE: (id: string | number) => `/iso-clauses/${id}`,
            SEARCH: "/iso-clauses/search",
        },
        DOCUMENT_TYPES: {
            BASE: "/document-types",
            GET: (id: string | number) => `/document-types/${id}`,
            UPDATE: (id: string | number) => `/document-types/${id}`,
            DELETE: (id: string | number) => `/document-types/${id}`,
            SEARCH: "/document-types/search",
        },
        EXCEL_IMAGE: "/excel/image",
    },
} as const;

export const apiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;
