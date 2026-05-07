// ============================================
// services/authService.js
// Logika bisnis untuk autentikasi.
// Bcrypt untuk hash password, JWT untuk token.
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

/**
 * Register user baru
 * Password di-hash dengan bcrypt sebelum disimpan ke database.
 * JANGAN PERNAH simpan password plain text!
 */
const register = async ({ name, email, password, role }) => {
  // Cek email sudah terdaftar
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new AppError('Email sudah terdaftar', 409);
  }

  // Hash password dengan bcrypt
  // saltRounds = 10 adalah standar yang aman (lebih tinggi = lebih lambat tapi lebih aman)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'staff',
  });

  return user;
};

/**
 * Login dan generate JWT token
 */
const login = async ({ email, password }) => {
  // Cari user berdasarkan email
  const user = await userModel.findByEmail(email);

  // Gunakan pesan yang sama untuk email/password salah
  // (mencegah user mengetahui email mana yang terdaftar)
  if (!user) {
    throw new AppError('Email atau password salah', 401);
  }

  // Bandingkan password dengan hash di database menggunakan bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Email atau password salah', 401);
  }

  // Generate JWT access token
  // Payload berisi data yang akan tersedia di req.user setelah verifikasi
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Kembalikan token dan info user (TANPA password)
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
