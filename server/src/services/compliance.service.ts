import {
    Prisma,
    ClauseComplianceStatus,
    ComplianceStatus,
    NonConformityStatus,
    ActionStatus,
} from '@prisma/client';
import prisma from '@/database/prisma';

export type ClauseCompliancePayload = Prisma.ClauseComplianceGetPayload<{
    include: { isoClause: true };
}>;
export type DocumentCompliancePayload = Prisma.DocumentComplianceGetPayload<{
    include: { document: true };
}>;
export type NonConformityPayload = Prisma.NonConformityGetPayload<{
    include: { correctiveActions: true; document: true; user: true };
}>;
export type CorrectiveActionPayload = Prisma.CorrectiveActionGetPayload<{
    include: { owner: true };
}>;

export class ComplianceService {
    // -------------------------
    // Clause Compliance
    // -------------------------
    async getAllClauses(): Promise<ClauseCompliancePayload[]> {
        return prisma.clauseCompliance.findMany({
            include: { isoClause: true },
        });
    }

    async updateClauseStatus(
        id: string,
        status: ClauseComplianceStatus,
        evidence?: string,
    ): Promise<ClauseCompliancePayload> {
        const data = {
            status,
            checkedAt: new Date(),
            evidence: evidence ?? null,
        };

        return prisma.clauseCompliance.update({
            where: { id },
            data,
            include: { isoClause: true },
        });
    }

    // -------------------------
    // Document Compliance
    // -------------------------
    async getDocumentCompliance(documentId: string) {
        return prisma.documentCompliance.findMany({
            where: { documentId },
        });
    }

    async updateDocumentCompliance(id: string, status: ComplianceStatus, description?: string) {
        const payload = {
            status,
            checkedAt: new Date(),
            description: description ?? null,
        };

        // The route passes the document id as `id` param. We need to update the
        // existing DocumentCompliance for that document if any, otherwise create one
        // and connect it to the document. documentId is not unique, so use findFirst.
        const existing = await prisma.documentCompliance.findFirst({ where: { documentId: id } });

        if (existing) {
            return prisma.documentCompliance.update({
                where: { id: existing.id },
                data: payload,
            });
        }

        return prisma.documentCompliance.create({
            data: {
                ...payload,
                document: { connect: { id } },
            },
        });
    }

    // -------------------------
    // NonConformities
    // -------------------------
    async getAllNonConformities(): Promise<NonConformityPayload[]> {
        return prisma.nonConformity.findMany({
            include: { correctiveActions: true, document: true, user: true },
        });
    }

    async createNonConformity(data: {
        type: string;
        description: string;
        documentId?: string;
        userId?: string;
    }): Promise<NonConformityPayload> {
        const createData: Prisma.NonConformityCreateInput = {
            type: data.type as any,
            description: data.description ?? null,
            // detectedAt/resolvedAt/status will use defaults defined in schema
        } as any;

        if (data.documentId) {
            // connect to existing document
            (createData as any).document = { connect: { id: data.documentId } };
        }

        if (data.userId) {
            (createData as any).user = { connect: { id: data.userId } };
        }

        return prisma.nonConformity.create({
            data: createData,
            include: { correctiveActions: true, document: true, user: true },
        });
    }

    async updateNonConformityStatus(
        id: string,
        status: NonConformityStatus,
    ): Promise<NonConformityPayload> {
        return prisma.nonConformity.update({
            where: { id },
            data: { status },
            include: { correctiveActions: true, document: true, user: true },
        });
    }

    // -------------------------
    // Corrective Actions
    // -------------------------
    async createCorrectiveAction(
        nonConformityId: string,
        description: string,
        ownerId?: string,
        dueDate?: Date,
    ): Promise<CorrectiveActionPayload> {
        const createData: Prisma.CorrectiveActionCreateInput = {
            description,
            status: ActionStatus.PENDING,
        } as any;

        // Connect the required nonConformity relation
        (createData as any).nonConformity = { connect: { id: nonConformityId } };

        // Optional owner
        if (ownerId) {
            (createData as any).owner = { connect: { id: ownerId } };
        }

        if (dueDate) {
            (createData as any).dueDate = dueDate;
        } else {
            (createData as any).dueDate = null;
        }

        return prisma.correctiveAction.create({
            data: createData,
            include: { owner: true },
        });
    }

    async updateCorrectiveActionStatus(
        id: string,
        status: ActionStatus,
        completedAt?: Date,
    ): Promise<CorrectiveActionPayload> {
        return prisma.correctiveAction.update({
            where: { id },
            data: {
                status,
                completedAt: completedAt ?? (status === ActionStatus.COMPLETED ? new Date() : null),
            },
            include: { owner: true },
        });
    }

    async getCorrectiveActions(nonConformityId: string): Promise<CorrectiveActionPayload[]> {
        return prisma.correctiveAction.findMany({
            where: { nonConformityId },
            include: { owner: true },
        });
    }

    // -------------------------
    // Stats
    // -------------------------
    async getComplianceStats() {
        const [totalClauses, totalDocuments, totalNonConformities] = await prisma.$transaction([
            prisma.clauseCompliance.count(),
            prisma.documentCompliance.count(),
            prisma.nonConformity.count(),
        ]);

        return { totalClauses, totalDocuments, totalNonConformities };
    }
}
