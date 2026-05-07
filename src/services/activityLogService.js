// ============================================
// services/activityLogService.js
// Logika bisnis untuk activity logs.
// ============================================

const activityLogModel = require('../models/activityLogModel');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

/**
 * Ambil semua activity log dengan filter dan pagination
 */
const getAllLogs = async (queryParams) => {
  const { user_id, action, module } = queryParams;
  const { page, limit } = getPagination(queryParams);

  const result = await activityLogModel.findAll({
    user_id,
    action,
    module,
    page,
    limit,
  });

  return {
    ...result,
    meta: buildPaginationMeta(result.total, result.page, result.limit),
  };
};

/**
 * Ambil daftar action dan module unik untuk filter
 */
const getFilterOptions = async () => {
  const [actions, modules] = await Promise.all([
    activityLogModel.getDistinctActions(),
    activityLogModel.getDistinctModules(),
  ]);
  return { actions, modules };
};

module.exports = { getAllLogs, getFilterOptions };
