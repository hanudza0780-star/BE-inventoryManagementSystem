// ============================================
// controllers/dashboardController.js
// Controller untuk dashboard statistics.
// ============================================

const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { MESSAGES } = require('../constants/messages');

/**
 * GET /api/dashboard/stats
 * Ambil semua statistik dashboard
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  return successResponse(res, 200, MESSAGES.DASHBOARD.STATS, stats);
});

/**
 * GET /api/dashboard/stock-chart
 * Data grafik stok 12 bulan terakhir
 */
const getStockChart = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStockChart();
  return successResponse(res, 200, 'Data grafik stok bulanan', data);
});

/**
 * GET /api/dashboard/top-products
 * Top 5 produk dengan transaksi terbanyak
 */
const getTopProducts = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTopProducts();
  return successResponse(res, 200, 'Top produk berdasarkan transaksi', data);
});

module.exports = { getStats, getStockChart, getTopProducts };
