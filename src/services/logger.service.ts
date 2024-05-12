import { injectable } from 'inversify';
import * as winston from 'winston';

@injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  getLogger(): winston.Logger {
    return this.logger;
  }
}
