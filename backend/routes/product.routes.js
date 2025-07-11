import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

router.post('/create', verifyToken, verifyAdmin, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/random', productController.getRandomProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyToken, verifyAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productController.deleteProduct);
router.get('/debug/categories', productController.getCategories);

export default router;
