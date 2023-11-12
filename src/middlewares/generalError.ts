import { Request, Response, NextFunction } from 'express';

export default function (error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof Error) {
    return res.status(400).json({
      type: 'Error',
      message: error.message,
    });
  }
  next(error);
}
