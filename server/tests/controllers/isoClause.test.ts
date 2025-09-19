import app from '@/app';
import request from 'supertest';
import prismaMock from '@/database/mocks/prisma';

describe('ISOClause controller', () => {
    const BASE_URL = '/iso-clauses';

    const isoClauseMock = {
        id: '68bacbe3ea87ed93cc6fa894',
        name: 'ISO 9001',
        description: 'ISO 9001:2015',
        code: 'ISO 9001',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('Create ISO clause', () => {
        it('should return 201 if ISO clause is created successfully ', async () => {
            prismaMock.iSOClause.findFirst.mockResolvedValue(null);
            prismaMock.iSOClause.create.mockResolvedValue(isoClauseMock);
            const res = await request(app)
                .post(BASE_URL)
                .send({ name: 'ISO 9001', description: 'ISO 9001:2015', code: 'ISO 9001' });
            expect(res.status).toBe(201);
        });

        it('should return 404 if ISO clause already exists', async () => {
            prismaMock.iSOClause.findFirst.mockResolvedValue(isoClauseMock);
            const res = await request(app).patch(BASE_URL);
            expect(res.status).toBe(404);
        });
    });

    describe('Get all ISO clauses', () => {
        it('should return 200 when ISO clauses are found', async () => {
            prismaMock.iSOClause.findMany.mockResolvedValue([isoClauseMock]);
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(200);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.iSOClause.findMany.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(500);
        });
    });

    describe('Get ISO clause by id', () => {
        it('should return 200 when ISO clause is found', async () => {
            prismaMock.iSOClause.findUnique.mockResolvedValue(isoClauseMock);
            const res = await request(app).get(`${BASE_URL}/${isoClauseMock.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if ISO clause is not found', async () => {
            prismaMock.iSOClause.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.iSOClause.findUnique.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(`${BASE_URL}/${isoClauseMock.id}`);
            expect(res.status).toBe(500);
        });
    });

    describe('Update ISO clause', () => {
        it('should return 200 when ISO clause is updated successfully', async () => {
            prismaMock.iSOClause.update.mockResolvedValue(isoClauseMock);
            const res = await request(app)
                .put(`${BASE_URL}/${isoClauseMock.id}`)
                .send({ name: 'Updated name' });
            expect(res.status).toBe(200);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.iSOClause.update.mockRejectedValue(new Error('Database error'));
            const res = await request(app)
                .put(`${BASE_URL}/${isoClauseMock.id}`)
                .send({ name: 'Updated name' });
            expect(res.status).toBe(400);
        });
    });

    describe('Deleted an ISO clause', () => {
        it('should return 204 when ISO clause is deleted successfully', async () => {
            prismaMock.iSOClause.delete.mockResolvedValue(isoClauseMock);
            const res = await request(app).delete(`${BASE_URL}/${isoClauseMock.id}`);
            expect(res.status).toBe(204);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.iSOClause.delete.mockRejectedValue(new Error('Database error'));
            const res = await request(app).delete(`${BASE_URL}/${isoClauseMock.id}`);
            expect(res.status).toBe(400);
        });
    });
});
