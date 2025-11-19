import { userIncludes } from "@/services/user.service";
import { Prisma } from "@prisma/client";

export function sanitizeUser(user: Prisma.UserGetPayload<{ include: typeof userIncludes }>) {
    const {
        name,
        role,
        email,
        departmentRoleUsers,
    } = user;

    const roles = departmentRoleUsers.map((item: any) => item.departmentRole.name);

    return { name, role, email, roles };
}
