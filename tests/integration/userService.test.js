const mongoose = require('mongoose');
const UserService = require('../../src/services/userService');
const UserRepository = require('../../src/services/userRepository');
const User = require('../../src/models/User');
const { createTestUserData, cleanupTestData } = require('../helpers/testHelpers');

describe('UserService Integration Tests', () => {
  let testUser, testUserId;

  beforeAll(async () => {
    // Create test user
    const userData = createTestUserData();
    testUser = await User.create(userData);
    testUserId = testUser._id;
  });

  afterAll(async () => {
    await cleanupTestData({ User });
    await mongoose.connection.close();
  });

  describe('getProfile', () => {
    it('should return user profile by ID', async () => {
      const profile = await UserService.getProfile(testUserId);
      
      expect(profile).toBeDefined();
      expect(profile._id.toString()).toBe(testUserId.toString());
      expect(profile.email).toBe(testUser.email);
      expect(profile.name).toBe(testUser.name);
    });

    it('should throw error for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await expect(UserService.getProfile(fakeId))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updates = {
        name: 'Updated Name',
        theme: 'dark'
      };

      const updatedUser = await UserService.updateProfile(testUserId, updates);
      
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.theme).toBe('dark');
      expect(updatedUser.email).toBe(testUser.email); // Unchanged
    });

    it('should only update provided fields', async () => {
      const updates = {
        name: 'Another Name'
      };

      const updatedUser = await UserService.updateProfile(testUserId, updates);
      
      expect(updatedUser.name).toBe('Another Name');
      expect(updatedUser.theme).toBe('dark'); // Previous value preserved
    });

    it('should throw error for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updates = { name: 'New Name' };
      
      await expect(UserService.updateProfile(fakeId, updates))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('UserRepository Integration', () => {
    it('should find user by email', async () => {
      const user = await UserRepository.findByEmail(testUser.email);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
    });

    it('should find user by ID', async () => {
      const user = await UserRepository.findById(testUserId);
      
      expect(user).toBeDefined();
      expect(user._id.toString()).toBe(testUserId.toString());
    });

    it('should not return password in findById', async () => {
      const user = await UserRepository.findById(testUserId);
      
      expect(user.password).toBeUndefined();
    });

    it('should find user by email with password', async () => {
      const user = await UserRepository.findByEmailWithPassword(testUser.email);
      
      expect(user).toBeDefined();
      expect(user.password).toBeDefined();
    });

    it('should update user role', async () => {
      const updatedUser = await UserRepository.updateRole(testUserId, 'admin');
      
      expect(updatedUser.role).toBe('admin');
    });

    it('should get role statistics', async () => {
      const stats = await UserRepository.getRoleStats();
      
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBeGreaterThan(0);
    });
  });
});
