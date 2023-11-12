interface ProcessEnv {
  MONGO_DB_CONNECTION_STRING: string;
  PORT: string;
  DB_NAME: string;
  SEEDER_ENABLED: boolean;
}

type InterfaceKeys<T> = keyof T;

/**
 * Get the value of .env
 *
 * Usage: env('PORT'); // returns 8080
 *
 * @param name process.env
 * @returns The value of the environment variables
 */
export function env(name: InterfaceKeys<ProcessEnv>): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing: process.env['${name}']`);
  }

  return value;
}
