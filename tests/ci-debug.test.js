// CI Debug Test - Check what's happening in CI environment
describe('CI Debug Test', () => {
  beforeAll(() => {
    console.log('🔍 CI Debug Test Starting...');
    console.log('📊 Environment Variables:');
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    console.log('  CI:', process.env.CI);
    console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    console.log('  PORT:', process.env.PORT);
    console.log('  MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
    console.log('  PWD:', process.env.PWD);
    console.log('  PATH:', process.env.PATH ? 'SET' : 'NOT SET');
  });

  test('should show CI environment info', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.CI).toBe('true');
    console.log('✅ CI environment detected correctly');
  });

  test('should have basic environment variables', () => {
    expect(process.env.JWT_SECRET).toBe('test-secret-key');
    expect(process.env.PORT).toBe('4001'); // Set by test setup
    console.log('✅ Basic environment variables are set');
  });

  test('should be able to run basic operations', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
    console.log('✅ Basic operations work');
  });
});
