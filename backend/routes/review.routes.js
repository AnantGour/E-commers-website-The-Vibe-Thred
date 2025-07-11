// routes/review.routes.js
import express from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createReview);
router.get('/:productId', getProductReviews);

export default router;
