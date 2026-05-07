// ============================================
// controllers/authController.js
// Controller untuk autentikasi.
// ============================================

const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { getIpAddress } = require('../middleware/activityLogger');
const { MESSAGES } = require('../constants/messages');
const AppError = require('../utils/AppError');

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await authService.register({ name, email, password, role });
  return successResponse(res, 201, MESSAGES.AUTH.REGISTER_SUCCESS, user);
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = getIpAddress(req);
  const result = await authService.login({ email, password }, ipAddress);
  return successResponse(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, result);
});

/**
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  const userModel = require('../models/userModel');
  const user = await userModel.findById(req.user.id);
  if (!user) throw new AppError('User tidak ditemukan', 404);
  return successResponse(res, 200, 'Data user', user);
});

module.exports = { register, login, getMe };
