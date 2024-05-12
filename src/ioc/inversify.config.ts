import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import Config, { IConfig } from '../config';
import BookRepository, { IBookRepository } from '../repositories/books.repository';
import GoogleBooksAPI, { IGoogleBooksApi } from '../services/googleBooksApi';
import { LoggerService } from 'src/services/logger.service';

const myContainer = new Container();
myContainer.bind<IConfig>(TYPES.Config).to(Config);
myContainer.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
myContainer.bind<IGoogleBooksApi>(TYPES.GoogleBooksAPI).to(GoogleBooksAPI);
myContainer.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);

export { myContainer };
