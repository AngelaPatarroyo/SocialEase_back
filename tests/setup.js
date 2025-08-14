// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = 4001;

// Global test utilities
global.testUtils = {
  // Helper to create mock user data
  createMockUser: (overrides = {}) => ({
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    ...overrides
  }),

  // Helper to create mock JWT token
  createMockToken: (payload = {}) => {
    const defaultPayload = {
      id: '507f1f77bcf86cd799439011',
      role: 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    return `mock.jwt.${btoa(JSON.stringify({ ...defaultPayload, ...payload }))}`;
  }
};

// Suppress console.log during tests unless explicitly needed
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}
