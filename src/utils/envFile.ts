interface ProcessEnv {
  MONGO_DB_CONNECTION_STRING: string;
  PORT: string;
  DB_NAME: string;
}

type InterfaceKeys<T> = keyof T;

export function env(name: InterfaceKeys<ProcessEnv>): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing: process.env['${name}']`);
  }

  return value;
}
