import express from 'express';
import booksController from 'src/controllers/booksController';
import wrapAsync from 'src/utils/wrapAsync';

const router = express.Router();

router.get('/', wrapAsync(booksController.getBooks));
router.get('/:id', wrapAsync(booksController.getBook));
router.post('/', wrapAsync(booksController.createBooks));
router.delete('/:id', wrapAsync(booksController.deleteBooks));
router.put('/:id', wrapAsync(booksController.updateBooks));
router.post('/:id/reviews', wrapAsync(booksController.addReviews));

export default router;
