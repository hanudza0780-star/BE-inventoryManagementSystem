// ============================================
// validations/productValidation.js
// Rules validasi untuk endpoint products
// ============================================

const { body, query, param } = require('express-validator');

/**
 * Validasi untuk POST /api/products (buat produk baru)
 * dan PUT /api/products/:id (update produk)
 */
const productBodyValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nama produk harus antara 2-200 karakter'),

  body('sku')
    .trim()
    .notEmpty().withMessage('SKU wajib diisi')
    .isLength({ min: 2, max: 100 })
    .withMessage('SKU harus antara 2-100 karakter')
    // Hanya huruf, angka, dan tanda hubung
    .matches(/^[A-Za-z0-9\-_]+$/)
    .withMessage('SKU hanya boleh berisi huruf, angka, tanda hubung (-), dan underscore (_)'),

  body('category')
    .trim()
    .notEmpty().withMessage('Kategori wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Kategori maksimal 100 karakter'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Deskripsi maksimal 1000 karakter'),

  body('price')
    .notEmpty().withMessage('Harga wajib diisi')
    .isFloat({ min: 0 }).withMessage('Harga harus berupa angka positif'),

  body('stock')
    .notEmpty().withMessage('Stok wajib diisi')
    .isInt({ min: 0 }).withMessage('Stok harus berupa bilangan bulat positif'),

  body('unit')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Satuan maksimal 50 karakter'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active harus berupa boolean (true/false)'),
];

/**
 * Validasi untuk query parameter GET /api/products
 */
const productQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page harus berupa angka positif'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Kata kunci pencarian maksimal 100 karakter'),

  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Kategori maksimal 100 karakter'),
];

/**
 * Validasi untuk URL parameter :id
 */
const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID harus berupa angka positif'),
];

module.exports = {
  productBodyValidation,
  productQueryValidation,
  idParamValidation,
};
