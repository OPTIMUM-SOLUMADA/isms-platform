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

export const documentStatusColors = {
    draft: 'bg-gray-100 text-gray-700',
    review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800'
};

export const userRoleColors: Record<RoleType, string> = {
    ADMIN: 'bg-red-100 text-red-800',
    VIEWER: 'bg-purple-100 text-purple-800',
    REVIEWER: 'bg-gray-100 text-gray-800'
};

export const userStatusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800'
};