import { Department, Prisma } from "@prisma/client";
import prisma from "@/database/prisma";
import { UserService } from "./user.service";

export class DepartmentService {
    protected userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    async createDepartment(data: Prisma.DepartmentCreateInput) {
        return prisma.department.create({ data });
    }

    async getDepartmentById(id: string) {
        return prisma.department.findUnique({
            where: { id },
            include: {
                members: true,
            },
        });
    }

    async getDepartmentByName(name: string) {
        return prisma.department.findUnique({
            where: { name },
            include: {
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
                members: true,
            },
        });
    }

    async init() {
        // Add default departments if not exists
        const departments = [
            { name: "IT", description: "Information Technology" },
            { name: "DEV", description: "Development" },
            { name: "HR", description: "Human Resources" },
            { name: "ROP", description: "Responsable Operations" },
            { name: "Internal Audit", description: "Internal Audit" },
            { name: "Legal", description: "Legal" },
        ];

        const results: Department[] = [];

        for (const department of departments) {
            const existing = await this.getDepartmentByName(department.name);

            if (!existing) {
                console.log(`Creating department: ${department.name}`);
                const created = await this.createDepartment({
                    ...department,
                });
                results.push(created);
            }
        }

        return results;
    }
}
