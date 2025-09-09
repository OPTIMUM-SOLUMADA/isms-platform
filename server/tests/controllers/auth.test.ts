import request from 'supertest';
import app from '@/app';
import prisma from '@/database/mocks/prisma';
import { mockUser } from '../mocks/data';

describe('Auth controller', () => {
    describe('login', () => {
        const baseUrl = '/auth/login';

        it('should not allow login with invalid credentials', async () => {
            const res = await request(app).post(baseUrl).send({
                email: 'test@test.com',
                password: 'test123',
            });

            expect(res.status).toBe(400);
        });

        it('should allow login with valid credentials', async () => {
            prisma.user.findUnique.mockResolvedValue(mockUser);
            const res = await request(app).post(baseUrl).send({
                email: 'test@test.com',
                password: 'test007',
            });

            expect(res.status).toBe(200);
        });
    });

    describe('reset-password', () => {
        const baseUrl = '/auth/reset-password';

        it('should not allow forgot-password with invalid email', async () => {
            const res = await request(app).post(baseUrl).send({
                email: 'test@',
            });

            expect(res.status).toBe(400);
        });
    });

    describe('change-password', () => {
        const baseUrl = '/auth/change-password';

        it('should not allow change-password without reset token', async () => {
            const res = await request(app).patch(baseUrl).send({
                password: 'pws1627',
            });

            expect(res.status).toBe(400);
        });
    });
});
