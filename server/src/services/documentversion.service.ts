import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export class DocumentVersionService {
    async getById(id: string) {
        return prisma.documentVersion.findFirst({
            where: {
                id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    async create(data: Prisma.DocumentVersionCreateInput) {
        return prisma.documentVersion.create({ data });
    }

    async update(id: string, data: Prisma.DocumentVersionUpdateInput) {
        return prisma.documentVersion.update({ where: { id }, data });
    }

    // patch version
    async createPatchedVersion(
        documentId: string,
        data: {
            userId: string;
            version: string;
            fileUrl?: string;
            googleDriveFileId: string;
        },
    ) {
        return prisma.$transaction(async (tx) => {
            // set current to false for all version of the doc
            await tx.documentVersion.updateMany({
                where: { documentId: documentId },
                data: { isCurrent: false },
            });

            // set current to true for the new version
            await tx.documentVersion.create({
                data: {
                    document: { connect: { id: documentId } },
                    isCurrent: true,
                    version: data.version,
                    ...(data.fileUrl && { fileUrl: data.fileUrl }),
                    createdBy: { connect: { id: data.userId } },
                    googleDriveFileId: data.googleDriveFileId,
                },
            });
        });
    }
}
