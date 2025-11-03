import app from '@/app';
import prismaMock from '@/database/mocks/prisma';
import request from 'supertest';
import { documentType } from '../fixtures/documenttype.fixture';

describe('Document type controller', () => {
    const BASE_URL = '/document-types';

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('Create document type', () => {
        it('should return 201 if document type is created successfully ', async () => {
            prismaMock.documentType.create.mockResolvedValue(documentType);
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
            prismaMock.documentType.findMany.mockResolvedValue([documentType]);
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
            prismaMock.documentType.findUnique.mockResolvedValue(documentType);
            const res = await request(app).get(`${BASE_URL}/${documentType.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if document type is not found', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.documentType.findUnique.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(`${BASE_URL}/${documentType.id}`);
            expect(res.status).toBe(500);
        });
    });

    describe('Document type - update', () => {
        it('should return 200 when document type is updated successfully', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(documentType);
            prismaMock.documentType.update.mockResolvedValue(documentType);
            const res = await request(app)
                .put(`${BASE_URL}/${documentType.id}`)
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
            prismaMock.documentType.findUnique.mockResolvedValue(documentType);
            prismaMock.documentType.delete.mockResolvedValue(documentType);
            const res = await request(app).delete(`${BASE_URL}/${documentType.id}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 if document type is not found', async () => {
            prismaMock.documentType.findUnique.mockResolvedValue(null);
            const res = await request(app).delete(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.documentType.delete.mockRejectedValue(new Error('Database error'));
            const res = await request(app).delete(`${BASE_URL}/${documentType.id}`);
            expect(res.status).toBe(400);
        });
    });
});
