// ============================================
// routes/productRoutes.js
// Endpoint products dengan validasi dan role-based access.
//
// ROLE ACCESS:
// - GET (baca): semua role (admin, manager, staff)
// - POST/PUT (tulis): admin dan manager
// - DELETE (hapus): admin saja
// ============================================

const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  productBodyValidation,
  productQueryValidation,
  idParamValidation,
} = require('../validations/productValidation');

// Semua route products butuh autentikasi
// Pasang authenticate sebagai middleware pertama

/**
 * GET  /api/products  - Ambil semua produk (semua role)
 * POST /api/products  - Buat produk baru (admin & manager)
 */
router
  .route('/')
  .get(
    authenticate,
    productQueryValidation, // Validasi query params
    validate,
    productController.getAll
  )
  .post(
    authenticate,
    authorize('admin', 'manager'), // Hanya admin & manager
    productBodyValidation,
    validate,
    productController.create
  );

/**
 * GET    /api/products/:id  - Ambil satu produk (semua role)
 * PUT    /api/products/:id  - Update produk (admin & manager)
 * DELETE /api/products/:id  - Hapus produk (admin saja)
 */
router
  .route('/:id')
  .get(
    authenticate,
    idParamValidation,
    validate,
    productController.getById
  )
  .put(
    authenticate,
    authorize('admin', 'manager'),
    [...idParamValidation, ...productBodyValidation], // Gabung validasi ID + body
    validate,
    productController.update
  )
  .delete(
    authenticate,
    authorize('admin'), // Hanya admin
    idParamValidation,
    validate,
    productController.remove
  );

/**
 * PATCH /api/products/:id/stock
 * Update stok langsung (admin & manager)
 */
router.patch(
  '/:id/stock',
  authenticate,
  authorize('admin', 'manager'),
  productController.updateStock
);

module.exports = router;
