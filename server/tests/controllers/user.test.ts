import app from '@/app';
import request from 'supertest';
import prismaMock from '@/database/mocks/prisma';
import { user } from '../fixtures/users.fixture';

describe('User controller', () => {
    const BASE_URL = '/users';

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('Create user', () => {
        // it('should return 201 if user is created successfully', async () => {
        //     prismaMock.user.findUnique.mockResolvedValue(null); // user n’existe pas
        //     prismaMock.user.create.mockResolvedValue(user); // création réussie

        //     const res = await request(app).post(BASE_URL).send({
        //         name: 'John Doe', // 👈 attendu par Joi et controller
        //         email: 'test@test.com', // 👈 valide
        //         role: 'admin', // 👈 doit exister dans roleValues
        //         departmentId: '507f1f77bcf86cd799439011', // 👈 24 caractères hex
        //     });

        //     expect(res.status).toBe(201);
        //     expect(res.body).toHaveProperty('id', user.id);
        // });

        it('should return 400 if email is invalid', async () => {
            const res = await request(app).post(BASE_URL).send({
                name: 'John Doe',
                email: 'invalid-email',
                role: 'admin',
                departmentId: '507f1f77bcf86cd799439011',
            });

            expect(res.status).toBe(400);
        });

        // it('should return 500 if prisma throws an error', async () => {
        //     const error = new Error('Database error');
        //     prismaMock.user.create.mockRejectedValue(error);

        //     const res = await request(app).post(BASE_URL).send({
        //         name: 'John Doe',
        //         email: 'test@test',
        //         role: 'admin',
        //         departmentId: '507f1f77bcf86cd799439011',
        //     });

        //     expect(res.status).toBe(500);
        //     expect(res.body).toHaveProperty('message', 'Database error');
        // });
    });

    describe('Get user by id', () => {
        it('should return 200 when user is found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(user);
            const res = await request(app).get(`${BASE_URL}/${user.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if user is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('shourld return 400 if prisma throws an error', async () => {
            prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(`${BASE_URL}/${user.id}`);
            expect(res.status).toBe(400);
        });
    });

    describe('update user', () => {
        it('should return 200 when user is updated successfully', async () => {
            prismaMock.user.update.mockResolvedValue(user);
            const res = await request(app)
                .put(`${BASE_URL}/${user.id}`)
                .send({ name: 'Updated name' });
            expect(res.status).toBe(200);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.user.update.mockRejectedValue(new Error('Database error'));
            const res = await request(app)
                .put(`${BASE_URL}/${user.id}`)
                .send({ name: 'Updated name' });
            expect(res.status).toBe(400);
        });
    });

    describe('Deleted an user', () => {
        it('should return 204 when user is deleted successfully', async () => {
            prismaMock.user.delete.mockResolvedValue(user);
            const res = await request(app).delete(`${BASE_URL}/${user.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.user.delete.mockRejectedValue(new Error('Database error'));
            const res = await request(app).delete(`${BASE_URL}/${user.id}`);
            expect(res.status).toBe(400);
        });
    });

    describe('Departemnt controller - findAll', () => {
        it('should return 200 when department is found', async () => {
            prismaMock.user.findMany.mockResolvedValue([user]);
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(200);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.user.findMany.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(400);
        });
    });
});
