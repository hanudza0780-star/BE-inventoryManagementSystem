// ============================================
// controllers/stockController.js
// Controller untuk manajemen stok.
// req.user.id diambil dari JWT token (set oleh middleware authenticate)
// ============================================

const stockService = require('../services/stockService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

/**
 * GET /api/stocks/history
 * Ambil riwayat transaksi stok
 * Query params: product_id, type (IN/OUT), page, limit
 */
const getHistory = asyncHandler(async (req, res) => {
  const result = await stockService.getStockHistory(req.query);

  return successResponse(res, 200, 'Riwayat transaksi stok', result.data, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

/**
 * POST /api/stocks/in
 * Catat stok masuk
 * Body: { product_id, quantity, note }
 */
const stockIn = asyncHandler(async (req, res) => {
  // req.user.id = ID user yang sedang login (dari JWT token)
  const transaction = await stockService.stockIn(req.body, req.user.id);

  return successResponse(res, 201, 'Stok masuk berhasil dicatat', transaction);
});

/**
 * POST /api/stocks/out
 * Catat stok keluar
 * Body: { product_id, quantity, note }
 */
const stockOut = asyncHandler(async (req, res) => {
  const transaction = await stockService.stockOut(req.body, req.user.id);

  return successResponse(res, 201, 'Stok keluar berhasil dicatat', transaction);
});

/**
 * GET /api/stocks/summary/:productId
 * Ambil ringkasan stok produk tertentu
 */
const getProductSummary = asyncHandler(async (req, res) => {
  const summary = await stockService.getProductStockSummary(req.params.productId);
  return successResponse(res, 200, 'Ringkasan stok produk', summary);
});

module.exports = { getHistory, stockIn, stockOut, getProductSummary };
