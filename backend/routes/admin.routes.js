// routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Secure admin-only routes
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/user/:id', protect, adminOnly, deleteUser);
router.get('/products', protect, adminOnly, getAllProducts);
router.delete('/product/:id', protect, adminOnly, deleteProduct);
router.get('/orders', protect, adminOnly, getAllOrders);

export default router;