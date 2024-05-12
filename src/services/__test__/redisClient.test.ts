import { RedisClientType } from 'redis';
import RedisClient from '../redisClient';

describe('RedisClient', () => {
  jest.mock('../../config/config', () => ({
    loadConfig: jest.fn(() => ({
      REDIS_URL: 'localhost',
      REDIS_PORT: 6379,
    })),
  }));

  jest.mock('winston', () => ({
    info: jest.fn((...a) => console.log(...a)),
    error: jest.fn((...a) => console.error(...a)),
  }));

  let mockConfig: any;
  let mockLogger: any;
  let client: RedisClientType;

  beforeAll(() => {
    mockConfig = require('../../config/config');
    mockLogger = require('winston');
  });

  it('should connect to Redis Cache', async () => {
    const redis = new RedisClient(mockConfig, mockLogger);
    client = await redis.connect();

    expect(client).toBeTruthy();
  });

  it('should add numbers', () => {
    const a = 1 + 1;

    expect(a).toBe(2);
  });

  afterAll(() => {
    client && client.quit();
  });
});
