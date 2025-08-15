// Simple test to isolate CI/CD issues
describe('Basic Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-secret-key');
  });

  it('should be able to require the server', () => {
    // This will test if the server can be imported without errors
    expect(() => require('../server')).not.toThrow();
  });
});
