// ============================================
// validations/stockValidation.js
// Rules validasi untuk endpoint stock management
// ============================================

const { body, query } = require('express-validator');

/**
 * Validasi untuk POST /api/stocks/in (stok masuk)
 */
const stockInValidation = [
  body('product_id')
    .notEmpty().withMessage('product_id wajib diisi')
    .isInt({ min: 1 }).withMessage('product_id harus berupa angka positif'),

  body('quantity')
    .notEmpty().withMessage('Jumlah stok wajib diisi')
    .isInt({ min: 1 }).withMessage('Jumlah stok masuk harus minimal 1'),

  body('note')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Catatan maksimal 500 karakter'),
];

/**
 * Validasi untuk POST /api/stocks/out (stok keluar)
 */
const stockOutValidation = [
  body('product_id')
    .notEmpty().withMessage('product_id wajib diisi')
    .isInt({ min: 1 }).withMessage('product_id harus berupa angka positif'),

  body('quantity')
    .notEmpty().withMessage('Jumlah stok wajib diisi')
    .isInt({ min: 1 }).withMessage('Jumlah stok keluar harus minimal 1'),

  body('note')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Catatan maksimal 500 karakter'),
];

/**
 * Validasi untuk query parameter GET /api/stocks/history
 */
const stockHistoryQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page harus berupa angka positif'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100'),

  query('product_id')
    .optional()
    .isInt({ min: 1 }).withMessage('product_id harus berupa angka positif'),

  query('type')
    .optional()
    .isIn(['IN', 'OUT']).withMessage('Type harus IN atau OUT'),
];

module.exports = { stockInValidation, stockOutValidation, stockHistoryQueryValidation };
