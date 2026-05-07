// ============================================
// utils/AppError.js
// Custom Error class untuk error yang sudah diketahui
// (operational errors) seperti 404, 400, 401, dll.
//
// KENAPA DIBUTUHKAN?
// Dengan class ini, kita bisa membuat error dengan
// statusCode langsung, sehingga global error handler
// bisa membedakan error operasional vs error sistem.
//
// CARA PAKAI:
// throw new AppError('Produk tidak ditemukan', 404);
// ============================================

class AppError extends Error {
  /**
   * @param {string} message - Pesan error yang akan ditampilkan ke user
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, dll)
   */
  constructor(message, statusCode) {
    super(message); // Panggil constructor Error bawaan

    this.statusCode = statusCode;

    // isOperational = true artinya error ini sudah kita antisipasi
    // (bukan bug/crash tak terduga)
    this.isOperational = true;

    // Capture stack trace untuk debugging (tanpa constructor ini sendiri)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
