import app from '@/app';
import request from 'supertest';
import prismaMock from '@/database/mocks/prisma';

describe('Invitation controller', () => {
    const BASE_URL = '/invitation';

    const invitationMock = {
        id: '68bacbe3ea87ed93cc6fa894',
        email: 'test@test',
        message: 'test',
        documentId: '68bacbe3ea87ed93cc6fa894',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('InvitationController.create', () => {
        // it('should return 201 if invitation is created successfully', async () => {
        //     // Prisma mock
        //     prismaMock.invitation.create.mockResolvedValue(invitationMock);

        //     const res = await request(app).post(BASE_URL).send({
        //         email: 'test@test',
        //         message: 'test',
        //         invitedById: 'user1', // obligatoire selon ton controller
        //     });

        //     expect(res.status).toBe(201);
        //     expect(res.body).toHaveProperty('id', 'invite123');
        //     expect(res.body).toHaveProperty('email', 'test@test');
        //     expect(res.body).toHaveProperty('invitedById', 'user1');
        // });

        it('should return 401 if userId is missing', async () => {
            const res = await request(app).post(BASE_URL).send({
                email: 'test@test',
                message: 'test',
            });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 500 if creation fails', async () => {
            prismaMock.invitation.create.mockRejectedValue(new Error('DB error'));

            const res = await request(app).post(BASE_URL).send({
                email: 'test@test',
                message: 'test',
                userId: 'user1',
            });

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'DB error');
        });
    });
});
