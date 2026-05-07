// ============================================
// validations/categoryValidation.js
// Rules validasi untuk endpoint categories
// ============================================

const { body, param } = require('express-validator');

/**
 * Validasi untuk POST dan PUT /api/categories
 */
const categoryBodyValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama kategori wajib diisi')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama kategori harus antara 2-100 karakter'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Deskripsi maksimal 500 karakter'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active harus berupa boolean (true/false)'),
];

/**
 * Validasi untuk URL parameter :id
 */
const idParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID harus berupa angka positif'),
];

module.exports = { categoryBodyValidation, idParamValidation };
