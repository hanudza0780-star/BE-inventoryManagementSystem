// ============================================
// routes/stockRoutes.js
// Endpoint untuk manajemen stok.
//
// ROLE ACCESS:
// - GET history: semua role
// - POST in/out: admin dan manager
// ============================================

const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stockController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  stockInValidation,
  stockOutValidation,
  stockHistoryQueryValidation,
} = require('../validations/stockValidation');

/**
 * GET /api/stocks/history
 * Riwayat semua transaksi stok
 * Query: ?product_id=1&type=IN&page=1&limit=10
 */
router.get(
  '/history',
  authenticate,
  stockHistoryQueryValidation,
  validate,
  stockController.getHistory
);

/**
 * POST /api/stocks/in
 * Catat stok masuk (admin & manager)
 */
router.post(
  '/in',
  authenticate,
  authorize('admin', 'manager'),
  stockInValidation,
  validate,
  stockController.stockIn
);

/**
 * POST /api/stocks/out
 * Catat stok keluar (admin & manager)
 */
router.post(
  '/out',
  authenticate,
  authorize('admin', 'manager'),
  stockOutValidation,
  validate,
  stockController.stockOut
);

/**
 * GET /api/stocks/summary/:productId
 * Ringkasan stok produk tertentu
 */
router.get(
  '/summary/:productId',
  authenticate,
  stockController.getProductSummary
);

module.exports = router;
