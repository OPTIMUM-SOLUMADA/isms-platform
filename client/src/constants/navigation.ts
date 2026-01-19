import { AccessPermission } from '@/types/role';
import {
    LayoutDashboard,
    FileText,
    GitBranch,
    Users,
    Activity,
    type LucideIcon,
    Building2,
    FileType2,
    FileLock2,
    Lightbulb,
    BookCheck,
    Shield,
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
        path: '/published-documents',
        labelKey: 'navigation.publishedDocuments.label',
        icon: BookCheck,
        descriptionKey: 'navigation.publishedDocuments.description',
        requiredPermission: "published-document.page.access"
    },
    {
        path: '/reviews',
        labelKey: 'navigation.reviews.label',
        icon: GitBranch,
        descriptionKey: 'navigation.reviews.description',
        requiredPermission: "reviews.page.access"
    },
    {
        path: '/pending-reviews',
        labelKey: 'navigation.pendingReviews.label',
        icon: Lightbulb,
        descriptionKey: 'navigation.pendingReviews.description',
        requiredPermission: "pendingReviews.page.access"
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
        icon: Building2,
        descriptionKey: 'navigation.others.departments.description',
        requiredPermission: 'departments.page.access',
    },
    {
        path: '/document-types',
        labelKey: 'navigation.others.documentTypes.label',
        icon: FileType2,
        descriptionKey: 'navigation.others.documentTypes.description',
        requiredPermission: 'document-types.page.access',
    },
    {
        path: '/iso-clauses',
        labelKey: 'navigation.others.isoClauses.label',
        icon: FileLock2,
        descriptionKey: 'navigation.others.isoClauses.description',
        requiredPermission: 'iso-clauses.page.access',
    },
];