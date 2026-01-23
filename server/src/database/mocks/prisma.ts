// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;


// import { PrismaClient } from '@prisma/client';
// import { mockDeep, mockReset } from 'jest-mock-extended';

// const prisma = mockDeep<PrismaClient>();

// export const resetPrismaMock = () => mockReset(prisma);

// export default prisma;
