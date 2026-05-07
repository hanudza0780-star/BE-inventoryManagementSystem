// ============================================
// controllers/productController.js
// Controller untuk CRUD products.
// Menggunakan asyncHandler - tidak perlu try/catch manual.
// Validasi input sudah ditangani di productValidation.js
// ============================================

const productService = require('../services/productService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

/**
 * GET /api/products
 * Ambil semua produk dengan search, filter, dan pagination.
 * Query params: ?search=laptop&page=1&limit=10&category=Elektronik
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  return successResponse(res, 200, 'Data produk berhasil diambil', result.data, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

/**
 * GET /api/products/:id
 * Ambil satu produk berdasarkan ID
 */
const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return successResponse(res, 200, 'Data produk ditemukan', product);
});

/**
 * POST /api/products
 * Buat produk baru (hanya admin dan manager)
 */
const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return successResponse(res, 201, 'Produk berhasil dibuat', product);
});

/**
 * PUT /api/products/:id
 * Update produk (hanya admin dan manager)
 */
const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return successResponse(res, 200, 'Produk berhasil diupdate', product);
});

/**
 * DELETE /api/products/:id
 * Hapus produk (hanya admin)
 */
const remove = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  return successResponse(res, 200, result.message);
});

/**
 * PATCH /api/products/:id/stock
 * Update stok produk langsung (tambah/kurangi).
 * Untuk pencatatan riwayat, gunakan /api/stocks/in atau /api/stocks/out
 */
const updateStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const product = await productService.adjustStock(req.params.id, quantity);
  return successResponse(res, 200, 'Stok berhasil diupdate', product);
});

module.exports = { getAll, getById, create, update, remove, updateStock };
