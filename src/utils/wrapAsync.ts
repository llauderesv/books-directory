import { Request, Response, NextFunction } from 'express';

type Func = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

function wrapAsync(fn: Func) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

export default wrapAsync;
