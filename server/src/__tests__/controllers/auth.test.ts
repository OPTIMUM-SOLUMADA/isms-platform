import request from 'supertest';
import app from '@/app';
import prisma from '@/database/mocks/prisma';
import { mockUser } from '../mocks/data';

describe('Auth controller', () => {

    const baseUrl = "/auth/login";

    it("should not allow login with invalid credentials", async () => {
        const res = await request(app).post(baseUrl).send({
            email: "test@test.com",
            password: "test123"
        });

        expect(res.status).toBe(401);
    });

    it("should allow login with valid credentials", async () => {
        prisma.user.findUnique.mockResolvedValue(mockUser);
        const res = await request(app).post(baseUrl).send({
            email: "test@test.com",
            password: "test007"
        });

        expect(res.status).toBe(200);
    });

});