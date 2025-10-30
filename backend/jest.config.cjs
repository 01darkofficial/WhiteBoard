/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    clearMocks: true,
    verbose: true,

    // 👇 Use new transform syntax (instead of deprecated globals)
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    },

    setupFiles: ['<rootDir>/tests/setup/testEnvSetup.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],

    // ⚙️ optional for now
    forceExit: true,
    detectOpenHandles: true,

    // For @ path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};
