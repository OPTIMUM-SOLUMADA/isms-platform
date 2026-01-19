import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export class DocumentApprovalService {
    /**
     * Create a new document approval entry.
     */
    async create(data: Prisma.DocumentApprovalCreateInput) {
        try {
            return await prisma.documentApproval.create({ data });
        } catch (error) {
            console.error('Error creating document approval:', error);
            // throw error;
            return null;
        }
    }

    /**
     * Find all approvals, optionally filtered by documentId, versionId, or approverId.
     */
    async findAll(filters?: { documentId?: string; versionId?: string; approverId?: string }) {
        try {
            return await prisma.documentApproval.findMany({
                where: {
                    ...(filters?.documentId && { documentId: filters?.documentId }),
                    ...(filters?.versionId && { versionId: filters?.versionId }),
                    ...(filters?.approverId && { approverId: filters?.approverId }),
                },
                include: {
                    document: true,
                    version: true,
                    approver: true,
                },
                orderBy: { approvedAt: 'desc' },
            });
        } catch (error) {
            console.error('Error fetching document approvals:', error);
            throw error;
        }
    }

    /**
     * Find a single approval by documentId, versionId, and approverId.
     */
    async findUnique(documentId: string, versionId: string, approverId: string) {
        try {
            return await prisma.documentApproval.findUnique({
                where: {
                    documentId_versionId_approverId: {
                        documentId,
                        versionId,
                        approverId,
                    },
                },
                include: {
                    document: true,
                    version: true,
                    approver: true,
                },
            });
        } catch (error) {
            console.error('Error fetching document approval:', error);
            throw error;
        }
    }

    /**
     * Delete all approvals for a given approver (user) id.
     */
    async deleteByApproverId(approverId: string) {
        try {
            return await prisma.documentApproval.deleteMany({
                where: { approverId },
            });
        } catch (error) {
            console.error('Error deleting document approvals by approver id:', error);
            throw error;
        }
    }



    /**
     * Delete an approval record.
     */
    async delete(documentId: string, versionId: string, approverId: string) {
        try {
            return await prisma.documentApproval.delete({
                where: {
                    documentId_versionId_approverId: {
                        documentId,
                        versionId,
                        approverId,
                    },
                },
            });
        } catch (error) {
            console.error('Error deleting document approval:', error);
            throw error;
        }
    }

    /**
     * Count how many approvals a document version has.
     */
    async countByVersion(versionId: string) {
        try {
            return await prisma.documentApproval.count({
                where: { versionId },
            });
        } catch (error) {
            console.error('Error counting document approvals:', error);
            throw error;
        }
    }
}
