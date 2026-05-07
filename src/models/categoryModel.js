// ============================================
// models/categoryModel.js
// Semua query SQL untuk tabel categories.
// Model hanya berisi query, tidak ada logika bisnis.
// ============================================

const { pool } = require('../config/db');

/**
 * Ambil semua kategori dengan pagination & search
 * @param {object} options
 */
const findAll = async ({ search = '', page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  let baseQuery = `FROM categories WHERE 1=1`;
  const params = [];

  if (search) {
    baseQuery += ` AND (name LIKE ? OR description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  // Query data
  const dataQuery = `SELECT * ${baseQuery} ORDER BY name ASC LIMIT ? OFFSET ?`;
  // Query hitung total
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
 * Ambil semua kategori aktif (untuk dropdown, tanpa pagination)
 */
const findAllActive = async () => {
  const [rows] = await pool.execute(
    'SELECT id, name, description FROM categories WHERE is_active = 1 ORDER BY name ASC'
  );
  return rows;
};

/**
 * Ambil satu kategori berdasarkan ID
 * @param {number} id
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

/**
 * Cari kategori berdasarkan nama (untuk cek duplikat)
 * @param {string} name
 */
const findByName = async (name) => {
  const [rows] = await pool.execute(
    'SELECT * FROM categories WHERE name = ?',
    [name]
  );
  return rows[0] || null;
};

/**
 * Buat kategori baru
 * @param {object} data
 */
const create = async ({ name, description, is_active = 1 }) => {
  const [result] = await pool.execute(
    'INSERT INTO categories (name, description, is_active) VALUES (?, ?, ?)',
    [name, description || null, is_active]
  );
  return findById(result.insertId);
};

/**
 * Update kategori berdasarkan ID
 * @param {number} id
 * @param {object} data
 */
const update = async (id, { name, description, is_active }) => {
  const [result] = await pool.execute(
    `UPDATE categories 
     SET name = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, description || null, is_active, id]
  );
  if (result.affectedRows === 0) return null;
  return findById(id);
};

/**
 * Hapus kategori berdasarkan ID
 * @param {number} id
 */
const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

/**
 * Hitung jumlah produk yang menggunakan kategori ini
 * Digunakan sebelum hapus kategori
 * @param {number} categoryId
 */
const countProducts = async (categoryId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total FROM products WHERE category_id = ?',
    [categoryId]
  );
  return rows[0].total;
};

module.exports = {
  findAll,
  findAllActive,
  findById,
  findByName,
  create,
  update,
  remove,
  countProducts,
};
