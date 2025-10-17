import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export class DepartmentRoleUserService {
    async createMany(data: Prisma.DepartmentRoleUserCreateManyInput) {
        return prisma.departmentRoleUser.createMany({
            data,
        });
    }

    async reCreateMany(data: Prisma.DepartmentRoleUserCreateManyInput) {
        return prisma.departmentRoleUser
            .deleteMany({ where: { userId: data.userId } })
            .then(() => this.createMany(data));
    }

    async findAll() {
        return prisma.departmentRoleUser.findMany({
            include: {
                departmentRole: {
                    select: {
                        id: true,
                        name: true,
                        departmentId: true,
                    },
                },
            },
        });
    }

    async findById(id: string) {
        return prisma.departmentRoleUser.findFirst({
            where: { id },
            include: {
                departmentRole: {
                    select: {
                        id: true,
                        name: true,
                        departmentId: true,
                    },
                },
            },
        });
    }
}
