import app from '@/app';
import prismaMock from '@/database/mocks/prisma';
import request from 'supertest';

describe('DocumentReview controller', () => {
    const BASE_URL = '/document-reviews';

    const reviewMock = {
        id: '68bacbe3ea87ed93cc6fa894',
        isCompleted: false,
        assignedById: '68bacbe3ea87ed93cc6fa894',
        comment: 'comment',
        decision: null,
        createdAt: new Date(),
        documentId: '68bacbe3ea87ed93cc6fa894',
        reviewDate: new Date(),
        reviewerId: '68bacbe3ea87ed93cc6fa894',
    };

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    describe('Create Review', () => {
        it('should return 400 if review is not found', async () => {
            prismaMock.documentReview.findFirst.mockResolvedValue(null);
            const res = await request(app).post(BASE_URL);
            expect(res.status).toBe(400);
        });

        it('it should return 201 if review is created successfully ', async () => {
            prismaMock.documentReview.create.mockResolvedValue(reviewMock);
            const res = await request(app).post(BASE_URL).send({
                document: 'doc123',
                reviewer: 'user123',
                dueDate: reviewMock.reviewDate,
            });
            expect(res.status).toBe(201);
        });
    });

    describe('Review controller - findAll', () => {
        it('should return 200 when review is found', async () => {
            prismaMock.documentReview.findMany.mockResolvedValue([reviewMock]);
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(200);
        });

        it('should return 500 if prisma throws an error', async () => {
            prismaMock.documentReview.findMany.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(500);
        });
    });

    describe('Review controller - update', () => {
        it('should return 200 when review is updated successfully', async () => {
            prismaMock.documentReview.update.mockResolvedValue(reviewMock);
            const res = await request(app)
                .put(`${BASE_URL}/${reviewMock.id}`)
                .send({ comment: 'commentaire update' });
            expect(res.status).toBe(200);
        });

        it('should return 400 if update fails', async () => {
            prismaMock.documentReview.update.mockRejectedValue(new Error('Update failed'));

            const res = await request(app)
                .put(`${BASE_URL}/${reviewMock.id}`)
                .send({ reviewDate: new Date() });

            expect(res.status).toBe(400);
        });
    });

    // describe('Review controller - delete', () => {
    //     it('should return 204 when Review is deleted successfully', async () => {
    //         prismaMock.documentReview.delete.mockResolvedValue(reviewMock);

    //         const res = await request(app).delete(`${BASE_URL}/${reviewMock.id}`);

    //         expect(res.status).toBe(404);
    //     });

    //     it('should return 404 if delete fails', async () => {
    //         prismaMock.documentReview.delete.mockRejectedValue(new Error('Delete failed'));

    //         const res = await request(app).delete(`${BASE_URL}/invalid-id`);

    //         expect(res.status).toBe(404);
    //     });
    // });

    describe('Mark as completed', () => {
        const url = `${BASE_URL}/mark-as-completed/${reviewMock.id}`;

        it('it should return 404 if review is not found', async () => {
            prismaMock.documentReview.findFirst.mockResolvedValue(null);
            const res = await request(app).patch(url);
            expect(res.status).toBe(404);
        });

        it('it should return 400 if review is already completed', async () => {
            prismaMock.documentReview.findFirst.mockResolvedValue({
                ...reviewMock,
                isCompleted: true,
            });
            const res = await request(app).patch(url);
            expect(res.status).toBe(400);
        });

        it('it should mark a review as completed', async () => {
            prismaMock.documentReview.findFirst.mockResolvedValue({
                ...reviewMock,
                isCompleted: false,
            });
            prismaMock.documentReview.update.mockResolvedValue({
                ...reviewMock,
                isCompleted: true,
            });

            const res = await request(app).patch(url);
            expect(res.status).toBe(200);
            expect(res.body.isCompleted).toBe(true);
        });
    });

    describe('Make decision', () => {
        const url = `${BASE_URL}/make-decision/${reviewMock.id}`;

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post(url);
            expect(res.status).toBe(400);
        });

        it('should return 404 if review is not found', async () => {
            prismaMock.documentReview.findFirst.mockResolvedValue(null);
            const res = await request(app).post(url).send({
                decision: 'APPROVE',
                comment: 'comment blabla...',
            });
            expect(res.status).toBe(404);
        });

        it('should make a decision', async () => {
            prismaMock.documentReview.findFirst.mockResolvedValue(reviewMock);
            prismaMock.documentReview.update.mockResolvedValue({
                ...reviewMock,
                decision: 'APPROVE',
            });
            const res = await request(app).post(url).send({
                decision: 'APPROVE',
                comment: 'comment blabla...',
            });
            expect(res.status).toBe(200);
            expect(res.body.decision).toBe('APPROVE');
        });
    });
});
