import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

export class DepartmentRoleUserService {
    async createMany(data: Prisma.DepartmentRoleUserCreateManyInput) {
        return prismaPostgres.departmentRoleUser.createMany({
            data,
        });
    }

    async reCreateMany(userId: string, data: Prisma.DepartmentRoleUserCreateManyInput) {
        return prismaPostgres.departmentRoleUser
            .deleteMany({ where: { id_user: userId } })
            .then(() => this.createMany(data));
    }

    async findAll() {
        return prismaPostgres.departmentRoleUser.findMany({
            include: {
                department_role: {
                    select: {
                        id_department_role: true,
                        name: true,
                        id_department: true,
                    },
                },
            },
        });
    }

    async findById(id: string) {
        return prismaPostgres.departmentRoleUser.findFirst({
            where: { id_department_role_user: id },
            include: {
                department_role: {
                    select: {
                        id_department_role: true,
                        name: true,
                        id_department: true,
                    },
                },
            },
        });
    }
}
