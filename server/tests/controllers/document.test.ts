import app from '@/app';
import prismaMock from '@/database/mocks/prisma';
import request from 'supertest';
import { document } from '../fixtures/document.fixture';

describe('Document controller', () => {
    const BASE_URL = '/documents';

    describe('Document controller - Create document', () => {
        it('should return 500 if creation fails', async () => {
            // on force Prisma à rejeter
            prismaMock.document.create.mockRejectedValue(new Error('Create failed'));

            const res = await request(app)
                .post(BASE_URL)
                .field('title', 'Test Doc')
                .field('owners', 'owner1')
                .field('reviewers', 'user1')
                .field('userId', 'creator123')
                .attach('file', Buffer.from('PDF content'), 'test.pdf');

            expect(res.status).toBe(500);
        });

        it('should create a document with owners and reviewers', async () => {
            prismaMock.document.create.mockResolvedValue(document);

            const res = await request(app)
                .post(`${BASE_URL}`)
                .field('title', 'Test Doc')
                .field('description', 'Description')
                .field('status', 'draft')
                .field('reviewers', 'user1,user2')
                .field('owners', 'owner1')
                .field('reviewFrequency', '6')
                .field('userId', 'owner1');
            // .attach('file', Buffer.from('PDF content'), 'test.pdf');

            expect(res.status).toBe(201);
        });
    });

    describe('Document controller - getById', () => {
        it('should return 200 when document is found', async () => {
            prismaMock.document.findUnique.mockResolvedValue(document);
            const res = await request(app).get(`${BASE_URL}/${document.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if document is not found', async () => {
            prismaMock.document.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.document.findUnique.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(`${BASE_URL}/${document.id}`);
            expect(res.status).toBe(400);
        });
    });

    describe('Document control - update', () => {
        it('should return 200 when document is updated successfully', async () => {
            prismaMock.document.findUnique.mockResolvedValue(document);
            prismaMock.document.update.mockResolvedValue({ ...document, title: 'Updated Doc' });

            const res = await request(app)
                .put(`${BASE_URL}/${document.id}`)
                .field('title', 'Updated Doc') // 👈 simulate multipart field
                .field('owners', 'owner1,owner2')
                .field('reviewers', 'user1,user2');

            expect(res.status).toBe(200);
        });

        it('should return 404 if update fails', async () => {
            prismaMock.document.update.mockRejectedValue(new Error('Update failed'));

            const res = await request(app)
                .put(`${BASE_URL}/error`)
                .field('title', 'Updated Doc') // 👈 simulate multipart field
                .field('owners', 'owner1,owner2')
                .field('reviewers', 'user1,user2');

            expect(res.status).toBe(404);
        });
    });

    describe('Document control - delete', () => {
        it('should return 204 when document is deleted successfully', async () => {
            prismaMock.document.findUnique.mockResolvedValue(document);
            prismaMock.document.delete.mockResolvedValue(document);

            const res = await request(app).delete(`${BASE_URL}/${document.id}`);

            expect(res.status).toBe(204);
        });

        it('should return 400 if delete fails', async () => {
            prismaMock.document.delete.mockRejectedValue(new Error('Delete failed'));

            const res = await request(app).delete(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(400);
        });
    });
});
