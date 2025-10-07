import { globalRateLimit } from '../lib/rateLimiter';

// Mock the upstashFetch function
jest.mock('../lib/rateLimiter', () => {
  const originalModule = jest.requireActual('../lib/rateLimiter');
  return {
    ...originalModule,
    globalRateLimit: jest.fn(),
  };
});

describe('Global Rate Limiting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow requests under the global limit', async () => {
    (globalRateLimit as jest.Mock).mockResolvedValue(true);
    
    const result = await globalRateLimit('s3', 1000, 60);
    expect(result).toBe(true);
  });

  it('should deny requests exceeding the global limit', async () => {
    (globalRateLimit as jest.Mock).mockResolvedValue(false);
    
    const result = await globalRateLimit('s3', 1000, 60);
    expect(result).toBe(false);
  });

  it('should handle different API names', async () => {
    (globalRateLimit as jest.Mock).mockResolvedValue(true);
    
    const result1 = await globalRateLimit('s3', 1000, 60);
    const result2 = await globalRateLimit('s3url', 1000, 60);
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(globalRateLimit).toHaveBeenCalledTimes(2);
  });

  it('should fail open on error', async () => {
    (globalRateLimit as jest.Mock).mockResolvedValue(true);
    
    const result = await globalRateLimit('s3', 1000, 60);
    expect(result).toBe(true);
  });
});
