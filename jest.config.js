module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/config/**',
    '!src/utils/logger.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 45000, // Increased to 45 seconds for MongoDB operations
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // Ensure tests don't hang
  maxWorkers: 1,
  // Better error reporting
  detectOpenHandles: true,
  // More aggressive timeout handling
  testEnvironmentOptions: {
    timeout: 45000
  },
  // Force cleanup
  globalSetup: undefined,
  globalTeardown: undefined
};
