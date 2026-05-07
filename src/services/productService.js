// ============================================
// services/productService.js
// Logika bisnis untuk module products.
// ============================================

const path = require('path');
const productModel = require('../models/productModel');
const AppError = require('../utils/AppError');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { deleteFile, extractFilePath } = require('../utils/fileHelper');
const { MESSAGES } = require('../constants/messages');

/**
 * Ambil semua produk dengan pagination, search, dan filter
 */
const getAllProducts = async (queryParams) => {
  const { search, category } = queryParams;
  const { page, limit } = getPagination(queryParams);

  return productModel.findAll({ search, page, limit, category });
};

/**
 * Ambil produk dengan stok rendah
 */
const getLowStockProducts = async (queryParams) => {
  const { search, category } = queryParams;
  const { page, limit } = getPagination(queryParams);

  return productModel.findLowStock({ search, category, page, limit });
};

/**
 * Ambil satu produk berdasarkan ID
 */
const getProductById = async (id) => {
  const product = await productModel.findById(id);
  if (!product) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
  return product;
};

/**
 * Buat produk baru
 */
const createProduct = async (productData) => {
  const { sku } = productData;

  const existingProduct = await productModel.findBySku(sku);
  if (existingProduct) throw new AppError(MESSAGES.PRODUCT.SKU_TAKEN(sku), 409);

  return productModel.create(productData);
};

/**
 * Update produk
 */
const updateProduct = async (id, productData) => {
  const { sku } = productData;

  const existing = await productModel.findById(id);
  if (!existing) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

  const skuOwner = await productModel.findBySku(sku);
  if (skuOwner && skuOwner.id !== Number(id)) {
    throw new AppError(MESSAGES.PRODUCT.SKU_TAKEN(sku), 409);
  }

  return productModel.update(id, productData);
};

/**
 * Upload / ganti gambar produk
 *
 * FLOW:
 * 1. Cek produk ada
 * 2. Jika produk sudah punya gambar → hapus file lama dari disk
 * 3. Simpan path gambar baru ke database
 * 4. Return data produk terbaru
 *
 * @param {number} id - ID produk
 * @param {object} file - req.file dari Multer
 * @param {string} baseUrl - Base URL server (untuk generate URL lengkap)
 */
const uploadProductImage = async (id, file, baseUrl) => {
  if (!file) throw new AppError('File gambar wajib diupload', 400);

  const existing = await productModel.findById(id);
  if (!existing) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

  // Hapus gambar lama jika ada
  if (existing.image_url) {
    const oldFilePath = extractFilePath(existing.image_url);
    deleteFile(oldFilePath);
  }

  // Generate URL publik untuk gambar baru
  // Contoh: http://localhost:3000/uploads/products/product-123.jpg
  const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;

  return productModel.updateImage(id, imageUrl);
};

/**
 * Hapus produk
 * Juga hapus file gambar dari disk jika ada
 */
const deleteProduct = async (id) => {
  const existing = await productModel.findById(id);
  if (!existing) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

  // Hapus file gambar dari disk
  if (existing.image_url) {
    const filePath = extractFilePath(existing.image_url);
    deleteFile(filePath);
  }

  await productModel.remove(id);
  return { message: MESSAGES.PRODUCT.DELETED(existing.name) };
};

/**
 * Update stok produk langsung (tanpa riwayat)
 */
const adjustStock = async (id, quantity) => {
  if (quantity === undefined || quantity === null) {
    throw new AppError('Field quantity wajib diisi', 400);
  }
  if (isNaN(quantity)) {
    throw new AppError('Jumlah stok harus berupa angka', 400);
  }

  const existing = await productModel.findById(id);
  if (!existing) throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);

  const updated = await productModel.updateStock(id, quantity);
  if (!updated) {
    throw new AppError(MESSAGES.PRODUCT.STOCK_INSUFFICIENT(existing.stock), 400);
  }

  return updated;
};

module.exports = {
  getAllProducts,
  getLowStockProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
  adjustStock,
};
