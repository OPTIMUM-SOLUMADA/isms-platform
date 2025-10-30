import { createDefaultPreset } from 'ts-jest';
import type { Config } from 'jest';

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
    testEnvironment: 'node',
    transform: {
        ...tsJestTransformCfg,
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
