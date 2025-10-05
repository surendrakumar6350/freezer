describe('Environment variables', () => {
  it('should have JWT_SECRET set', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
  });
  it('should have USER_USERNAME and USER_PASSWORD set', () => {
    expect(process.env.USER_USERNAME).toBeDefined();
    expect(process.env.USER_PASSWORD).toBeDefined();
  });
});
