// ============================================
// services/productService.js
// Logika bisnis untuk module products.
// Semua validasi bisnis dan aturan ada di sini.
// Controller hanya memanggil fungsi dari service ini.
// ============================================

const productModel = require('../models/productModel');
const AppError = require('../utils/AppError');

/**
 * Ambil semua produk dengan pagination, search, dan filter
 */
const getAllProducts = async (queryParams) => {
  const { search, page = 1, limit = 10, category } = queryParams;

  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

  return productModel.findAll({
    search,
    page: validPage,
    limit: validLimit,
    category,
  });
};

/**
 * Ambil satu produk berdasarkan ID
 */
const getProductById = async (id) => {
  const product = await productModel.findById(id);
  if (!product) {
    throw new AppError('Produk tidak ditemukan', 404);
  }
  return product;
};

/**
 * Buat produk baru
 */
const createProduct = async (productData) => {
  const { sku } = productData;

  // Cek SKU sudah dipakai
  const existingProduct = await productModel.findBySku(sku);
  if (existingProduct) {
    throw new AppError(`SKU '${sku}' sudah digunakan produk lain`, 409);
  }

  return productModel.create(productData);
};

/**
 * Update produk
 */
const updateProduct = async (id, productData) => {
  const { sku } = productData;

  // Cek produk ada
  const existing = await productModel.findById(id);
  if (!existing) {
    throw new AppError('Produk tidak ditemukan', 404);
  }

  // Cek SKU duplikat (kecuali milik produk ini sendiri)
  const skuOwner = await productModel.findBySku(sku);
  if (skuOwner && skuOwner.id !== Number(id)) {
    throw new AppError(`SKU '${sku}' sudah digunakan produk lain`, 409);
  }

  return productModel.update(id, productData);
};

/**
 * Hapus produk
 */
const deleteProduct = async (id) => {
  const existing = await productModel.findById(id);
  if (!existing) {
    throw new AppError('Produk tidak ditemukan', 404);
  }

  await productModel.remove(id);
  return { message: `Produk '${existing.name}' berhasil dihapus` };
};

/**
 * Update stok produk langsung (tanpa mencatat riwayat)
 * Untuk pencatatan riwayat, gunakan stockService
 */
const adjustStock = async (id, quantity) => {
  if (quantity === undefined || quantity === null) {
    throw new AppError('Field quantity wajib diisi', 400);
  }

  if (isNaN(quantity)) {
    throw new AppError('Jumlah stok harus berupa angka', 400);
  }

  const existing = await productModel.findById(id);
  if (!existing) {
    throw new AppError('Produk tidak ditemukan', 404);
  }

  const updated = await productModel.updateStock(id, quantity);
  if (!updated) {
    throw new AppError(
      `Stok tidak mencukupi. Stok saat ini: ${existing.stock}`,
      400
    );
  }

  return updated;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
};
