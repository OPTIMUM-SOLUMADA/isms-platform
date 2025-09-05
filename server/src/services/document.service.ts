import { Prisma } from '@prisma/client';
import prisma from '@/database/prisma';
import { UserService } from './user.service';
import { DocumentOwnerService } from './documentowner.service';

export class DocumentService {
    protected userService: UserService;
    protected documentOwnerService: DocumentOwnerService;
    protected documentInclude: Prisma.DocumentInclude;
    constructor() {
        this.userService = new UserService();
        this.documentOwnerService = new DocumentOwnerService();
        this.documentInclude = {
            approvals: true,
            auditlogs: true,
            department: true,
            isoClause: true,
            reviews: true,
            versions: true,
            type: true,
            owners: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            createdAt: true,
                        },
                    },
                },
            },
            reviewers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            createdAt: true,
                        },
                    },
                },
            },
        };
    }

    async createDocument(data: Prisma.DocumentCreateInput) {
        return prisma.document.create({
            data,
            include: this.documentInclude,
        });
    }
    async createDocumentWithOwnersAndReviewers(
        data: Prisma.DocumentCreateInput,
        ownerIds: string[],
        reviewerIds: string[],
    ) {
        return prisma.$transaction(async (tx) => {
            const doc = await tx.document.create({ data });
            const ownersData = ownerIds.map((userId) => ({ documentId: doc.id, userId }));
            const reviewersData = reviewerIds.map((userId) => ({ documentId: doc.id, userId }));
            // create reviewers
            await tx.documentReviewer.createMany({ data: reviewersData });
            // create owners
            await tx.documentOwner.createMany({ data: ownersData });
            // return document
            return tx.document.findUnique({
                where: { id: doc.id },
                include: this.documentInclude,
            });
        });
    }

    async updateDocumentWithOwnersAndReviewers(
        id: string,
        data: Prisma.DocumentUpdateInput,
        ownerIds: string[],
        reviewerIds: string[],
    ) {
        return prisma.$transaction(async (tx) => {
            // Update the document fields
            const doc = await tx.document.update({
                where: { id },
                data,
            });

            // Replace owners (delete old, insert new)
            await tx.documentOwner.deleteMany({ where: { documentId: id } });
            const ownersData = ownerIds.map((userId) => ({
                documentId: id,
                userId,
            }));
            if (ownersData.length) {
                await tx.documentOwner.createMany({ data: ownersData });
            }

            // Remove reviewers (delete old, insert new)
            await tx.documentReviewer.deleteMany({ where: { documentId: id } });
            const reviewersData = reviewerIds.map((userId) => ({
                documentId: id,
                userId,
            }));
            if (reviewersData.length) {
                await tx.documentReviewer.createMany({ data: reviewersData });
            }

            // Return the updated document with owners
            return tx.document.findUnique({
                where: { id: doc.id },
                include: this.documentInclude,
            });
        });
    }

    async getDocumentById(id: string) {
        return prisma.document.findUnique({
            where: { id },
            include: this.documentInclude,
        });
    }

    async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
        return prisma.document.update({
            where: { id },
            data,
            include: this.documentInclude,
        });
    }

    async deleteDocument(id: string) {
        return prisma.document.delete({ where: { id } });
    }

    async listDocuments({ page = 1, limit = 50 }: { page: number; limit: number }) {
        const skip = (page - 1) * limit;

        const [items, total] = await prisma.$transaction([
            prisma.document.findMany({
                skip,
                take: limit,
                orderBy: {
                    updatedAt: 'desc',
                },
                include: this.documentInclude,
            }),
            prisma.document.count(),
        ]);

        return {
            data: items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // document stats
    async getDocumentStats() {
        const [total, draft, inReview, approved, expired] = await prisma.$transaction([
            prisma.document.count(),
            prisma.document.count({ where: { status: 'DRAFT' } }),
            prisma.document.count({ where: { status: 'IN_REVIEW' } }),
            prisma.document.count({ where: { status: 'APPROVED' } }),
            prisma.document.count({ where: { status: 'EXPIRED' } }),
        ]);

        return {
            total,
            draft,
            inReview,
            approved,
            expired,
        };
    }

    // publish document
    async publishDocument(id: string) {
        return prisma.document.update({
            where: { id },
            data: {
                published: true,
                publicationDate: new Date(),
            },
            include: this.documentInclude,
        });
    }

    // unpublish document
    async unpublishDocument(id: string) {
        return prisma.document.update({
            where: { id },
            data: {
                published: false,
                publicationDate: null,
            },
            include: this.documentInclude,
        });
    }
}
