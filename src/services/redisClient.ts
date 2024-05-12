import { RedisClientType, createClient } from 'redis';
import Config, { IConfig } from '../config';
import { Logger } from 'winston';

export default class RedisClient {
  private client: RedisClientType | null = null;
  private REDIS_CONN_MAX_RETRIES = 5;
  private config: IConfig;
  private log: Logger;

  constructor(config: Config, logger: Logger) {
    this.config = config;
    this.log = logger;
  }

  public async connect(): Promise<RedisClientType> {
    this.client = (await createClient({
      url: `redis://${this.config.REDIS_URL}:${this.config.REDIS_PORT}`,
      socket: { reconnectStrategy: this.reconnectStrategy },
    })
      .on('error', err => this.log.error(err))
      .connect()) as RedisClientType;

    return this.client;
  }

  public async close(): Promise<void> {
    if (this.client) {
      this.log.info('Redis client close');
      this.client.quit();
      this.client = null;
    }
  }

  // Reconnect strategy method in Redis Server if the Redis server can't connect to the client.
  private reconnectStrategy(retries: number, cause: Error): false | Error | number {
    if (retries > this.REDIS_CONN_MAX_RETRIES) {
      this.close();
      return false;
    }
    this.log.info(`Retrying redis connection: ${retries}`);
    return 1000 * retries;
  }
}
