// ============================================
// middleware/errorHandler.js
// Global error handler - menangkap SEMUA error
// yang tidak tertangani di controller/route.
//
// CARA KERJA:
// Express mengenali error handler dari 4 parameter: (err, req, res, next)
// Semua error yang di-throw atau di-next(error) akan masuk ke sini.
//
// URUTAN PEMASANGAN: Harus PALING TERAKHIR di app.js
// ============================================

const AppError = require('../utils/AppError');

/**
 * Middleware untuk menangani route yang tidak ditemukan (404)
 * Dipasang SETELAH semua route didefinisikan
 */
const notFound = (req, res, next) => {
  // Buat AppError dengan status 404
  next(new AppError(`Route tidak ditemukan: ${req.method} ${req.originalUrl}`, 404));
};

// -----------------------------------------------
// Handler untuk berbagai jenis error MySQL
// -----------------------------------------------

const handleMySQLDuplicateError = (err) => {
  // Ambil nama field yang duplikat dari pesan error MySQL
  const match = err.message.match(/Duplicate entry '(.+)' for key '(.+)'/);
  const value = match ? match[1] : 'unknown';
  return new AppError(`Data '${value}' sudah ada. Gunakan nilai yang berbeda.`, 409);
};

const handleMySQLForeignKeyError = () => {
  return new AppError('Data referensi tidak ditemukan atau masih digunakan.', 400);
};

// -----------------------------------------------
// Handler untuk error JWT
// -----------------------------------------------

const handleJWTError = () => {
  return new AppError('Token tidak valid. Silakan login ulang.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Token sudah kadaluarsa. Silakan login ulang.', 401);
};

// -----------------------------------------------
// Kirim response error saat DEVELOPMENT
// Tampilkan detail lengkap untuk debugging
// -----------------------------------------------
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,       // Stack trace untuk debugging
    error: err,
  });
};

// -----------------------------------------------
// Kirim response error saat PRODUCTION
// Sembunyikan detail teknis dari user
// -----------------------------------------------
const sendErrorProd = (err, res) => {
  // Error operasional (sudah kita antisipasi) → tampilkan ke user
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Error tidak terduga (bug, crash) → jangan tampilkan detail ke user
  console.error('🔴 UNEXPECTED ERROR:', err);
  return res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
  });
};

/**
 * Global error handler utama
 * Express mengenali ini sebagai error handler karena ada 4 parameter
 */
const errorHandler = (err, req, res, next) => {
  // Set default statusCode dan message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log semua error ke console
  console.error(`🔴 [${new Date().toISOString()}] ${err.statusCode} - ${err.message}`);

  if (process.env.NODE_ENV === 'development') {
    // Di development: tampilkan semua detail
    sendErrorDev(err, res);
  } else {
    // Di production: tangani error spesifik, sembunyikan detail teknis
    let error = { ...err, message: err.message };

    // Tangani error MySQL duplikat (ER_DUP_ENTRY)
    if (err.code === 'ER_DUP_ENTRY') {
      error = handleMySQLDuplicateError(err);
    }

    // Tangani error MySQL foreign key (ER_NO_REFERENCED_ROW_2)
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
      error = handleMySQLForeignKeyError();
    }

    // Tangani error JWT tidak valid
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    // Tangani error JWT kadaluarsa
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

module.exports = { notFound, errorHandler };
