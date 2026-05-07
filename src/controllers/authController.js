// ============================================
// controllers/authController.js
// Controller untuk autentikasi.
// Validasi input sudah ditangani oleh express-validator
// di layer route, sehingga controller lebih bersih.
// ============================================

const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

/**
 * POST /api/auth/register
 * Daftarkan user baru.
 * Validasi input dilakukan di authValidation.js (route layer)
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await authService.register({ name, email, password, role });

  return successResponse(res, 201, 'Registrasi berhasil', user);
});

/**
 * POST /api/auth/login
 * Login dan dapatkan JWT token.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  return successResponse(res, 200, 'Login berhasil', result);
});

/**
 * GET /api/auth/me
 * Ambil data user yang sedang login.
 * req.user diisi oleh middleware authenticate dari JWT token.
 */
const getMe = asyncHandler(async (req, res) => {
  const userModel = require('../models/userModel');
  const user = await userModel.findById(req.user.id);

  if (!user) {
    // Gunakan AppError untuk error yang sudah diketahui
    const AppError = require('../utils/AppError');
    throw new AppError('User tidak ditemukan', 404);
  }

  return successResponse(res, 200, 'Data user', user);
});

module.exports = { register, login, getMe };
