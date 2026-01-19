import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

const prisma = mockDeep<PrismaClient>();

export const resetPrismaMock = () => mockReset(prisma);

export default prisma;
