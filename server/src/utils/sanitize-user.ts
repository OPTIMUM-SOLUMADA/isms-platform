import type { UserPayload } from '@/services/user.service';

export function sanitizeUser(user: UserPayload) {
    const { name, role, email, departmentRoleUsers } = user;

    const roles = departmentRoleUsers.map((item: any) => item.departmentRole.name);

    return { name, role, email, roles };
}
