import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', verifyToken, orderController.placeOrder);
router.get('/myorders', verifyToken, orderController.getMyOrders);
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.put('/:id/deliver', verifyToken, verifyAdmin, orderController.markAsDelivered);
router.put('/:id/pay', verifyToken, verifyAdmin, orderController.markAsPaid);
router.put('/cancel/:id', verifyToken, orderController.cancelOrder);
router.get('/sales', verifyToken, verifyAdmin, orderController.getMonthlySales);

export default router;