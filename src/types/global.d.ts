// Types for retuning Express Response to API Controllers
export type ApiResponse = Promise<Response<any, Record<string, any>>>;
