import { GoogleAccount } from '@prisma/client';

export const googleAccount: GoogleAccount = {
    id: '1',
    email: 'a@b.c',
    createdAt: new Date(),
    tokens: {},
    workingDirId: '1',
    googleId: '1',
};
