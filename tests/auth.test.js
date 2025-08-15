const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

// Mock the server app for testing
beforeAll(async () => {
  try {
    // Start in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Set test environment
    process.env.MONGO_URI = mongoUri;
    process.env.JWT_SECRET = 'test-secret-key';
    
    // Import app after setting environment
    app = require('../server');
    
    // Wait for MongoDB connection with timeout
    await Promise.race([
      mongoose.connect(mongoUri),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 15000)
      )
    ]);
    
    console.log('✅ MongoDB connected for testing');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    console.log('🧹 Starting test cleanup...');
    
    // Force disconnect MongoDB with timeout
    if (mongoose.connection.readyState !== 0) {
      console.log('🔌 Disconnecting MongoDB...');
      await Promise.race([
        mongoose.disconnect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('MongoDB disconnect timeout')), 8000)
        )
      ]);
      console.log('✅ MongoDB disconnected');
    }
    
    // Force stop MongoDB server with timeout
    if (mongoServer) {
      console.log('🛑 Stopping MongoDB server...');
      await Promise.race([
        mongoServer.stop(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('MongoDB server stop timeout')), 8000)
        )
      ]);
      console.log('✅ MongoDB server stopped');
    }
    
    console.log('✅ Test cleanup completed');
  } catch (error) {
    console.error('❌ Test cleanup error:', error);
    console.log('🚨 Force cleanup - exiting process');
    
    // Force cleanup and exit
    try {
      if (mongoose.connection.readyState !== 0) {
        mongoose.disconnect();
      }
      if (mongoServer) {
        mongoServer.stop();
      }
    } catch (cleanupError) {
      console.error('❌ Force cleanup failed:', cleanupError);
    }
    
    // Force exit after cleanup
    setTimeout(() => {
      console.log('🚨 Force exit after timeout');
      process.exit(0);
    }, 1000);
  }
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.deleteMany({});
    } catch (error) {
      // Ignore errors if collection doesn't exist
    }
  }
});

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Registration successful');
    });

    it('should reject registration with missing fields', async () => {
      const userData = {
        name: 'Test User',
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'All fields are required');
    });

    it('should reject registration with duplicate email', async () => {
      // First registration
      const userData1 = {
        name: 'Test User 1',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData1)
        .expect(201);

      // Second registration with same email
      const userData2 = {
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'password456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData2)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', loginData.email);
    });

    it('should reject login with wrong password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
