// ============================================
// validations/authValidation.js
// Rules validasi untuk endpoint autentikasi
// menggunakan express-validator.
//
// KENAPA express-validator?
// - Lebih terstruktur dari validasi manual di controller
// - Bisa chain rules: .notEmpty().isEmail().normalizeEmail()
// - Mudah di-reuse di berbagai route
// - Output error sudah terstandarisasi
// ============================================

const { body } = require('express-validator');

/**
 * Validasi untuk endpoint POST /api/auth/register
 */
const registerValidation = [
  // Validasi field: name
  body('name')
    .trim()                                    // Hapus spasi di awal/akhir
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama harus antara 2-100 karakter'),

  // Validasi field: email
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),                         // Ubah ke lowercase, hapus spasi

  // Validasi field: password
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
    .isLength({ max: 100 }).withMessage('Password maksimal 100 karakter'),

  // Validasi field: role (opsional, hanya nilai tertentu yang diizinkan)
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Role harus salah satu dari: admin, manager, staff'),
];

/**
 * Validasi untuk endpoint POST /api/auth/login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
];

module.exports = { registerValidation, loginValidation };
