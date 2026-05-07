// ============================================
// models/dashboardModel.js
// Query agregasi MySQL untuk statistik dashboard.
// Semua query dioptimasi dengan single-query aggregation.
// ============================================

const { pool } = require('../config/db');

/**
 * Ambil semua statistik dashboard dalam satu batch query
 * Menggunakan Promise.all untuk menjalankan query secara paralel
 * (lebih cepat dari sequential await)
 */
const getStats = async () => {
  // Jalankan semua query secara paralel
  const [
    productStats,
    categoryStats,
    stockStats,
    userStats,
    lowStockProducts,
    recentTransactions,
  ] = await Promise.all([
    // 1. Statistik produk
    pool.execute(`
      SELECT
        COUNT(*)                                    AS total_products,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_products,
        SUM(stock)                                  AS total_stock_value,
        SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS out_of_stock
      FROM products
    `),

    // 2. Statistik kategori
    pool.execute(`
      SELECT COUNT(*) AS total_categories
      FROM categories
      WHERE is_active = 1
    `),

    // 3. Statistik transaksi stok (bulan ini)
    pool.execute(`
      SELECT
        SUM(CASE WHEN type = 'IN'  THEN quantity ELSE 0 END) AS total_stock_in,
        SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) AS total_stock_out,
        COUNT(*)                                              AS total_transactions
      FROM stock_transactions
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at)  = YEAR(CURRENT_DATE())
    `),

    // 4. Statistik user
    pool.execute(`
      SELECT COUNT(*) AS active_users FROM users
    `),

    // 5. Produk dengan stok rendah (stock <= minimum_stock)
    pool.execute(`
      SELECT id, name, sku, stock, minimum_stock, unit, category
      FROM products
      WHERE stock <= minimum_stock AND is_active = 1
      ORDER BY stock ASC
      LIMIT 10
    `),

    // 6. 5 transaksi stok terbaru
    pool.execute(`
      SELECT
        st.id, st.type, st.quantity, st.created_at,
        p.name AS product_name, p.sku AS product_sku,
        u.name AS created_by
      FROM stock_transactions st
      LEFT JOIN products p ON st.product_id = p.id
      LEFT JOIN users u ON st.created_by = u.id
      ORDER BY st.created_at DESC
      LIMIT 5
    `),
  ]);

  return {
    products: productStats[0][0],
    categories: categoryStats[0][0],
    stocks: stockStats[0][0],
    users: userStats[0][0],
    lowStockProducts: lowStockProducts[0],
    recentTransactions: recentTransactions[0],
  };
};

/**
 * Ambil data grafik stok per bulan (12 bulan terakhir)
 */
const getStockChart = async () => {
  const [rows] = await pool.execute(`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      SUM(CASE WHEN type = 'IN'  THEN quantity ELSE 0 END) AS stock_in,
      SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) AS stock_out
    FROM stock_transactions
    WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month ASC
  `);
  return rows;
};

/**
 * Ambil top 5 produk dengan transaksi terbanyak
 */
const getTopProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT
      p.id, p.name, p.sku, p.stock,
      COUNT(st.id) AS transaction_count,
      SUM(CASE WHEN st.type = 'OUT' THEN st.quantity ELSE 0 END) AS total_out
    FROM products p
    LEFT JOIN stock_transactions st ON p.id = st.product_id
    GROUP BY p.id, p.name, p.sku, p.stock
    ORDER BY transaction_count DESC
    LIMIT 5
  `);
  return rows;
};

module.exports = { getStats, getStockChart, getTopProducts };
