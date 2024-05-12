import { createClient } from 'redis';
import { Types } from 'mongoose';
import bookModel, { IBook } from 'src/models/book.model';
import IRepository, { PaginatedResult, PaginationParams } from './IRepository';
import { inject, injectable } from 'inversify';
import { IConfig } from '../config';
import { TYPES } from '../ioc/types';
import { LoggerService } from 'src/services/logger.service';
import { Logger } from 'winston';

export interface IBookRepository extends IRepository<IBook> {
  initializeCache(): Promise<any>;
}

@injectable()
class BookRepository implements IBookRepository {
  private readonly config: IConfig;
  private readonly logger: Logger;

  constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.LoggerService) logger: LoggerService
  ) {
    this.config = config;
    this.logger = logger.getLogger().child({ module: 'books-repository' });
  }

  async getPaginated(pagination: PaginationParams): Promise<PaginatedResult<IBook> | null> {
    const books: IBook[] = await bookModel
      .find(pagination.query)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();
    const totalItems = await bookModel.countDocuments(pagination.query);
    const totalPages = Math.ceil(totalItems / pagination.limit);

    return {
      currentPage: pagination.page,
      totalPages,
      totalItems,
      items: books,
    };
  }

  async initializeCache(): Promise<any> {
    this.logger.info('Connecting to cache...');
    const client = await createClient({
      url: `redis://${this.config.REDIS_URL}:${this.config.REDIS_PORT}`,
    })
      .on('error', err => console.log(`Error: ${err}`))
      .connect();
    return client;
  }

  async getAll(): Promise<IBook[]> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string | Types.ObjectId): Promise<IBook | null> {
    const client = await this.initializeCache();
    const key = `books:details:${id}`;
    const bookCache = (await client.json.GET(key)) as string | null;

    if (bookCache) {
      this.logger.info(`Retrieving data from Cache`, bookCache);
      const parseBook: IBook = JSON.parse(bookCache);
      return parseBook;
    } else {
      this.logger.info('Not found in the cache');
      const book: IBook | null = await bookModel.findOne({ _id: id });
      if (!book) {
        this.logger.info(`No book found ${id}`);
        return null;
      }

      await client.json.SET(key, '$', JSON.stringify(book));
      return book;
    }
  }
  create(item: IBook): Promise<IBook> {
    throw new Error('Method not implemented.');
  }
  update(id: string, item: IBook): Promise<IBook | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

export default BookRepository;
