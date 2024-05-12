import { Request, Response } from 'express';
import bookModel, { IBook } from 'src/models/book.model';
import convertCamelToSnakeCaseKeys from 'src/utils/convertCamelToSnake';
import bookSchema from 'src/validations/book.schema';
import { ApiResponse } from 'src/types/global';
import validateCastToObjectId from 'src/utils/validateObjectId';
import { bookRepository, googleBooksApi, logger } from 'src/ioc';
import { PaginatedResult, PaginationParams } from 'src/repositories/IRepository';
import { BooksParams } from 'src/services/googleBooksApi';

interface Book {
  page: string;
  limit: string;
}

// Create Logger Instance
const log = logger.getLogger().child({ module: 'books-controller', pid: process.pid });

async function getGoogleBook(req: Request, res: Response): ApiResponse {
  const bookId = req.params.id;
  const resp = await googleBooksApi.getBookDetails(bookId);
  if (resp) {
    return res.status(200).json(resp);
  }
  return res.status(200).json({ message: 'No book found' });
}

async function getGoogleBooks(
  req: Request<{}, {}, {}, BooksParams>,
  res: Response
): ApiResponse {
  const booksParam = req.query;
  const resp = await googleBooksApi.getBooks(booksParam);
  if (resp) {
    console.log('Total fetched items: ', resp.items?.length);
    return res.status(200).json(resp);
  }
  return res.status(200).json({ message: 'No books found' });
}

/**
 * Get a single book item
 *
 * @param {Request} req Express.Request
 * @param {Response} res Express.Response
 * @returns {Object} Returns Book details
 */
async function getBook(req: Request, res: Response): ApiResponse {
  log.info('Get Book Infos');
  const id = validateCastToObjectId(req.params.id);
  const book = await bookRepository.getById(id);
  if (!book) {
    log.info(`No found Book ${id}`);
    return res.status(404).json({ message: 'No found Book' });
  }

  return res.status(200).json({ data: book });
}

/**
 * TODO: Improve here the search term like genre interest
 *
 * Get all the available books
 * @param {Request} req Express.Request
 * @param {Response} res Express.Response
 * @returns {Array<Object>} JSON list of book items
 */
async function getBooks(req: Request<{}, {}, {}, Book>, res: Response): ApiResponse {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const skip = (page - 1) * limit;
  const query = {};

  const pagination: PaginationParams = { page, limit, skip, query };
  const paginatedResult: PaginatedResult<IBook> | null = await bookRepository.getPaginated(
    pagination
  );

  return res.json(paginatedResult).status(200);
}

/**
 * Create Book
 *
 * @param {Request} req Express.Request
 * @param {Response} res Express.Response
 *
 * @returns {Object} Returns the created Book
 */
async function createBooks(req: Request, res: Response): ApiResponse {
  const body = req.body;
  const resp = bookSchema.validate(body);
  if (resp.error) {
    return res.status(400).json({ message: resp.error.details });
  }

  // Convert the body to snake case for saving to MongoDB
  const convertBodyToSnakeCase = convertCamelToSnakeCaseKeys(resp.value);
  bookModel.create(convertBodyToSnakeCase);

  return res.status(201).json({ data: resp.value });
}

/**
 * Delete Books and Saves into DB
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {Object} Returns a successful message when successfully deleted the Book
 */
async function deleteBooks(req: Request, res: Response): ApiResponse {
  const _id = validateCastToObjectId(req.params.id);

  const book = await bookModel.findOneAndDelete({ _id }).exec();
  if (!book) {
    throw new Error(`Can't find book with ${_id}`);
  }
  return res.json({ message: 'Successfully deleted the record' });
}

/**
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {Object} Returns the updated Book
 */
async function updateBooks(req: Request, res: Response): ApiResponse {
  const _id = validateCastToObjectId(req.params.id);
  const body = req.body;

  const book = await bookModel.findOneAndUpdate({ _id }, body).exec();
  if (!book) {
    throw new Error(`Can't find book with ${_id}`);
  }
  return res.json({ message: 'Successfully updated the record' });
}

/**
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @returns {String} Returns successful message when successfully added a review
 */
async function addReviews(req: Request, res: Response): ApiResponse {
  const _id = validateCastToObjectId(req.params.id);
  const book = await bookModel.findOne({ _id });
  if (!book) {
    throw new Error(`Can't find book with ${_id}`);
  }
  const body = req.body;

  await bookModel.updateOne({ _id }, { $push: { reviews: body } });
  return res.json({ message: 'Successfully added a review' });
}

export default {
  getBooks,
  getBook,
  createBooks,
  deleteBooks,
  updateBooks,
  addReviews,
  getGoogleBook,
  getGoogleBooks,
};
