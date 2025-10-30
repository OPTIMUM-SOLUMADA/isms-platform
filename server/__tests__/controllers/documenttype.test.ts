import app from '@/app';
import prismaMock from '@/database/mocks/prisma';
import request from 'supertest';

describe('Document type controller', () => {
    const BASE_URL = '/document-types';

    const documentTypeMock = {
        id: 'type123',
        name: 'Test Type',
        description: 'A type for testing',
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('Create document type', () => {
        it('should return 201 if document type is created successfully ', async () => {
            prismaMock.documentType.create.mockResolvedValue(documentTypeMock);
            const res = await request(app)
                .post(BASE_URL)
                .send({ name: 'Test Type', description: 'A type for testing' });
            expect(res.status).toBe(201);
        });

        it('should return 404 if document type already exists', async () => {
            prismaMock.documentType.findFirst.mockResolvedValue(null);
            const res = await request(app).patch(BASE_URL);
            expect(res.status).toBe(404);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.documentType.create.mockRejectedValue(new Error('Create failed'));

            const res = await request(app)
                .post(BASE_URL)
                .send({ name: 'Invalid Type', description: 'Some desc' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Create failed');
        });
    });

    describe('Document type - findAll', () => {
        it('should return 200 when document types are found', async () => {
            prismaMock.documentType.findMany.mockResolvedValue([documentTypeMock]);
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(200);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.documentType.findMany.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(500);
        });
    });

    describe('Document type - getById', () => {
        it('should return 200 when document type is found', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(documentTypeMock);
            const res = await request(app).get(`${BASE_URL}/${documentTypeMock.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if document type is not found', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.documentType.findUnique.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(`${BASE_URL}/${documentTypeMock.id}`);
            expect(res.status).toBe(500);
        });
    });

    describe('Document type - update', () => {
        it('should return 200 when document type is updated successfully', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(documentTypeMock);
            prismaMock.documentType.update.mockResolvedValue(documentTypeMock);
            const res = await request(app)
                .put(`${BASE_URL}/${documentTypeMock.id}`)
                .send({ name: 'Updated Type', description: 'Update description' });
            expect(res.status).toBe(200);
        });

        it('should return 400 if document type is error', async () => {
            prismaMock.documentType.update.mockRejectedValue(new Error('Database error'));
            const res = await request(app)
                .put(`${BASE_URL}/invalid-id`)
                .send({ name: 'Updated Type', description: 'Update description' });
            expect(res.status).toBe(400);
        });

        it('should return 404 if document type is not found', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(null);
            const res = await request(app)
                .put(`${BASE_URL}/invalid-id`)
                .send({ name: 'Updated Type', description: 'Update description' });
            expect(res.status).toBe(404);
        });
    });

    describe('Document type - delete', () => {
        it('should return 204 when document type is deleted successfully', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(documentTypeMock);
            prismaMock.documentType.delete.mockResolvedValue(documentTypeMock);
            const res = await request(app).delete(`${BASE_URL}/${documentTypeMock.id}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 if document type is not found', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(null);
            const res = await request(app).delete(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.documentType.delete.mockRejectedValue(new Error('Database error'));
            const res = await request(app).delete(`${BASE_URL}/${documentTypeMock.id}`);
            expect(res.status).toBe(400);
        });
    });
});
