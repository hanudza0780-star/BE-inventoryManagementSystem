// ============================================
// routes/categoryRoutes.js
// Endpoint untuk module categories.
//
// ROLE ACCESS:
// - GET: semua role
// - POST/PUT/DELETE: admin saja
// ============================================

const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categoryBodyValidation, idParamValidation } = require('../validations/categoryValidation');

/**
 * GET  /api/categories        - Ambil semua kategori (semua role)
 * POST /api/categories        - Buat kategori baru (admin)
 */
router
  .route('/')
  .get(authenticate, categoryController.getAll)
  .post(
    authenticate,
    authorize('admin'),
    categoryBodyValidation,
    validate,
    categoryController.create
  );

/**
 * GET /api/categories/active  - Ambil kategori aktif (untuk dropdown)
 * Harus didefinisikan SEBELUM /:id agar tidak konflik
 */
router.get('/active', authenticate, categoryController.getActive);

/**
 * GET    /api/categories/:id  - Ambil satu kategori
 * PUT    /api/categories/:id  - Update kategori (admin)
 * DELETE /api/categories/:id  - Hapus kategori (admin)
 */
router
  .route('/:id')
  .get(authenticate, idParamValidation, validate, categoryController.getById)
  .put(
    authenticate,
    authorize('admin'),
    [...idParamValidation, ...categoryBodyValidation],
    validate,
    categoryController.update
  )
  .delete(
    authenticate,
    authorize('admin'),
    idParamValidation,
    validate,
    categoryController.remove
  );

module.exports = router;
