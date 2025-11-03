import app from '@/app';
import request from 'supertest';
import prismaMock from '@/database/mocks/prisma';
import { department } from '../fixtures/departments.fixture';

describe('Department controller', () => {
    const BASE_URL = '/departments';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('Create department', () => {
        it('should return 404 if department is not found', async () => {
            prismaMock.department.findFirst.mockResolvedValue(null);
            const res = await request(app).patch(BASE_URL);
            expect(res.status).toBe(404);
        });

        it('it should return 201 if department is created successfully ', async () => {
            prismaMock.department.create.mockResolvedValue(department);
            const res = await request(app)
                .post(BASE_URL)
                .send({ name: 'IT', description: 'Information Technology' });
            expect(res.status).toBe(201);
        });
    });

    describe('Department controller - getById', () => {
        it('should return 200 when department is found', async () => {
            prismaMock.department.findUnique.mockResolvedValue(department);
            const res = await request(app).get(`${BASE_URL}/${department.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if department is not found', async () => {
            prismaMock.department.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.department.findUnique.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get(`${BASE_URL}/${department.id}`);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error', 'Database error');
        });
    });

    describe('Department controller - update', () => {
        it('should return 200 when department is updated successfully', async () => {
            prismaMock.department.update.mockResolvedValue(department);
            const res = await request(app)
                .put(`${BASE_URL}/${department.id}`)
                .send({ name: 'Updated IT', description: 'Update Information Technology' });

            expect(res.status).toBe(200);
        });
    });

    describe('Departemnt controller - findAll', () => {
        it('should return 200 when department is found', async () => {
            prismaMock.department.findMany.mockResolvedValue([department]);
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(200);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.department.findMany.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(500);
        });
    });

    describe('Department controller - delete', () => {
        it('should return 204 when department is deleted successfully', async () => {
            prismaMock.department.delete.mockResolvedValue(department);
            const res = await request(app).delete(`${BASE_URL}/${department.id}`);
            expect(res.status).toBe(204);
        });
    });
});
