import { AccessPermission } from '@/types/role';
import {
    LayoutDashboard,
    FileText,
    GitBranch,
    Users,
    Shield,
    Activity,
    type LucideIcon,
    Building,
} from 'lucide-react';

type MenuItem = {
    path: string;
    labelKey: string;
    icon: LucideIcon;
    requiredPermission: AccessPermission;
    descriptionKey: string;
}

export const menuItems: MenuItem[] = [
    {
        path: '/dashboard',
        labelKey: 'navigation.dashboard.label',
        icon: LayoutDashboard,
        descriptionKey: 'navigation.dashboard.description',
        requiredPermission: 'dashboard.page.access'
    },
    {
        path: '/documents',
        labelKey: 'navigation.documents.label',
        icon: FileText,
        descriptionKey: 'navigation.documents.description',
        requiredPermission: "documents.page.access"
    },
    {
        path: '/reviews',
        labelKey: 'navigation.reviews.label',
        icon: GitBranch,
        descriptionKey: 'navigation.reviews.description',
        requiredPermission: "reviews.page.access"
    },
    {
        path: '/compliance',
        labelKey: 'navigation.compliance.label',
        icon: Shield,
        descriptionKey: 'navigation.compliance.description',
        requiredPermission: "compliance.page.access"
    },
    {
        path: '/users',
        labelKey: 'navigation.users.label',
        icon: Users,
        descriptionKey: 'navigation.users.description',
        requiredPermission: "users.page.access"
    },
    {
        path: '/audit',
        labelKey: 'navigation.auditLog.label',
        icon: Activity,
        descriptionKey: 'navigation.auditLog.description',
        requiredPermission: "audit.page.access"
    }
];


export const otherMenuItems: MenuItem[] = [
    {
        path: '/departments',
        labelKey: 'navigation.others.departments.label',
        icon: Building,
        descriptionKey: 'navigation.others.departments.description',
        requiredPermission: 'documents.page.access',
    }
];