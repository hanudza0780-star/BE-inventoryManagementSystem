// ============================================
// controllers/productController.js
// Controller untuk CRUD products + image upload + low stock.
// ============================================

const productService = require('../services/productService');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { MESSAGES } = require('../constants/messages');

/**
 * GET /api/products
 * Ambil semua produk dengan search, filter, dan pagination
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  return successResponse(res, 200, MESSAGES.PRODUCT.FETCH_ALL, result.data, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

/**
 * GET /api/products/low-stock
 * Ambil produk dengan stok rendah (stock <= minimum_stock)
 */
const getLowStock = asyncHandler(async (req, res) => {
  const result = await productService.getLowStockProducts(req.query);

  return successResponse(res, 200, MESSAGES.PRODUCT.LOW_STOCK, result.data, {
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
  return successResponse(res, 200, MESSAGES.PRODUCT.FETCH_ONE, product);
});

/**
 * POST /api/products
 * Buat produk baru
 */
const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return successResponse(res, 201, MESSAGES.PRODUCT.CREATED, product);
});

/**
 * PUT /api/products/:id
 * Update produk
 */
const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return successResponse(res, 200, MESSAGES.PRODUCT.UPDATED, product);
});

/**
 * DELETE /api/products/:id
 * Hapus produk (juga hapus gambar dari disk)
 */
const remove = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  return successResponse(res, 200, result.message);
});

/**
 * PATCH /api/products/:id/stock
 * Update stok langsung
 */
const updateStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const product = await productService.adjustStock(req.params.id, quantity);
  return successResponse(res, 200, MESSAGES.PRODUCT.STOCK_UPDATED, product);
});

/**
 * POST /api/products/:id/image
 * Upload gambar produk
 *
 * req.file tersedia karena middleware uploadProductImage (Multer) sudah dijalankan
 * sebelum controller ini di route
 */
const uploadImage = asyncHandler(async (req, res) => {
  // Buat base URL dari request (http://localhost:3000)
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const product = await productService.uploadProductImage(
    req.params.id,
    req.file,
    baseUrl
  );

  return successResponse(res, 200, MESSAGES.PRODUCT.IMAGE_UPLOADED, product);
});

module.exports = { getAll, getLowStock, getById, create, update, remove, updateStock, uploadImage };
