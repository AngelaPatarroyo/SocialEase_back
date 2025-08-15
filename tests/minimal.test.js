// Minimal test - should work in any environment
test('basic arithmetic', () => {
  expect(2 + 2).toBe(4);
});

test('environment check', () => {
  expect(process.env.NODE_ENV).toBe('test');
});
