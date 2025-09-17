import app from '@/app';
import prismaMock from '@/database/mocks/prisma';
import request from 'supertest';

describe('Document controller', () => {
    const BASE_URL = '/documents';

    const documentMock = {
        id: 'doc123',
        title: 'Test Doc',
        description: 'A document for testing',
        status: 'DRAFT',
        type: { id: 'type123' },
        department: { id: 'dep123' },
        isoClause: { id: 'iso123' },
        fileUrl: 'test.pdf',
        versions: [
            {
                id: 'ver123',
                version: '1.0',
                isCurrent: true,
                fileUrl: 'test.pdf',
            },
        ],
        reviewers: [{ id: 'user1' }, { id: 'user2' }],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

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
            prismaMock.document.create.mockResolvedValue(documentMock);

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

            console.log('Response body:', res.body); // 🔍 debug

            expect(res.status).toBe(201);
        });
        // it('should return 201 if document is created successfully', async () => {
        //     prismaMock.document.create.mockResolvedValue(documentMock);

        //     expect(res.status).toBe(201);
        //     expect(res.body).toHaveProperty('id', 'doc123');
        //     expect(res.body.versions[0]).toHaveProperty('version', '1.0');
        // });
    });

    describe('Document controller - getById', () => {
        it('should return 200 when document is found', async () => {
            prismaMock.document.findUnique.mockResolvedValue(documentMock);
            const res = await request(app).get(`${BASE_URL}/${documentMock.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if document is not found', async () => {
            prismaMock.document.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.document.findUnique.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(`${BASE_URL}/${documentMock.id}`);
            expect(res.status).toBe(400);
        });
    });

    describe('Document control - update', () => {
        it('should return 200 when document is updated successfully', async () => {
            prismaMock.document.findUnique.mockResolvedValue(documentMock);
            prismaMock.document.update.mockResolvedValue({ ...documentMock, title: 'Updated Doc' });

            const res = await request(app)
                .put(`${BASE_URL}/${documentMock.id}`)
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
            prismaMock.document.findUnique.mockResolvedValue(documentMock);
            prismaMock.document.delete.mockResolvedValue(documentMock);

            const res = await request(app).delete(`${BASE_URL}/${documentMock.id}`);

            expect(res.status).toBe(204);
        });

        it('should return 400 if delete fails', async () => {
            prismaMock.document.delete.mockRejectedValue(new Error('Delete failed'));

            const res = await request(app).delete(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(400);
        });
    });

    // describe('Document controller - findAll', () => {
    //     it('should return 200 when document is found', async () => {
    //         prismaMock.document.findMany.mockResolvedValue([documentMock]);
    //         const res = await request(app).get(BASE_URL);
    //         expect(res.status).toBe(200);
    //     });

    //     // it('should return 400 if prisma throws an error', async () => {
    //     //     prismaMock.document.findMany.mockRejectedValue(new Error('Database error'));
    //     //     const res = await request(app).get(BASE_URL);
    //     //     expect(res.status).toBe(400);
    //     // });
    // });

    // describe('Document controller - getStatistics', () => {
    //     it('should return 200 with statistics when service resolves', async () => {
    //         const statsMock = { total: 5, approved: 2, pending: 3 };
    //         // on mock le service
    //         prismaMock.$queryRaw.mockResolvedValue(statsMock);

    //         const res = await request(app).get(`${BASE_URL}/statistics`);

    //         expect(res.status).toBe(200);
    //         expect(res.body).toEqual(statsMock);
    //     });

    //     it('should return 400 if service throws an error', async () => {
    //         prismaMock.$queryRaw.mockRejectedValue(new Error('Database error'));

    //         const res = await request(app).get(`${BASE_URL}/statistics`);

    //         expect(res.status).toBe(400);
    //     });
    // });
});
