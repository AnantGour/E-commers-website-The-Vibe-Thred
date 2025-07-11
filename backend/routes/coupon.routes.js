import express from 'express';
import verifyAdmin from '../middleware/verifyAdmin.js';
import * as couponController from '../controllers/coupon.controller.js';

const router = express.Router();
router.post('/create', verifyAdmin, couponController.createCoupon);
router.post('/apply', couponController.applyCoupon);

export default router;
