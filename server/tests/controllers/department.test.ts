import app from '@/app';
import request from 'supertest';
import prismaMock from '@/database/mocks/prisma';

describe('Department controller', () => {
    const BASE_URL = '/departments';

    const departmentMock = {
        id: '68bacbe3ea87ed93cc6fa894',
        name: 'IT',
        description: 'Information Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

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
            prismaMock.department.create.mockResolvedValue(departmentMock);
            const res = await request(app)
                .post(BASE_URL)
                .send({ name: 'IT', description: 'Information Technology' });
            expect(res.status).toBe(201);
        });
    });

    describe('Department controller - getById', () => {
        it('should return 200 when department is found', async () => {
            prismaMock.department.findUnique.mockResolvedValue(departmentMock);
            const res = await request(app).get(`${BASE_URL}/${departmentMock.id}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 if department is not found', async () => {
            prismaMock.department.findUnique.mockResolvedValue(null);
            const res = await request(app).get(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(404);
        });

        it('should return 400 if prisma throws an error', async () => {
            prismaMock.department.findUnique.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get(`${BASE_URL}/${departmentMock.id}`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Database error');
        });
    });

    describe('Department controller - update', () => {
        it('should return 200 when department is updated successfully', async () => {
            prismaMock.department.update.mockResolvedValue(departmentMock);
            const res = await request(app)
                .put(`${BASE_URL}/${departmentMock.id}`)
                .send({ name: 'Updated IT', description: 'Update Information Technology' });

            expect(res.status).toBe(200);
        });

        it('should return 404 if department not found', async () => {
            prismaMock.department.update.mockRejectedValue(new Error('Database error'));
            const res = await request(app)
                .put(`${BASE_URL}/invalid-id`)
                .send({ name: 'Updated IT', description: 'Update Information Technology' });

            expect(res.status).toBe(400);
        });
    });

    describe('Departemnt controller - findAll', () => {
        it('should return 200 when department is found', async () => {
            prismaMock.department.findMany.mockResolvedValue([departmentMock]);
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(200);
        });

        it('should return 4 00 if prisma throws an error', async () => {
            prismaMock.department.findMany.mockRejectedValue(new Error('Database error'));
            const res = await request(app).get(BASE_URL);
            expect(res.status).toBe(400);
        });
    });

    describe('Department controller - delete', () => {
        it('should return 204 when department is deleted successfully', async () => {
            prismaMock.department.delete.mockResolvedValue(departmentMock);
            const res = await request(app).delete(`${BASE_URL}/${departmentMock.id}`);
            expect(res.status).toBe(204);
        });

        it('should return 404 if department not found', async () => {
            prismaMock.department.delete.mockRejectedValue(new Error('Database error'));
            const res = await request(app).delete(`${BASE_URL}/invalid-id`);
            expect(res.status).toBe(400);
        });
    });

    //     it('should return 200 when department is updated successfully', async () => {
    //         const res = await request(app).put(url).send({ name: 'Updated IT' });

    //         expect(res.status).toBe(200);
    //         expect(res.body.name).toBe('Updated IT');
    //     });

    //     it('should return 404 if department not found', async () => {
    //         const res = await request(app)
    //             .put(`${BASE_URL}/update/invalid-id`)
    //             .send({ name: 'Updated IT' });

    //         expect(res.status).toBe(404);
    //     });
    // });
});
