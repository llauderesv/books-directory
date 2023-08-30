import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: String,
    author: String,
    publication_year: Number,
    isbn: String,
    genre: [{ type: String }],
    description: String,
    rating: Number,
    reviews: [{ user: String, text: String, rating: Number }],
  },
  { versionKey: false }
);

const bookModel = mongoose.model('book', schema);

export default bookModel;
