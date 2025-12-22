import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

export class DepartmentRoleDocumentService {
    async createMany(data: Prisma.DepartmentRoleDocumentCreateManyInput) {
        return prismaPostgres.departmentRoleDocument.createMany({
            data,
        });
    }

    async reCreateMany(documentId: string, data: Prisma.DepartmentRoleDocumentCreateManyInput) {
        return prismaPostgres.departmentRoleDocument
            .deleteMany({ where: { id_document: documentId } })
            .then(() => this.createMany(data));
    }

    async findAll() {
        return prismaPostgres.departmentRoleDocument.findMany({
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
        return prismaPostgres.departmentRoleDocument.findFirst({
            where: { id_department_role_document: id },
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
