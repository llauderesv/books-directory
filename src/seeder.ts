import { IBook } from './models/book.model';
import { random, shuffleArray } from './utils/functions';

function seeder(): IBook[] {
  const popularBooks = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { title: '1984', author: 'George Orwell' },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { title: 'Pride and Prejudice', author: 'Jane Austen' },
  ];

  const dummyData: IBook[] = [];

  for (const book of popularBooks) {
    const { title, author } = book;
    const entry = {
      title,
      author,
      publication_year: parseInt(`19${random(100, false)}`),
      isbn: `${random(1000)}-0-${random(1000)}-${random(1000)}-${random(10, false)}`,
      genre: shuffleArray([
        'Fiction',
        'Mystery',
        'Science Fiction',
        'Fantasy',
        'Romance',
        'Thriller',
      ]).slice(0, 2),
      description: 'A fascinating book that you must read!',
      reviews: [
        {
          user: 'Reader123',
          text: 'A great read!',
          rating: parseInt(random(5, false), 10),
        },
        {
          user: 'BookLover456',
          text: "I couldn't put it down!",
          rating: parseInt(random(5, false), 10),
        },
      ],
    };

    dummyData.push(entry);
  }

  return dummyData;
}

export default seeder;
