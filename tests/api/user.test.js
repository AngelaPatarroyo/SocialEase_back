const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../src/models/User');
const { generateTestToken } = require('../helpers/testHelpers');

describe('User API Endpoints', () => {
  let testUser, authToken, adminToken;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      role: 'user'
    });

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedPassword123',
      role: 'admin'
    });

    // Generate tokens
    authToken = generateTestToken(testUser._id, testUser.role);
    adminToken = generateTestToken(adminUser._id, adminUser.role);
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: ['test@example.com', 'admin@example.com'] } });
    await mongoose.connection.close();
  });

  describe('GET /api/user/profile', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('Test User');
    });

    it('should return 401 when no token provided', async () => {
      await request(app)
        .get('/api/user/profile')
        .expect(401);
    });

    it('should return 401 when invalid token provided', async () => {
      await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        theme: 'dark'
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.theme).toBe('dark');
    });

    it('should validate input data', async () => {
      const invalidData = {
        name: 'a', // Too short
        theme: 'invalid-theme' // Invalid enum value
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/user/password', () => {
    it('should update password successfully', async () => {
      const passwordData = {
        currentPassword: 'hashedPassword123',
        newPassword: 'newPassword123!'
      };

      const response = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password updated');
    });

    it('should validate password requirements', async () => {
      const weakPassword = {
        currentPassword: 'hashedPassword123',
        newPassword: 'weak' // Too short
      };

      const response = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(weakPassword)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/user/dashboard', () => {
    it('should return user dashboard data', async () => {
      const response = await request(app)
        .get('/api/user/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data).toHaveProperty('stats');
    });
  });

  describe('GET /api/user/badges', () => {
    it('should return user badges', async () => {
      const response = await request(app)
        .get('/api/user/badges')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/user/delete', () => {
    it('should delete user account', async () => {
      const response = await request(app)
        .delete('/api/user/delete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Account deleted');
    });
  });
});
