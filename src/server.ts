import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import seeder from './seeder';
import bookModel from './models/book.model';

// Routes
import authRoute from 'src/routes/auth.route';
import booksRoute from 'src/routes/book.route';
import userRoute from 'src/routes/user.route';
import healthCheckRoute from 'src/routes/health-check.route';

// Middlewares
import mongoError from 'src/middlewares/mongoError';
import generalError from './middlewares/generalError';
import { config } from 'src/ioc';

(async function startServer(): Promise<void> {
  const app = express();

  const PORT = config.PORT;
  const DB_NAME = config.DB_NAME;
  mongoose.connect(config.MONGO_DB_CONNECTION_STRING, { dbName: DB_NAME });

  if (!config.SEEDER_ENABLED) {
    console.log(`Seeding your MongoDB database: ${DB_NAME}`);
    const dummyData = seeder();

    await bookModel.deleteMany({});
    await bookModel.insertMany(dummyData);

    console.log(`Successfully seed your MongoDB database: ${DB_NAME}`);
  }

  // Package Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('tiny'));

  // Routes Middle wares
  app.use('/api/health-check', healthCheckRoute);
  app.use('/api/v1/books', booksRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);

  // Error Middlewares
  app.use(mongoError);
  app.use(generalError);

  app.get('/', (req, res) => res.send('<pre>Welcome to my Books directory</pre>'));
  app.listen(PORT, () => console.log(`App is listening on localhost:${PORT}`));
})();
