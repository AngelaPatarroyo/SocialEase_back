/**
 * CI App Startup Test
 * Tests that the application can start and basic functionality works
 * without requiring database connections
 */

const request = require('supertest');

describe('CI App Startup Tests', () => {
  let app;

  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.PORT = '4001';
    
    // Import app after setting environment
    app = require('../server');
    
    // Wait a bit for app to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Clean up
    if (app && app.close) {
      await new Promise(resolve => app.close(resolve));
    }
  });

  describe('Health Check Endpoints', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.environment).toBe('test');
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /auth-test should return 200', async () => {
      const response = await request(app)
        .get('/auth-test')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Auth routes are accessible');
    });
  });

  describe('API Documentation', () => {
    test('GET /api/docs should return 200', async () => {
      const response = await request(app)
        .get('/api/docs')
        .expect(200);
    });
  });

  describe('Protected Routes (without auth)', () => {
    test('GET /api/user/profile should return 401 without token', async () => {
      await request(app)
        .get('/api/user/profile')
        .expect(401);
    });

    test('GET /api/admin/users should return 401 without token', async () => {
      await request(app)
        .get('/api/admin/users')
        .expect(401);
    });
  });

  describe('404 Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Not Found');
    });
  });

  describe('Environment Validation', () => {
    test('App should be in test mode', () => {
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.JWT_SECRET).toBeDefined();
    });
  });
});
