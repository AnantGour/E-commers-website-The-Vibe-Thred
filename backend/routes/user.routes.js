import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';

router.post('/register', userController.register);
router.get('/fetch', userController.fetch);
router.patch('/update', userController.update);
router.delete('/delete', userController.deleteUser);
router.post('/login', userController.login);
router.patch('/changepassword', userController.changePassword);
router.post('/resend-verification', userController.resendVerification);
router.get('/check-verification/:email', userController.checkVerification);
router.post('/verify', userController.verifyEmail);



export default router;