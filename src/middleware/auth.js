// ============================================
// middleware/auth.js
// Middleware autentikasi JWT
// Memverifikasi token sebelum request masuk ke controller
// ============================================

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

/**
 * Middleware untuk memverifikasi JWT token
 * Cara pakai: tambahkan 'authenticate' sebagai parameter kedua di route
 * Contoh: router.get('/products', authenticate, productController.getAll)
 */
const authenticate = (req, res, next) => {
  // Ambil token dari header Authorization
  // Format header: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ambil bagian setelah "Bearer "

  if (!token) {
    return errorResponse(res, 401, 'Akses ditolak. Token tidak ditemukan.');
  }

  try {
    // Verifikasi token dengan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke request object
    next(); // Lanjut ke controller
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token sudah kadaluarsa. Silakan login ulang.');
    }
    return errorResponse(res, 403, 'Token tidak valid.');
  }
};

/**
 * Middleware untuk cek role user
 * Cara pakai: authorize('admin') atau authorize('admin', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Tidak terautentikasi.');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Akses ditolak. Anda tidak memiliki izin.');
    }

    next();
  };
};

module.exports = { authenticate, authorize };
