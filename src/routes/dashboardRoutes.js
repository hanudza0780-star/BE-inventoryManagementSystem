// ============================================
// routes/dashboardRoutes.js
// Endpoint dashboard statistics.
// Hanya bisa diakses oleh admin dan manager.
// ============================================

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

// Semua endpoint dashboard butuh auth + role admin/manager
const dashboardAuth = [authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER)];

router.get('/stats',        dashboardAuth, dashboardController.getStats);
router.get('/stock-chart',  dashboardAuth, dashboardController.getStockChart);
router.get('/top-products', dashboardAuth, dashboardController.getTopProducts);

module.exports = router;
