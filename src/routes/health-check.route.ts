import { Router, Request, Response } from 'express';

const router = Router();

async function healthCheck(req: Request, res: Response): Return {
  return res.status(200).json({
    status: 'OK',
  });
}

router.get('/', healthCheck);

export default router;
