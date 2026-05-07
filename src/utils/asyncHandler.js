// ============================================
// utils/asyncHandler.js
// Wrapper untuk async controller agar tidak perlu
// menulis try/catch di setiap controller function.
//
// KENAPA DIBUTUHKAN?
// Tanpa asyncHandler, setiap controller harus punya
// try/catch sendiri. Dengan asyncHandler, error otomatis
// diteruskan ke global error handler via next(error).
//
// CARA PAKAI:
// const getAll = asyncHandler(async (req, res) => {
//   const data = await someService();
//   res.json(data);
// });
// ============================================

/**
 * Membungkus async function agar error-nya otomatis
 * diteruskan ke Express error handler (next)
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Jalankan fn, jika ada error tangkap dan kirim ke next()
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
