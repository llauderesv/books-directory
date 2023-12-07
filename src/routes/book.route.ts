import express from 'express';
import booksController from 'src/controllers/book.controller';
import checkJwt from 'src/middlewares/checkJwt';
import wrapAsync from 'src/utils/wrapAsync';

const router = express.Router();

/**
 * Routes for all Books endpoints
 */
router.get('/', checkJwt, wrapAsync(booksController.getBooks));
router.get('/:id', checkJwt, wrapAsync(booksController.getBook));
router.post('/', checkJwt, wrapAsync(booksController.createBooks));
router.delete('/:id', checkJwt, wrapAsync(booksController.deleteBooks));
router.put('/:id', checkJwt, wrapAsync(booksController.updateBooks));
router.post('/:id/reviews', checkJwt, wrapAsync(booksController.addReviews));

export default router;
