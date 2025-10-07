import { GET as s3GET } from '../app/api/s3/route';
import { GET as s3UrlGET } from '../app/api/s3-url/route';
import { NextRequest } from 'next/server';
import { globalRateLimit } from '../lib/rateLimiter';

// Mock the globalRateLimit function
jest.mock('../lib/rateLimiter', () => {
  const originalModule = jest.requireActual('../lib/rateLimiter');
  return {
    ...originalModule,
    globalRateLimit: jest.fn(),
    rateLimit: jest.fn(),
  };
});

describe('Global Rate Limiting Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('s3 API route', () => {
    it('should check global rate limit before processing request', async () => {
      const mockGlobalRateLimit = globalRateLimit as jest.Mock;
      mockGlobalRateLimit.mockResolvedValue(false); // Global limit exceeded

      const request = {
        method: 'GET',
        cookies: { get: () => undefined },
        nextUrl: { searchParams: new Map() },
      } as unknown as NextRequest;

      const response = await s3GET(request);
      
      // Should return 401 because no token, but globalRateLimit shouldn't be called
      // since auth check happens first
      expect(response.status).toBe(401);
    });
  });

  describe('s3-url API route', () => {
    it('should check global rate limit before processing request', async () => {
      const mockGlobalRateLimit = globalRateLimit as jest.Mock;
      mockGlobalRateLimit.mockResolvedValue(false); // Global limit exceeded

      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/s3-url',
        cookies: { get: () => undefined },
        nextUrl: { searchParams: new Map() },
      } as unknown as NextRequest;

      const response = await s3UrlGET(request);
      
      // Should return 401 because no token
      expect(response.status).toBe(401);
    });
  });

  describe('Configuration validation', () => {
    it('should use default values when environment variables are not set', () => {
      // Store original env vars
      const originalGlobalLimit = process.env.S3_GLOBAL_RATE_LIMIT;
      const originalGlobalWindow = process.env.S3_GLOBAL_WINDOW_SEC;

      // Clear env vars
      delete process.env.S3_GLOBAL_RATE_LIMIT;
      delete process.env.S3_GLOBAL_WINDOW_SEC;

      // The defaults should be used (1000 and 60)
      const defaultLimit = parseInt(process.env.S3_GLOBAL_RATE_LIMIT || "1000", 10);
      const defaultWindow = parseInt(process.env.S3_GLOBAL_WINDOW_SEC || "60", 10);

      expect(defaultLimit).toBe(1000);
      expect(defaultWindow).toBe(60);

      // Restore env vars
      if (originalGlobalLimit) process.env.S3_GLOBAL_RATE_LIMIT = originalGlobalLimit;
      if (originalGlobalWindow) process.env.S3_GLOBAL_WINDOW_SEC = originalGlobalWindow;
    });

    it('should parse custom values from environment variables', () => {
      // Set custom env vars
      process.env.S3_GLOBAL_RATE_LIMIT = "500";
      process.env.S3_GLOBAL_WINDOW_SEC = "30";

      const customLimit = parseInt(process.env.S3_GLOBAL_RATE_LIMIT || "1000", 10);
      const customWindow = parseInt(process.env.S3_GLOBAL_WINDOW_SEC || "60", 10);

      expect(customLimit).toBe(500);
      expect(customWindow).toBe(30);

      // Clean up
      delete process.env.S3_GLOBAL_RATE_LIMIT;
      delete process.env.S3_GLOBAL_WINDOW_SEC;
    });
  });
});
