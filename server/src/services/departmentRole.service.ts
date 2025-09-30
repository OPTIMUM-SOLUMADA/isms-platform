import prisma from '@/database/prisma';

export class DepartmentRoleService {
    async addRoles(departmentId: string, roles: { name: string; description?: string }[]) {
        // Vérifie si le département existe
        const department = await prisma.department.findUnique({
            where: { id: departmentId },
        });

        if (!department) {
            throw new Error('Department not found');
        }
        const isExist = await prisma.departmentRole.findUnique({
            where: {
                name: DepartmentRoleService.name,
            },
        });
        if (isExist) {
            throw new Error('Role already exist');
        }

        // Crée plusieurs rôles pour ce département
        await prisma.departmentRole.createMany({
            data: roles.map((role) => ({
                name: role.name,
                description: role.description ?? '',
                departmentId,
            })),
        });

        // Retourne le département avec ses rôles mis à jour
        return prisma.department.findUnique({
            where: { id: departmentId },
            include: {
                roles: true, // <-- inclure les rôles
            },
        });
    }

    async findAll() {
        return prisma.departmentRole.findMany({
            include: { department: true },
        });
    }

    async listDepartmentsRole({ id, page, limit }: { id: string; page: number; limit: number }) {
        return prisma.departmentRole.findMany({
            where: { departmentId: id },
            include: { department: true },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async findById(id: string) {
        return prisma.departmentRole.findUnique({
            where: { id },
            include: { department: true },
        });
    }

    async updateRoles(id: string, data: { name?: string; description?: string }) {
        return prisma.departmentRole.update({
            where: { id },
            data,
        });
    }

    async removeRoles(id: string) {
        return prisma.departmentRole.delete({ where: { id } });
    }
}
