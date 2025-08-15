const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

// Mock the server app for testing
beforeAll(async () => {
  try {
    console.log('🚀 Setting up test environment...');
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      CI: process.env.CI,
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET'
    });
    
    // Always set required environment variables
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.NODE_ENV = 'test';
    
    // Check if we're in CI environment
    const isCI = process.env.CI === 'true';
    
    if (isCI) {
      // In CI, use the MongoDB service provided by GitHub Actions
      console.log('🚀 CI Environment detected - using MongoDB service');
      
      // Ensure MONGO_URI is set
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not set in CI environment');
      }
      
      console.log('🔌 Connecting to MongoDB in CI...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected in CI');
    } else {
      // Local development - use in-memory MongoDB
      console.log('💻 Local Environment detected - using MongoDB Memory Server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      // Set test environment
      process.env.MONGO_URI = mongoUri;
      
      console.log('🔌 Connecting to MongoDB Memory Server...');
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server connected');
    }
    
    // Import app after MongoDB connection is established
    app = require('../server');
    console.log('✅ Test environment setup completed');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    console.log('🧹 Starting test cleanup...');
    
    // Disconnect MongoDB
    if (mongoose.connection.readyState !== 0) {
      console.log('🔌 Disconnecting MongoDB...');
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected');
    }
    
    // Stop MongoDB Memory Server (local only)
    if (mongoServer && process.env.CI !== 'true') {
      console.log('🛑 Stopping MongoDB Memory Server...');
      await mongoServer.stop();
      console.log('✅ MongoDB Memory Server stopped');
    }
    
    console.log('✅ Test cleanup completed');
  } catch (error) {
    console.error('❌ Test cleanup error:', error);
    
    // Force cleanup
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      if (mongoServer && process.env.CI !== 'true') {
        await mongoServer.stop();
      }
    } catch (cleanupError) {
      console.error('❌ Force cleanup failed:', cleanupError);
    }
    
    console.log('✅ Force cleanup completed');
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
