const jwt = require('jsonwebtoken');

describe('JWT utility', () => {
  it('should sign and verify a token', () => {
    const secret = 'test_secret';
    const payload = { username: 'user1' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    expect(decoded).toMatchObject(payload);
  });
});
