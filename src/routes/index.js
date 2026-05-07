// ============================================
// routes/index.js
// Pusat semua route. app.js hanya import file ini.
// ============================================

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const authRoutes      = require('./authRoutes');
const productRoutes   = require('./productRoutes');
const categoryRoutes  = require('./categoryRoutes');
const stockRoutes     = require('./stockRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const logRoutes       = require('./activityLogRoutes');

router.use('/auth',       authRoutes);
router.use('/products',   productRoutes);
router.use('/categories', categoryRoutes);
router.use('/stocks',     stockRoutes);
router.use('/dashboard',  dashboardRoutes);
router.use('/logs',       logRoutes);

// -----------------------------------------------
// Health Check — tidak butuh autentikasi
// Mengembalikan status server + koneksi database
// -----------------------------------------------
router.get('/health', async (req, res) => {
  // Cek koneksi database
  let dbStatus = 'connected';
  let dbLatency = null;

  try {
    const start = Date.now();
    const connection = await pool.getConnection();
    dbLatency = Date.now() - start;
    connection.release();
  } catch {
    dbStatus = 'disconnected';
  }

  const status = dbStatus === 'connected' ? 'ok' : 'degraded';

  res.status(dbStatus === 'connected' ? 200 : 503).json({
    success: dbStatus === 'connected',
    status,
    message: dbStatus === 'connected' ? 'Server berjalan dengan baik' : 'Database tidak terhubung',
    data: {
      api: 'ok',
      database: dbStatus,
      db_latency_ms: dbLatency,
      uptime_seconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    },
  });
});

module.exports = router;
