import { Prisma } from "@prisma/client";
import prisma from "@/database/prisma";

export class DepartmentService {
    async createDepartment(data: Prisma.DepartmentCreateInput) {
        return prisma.department.create({ data });
    }

    async getDepartmentById(id: string) {
        return prisma.department.findUnique({
            where: { id },
            include: {
                manager: true,
                members: true,
            },
        });
    }

    async updateDepartment(id: string, data: Prisma.DepartmentUpdateInput) {
        return prisma.department.update({
            where: { id },
            data,
        });
    }

    async deleteDepartment(id: string) {
        return prisma.department.delete({ where: { id } });
    }

    async listDepartments() {
        return prisma.department.findMany({
            include: {
                manager: true,
                members: true,
            },
        });
    }
}
