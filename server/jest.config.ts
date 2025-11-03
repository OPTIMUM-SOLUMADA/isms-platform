import { createDefaultPreset, pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { compilerOptions } from './tsconfig.json';

const tsJestTransformCfg = createDefaultPreset().transform;
const moduleNameMapper = {
    ...pathsToModuleNameMapper(compilerOptions.paths ?? {}, { prefix: '<rootDir>/' }),
    '^@tests/(.*)$': '<rootDir>/tests/$1',
};

const config: Config = {
    testEnvironment: 'node',
    transform: {
        ...tsJestTransformCfg,
        '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    },
    moduleNameMapper,
    testMatch: ['**/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
