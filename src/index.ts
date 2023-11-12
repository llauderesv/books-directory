require('dotenv').config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from 'src/utils/envFile';
import seeder from './seeder';
import bookModel from './models/book.model';

// Routes
import booksRoute from 'src/routes/book.route';
import userRoute from 'src/routes/user.route';
import healthCheckRoute from 'src/routes/health-check.route';

// Middlewares
import mongoError from 'src/middlewares/mongoError';
import generalError from './middlewares/generalError';

(async function startServer(): Promise<void> {
  const app = express();

  const PORT = env('PORT');
  const DB_NAME = env('DB_NAME');
  const CONNECTION_STRING = env('MONGO_DB_CONNECTION_STRING');
  mongoose.connect(CONNECTION_STRING, { dbName: DB_NAME });

  if (env('SEEDER_ENABLED')) {
    console.log(`Seeding your MongoDB database: ${DB_NAME}`);
    const dummyData = seeder();

    await bookModel.deleteMany({});
    await bookModel.insertMany(dummyData);

    console.log(`Successfully seed your MongoDB database: ${DB_NAME}`);
  }

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('tiny'));

  // Routes
  app.use('/api/health-check', healthCheckRoute);
  app.use('/api/v1/books', booksRoute);
  app.use('/api/v1/users', userRoute);

  // Middlewares
  app.use(mongoError);
  app.use(generalError);

  app.get('/', (req, res) => res.send('<pre>Welcome to my Books directory</pre>'));
  app.listen(PORT, () => console.log(`App is listening on localhost:${PORT}`));
})();
