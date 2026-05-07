// ============================================
// middleware/rateLimiter.js
// Rate limiting untuk mencegah brute force dan abuse.
//
// KENAPA RATE LIMITING?
// - Mencegah brute force attack pada endpoint login
// - Mencegah DDoS sederhana
// - Melindungi resource server dari abuse
//
// express-rate-limit bekerja dengan menyimpan
// jumlah request per IP dalam memory (default)
// dan menolak request jika melebihi batas.
// ============================================

const rateLimit = require('express-rate-limit');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

/**
 * Rate limiter untuk endpoint LOGIN
 * Lebih ketat: maks 10 percobaan per 15 menit per IP
 *
 * Ini mencegah brute force attack pada password
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Window 15 menit
  max: 10,                   // Maks 10 request per window
  standardHeaders: true,     // Kirim header RateLimit-* standar
  legacyHeaders: false,      // Nonaktifkan header X-RateLimit-* lama

  // Pesan error saat limit tercapai
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

/**
 * Rate limiter umum untuk semua API endpoint
 * Lebih longgar: maks 100 request per menit per IP
 */
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Window 1 menit
  max: 100,                  // Maks 100 request per window
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: MESSAGES.GENERAL.RATE_LIMIT,
    });
  },
});

/**
 * Rate limiter untuk upload file
 * Maks 20 upload per 10 menit per IP
 */
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // Window 10 menit
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Terlalu banyak upload. Silakan coba lagi nanti.',
    });
  },
});

module.exports = { loginLimiter, apiLimiter, uploadLimiter };
