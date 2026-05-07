// ============================================
// utils/response.js
// Helper untuk format response JSON yang konsisten
// Semua response API menggunakan format yang sama
// ============================================

/**
 * Response sukses
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {string} message - Pesan sukses
 * @param {any} data - Data yang dikembalikan
 * @param {object} meta - Metadata tambahan (pagination, dll)
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };

  // Tambahkan meta jika ada (contoh: info pagination)
  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Response error
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {string} message - Pesan error
 * @param {any} errors - Detail error (opsional)
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
  };

  // Tampilkan detail error hanya di mode development
  if (errors && process.env.NODE_ENV === 'development') {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
