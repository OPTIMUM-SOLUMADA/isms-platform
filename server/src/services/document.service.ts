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
            },
        });
    }

    async getDocumentById(id: string) {
        return prisma.document.findUnique({
            where: { id },
            include: {
                approvals: true,
                auditlogs: true,
                department: true,
                isoClause: true,
                owner: true,
                reviews: true,
                versions: true,
                type: true,
            },
        });
    }

    async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
        return prisma.document.update({
            where: { id },
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

    async deleteDocument(id: string) {
        return prisma.document.delete({ where: { id } });
    }

    async listDocuments({
        page = 1, limit = 50
    }: { page: number, limit: number }) {

        const skip = (page - 1) * limit;

        const [items, total] = await prisma.$transaction([
            prisma.document.findMany({
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc"
                },
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
            }),
            prisma.document.count()
        ]);

        return {
            data: items,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    // document stats
    async getDocumentStats() {
        const [total, draft, inReview, approved, expired] = await prisma.$transaction([
            prisma.document.count(),
            prisma.document.count({ where: { status: "DRAFT" } }),
            prisma.document.count({ where: { status: "IN_REVIEW" } }),
            prisma.document.count({ where: { status: "APPROVED" } }),
            prisma.document.count({ where: { status: "EXPIRED" } }),
        ]);

        return {
            total,
            draft,
            inReview,
            approved,
            expired
        };
    }
}
