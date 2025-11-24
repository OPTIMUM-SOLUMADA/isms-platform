import {
    LogIn,
    LogOut,
    UserPlus,
    UserX,
    UserCog,
    FileEdit,
    FilePlus,
    FileText,
    FileCheck,
    FileX,
    RefreshCcw,
    Building2,
    Download,
    Eye,
    ShieldAlert,
} from "lucide-react";

export const auditEventMeta = {
    // 🔐 Auth
    AUTH_LOGIN_ATTEMPT: {
        label: "Login Attempt",
        labelKey: "auditLog.events.AUTH_LOGIN_ATTEMPT",
        icon: ShieldAlert,
        color: "text-amber-600 bg-amber-50",
    },
    AUTH_LOGIN: {
        label: "Login",
        labelKey: "auditLog.events.AUTH_LOGIN",
        icon: LogIn,
        color: "text-indigo-600 bg-indigo-50",
    },
    AUTH_LOGOUT: {
        label: "Logout",
        labelKey: "auditLog.events.AUTH_LOGOUT",
        icon: LogOut,
        color: "text-gray-600 bg-gray-50",
    },

    // 📄 Document
    DOCUMENT_CREATE: {
        label: "Document Created",
        labelKey: "auditLog.events.DOCUMENT_CREATE",
        icon: FilePlus,
        color: "text-green-600 bg-green-50",
    },
    DOCUMENT_EDIT: {
        label: "Document Edited",
        labelKey: "auditLog.events.DOCUMENT_EDIT",
        icon: FileEdit,
        color: "text-amber-600 bg-amber-50",
    },
    DOCUMENT_DELETE: {
        label: "Document Deleted",
        labelKey: "auditLog.events.DOCUMENT_DELETE",
        icon: FileX,
        color: "text-red-600 bg-red-50",
    },
    DOCUMENT_DOWNLOAD: {
        label: "Document Downloaded",
        labelKey: "auditLog.events.DOCUMENT_DOWNLOAD",
        icon: Download,
        color: "text-cyan-600 bg-cyan-50",
    },

    // 📑 Document Version
    DOCUMENT_VERSION_CREATED: {
        label: "Version Created",
        labelKey: "auditLog.events.DOCUMENT_VERSION_CREATED",
        icon: FileText,
        color: "text-teal-600 bg-teal-50",
    },
    DOCUMENT_VERSION_APPROVED: {
        label: "Version Approved",
        labelKey: "auditLog.events.DOCUMENT_VERSION_APPROVED",
        icon: FileCheck,
        color: "text-emerald-600 bg-emerald-50",
    },
    DOCUMENT_VERSION_REJECTED: {
        label: "Version Rejected",
        labelKey: "auditLog.events.DOCUMENT_VERSION_REJECTED",
        icon: FileX,
        color: "text-red-600 bg-red-50",
    },

    DOCUMENT_STATUS_CHANGE: {
        label: "Status Changed",
        labelKey: "auditLog.events.DOCUMENT_STATUS_CHANGE",
        icon: RefreshCcw,
        color: "text-cyan-600 bg-cyan-50",
    },
    DOCUMENT_REVIEW_SUBMITTED: {
        label: "Review Submitted",
        labelKey: "auditLog.events.DOCUMENT_REVIEW_SUBMITTED",
        icon: Eye,
        color: "text-violet-600 bg-violet-50",
    },
    DOCUMENT_REVIEW_COMPLETED: {
        label: "Review Completed",
        labelKey: "auditLog.events.DOCUMENT_REVIEW_COMPLETED",
        icon: FileCheck,
        color: "text-teal-600 bg-teal-50",
    },

    // 👤 User
    USER_ADD: {
        label: "User Added",
        labelKey: "auditLog.events.USER_ADD",
        icon: UserPlus,
        color: "text-green-600 bg-green-50",
    },
    USER_UPDATE: {
        label: "User Updated",
        labelKey: "auditLog.events.USER_UPDATE",
        icon: UserCog,
        color: "text-blue-600 bg-blue-50",
    },
    USER_DELETE: {
        label: "User Deleted",
        labelKey: "auditLog.events.USER_DELETE",
        icon: UserX,
        color: "text-red-600 bg-red-50",
    },

    // 🏢 Department
    DEPARTMENT_CREATE: {
        label: "Department Created",
        labelKey: "auditLog.events.DEPARTMENT_CREATE",
        icon: Building2,
        color: "text-green-700 bg-green-50",
    },
    DEPARTMENT_UPDATE: {
        label: "Department Updated",
        labelKey: "auditLog.events.DEPARTMENT_UPDATE",
        icon: Building2,
        color: "text-blue-700 bg-blue-50",
    },
    DEPARTMENT_DELETE: {
        label: "Department Deleted",
        labelKey: "auditLog.events.DEPARTMENT_DELETE",
        icon: Building2,
        color: "text-red-700 bg-red-50",
    },

    // ⚙️ Action / System
    ACCESS_LOG: {
        label: "Access Log",
        labelKey: "auditLog.events.ACCESS_LOG",
        icon: Eye,
        color: "text-slate-600 bg-slate-50",
    },
    EXPORT_LOGS: {
        label: "Logs Exported",
        labelKey: "auditLog.events.EXPORT_LOGS",
        icon: Download,
        color: "text-purple-600 bg-purple-50",
    },
} as const;

export type AuditEventTypeKey = keyof typeof auditEventMeta;
