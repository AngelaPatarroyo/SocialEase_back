// Simple Jest configuration for CI/CD debugging
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  verbose: true,
  testTimeout: 10000,
  forceExit: true
};
