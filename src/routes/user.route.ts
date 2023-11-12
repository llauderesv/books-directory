import express, { Request, Response } from 'express';
import wrapAsync from 'src/utils/wrapAsync';
import userController from 'src/controllers/user.controller';

const router = express.Router();

router.get('/', wrapAsync(userController.getUsers));
router.post('/', wrapAsync(userController.createUser));

export default router;
