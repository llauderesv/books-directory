import { MongooseError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export default function (error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof MongooseError) {
    return res.status(503).json({
      type: 'MongooseError',
      message: error.message,
    });
  }
  next(error);
}
