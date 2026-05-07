// ============================================
// models/stockModel.js
// Query SQL untuk tabel stock_transactions.
// Mencatat setiap pergerakan stok (masuk/keluar).
// ============================================

const { pool } = require('../config/db');

/**
 * Ambil riwayat transaksi stok dengan filter & pagination
 * @param {object} options
 */
const findAll = async ({ product_id, type, page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  // JOIN dengan tabel products dan users untuk info lengkap
  let baseQuery = `
    FROM stock_transactions st
    LEFT JOIN products p ON st.product_id = p.id
    LEFT JOIN users u ON st.created_by = u.id
    WHERE 1=1
  `;
  const params = [];

  // Filter berdasarkan produk
  if (product_id) {
    baseQuery += ` AND st.product_id = ?`;
    params.push(Number(product_id));
  }

  // Filter berdasarkan tipe (IN/OUT)
  if (type) {
    baseQuery += ` AND st.type = ?`;
    params.push(type.toUpperCase());
  }

  const dataQuery = `
    SELECT 
      st.id,
      st.type,
      st.quantity,
      st.note,
      st.created_at,
      p.id AS product_id,
      p.name AS product_name,
      p.sku AS product_sku,
      u.id AS user_id,
      u.name AS created_by_name
    ${baseQuery}
    ORDER BY st.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  const [rows] = await pool.execute(dataQuery, [...params, Number(limit), Number(offset)]);
  const [countResult] = await pool.execute(countQuery, params);

  return {
    data: rows,
    total: countResult[0].total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(countResult[0].total / limit),
  };
};

/**
 * Buat transaksi stok baru
 * @param {object} data
 */
const create = async ({ product_id, type, quantity, note, created_by }) => {
  const [result] = await pool.execute(
    `INSERT INTO stock_transactions (product_id, type, quantity, note, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [product_id, type, quantity, note || null, created_by]
  );

  // Ambil data transaksi yang baru dibuat beserta info produk
  const [rows] = await pool.execute(
    `SELECT 
      st.id, st.type, st.quantity, st.note, st.created_at,
      p.id AS product_id, p.name AS product_name, p.sku AS product_sku,
      p.stock AS stock_after,
      u.name AS created_by_name
     FROM stock_transactions st
     LEFT JOIN products p ON st.product_id = p.id
     LEFT JOIN users u ON st.created_by = u.id
     WHERE st.id = ?`,
    [result.insertId]
  );

  return rows[0];
};

/**
 * Ambil ringkasan stok per produk
 * (total masuk, total keluar, selisih)
 * @param {number} productId
 */
const getSummaryByProduct = async (productId) => {
  const [rows] = await pool.execute(
    `SELECT
      SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) AS total_in,
      SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) AS total_out,
      COUNT(*) AS total_transactions
     FROM stock_transactions
     WHERE product_id = ?`,
    [productId]
  );
  return rows[0];
};

module.exports = { findAll, create, getSummaryByProduct };
