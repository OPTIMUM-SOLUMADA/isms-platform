import prismaMock from './src/database/mocks/prisma';

beforeEach(() => {
    jest.clearAllMocks();
});

jest.mock('./src/database/prisma', () => ({
    __esModule: true,
    default: prismaMock,
}));