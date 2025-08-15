// Test MongoDB authentication
describe('MongoDB Authentication Test', () => {
  let mongoose;

  beforeAll(async () => {
    mongoose = require('mongoose');
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test('should connect to MongoDB with authentication', async () => {
    // This test will only work if we have a real MongoDB with auth
    // In CI, it should work with the GitHub Actions MongoDB service
    if (process.env.CI === 'true' && process.env.MONGO_URI) {
      console.log('🔌 Testing MongoDB connection with auth...');
      await mongoose.connect(process.env.MONGO_URI);
      expect(mongoose.connection.readyState).toBe(1); // Connected
      console.log('✅ MongoDB connected with authentication');
    } else {
      console.log('⏭️ Skipping MongoDB auth test (not in CI)');
      expect(true).toBe(true);
    }
  });
});
