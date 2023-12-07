import express from 'express';
import wrapAsync from 'src/utils/wrapAsync';
import authController from 'src/controllers/auth.controller';

const router = express.Router();

router.post('/', wrapAsync(authController.getAccessToken));

export default router;
