import { Request, Response } from 'express';
import bookModel, { IBook } from 'src/models/book.model';
import convertCamelToSnakeCaseKeys from 'src/utils/convertCamelToSnake';
import bookSchema from 'src/validations/book.schema';
import { ApiResponse } from 'src/types/global';
import validateCastToObjectId from 'src/utils/validateObjectId';

interface Book {
  page: string;
  limit: string;
}

/**
 * Get a single book item
 *
 * @param {Request} req Express.Request
 * @param {Response} res Express.Response
 * @returns {Object} Returns Book details
 */
async function getBook(req: Request, res: Response): ApiResponse {
  const _id = validateCastToObjectId(req.params.id);
  const book: IBook | unknown = await bookModel.findOne({ _id });
  if (!book) {
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

  const books: IBook[] = await bookModel.find(query).skip(skip).limit(limit).exec();

  const totalItems = await bookModel.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return res
    .json({
      currentPage: page,
      totalPages,
      totalItems,
      items: books,
    })
    .status(200);
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

  const book = await bookModel.findOne({ _id }).exec();
  if (!book) {
    throw new Error(`Can't find book with ${_id}`);
  }

  await bookModel.deleteOne({ _id });
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

  await bookModel.updateOne({ _id }, { ...body });
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

export default { getBooks, getBook, createBooks, deleteBooks, updateBooks, addReviews };
