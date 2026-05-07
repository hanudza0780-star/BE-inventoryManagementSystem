// ============================================
// routes/activityLogRoutes.js
// Endpoint activity logs.
// Hanya admin yang bisa melihat semua log.
// ============================================

const express = require('express');
const router = express.Router();

const activityLogController = require('../controllers/activityLogController');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

// Hanya admin yang bisa akses logs
router.get('/',        authenticate, authorize(ROLES.ADMIN), activityLogController.getAll);
router.get('/filters', authenticate, authorize(ROLES.ADMIN), activityLogController.getFilterOptions);

module.exports = router;
