import { env } from "./env";

export const API_CONFIG = {
  BASE_URL: env.BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      CHANGE_PASSWORD: "/api/auth/change-password",
      RESET_PASSWORD: "/api/auth/reset-password",
      REFRESH: "/api/auth/refresh",
      VERIFY: "/api/auth/verify",
      LOGOUT: "/api/auth/logout",
      VERIFY_RESET_TOKEN: "/api/auth/verify-reset-token",
      VERIFY_ACCOUNT: "/api/auth/verify-account",
    },
    USERS: {
      BASE: "/api/users",
      GET: (id: string | number) => `/api/users/${id}`,
      UPDATE: (id: string | number) => `/api/users/${id}`,
      DELETE: (id: string | number) => `/api/users/${id}`,
      INVITE: (id: string | number) => `/api/users/${id}/invite`,
      DEACTIVATE: (id: string | number) => `/api/users/${id}/deactivate`,
      ACTIVATE: (id: string | number) => `/api/users/${id}/activate`,
      GET_USER_BY_IDS: "/api/users/by-ids",
      SEARCH: "/api/users/search",
    },
    DEPARTMENTS: {
      BASE: "/api/departments",
      GET: (id: string | number) => `/api/departments/${id}`,
      UPDATE: (id: string | number) => `/api/departments/${id}`,
      DELETE: (id: string | number) => `/api/departments/${id}`,
      SEARCH: "/api/departments/search",
      GET_ROLES: (id: string | number) => `/api/departments/${id}/roles`,
      SEARCH_ROLES: "/api/users/search",
      GET_ROLE_BY_ID: (id: string | number) => `/api/deparmtents/role/${id}`,
      // UPDATE_ROLES: (id: string | number) => `/api/departments/${id}/roles`,
      // DELETE_ROLES: (id: string | number) => `/api/departments/${id}/roles`,
    },
    DOCUMENTS: {
      BASE: "/api/documents",
      STATS: "/api/documents/statistics",
      GET: (id: string | number) => `/api/documents/${id}`,
      DOWNLOAD: (id: string | number) => `/api/documents/download/${id}`,
      PUBLISH: (id: string | number) => `/api/documents/publish/${id}`,
      UNPUBLISH: (id: string | number) => `/api/documents/unpublish/${id}`,
      CREATE_DRAFT_VERSION: (id: string | number) =>
        `/api/documents/create-draft-version/${id}`,
    },
    REVIEWS: {
      BASE: "/api/document-reviews",
      GET: (id: string | number) => `/api/document-reviews/${id}`,
      UPDATE: (id: string | number) => `/api/document-reviews/${id}`,
      DELETE: (id: string | number) => `/api/document-reviews/${id}`,
      SEARCH: "/api/document-reviews/search",
      MAKE_DECISION: (id: string | number) =>
        `/api/document-reviews/make-decision/${id}`,
      GET_MY_REVIEWS: (id: string | number) =>
        `/api/document-reviews/my-reviews/${id}`,
      GET_MY_REVIEWS_STATS: (id: string | number) =>
        `/api/document-reviews/my-reviews/${id}/stats`,
      GET_MY_REVIEWS_DUE_SOON: (id: string | number) =>
        `/api/document-reviews/my-reviews/${id}/due-soon`,
      GET_MY_EXPIRED_AND_DUE_SOON_REVIEWS_BY_USER: (id: string | number) =>
        `/api/document-reviews/my-reviews/${id}/expired-and-due-soon-reviews`,
      GET_PENDING_REVIEWS: (id: string | number) =>
        `/api/document-reviews/pending-reviews/${id}`,
      MARK_AS_COMPLETED: (id: string | number) =>
        `/api/document-reviews/mark-as-completed/${id}`,
      PATCH_DOCUMENT_VERSION: (id: string | number) =>
        `/api/document-reviews/${id}/patch-document-version`,
      GET_SUBMITTED_REVIEWS_BY_DOCUMENT: (id: string | number) =>
        `/api/document-reviews/document/${id}/submitted`,
      GET_COMPLETED_REVIEWS_BY_DOCUMENT: (id: string | number) =>
        `/api/document-reviews/document/${id}/completed`,
      GET_EXPIRED_REVIEWS_BY_USER: (id: string | number) =>
        `/api/document-reviews/expired-reviews/${id}`,
      GET_OTHER_USERS_REVIEWS: (documentId: string, versionId: string) =>
        `/api/document-reviews/other-users-reviews/${documentId}/${versionId}`,
    },
    ISO_CLAUSES: {
      BASE: "/api/iso-clauses",
      GET: (id: string | number) => `/api/iso-clauses/${id}`,
      UPDATE: (id: string | number) => `/api/iso-clauses/${id}`,
      DELETE: (id: string | number) => `/api/iso-clauses/${id}`,
      SEARCH: "/api/iso-clauses/search",
    },
    DOCUMENT_TYPES: {
      BASE: "/api/document-types",
      GET: (id: string | number) => `/api/document-types/${id}`,
      UPDATE: (id: string | number) => `/api/document-types/${id}`,
      DELETE: (id: string | number) => `/api/document-types/${id}`,
      SEARCH: "/api/document-types/search",
    },
    DOCUMENT_VERSIONS: {
      BASE: "/api/document-versions",
      GET: (id: string | number) => `/api/document-versions/${id}`,
      UPDATE: (id: string | number) => `/api/document-versions/${id}`,
      DELETE: (id: string | number) => `/api/document-versions/${id}`,
      GET_BY_DOCUMENT: (id: string | number) =>
        `/api/document-versions/document/${id}`,
      SEARCH: "/api/document-versions/search",
      DOWNLOAD: (id: string | number) =>
        `/api/document-versions/download/${id}`,
    },
    OWNERS: {
      BASE: "/api/owners",
      GET: (id: string | number) => `/api/owners/${id}`,
    },
    EXCEL_IMAGE: "/api/excel/image",
    DEPARTMENT_ROLE_DOCUMENTS: {
      BASE: "/api/department-role-documents",
      GET: (id: string | number) => `/api/department-role-documents/${id}`,
    },
    DEPARTMENT_ROLE: {
      BASE: "/api/department-roles",
      GET: (id: string | number) => `/api/department-roles/${id}`,
    },
    GOOGLE_DRIVE: {
      BASE: "/api/google-drive",
      GET_FILES: () => `/api/google-drive/files`,
      GRANT_PERMISSIONS_TO_FILE_VERSION: (id: string | number) =>
        `/api/google-drive/grant-permissions/${id}`,
    },
  },
} as const;

export const apiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;
