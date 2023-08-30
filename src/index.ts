require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose, { MongooseError } from 'mongoose';
import booksRoute from 'src/routes/booksRoute';
import { env } from 'src/utils/envFile';

(async function startServer() {
  const app = express();

  const PORT = env('PORT');

  mongoose.connect(env('MONGO_DB_CONNECTION_STRING'), { dbName: env('DB_NAME') });

  app.use(cors());
  app.use(express.json());
  app.use(morgan('tiny'));
  app.use('/api/v1/books', booksRoute);

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof Error) {
      return res
        .json({
          type: 'Error',
          message: error.message,
        })
        .status(400);
    }
    next(error);
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof MongooseError) {
      return res.status(503).json({
        type: 'MongooseError',
        message: error.message,
      });
    }
    next(error);
  });

  app.get('/', (req, res) => res.send('<pre>Welcome to my Books directory</pre>'));
  app.listen(PORT, () => console.log(`App is listening on localhost:${PORT}`));
})();
