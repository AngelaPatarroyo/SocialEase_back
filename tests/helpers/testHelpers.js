const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Test Helper Functions
 * Provides utilities for testing authentication, database setup, and common test operations
 */

/**
 * Generate a test JWT token for testing authenticated endpoints
 */
function generateTestToken(userId, role = 'user') {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
}

/**
 * Generate a test JWT token with custom payload
 */
function generateCustomTestToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
}

/**
 * Hash a password for testing
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Create test user data
 */
function createTestUserData(overrides = {}) {
  return {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'user',
    ...overrides
  };
}

/**
 * Create test scenario data
 */
function createTestScenarioData(overrides = {}) {
  return {
    title: 'Test Scenario',
    slug: `test-scenario-${Date.now()}`,
    description: 'A test scenario for testing purposes',
    difficulty: 'easy',
    points: 10,
    vrSupported: false,
    ...overrides
  };
}

/**
 * Create test feedback data
 */
function createTestFeedbackData(userId, scenarioId, overrides = {}) {
  return {
    userId,
    scenarioId,
    reflection: 'This is a test reflection',
    rating: 5,
    ...overrides
  };
}

/**
 * Create test progress data
 */
function createTestProgressData(userId, overrides = {}) {
  return {
    userId,
    completedScenarios: [],
    achievements: [],
    ...overrides
  };
}

/**
 * Create test self-assessment data
 */
function createTestSelfAssessmentData(userId, overrides = {}) {
  return {
    userId,
    confidenceBefore: 50,
    confidenceAfter: 70,
    primaryGoal: 'Improve social skills',
    comfortZones: ['small groups'],
    preferredScenarios: ['conversations'],
    anxietyTriggers: ['public speaking'],
    socialFrequency: 'sometimes',
    communicationConfidence: 7,
    socialLevel: 'beginner',
    ...overrides
  };
}

/**
 * Clean up test data from database
 */
async function cleanupTestData(models) {
  const cleanupPromises = Object.entries(models).map(([name, model]) => {
    if (model && typeof model.deleteMany === 'function') {
      return model.deleteMany({});
    }
    return Promise.resolve();
  });
  
  await Promise.all(cleanupPromises);
}

/**
 * Wait for a specified amount of time (useful for async operations)
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock request object for testing
 */
function createMockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides
  };
}

/**
 * Mock response object for testing
 */
function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Mock next function for testing middleware
 */
function createMockNext() {
  return jest.fn();
}

module.exports = {
  generateTestToken,
  generateCustomTestToken,
  hashPassword,
  createTestUserData,
  createTestScenarioData,
  createTestFeedbackData,
  createTestProgressData,
  createTestSelfAssessmentData,
  cleanupTestData,
  wait,
  createMockRequest,
  createMockResponse,
  createMockNext
};
