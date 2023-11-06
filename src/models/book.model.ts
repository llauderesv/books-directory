import mongoose from 'mongoose';

interface IBook {
  title: string;
  author: string;
  publication_year: number;
  isbn: string;
  genre: string[];
  description: string;
  rating?: number;
  reviews: { user: string; text: string; rating: number }[];
}

const schema = new mongoose.Schema<IBook>(
  {
    title: String,
    author: String,
    publication_year: Number,
    isbn: String,
    genre: [{ type: String }],
    description: String,
    reviews: [{ user: String, text: String, rating: Number }],
  },
  { versionKey: false, _id: false, toJSON: { virtuals: true } }
);

schema.virtual('rating').get(function () {
  const sumRating: number = this.reviews.reduce((initialValue, currentValue) => {
    if (currentValue.rating) {
      return initialValue + currentValue.rating;
    }
    return initialValue;
  }, 0);

  const roundOff = Math.ceil(sumRating / this.reviews.length);
  return roundOff;
});

const bookModel = mongoose.model('book', schema);

export { IBook };
export default bookModel;
