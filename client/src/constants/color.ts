import { RoleType } from "@/types";

export const statusColors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
};

export const complianceStatusColors = {
    compliant: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    'non-compliant': 'bg-red-100 text-red-800',
    'not-started': 'bg-gray-100 text-gray-800'
};

export const resourceTypeColors = {
    document: 'bg-blue-100 text-blue-800',
    user: 'bg-purple-100 text-purple-800',
    system: 'bg-gray-100 text-gray-800',
    review: 'bg-orange-100 text-orange-800',
    policy: 'bg-green-100 text-green-800'
};

export const documentStatusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    in_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800'
};

export const userRoleColors: Record<RoleType, string> = {
    ADMIN: 'bg-theme/10 text-theme',
    VIEWER: 'bg-primary/5 text-gray-500',
    REVIEWER: 'bg-amber/10 text-amber-600',
    CONTRIBUTOR: 'bg-indigo/10 text-indigo-600',
};

export const userStatusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800'
};

export const avatarColors = [
    "bg-red-100 text-red-700 border-red-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-teal-100 text-teal-700 border-teal-200",
];
