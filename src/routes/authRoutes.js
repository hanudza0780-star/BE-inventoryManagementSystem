// ============================================
// routes/authRoutes.js
// Endpoint autentikasi dengan rate limiting dan validasi.
// ============================================

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../validations/authValidation');

router.post('/register', registerValidation, validate, authController.register);

// loginLimiter dipasang di endpoint login untuk mencegah brute force
router.post('/login', loginLimiter, loginValidation, validate, authController.login);

router.get('/me', authenticate, authController.getMe);

module.exports = router;
