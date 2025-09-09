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
