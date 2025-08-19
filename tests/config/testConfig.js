/**
 * Test Configuration
 * Centralized configuration for all test suites
 */

module.exports = {
  // Database configuration for tests
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/socialease-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // JWT configuration for tests
  jwt: {
    secret: process.env.JWT_SECRET || 'test-secret-key-for-testing-only',
    expiresIn: '1h'
  },

  // Test timeouts
  timeouts: {
    unit: 10000,        // 10 seconds
    integration: 30000,  // 30 seconds
    api: 45000,         // 45 seconds
    e2e: 60000          // 60 seconds
  },

  // Test data configuration
  testData: {
    user: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'user'
    },
    admin: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      role: 'admin'
    },
    scenario: {
      title: 'Test Scenario',
      slug: 'test-scenario',
      description: 'A test scenario for testing purposes',
      difficulty: 'easy',
      points: 10,
      vrSupported: false
    }
  },

  // API endpoints for testing
  endpoints: {
    base: '/api',
    auth: '/api/auth',
    user: '/api/user',
    admin: '/api/admin',
    scenarios: '/api/scenarios',
    feedback: '/api/feedback',
    progress: '/api/progress',
    selfAssessment: '/api/self-assessment'
  },

  // Test environment setup
  environment: {
    nodeEnv: 'test',
    port: process.env.PORT || 4001,
    logLevel: 'error' // Reduce log noise during tests
  },

  // Cleanup configuration
  cleanup: {
    autoCleanup: true,
    cleanupDelay: 1000, // 1 second delay between test suites
    preserveData: false  // Don't preserve test data between runs
  }
};
