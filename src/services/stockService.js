// ============================================
// services/stockService.js
// Logika bisnis untuk manajemen stok.
//
// FLOW STOK MASUK (IN):
// 1. Validasi produk ada
// 2. Catat transaksi di stock_transactions
// 3. Tambah stok di tabel products
//
// FLOW STOK KELUAR (OUT):
// 1. Validasi produk ada
// 2. Cek stok mencukupi
// 3. Catat transaksi di stock_transactions
// 4. Kurangi stok di tabel products
//
// Semua operasi menggunakan MySQL TRANSACTION
// agar data konsisten (tidak setengah-setengah)
// ============================================

const stockModel = require('../models/stockModel');
const productModel = require('../models/productModel');
const AppError = require('../utils/AppError');
const { pool } = require('../config/db');

/**
 * Ambil riwayat transaksi stok
 */
const getStockHistory = async (queryParams) => {
  const { product_id, type, page = 1, limit = 10 } = queryParams;

  const validPage = Math.max(1, parseInt(page));
  const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

  return stockModel.findAll({
    product_id,
    type,
    page: validPage,
    limit: validLimit,
  });
};

/**
 * Proses stok masuk (IN)
 * @param {object} data - { product_id, quantity, note }
 * @param {number} userId - ID user yang melakukan transaksi
 */
const stockIn = async ({ product_id, quantity, note }, userId) => {
  // 1. Cek produk ada
  const product = await productModel.findById(product_id);
  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404);
  }

  // 2. Gunakan MySQL TRANSACTION untuk konsistensi data
  // Jika salah satu query gagal, semua dibatalkan (rollback)
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // Mulai transaksi

    // 3. Catat transaksi stok
    const [transResult] = await connection.execute(
      `INSERT INTO stock_transactions (product_id, type, quantity, note, created_by)
       VALUES (?, 'IN', ?, ?, ?)`,
      [product_id, quantity, note || null, userId]
    );

    // 4. Tambah stok produk
    await connection.execute(
      `UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [quantity, product_id]
    );

    await connection.commit(); // Simpan semua perubahan

    // 5. Ambil data transaksi yang baru dibuat
    const [rows] = await connection.execute(
      `SELECT 
        st.id, st.type, st.quantity, st.note, st.created_at,
        p.id AS product_id, p.name AS product_name, p.sku AS product_sku,
        p.stock AS stock_after,
        u.name AS created_by_name
       FROM stock_transactions st
       LEFT JOIN products p ON st.product_id = p.id
       LEFT JOIN users u ON st.created_by = u.id
       WHERE st.id = ?`,
      [transResult.insertId]
    );

    return rows[0];
  } catch (error) {
    await connection.rollback(); // Batalkan semua jika ada error
    throw error;
  } finally {
    connection.release(); // Kembalikan koneksi ke pool
  }
};

/**
 * Proses stok keluar (OUT)
 * @param {object} data - { product_id, quantity, note }
 * @param {number} userId - ID user yang melakukan transaksi
 */
const stockOut = async ({ product_id, quantity, note }, userId) => {
  // 1. Cek produk ada
  const product = await productModel.findById(product_id);
  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404);
  }

  // 2. Validasi stok mencukupi (PENTING: jangan sampai stok minus!)
  if (product.stock < quantity) {
    throw new AppError(
      `Stok tidak mencukupi. Stok tersedia: ${product.stock}, diminta: ${quantity}`,
      400
    );
  }

  // 3. Gunakan MySQL TRANSACTION
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 4. Catat transaksi stok keluar
    const [transResult] = await connection.execute(
      `INSERT INTO stock_transactions (product_id, type, quantity, note, created_by)
       VALUES (?, 'OUT', ?, ?, ?)`,
      [product_id, quantity, note || null, userId]
    );

    // 5. Kurangi stok produk
    // Kondisi "stock - ? >= 0" sebagai safety net tambahan
    const [updateResult] = await connection.execute(
      `UPDATE products 
       SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND stock - ? >= 0`,
      [quantity, product_id, quantity]
    );

    // Jika tidak ada baris yang terupdate, berarti stok tidak cukup
    if (updateResult.affectedRows === 0) {
      throw new AppError('Stok tidak mencukupi', 400);
    }

    await connection.commit();

    // 6. Ambil data transaksi yang baru dibuat
    const [rows] = await connection.execute(
      `SELECT 
        st.id, st.type, st.quantity, st.note, st.created_at,
        p.id AS product_id, p.name AS product_name, p.sku AS product_sku,
        p.stock AS stock_after,
        u.name AS created_by_name
       FROM stock_transactions st
       LEFT JOIN products p ON st.product_id = p.id
       LEFT JOIN users u ON st.created_by = u.id
       WHERE st.id = ?`,
      [transResult.insertId]
    );

    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Ambil ringkasan stok produk tertentu
 */
const getProductStockSummary = async (productId) => {
  const product = await productModel.findById(productId);
  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404);
  }

  const summary = await stockModel.getSummaryByProduct(productId);

  return {
    product: {
      id: product.id,
      name: product.name,
      sku: product.sku,
      current_stock: product.stock,
      unit: product.unit,
    },
    transactions: {
      total_in: summary.total_in || 0,
      total_out: summary.total_out || 0,
      total_transactions: summary.total_transactions || 0,
    },
  };
};

module.exports = { getStockHistory, stockIn, stockOut, getProductStockSummary };
