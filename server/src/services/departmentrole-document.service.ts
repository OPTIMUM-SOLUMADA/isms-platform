import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export class DepartmentRoleDocumentService {
    async createMany(data: Prisma.DepartmentRoleDocumentCreateManyInput) {
        return prisma.departmentRoleDocument.createMany({
            data,
        });
    }

    async reCreateMany(documentId: string, data: Prisma.DepartmentRoleDocumentCreateManyInput) {
        return prisma.departmentRoleDocument
            .deleteMany({ where: { documentId: documentId } })
            .then(() => this.createMany(data));
    }

    async findAll() {
        return prisma.departmentRoleDocument.findMany({
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
        return prisma.departmentRoleDocument.findFirst({
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
