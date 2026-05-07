// ============================================
// models/userModel.js
// Model untuk tabel users (autentikasi)
// ============================================

const { pool } = require('../config/db');

/**
 * Cari user berdasarkan email
 * @param {string} email
 */
const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};

/**
 * Cari user berdasarkan ID
 * @param {number} id
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

/**
 * Buat user baru
 * @param {object} userData
 */
const create = async ({ name, email, password, role = 'staff' }) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return findById(result.insertId);
};

module.exports = { findByEmail, findById, create };
