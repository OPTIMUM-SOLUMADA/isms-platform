import { Prisma } from "@prisma/client";
import prisma from "@/database/prisma";
import { UserService } from "./user.service";

export class DocumentService {
    protected userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    async createDocument(data: Prisma.DocumentCreateInput) {
        return prisma.document.create({
            data,
            include: {
                approvals: true,
                auditlogs: true,
                department: true,
                isoClause: true,
                owner: true,
                reviews: true,
                versions: true,
                type: true,
            }
        });
    }

    async getDocumentById(id: string) {
        return prisma.document.findUnique({
            where: { id }
        });
    }

    async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
        return prisma.document.update({
            where: { id },
            data,
        });
    }

    async deleteDocument(id: string) {
        return prisma.document.delete({ where: { id } });
    }

    async listDocuments() {
        return prisma.document.findMany({
            include: {
                approvals: true,
                auditlogs: true,
                department: true,
                isoClause: true,
                owner: true,
                reviews: true,
                versions: true,
                type: true,
            }
        });
    }
}
