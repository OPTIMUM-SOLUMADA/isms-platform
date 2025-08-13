import {
    LayoutDashboard,
    FileText,
    GitBranch,
    Users,
    Shield,
    Activity,
} from 'lucide-react';

export const menuItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Overview and metrics'
    },
    {
        path: '/documents',
        label: 'Documents',
        icon: FileText,
        description: 'Policy repository'
    },
    {
        path: '/reviews',
        label: 'Reviews',
        icon: GitBranch,
        description: 'Workflow management'
    },
    {
        path: '/compliance',
        label: 'Compliance',
        icon: Shield,
        description: 'ISO 27001 status'
    },
    {
        path: '/users',
        label: 'Users',
        icon: Users,
        description: 'Role management'
    },
    {
        path: '/audit',
        label: 'Audit Log',
        icon: Activity,
        description: 'Change tracking'
    }
];
