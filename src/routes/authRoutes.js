// ============================================
// routes/authRoutes.js
// Endpoint autentikasi dengan validasi express-validator.
//
// FLOW SETIAP REQUEST:
// 1. Validation rules (express-validator) → cek format input
// 2. validate middleware → jika ada error, kirim 422
// 3. Controller → proses bisnis
// ============================================

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../validations/authValidation');

/**
 * POST /api/auth/register
 * Urutan middleware: registerValidation → validate → controller
 */
router.post(
  '/register',
  registerValidation,   // 1. Jalankan rules validasi
  validate,             // 2. Cek hasil validasi
  authController.register // 3. Proses registrasi
);

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  loginValidation,
  validate,
  authController.login
);

/**
 * GET /api/auth/me
 * Butuh JWT token yang valid
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;
