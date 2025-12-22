import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

export class DocumentApprovalService {
    /**
     * Create a new document approval entry.
     */
    async create(data: Prisma.DocumentApprovalCreateInput) {
        try {
            return await prismaPostgres.documentApproval.create({ data });
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
            return await prismaPostgres.documentApproval.findMany({
                where: {
                    ...(filters?.documentId && { id_document: filters?.documentId }),
                    ...(filters?.versionId && { id_version: filters?.versionId }),
                    ...(filters?.approverId && { id_approver: filters?.approverId }),
                },
                orderBy: { approved_at: 'desc' },
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
            return await prismaPostgres.documentApproval.findUnique({
                where: {
                    id_document_id_version_id_approver: {
                        id_document: documentId,
                        id_version: versionId,
                        id_approver: approverId,
                    },
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
            return await prismaPostgres.documentApproval.deleteMany({
                where: { id_approver: approverId },
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
            return await prismaPostgres.documentApproval.delete({
                where: {
                    id_document_id_version_id_approver: {
                        id_document: documentId,
                        id_version: versionId,
                        id_approver: approverId,
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
            return await prismaPostgres.documentApproval.count({
                where: { id_version: versionId },
            });
        } catch (error) {
            console.error('Error counting document approvals:', error);
            throw error;
        }
    }
}
