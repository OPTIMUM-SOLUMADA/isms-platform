import prisma from '@/database/prisma';
import crypto from 'crypto';

export type InvitationData = {
    email: string;
    invitedById: string;
    message?: string;
};

export class InvitationService {
    static async createInvitation(data: InvitationData) {
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

        // optional: expire old pending invitations for the same email
        await prisma.invitation.updateMany({
            where: { email: data.email, status: 'PENDING' },
            data: { status: 'EXPIRED' },
        });

        return prisma.invitation.create({
            data: {
                email: data.email,
                token,
                invitedById: data.invitedById,
                expiresAt,
                status: 'PENDING',
            },
        });
    }

    static async resetInvitation(invitationId: string) {
        const newToken = crypto.randomUUID();
        const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        return prisma.invitation.update({
            where: { id: invitationId },
            data: { token: newToken, expiresAt: newExpiresAt, status: 'PENDING' },
        });
    }

    static async expireInvitation(invitationId: string) {
        return prisma.invitation.update({
            where: { id: invitationId },
            data: { status: 'EXPIRED' },
        });
    }

    static async acceptInvitation(token: string, userId: string) {
        const invitation = await prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation || invitation.status !== 'PENDING') {
            throw new Error('Invitation invalid or already used');
        }

        if (invitation.expiresAt < new Date()) {
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' },
            });
            throw new Error('Invitation expired');
        }

        // mark accepted
        return prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED', acceptedAt: new Date() },
        });
    }

    static async getAllInvitations() {
        return prisma.invitation.findMany({
            orderBy: { createdAt: 'desc' },
            include: { invitedBy: true },
        });
    }
}
