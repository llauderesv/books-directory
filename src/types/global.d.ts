declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_DB_CONNECTION_STRING: string;
  }
}

// Types for retuning Express Response to API Controllers
type Return = Promise<Response<any, Record<string, any>>>;
