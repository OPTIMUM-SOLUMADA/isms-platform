import { prismaPostgres } from '@/database/prisma';
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
        await prismaPostgres.invitation.updateMany({
            where: { email: data.email, status: 'PENDING' },
            data: { status: 'EXPIRED' },
        });

        return prismaPostgres.invitation.create({
            data: {
                email: data.email,
                token,
                id_invited_by: data.invitedById,
                expires_at: expiresAt,
                status: 'PENDING',
            },
        });
    }

    static async resetInvitation(invitationId: string) {
        const newToken = crypto.randomUUID();
        const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        return prismaPostgres.invitation.update({
            where: { id_invitation: invitationId },
            data: { token: newToken, expires_at: newExpiresAt, status: 'PENDING' },
        });
    }

    static async expireInvitation(invitationId: string) {
        return prismaPostgres.invitation.update({
            where: { id_invitation: invitationId },
            data: { status: 'EXPIRED' },
        });
    }

    static async acceptInvitation(token: string, userId: string) {
        const invitation = await prismaPostgres.invitation.findUnique({
            where: { token },
        });

        if (!invitation || invitation.status !== 'PENDING') {
            throw new Error('Invitation invalid or already used');
        }

        if (invitation.expires_at < new Date()) {
            await prismaPostgres.invitation.update({
                where: { id_invitation: invitation.id_invitation },
                data: { status: 'EXPIRED' },
            });
            throw new Error('Invitation expired');
        }

        // mark accepted
        return prismaPostgres.invitation.update({
            where: { id_invitation: invitation.id_invitation },
            data: { status: 'ACCEPTED', accepted_at: new Date() },
        });
    }

    static async getAllInvitations() {
        return prismaPostgres.invitation.findMany({
            orderBy: { created_at: 'desc' },
        });
    }
}
