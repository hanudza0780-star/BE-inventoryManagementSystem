// ============================================
// middleware/validate.js
// Middleware reusable untuk menangani hasil validasi
// dari express-validator.
//
// CARA KERJA:
// 1. express-validator menjalankan rules validasi
// 2. Hasilnya disimpan di request object
// 3. Middleware ini mengecek apakah ada error
// 4. Jika ada error → kirim response 422
// 5. Jika tidak ada → lanjut ke controller
//
// CARA PAKAI DI ROUTE:
// router.post('/login',
//   loginValidation,   // array rules dari express-validator
//   validate,          // middleware ini
//   authController.login
// );
// ============================================

const { validationResult } = require('express-validator');

/**
 * Middleware untuk mengecek hasil validasi express-validator
 * Harus dipasang SETELAH array validation rules
 */
const validate = (req, res, next) => {
  // Ambil semua error validasi dari request
  const errors = validationResult(req);

  // Jika tidak ada error, lanjut ke handler berikutnya
  if (errors.isEmpty()) {
    return next();
  }

  // Format error menjadi array yang mudah dibaca
  // Contoh output: [{ field: "email", message: "Email tidak valid" }]
  const formattedErrors = errors.array().map((err) => ({
    field: err.path,      // Nama field yang error (email, password, dll)
    message: err.msg,     // Pesan error
  }));

  // Kirim response 422 Unprocessable Entity
  // (422 lebih tepat dari 400 untuk validation error)
  return res.status(422).json({
    success: false,
    message: 'Validasi gagal. Periksa kembali data yang dikirim.',
    errors: formattedErrors,
  });
};

module.exports = validate;
