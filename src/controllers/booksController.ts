import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bookModel from 'src/models/book.model';

const validateCastToObjectId = (id: string) => {
  id = id.trim();
  if (!id || id.length <= 0) throw new Error(`Invalid book id ${id}`);
  return new mongoose.Types.ObjectId(id);
};

async function getBooks(req: Request, res: Response) {
  const books = await bookModel.find();

  return res.json({ data: books }).status(200);
}

async function createBooks(req: Request, res: Response) {
  const body = req.body;
  bookModel.create({ ...body });

  res.json({ data: body }).status(201);
}

async function deleteBooks(req: Request, res: Response) {
  const _id = validateCastToObjectId(req.params.id);

  const book = await bookModel.findOne({ _id }).exec();
  if (!book) {
    throw new Error(`Can't find book with ${_id}`);
  }

  await bookModel.deleteOne({ _id });
  res.json({ message: 'Successfully deleted the record' });
}

async function updateBooks(req: Request, res: Response) {
  const _id = validateCastToObjectId(req.params.id);
  const body = req.body;

  await bookModel.updateOne({ _id }, { ...body });
  res.json({ message: 'Successfully updated the record' });
}

export default { getBooks, createBooks, deleteBooks, updateBooks };
