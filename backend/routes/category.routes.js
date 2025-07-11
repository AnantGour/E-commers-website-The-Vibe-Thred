import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// Admin-only create category
router.post('/create', verifyToken, verifyAdmin, categoryController.createCategory);

// Public - get all categories
router.get('/', categoryController.getAllCategories);

// Admin-only delete category
router.delete('/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

export default router;