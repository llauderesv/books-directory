import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bookModel, { IBook } from 'src/models/book.model';

const validateCastToObjectId = (id: string): mongoose.Types.ObjectId => {
  id = id.trim();
  if (!id || id.length <= 0) throw new Error(`Invalid book id ${id}`);
  return new mongoose.Types.ObjectId(id);
};

async function getBook(req: Request, res: Response) {
  const _id = validateCastToObjectId(req.params.id);
  const book: IBook | unknown = await bookModel.findOne({ _id });
  if (!book) {
    return res.json({ message: 'No found book' }).status(200);
  }

  return res.json({ data: book }).status(200);
}

interface Book {
  page: string;
  limit: string;
}

async function getBooks(req: Request<{}, {}, {}, Book>, res: Response) {
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

async function createBooks(req: Request, res: Response) {
  const body = req.body;
  bookModel.create({ ...body });

  return res.json({ data: body }).status(201);
}

async function deleteBooks(req: Request, res: Response) {
  const _id = validateCastToObjectId(req.params.id);

  const book = await bookModel.findOne({ _id }).exec();
  if (!book) {
    throw new Error(`Can't find book with ${_id}`);
  }

  await bookModel.deleteOne({ _id });
  return res.json({ message: 'Successfully deleted the record' });
}

async function updateBooks(req: Request, res: Response) {
  const _id = validateCastToObjectId(req.params.id);
  const body = req.body;

  await bookModel.updateOne({ _id }, { ...body });
  return res.json({ message: 'Successfully updated the record' });
}

async function addReviews(req: Request, res: Response) {
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
