import { injectable } from 'inversify';

export interface IConfig {
  DB_NAME: string;
  MONGO_DB_CONNECTION_STRING: string;
  PORT: string;
  SEEDER_ENABLED: string;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  REDIS_URL: string;
  REDIS_PORT: string;
  GOOGLE_API_KEY: string;
}

@injectable()
class Config implements IConfig {
  public readonly DB_NAME: string;
  public readonly MONGO_DB_CONNECTION_STRING: string;
  public readonly PORT: string;
  public readonly SEEDER_ENABLED: string;
  public readonly AUTH0_DOMAIN: string;
  public readonly AUTH0_AUDIENCE: string;
  public readonly AUTH0_CLIENT_ID: string;
  public readonly AUTH0_CLIENT_SECRET: string;
  public readonly REDIS_URL: string;
  public readonly REDIS_PORT: string;
  public readonly GOOGLE_API_KEY: string;

  // Env Vars Setters
  constructor() {
    this.DB_NAME = process.env.DB_NAME || '';
    this.MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING || '';
    this.PORT = process.env.PORT || '8080';
    this.SEEDER_ENABLED = process.env.SEEDER_ENABLED || '';
    this.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';
    this.AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || '';
    this.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || '';
    this.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || '';
    this.REDIS_URL = process.env.REDIS_URL || '';
    this.REDIS_PORT = process.env.REDIS_PORT || '';
    this.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
  }
}

export default Config;
