import { prismaPostgres } from '@/database/prisma';
import { Department, Prisma } from '../../node_modules/.prisma/client/postgresql';
import { UserService } from './user.service';

const depIncludes: Prisma.DepartmentInclude = {
    functions: {
        include: {
            users: {
                select: {
                    id_user: true,
                    name: true,
                    email: true,
                },
            },
        },
    },
    department_document_classifications: {
        include: {
            document: {
                select: {
                    id_document: true,
                    title: true,
                },
            },
            classification: true,
        },
    },
};

/**
 * Service for managing departments
 * Uses PostgreSQL for relational department data
 */
export class DepartmentService {
    protected userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    async createDepartment(data: Prisma.DepartmentCreateInput) {
        return prismaPostgres.department.create({ data, include: depIncludes });
    }

    async getDepartmentById(id: string) {
        return prismaPostgres.department.findUnique({
            where: { id_department: id },
            include: depIncludes,
        });
    }

    async getDepartmentByName(name: string) {
        return prismaPostgres.department.findFirst({
            where: { name },
            include: depIncludes,
        });
    }

    async updateDepartment(id: string, data: Prisma.DepartmentUpdateInput) {
        return prismaPostgres.department.update({
            where: { id_department: id },
            data,
            include: depIncludes,
        });
    }

    async deleteDepartment(id: string) {
        return prismaPostgres.department.delete({ where: { id_department: id } });
    }

    async listDepartments({
        filter,
        page = 1,
        limit = 20,
        orderBy = { created_at: 'desc' },
    }: {
        filter?: Prisma.DepartmentWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.DepartmentOrderByWithRelationInput;
    }) {
        const total = await prismaPostgres.department.count({ where: filter });
        const departments = await prismaPostgres.department.findMany({
            include: depIncludes,
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            departments,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async search(query: string) {
        return prismaPostgres.department.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id_department: true,
                name: true,
                description: true,
            },
            take: 20,
        });
    }

    async init() {
        // Add default departments if not exists
        const departments = [
            { name: 'IT', description: 'Information Technology' },
            { name: 'DEV', description: 'Development' },
            { name: 'HR', description: 'Human Resources' },
            { name: 'ROP', description: 'Responsable Operations' },
            { name: 'Internal Audit', description: 'Internal Audit' },
            { name: 'Legal', description: 'Legal' },
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
