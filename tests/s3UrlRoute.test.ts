import { GET } from '../app/api/s3-url/route';
import { NextRequest } from 'next/server';

describe('s3-url route', () => {
  it('should return 401 if no token is provided', async () => {
    const request = {
      method: 'GET',
      headers: new Map(),
      nextUrl: { searchParams: new Map() },
      cookies: { get: () => undefined },
    } as unknown as NextRequest;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
  });
});
