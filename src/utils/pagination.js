// ============================================
// utils/pagination.js
// Helper untuk normalisasi dan kalkulasi pagination.
// Digunakan di semua service yang butuh pagination.
// ============================================

/**
 * Normalisasi dan validasi parameter pagination dari query string
 * @param {object} query - req.query object
 * @returns {object} - { page, limit, offset }
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Buat objek meta pagination untuk response
 * @param {number} total - Total seluruh data
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Data per halaman
 * @returns {object} - Pagination meta
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

module.exports = { getPagination, buildPaginationMeta };
