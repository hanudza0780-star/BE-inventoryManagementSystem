// ============================================
// services/authService.js
// Logika bisnis untuk autentikasi.
// Mencatat activity log saat login berhasil.
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');
const { createLog } = require('../middleware/activityLogger');
const { MESSAGES } = require('../constants/messages');

/**
 * Register user baru
 */
const register = async ({ name, email, password, role }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) throw new AppError(MESSAGES.AUTH.EMAIL_TAKEN, 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  return userModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'staff',
  });
};

/**
 * Login dan generate JWT token
 * Mencatat activity log saat login berhasil
 */
const login = async ({ email, password }, ipAddress = null) => {
  const user = await userModel.findByEmail(email);

  // Pesan sama untuk email/password salah (mencegah user enumeration)
  if (!user) throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Catat activity log login berhasil (fire and forget)
  createLog({
    user_id: user.id,
    action: 'LOGIN',
    module: 'auth',
    description: `${user.name} (${user.role}) berhasil login`,
    ip_address: ipAddress,
  });

  return {
    token,
    token_type: 'Bearer',
    expires_in: process.env.JWT_EXPIRES_IN || '7d',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = { register, login };
