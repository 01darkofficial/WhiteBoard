/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    clearMocks: true,
    verbose: true,

    setupFiles: ['<rootDir>/tests/setup/testEnvSetup.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {},

    forceExit: true,
    detectOpenHandles: true,

    // For paths starting with @
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};
