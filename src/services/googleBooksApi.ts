import { Logger } from 'winston';
import { books_v1, books } from '@googleapis/books';
import { createClient } from 'redis';
import { IConfig } from 'src/config';
import { TYPES } from 'src/ioc/types';
import { inject, injectable } from 'inversify';
import { LoggerService } from 'src/services/logger.service';

type Book = books_v1.Schema$Volume;
type Books = books_v1.Schema$Volumes;
type BooksClient = books_v1.Books;

export interface BooksParams {
  category: 'intitle' | 'inauthor' | 'inpublisher' | 'subject' | 'isbn' | 'lccn' | 'oclc';
  query: string;
  currentPage: number;
  pageSize: number;
  orderBy?: 'relevance' | 'newest';
}

export interface IGoogleBooksApi {
  getBookDetails(bookId: string): Promise<Book | null>;
  getBooks(bookParams: BooksParams): Promise<Books | null>;
}

@injectable()
export default class GoogleBooksAPI implements IGoogleBooksApi {
  readonly booksClient: BooksClient;
  readonly config: IConfig;
  readonly logger: Logger;
  private client: any;

  constructor(
    @inject(TYPES.Config) config: IConfig,
    @inject(TYPES.LoggerService) logger: LoggerService
  ) {
    this.config = config;
    this.booksClient = books({ version: 'v1', auth: this.config.GOOGLE_API_KEY });
    this.logger = logger.getLogger().child({ module: 'google-books-api' });

    this.initializeCache();
  }

  private initializeCache() {
    this.client = createClient({
      url: `redis://${this.config.REDIS_URL}:${this.config.REDIS_PORT}`,
    });

    this.client.on('error', (err: any) => console.log(`Error: ${err}`));
    this.client.connect();
    this.logger.info('Successfully connected to redis cache');
  }

  async getBookDetails(bookId: string): Promise<Book | null> {
    const key = `books:details:${bookId}`;
    const bookCache = (await this.client.json.GET(key)) as string | null;
    if (bookCache) {
      this.logger.info('Cache hit');
      return JSON.parse(bookCache);
    } else {
      this.logger.info('Cache missed, Getting Books from Google Books Api');
      const response = await this.booksClient.volumes.get({ volumeId: bookId });
      if (response.status !== 200) {
        this.logger.info('Error retrieving books from Google Books Api');
        return null;
      }

      await this.client.json.SET(key, '$', JSON.stringify(response.data));
      return response.data;
    }
  }

  async getBooks(bookParams: BooksParams): Promise<Books | null> {
    const {
      category,
      query,
      currentPage = 1,
      pageSize = 10,
      orderBy = 'relevance',
    } = bookParams;
    const startIndex = (currentPage - 1) * pageSize;
    const key = `books:category:author`;

    this.logger.info(`Fetching from google books api category: ${JSON.stringify(bookParams)}`);
    const response = await this.booksClient.volumes.list({
      q: `${category}:${query}`,
      startIndex,
      maxResults: pageSize,
      orderBy,
    });

    return response.data;
  }
}
