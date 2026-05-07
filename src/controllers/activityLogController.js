// ============================================
// controllers/activityLogController.js
// Controller untuk activity logs.
// ============================================

const activityLogService = require('../services/activityLogService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { MESSAGES } = require('../constants/messages');

/**
 * GET /api/logs
 * Ambil semua activity log dengan filter dan pagination
 * Query: ?user_id=1&action=LOGIN&module=auth&page=1&limit=20
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await activityLogService.getAllLogs(req.query);

  return successResponse(res, 200, MESSAGES.LOG.FETCH_ALL, result.data, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

/**
 * GET /api/logs/filters
 * Ambil daftar action dan module unik untuk filter dropdown
 */
const getFilterOptions = asyncHandler(async (req, res) => {
  const options = await activityLogService.getFilterOptions();
  return successResponse(res, 200, 'Filter options', options);
});

module.exports = { getAll, getFilterOptions };
