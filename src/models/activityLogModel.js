// ============================================
// models/activityLogModel.js
// Query SQL untuk tabel activity_logs.
// Mencatat semua aktivitas penting di sistem.
// ============================================

const { pool } = require('../config/db');

/**
 * Ambil semua activity log dengan filter dan pagination
 * @param {object} options
 */
const findAll = async ({ user_id, action, module, page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (user_id) {
    whereClause += ' AND al.user_id = ?';
    params.push(Number(user_id));
  }

  if (action) {
    whereClause += ' AND al.action = ?';
    params.push(action.toUpperCase());
  }

  if (module) {
    whereClause += ' AND al.module = ?';
    params.push(module.toLowerCase());
  }

  const dataQuery = `
    SELECT
      al.id,
      al.action,
      al.module,
      al.description,
      al.ip_address,
      al.created_at,
      u.id   AS user_id,
      u.name AS user_name,
      u.role AS user_role
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM activity_logs al
    ${whereClause}
  `;

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
 * Ambil daftar action unik (untuk filter dropdown)
 */
const getDistinctActions = async () => {
  const [rows] = await pool.execute(
    'SELECT DISTINCT action FROM activity_logs ORDER BY action'
  );
  return rows.map((r) => r.action);
};

/**
 * Ambil daftar module unik (untuk filter dropdown)
 */
const getDistinctModules = async () => {
  const [rows] = await pool.execute(
    'SELECT DISTINCT module FROM activity_logs ORDER BY module'
  );
  return rows.map((r) => r.module);
};

module.exports = { findAll, getDistinctActions, getDistinctModules };
