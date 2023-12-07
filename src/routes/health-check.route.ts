import { Router, Request, Response } from 'express';

// Types for retuning Express Response to API Controllers
type Return = Promise<Response<any, Record<string, any>>>;

const router = Router();

async function healthCheck(req: Request, res: Response): Return {
  return res.status(200).json({
    status: 'OK',
  });
}

router.get('/', healthCheck);

export default router;
