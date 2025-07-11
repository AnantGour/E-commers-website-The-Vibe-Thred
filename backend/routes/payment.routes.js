import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyToken, verifyPayment); 

export default router;
