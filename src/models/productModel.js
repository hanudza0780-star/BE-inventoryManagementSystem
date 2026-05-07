// ============================================
// models/productModel.js
// Semua query SQL untuk tabel products.
// Menggunakan parameterized query untuk mencegah SQL injection.
// ============================================

const { pool } = require('../config/db');

/**
 * Ambil semua produk dengan search, filter, dan pagination
 * @param {object} options
 */
const findAll = async ({ search = '', page = 1, limit = 10, category = '' } = {}) => {
  const offset = (page - 1) * limit;

  // Bangun WHERE clause secara dinamis
  let whereClause = `WHERE 1=1`;
  const params = [];

  if (search) {
    whereClause += ` AND (p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (category) {
    whereClause += ` AND p.category = ?`;
    params.push(category);
  }

  // Query data dengan JOIN ke categories
  const dataQuery = `
    SELECT 
      p.id, p.name, p.sku, p.category, p.category_id,
      c.name AS category_name,
      p.description, p.price, p.stock, p.unit,
      p.is_active, p.created_at, p.updated_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  // Query hitung total (tanpa LIMIT/OFFSET)
  const countQuery = `SELECT COUNT(*) as total FROM products p ${whereClause}`;

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
 * Ambil satu produk berdasarkan ID
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
};

/**
 * Cari produk berdasarkan SKU
 */
const findBySku = async (sku) => {
  const [rows] = await pool.execute(
    'SELECT * FROM products WHERE sku = ?',
    [sku]
  );
  return rows[0] || null;
};

/**
 * Buat produk baru
 */
const create = async ({ name, sku, category_id, category, description, price, stock, unit, is_active = 1 }) => {
  const [result] = await pool.execute(
    `INSERT INTO products (name, sku, category_id, category, description, price, stock, unit, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, sku, category_id || null, category, description || null, price, stock, unit || 'pcs', is_active]
  );
  return findById(result.insertId);
};

/**
 * Update produk berdasarkan ID
 */
const update = async (id, { name, sku, category_id, category, description, price, stock, unit, is_active }) => {
  const [result] = await pool.execute(
    `UPDATE products 
     SET name = ?, sku = ?, category_id = ?, category = ?, description = ?,
         price = ?, stock = ?, unit = ?, is_active = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, sku, category_id || null, category, description || null, price, stock, unit || 'pcs', is_active, id]
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
};

/**
 * Update stok produk (tambah atau kurangi)
 * Kondisi "stock + ? >= 0" mencegah stok minus
 */
const updateStock = async (id, quantity) => {
  const [result] = await pool.execute(
    `UPDATE products 
     SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND stock + ? >= 0`,
    [quantity, id, quantity]
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
};

/**
 * Hapus produk berdasarkan ID
 */
const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Ambil daftar kategori unik dari kolom category
 */
const getCategories = async () => {
  const [rows] = await pool.execute(
    'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
  );
  return rows.map(row => row.category);
};

module.exports = {
  findAll,
  findById,
  findBySku,
  create,
  update,
  updateStock,
  remove,
  getCategories,
};
