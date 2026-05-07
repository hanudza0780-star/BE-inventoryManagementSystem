// ============================================
// controllers/categoryController.js
// Controller untuk module categories.
// Menggunakan asyncHandler agar tidak perlu try/catch.
// ============================================

const categoryService = require('../services/categoryService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

/**
 * GET /api/categories
 * Ambil semua kategori dengan pagination
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories(req.query);

  return successResponse(res, 200, 'Data kategori berhasil diambil', result.data, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

/**
 * GET /api/categories/active
 * Ambil semua kategori aktif (untuk dropdown, tanpa pagination)
 */
const getActive = asyncHandler(async (req, res) => {
  const categories = await categoryService.getActiveCategories();
  return successResponse(res, 200, 'Daftar kategori aktif', categories);
});

/**
 * GET /api/categories/:id
 * Ambil satu kategori berdasarkan ID
 */
const getById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return successResponse(res, 200, 'Data kategori ditemukan', category);
});

/**
 * POST /api/categories
 * Buat kategori baru (hanya admin)
 */
const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return successResponse(res, 201, 'Kategori berhasil dibuat', category);
});

/**
 * PUT /api/categories/:id
 * Update kategori (hanya admin)
 */
const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return successResponse(res, 200, 'Kategori berhasil diupdate', category);
});

/**
 * DELETE /api/categories/:id
 * Hapus kategori (hanya admin)
 */
const remove = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  return successResponse(res, 200, result.message);
});

module.exports = { getAll, getActive, getById, create, update, remove };
