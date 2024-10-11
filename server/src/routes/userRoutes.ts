// src/routes/authRoutes.ts

import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth/authController.ts';
import { getUser, updateUser, userLoginStatus, changePassword } from '../controllers/auth/userController.ts';
import { verifyEmail, verifyUser } from '../controllers/auth/emailController.ts';
import { forgotPassword, resetPassword } from '../controllers/auth/passwordController.ts';
import protect from '../middleware/authMiddleware.ts';

const router = express.Router();

// Rutas de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Rutas de usuario
router.get('/user', protect, getUser);
router.patch('/user', protect, updateUser);
router.get('/logged-in', userLoginStatus);
router.patch('/change-password', protect, changePassword);

// Rutas de verificación de email
router.post('/verify-email', protect, verifyEmail);
router.get('/verify-email/:verificationToken', verifyUser);

// Rutas de restablecimiento de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetPasswordToken', resetPassword);

export default router;
