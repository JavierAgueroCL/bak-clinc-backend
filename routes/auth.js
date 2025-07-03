const express = require('express');
const AuthController = require('../controllers/authController');
const AuthValidator = require('../validators/authValidator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', AuthValidator.validateRegister, AuthController.register);
router.post('/login', AuthValidator.validateLogin, AuthController.login);
router.post('/forgot-password', AuthValidator.validateEmail, AuthController.forgotPassword);
router.post('/reset-password', AuthValidator.validateResetPassword, AuthController.resetPassword);
router.post('/verify-email', AuthValidator.validateToken, AuthController.verifyEmail);
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;