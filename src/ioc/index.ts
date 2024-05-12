import { IGoogleBooksApi } from 'src/services/googleBooksApi';
import { IConfig } from '../config';
import { IBookRepository } from '../repositories/books.repository';
import { myContainer } from './inversify.config';
import { TYPES } from './types';
import { LoggerService } from 'src/services/logger.service';

const config = myContainer.get<IConfig>(TYPES.Config);
const bookRepository = myContainer.get<IBookRepository>(TYPES.BookRepository);
const googleBooksApi = myContainer.get<IGoogleBooksApi>(TYPES.GoogleBooksAPI);
const logger = myContainer.resolve<LoggerService>(LoggerService);

export { bookRepository, config, googleBooksApi, logger };
