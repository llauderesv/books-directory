import { createClient } from 'redis';
import { Types } from 'mongoose';
import bookModel, { IBook } from 'src/models/book.model';
import IRepository, { PaginatedResult, PaginationParams } from './IRepository';
import loadConfig, { ProcessEnv } from 'src/config/config';

export default class BookRepository implements IRepository<IBook> {
  private readonly Config: ProcessEnv;

  constructor() {
    this.Config = loadConfig();
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

  async initializeCache() {
    const client = await createClient({
      url: `redis://${this.Config.REDIS_URL}:${this.Config.REDIS_PORT}`,
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
      console.log(`Retrieving data from Cache`, bookCache);
      return JSON.parse(bookCache) as IBook | null;
    } else {
      console.log('Not found in the cache');
      const book: IBook | null = await bookModel.findOne({ _id: id });
      if (!book) {
        console.log(`No book found ${id}`);
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
