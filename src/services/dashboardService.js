// ============================================
// services/dashboardService.js
// Logika bisnis untuk dashboard statistics.
// ============================================

const dashboardModel = require('../models/dashboardModel');

/**
 * Ambil semua statistik untuk dashboard
 */
const getDashboardStats = async () => {
  const raw = await dashboardModel.getStats();

  // Format response menjadi struktur yang bersih
  return {
    products: {
      total: Number(raw.products.total_products) || 0,
      active: Number(raw.products.active_products) || 0,
      out_of_stock: Number(raw.products.out_of_stock) || 0,
      total_stock_value: Number(raw.products.total_stock_value) || 0,
    },
    categories: {
      total: Number(raw.categories.total_categories) || 0,
    },
    stocks: {
      // Transaksi bulan ini
      total_in_this_month: Number(raw.stocks.total_stock_in) || 0,
      total_out_this_month: Number(raw.stocks.total_stock_out) || 0,
      total_transactions_this_month: Number(raw.stocks.total_transactions) || 0,
    },
    users: {
      total: Number(raw.users.active_users) || 0,
    },
    low_stock_products: raw.lowStockProducts,
    recent_transactions: raw.recentTransactions,
  };
};

/**
 * Ambil data grafik stok bulanan
 */
const getStockChart = async () => {
  return dashboardModel.getStockChart();
};

/**
 * Ambil top produk berdasarkan transaksi
 */
const getTopProducts = async () => {
  return dashboardModel.getTopProducts();
};

module.exports = { getDashboardStats, getStockChart, getTopProducts };
