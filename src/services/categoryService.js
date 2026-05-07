// ============================================
// services/categoryService.js
// Logika bisnis untuk module categories.
// Validasi, cek duplikat, dan aturan bisnis ada di sini.
// ============================================

const categoryModel = require('../models/categoryModel');
const AppError = require('../utils/AppError');

/**
 * Ambil semua kategori dengan pagination
 */
const getAllCategories = async (queryParams) => {
  const { search, page = 1, limit = 10 } = queryParams;

  const validPage = Math.max(1, parseInt(page));
  const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

  return categoryModel.findAll({ search, page: validPage, limit: validLimit });
};

/**
 * Ambil semua kategori aktif (untuk dropdown)
 */
const getActiveCategories = async () => {
  return categoryModel.findAllActive();
};

/**
 * Ambil satu kategori berdasarkan ID
 */
const getCategoryById = async (id) => {
  const category = await categoryModel.findById(id);
  if (!category) {
    throw new AppError('Kategori tidak ditemukan', 404);
  }
  return category;
};

/**
 * Buat kategori baru
 */
const createCategory = async (data) => {
  const { name } = data;

  // Cek nama kategori sudah ada
  const existing = await categoryModel.findByName(name);
  if (existing) {
    throw new AppError(`Kategori '${name}' sudah ada`, 409);
  }

  return categoryModel.create(data);
};

/**
 * Update kategori
 */
const updateCategory = async (id, data) => {
  // Cek kategori ada
  const existing = await categoryModel.findById(id);
  if (!existing) {
    throw new AppError('Kategori tidak ditemukan', 404);
  }

  // Cek nama duplikat (kecuali milik kategori ini sendiri)
  const nameOwner = await categoryModel.findByName(data.name);
  if (nameOwner && nameOwner.id !== Number(id)) {
    throw new AppError(`Kategori '${data.name}' sudah ada`, 409);
  }

  return categoryModel.update(id, data);
};

/**
 * Hapus kategori
 * Tidak bisa hapus jika masih ada produk yang menggunakan kategori ini
 */
const deleteCategory = async (id) => {
  const existing = await categoryModel.findById(id);
  if (!existing) {
    throw new AppError('Kategori tidak ditemukan', 404);
  }

  // Cek apakah ada produk yang menggunakan kategori ini
  const productCount = await categoryModel.countProducts(id);
  if (productCount > 0) {
    throw new AppError(
      `Kategori tidak bisa dihapus karena masih digunakan oleh ${productCount} produk`,
      400
    );
  }

  await categoryModel.remove(id);
  return { message: `Kategori '${existing.name}' berhasil dihapus` };
};

module.exports = {
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
