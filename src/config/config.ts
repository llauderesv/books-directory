export interface ProcessEnv {
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
}

export default function loadConfig(): ProcessEnv {
  return {
    DB_NAME: process.env.DB_NAME || '',
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING || '',
    PORT: process.env.PORT || '8080',
    SEEDER_ENABLED: process.env.SEEDER_ENABLED || '',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || '',
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || '',
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '',
    REDIS_URL: process.env.REDIS_URL || '',
    REDIS_PORT: process.env.REDIS_PORT || '',
  };
}
