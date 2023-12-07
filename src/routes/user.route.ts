import express from 'express';
import wrapAsync from 'src/utils/wrapAsync';
import userController from 'src/controllers/user.controller';
import checkJwt from 'src/middlewares/checkJwt';

const router = express.Router();

router.get('/:id', checkJwt, wrapAsync(userController.getUsers));
router.post('/', checkJwt, wrapAsync(userController.createUser));
router.post('/update', checkJwt, wrapAsync(userController.updateUser));

export default router;
