// ============================================
// routes/productRoutes.js
// Endpoint products dengan validasi, role-based access,
// image upload, dan low stock feature.
// ============================================

const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadProductImage } = require('../middleware/upload');
const { logActivity } = require('../middleware/activityLogger');
const { uploadLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const {
  productBodyValidation,
  productQueryValidation,
  idParamValidation,
} = require('../validations/productValidation');
const { ROLES } = require('../constants/roles');

/**
 * GET  /api/products       - List produk (semua role)
 * POST /api/products       - Buat produk (admin, manager)
 */
router
  .route('/')
  .get(authenticate, productQueryValidation, validate, productController.getAll)
  .post(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.MANAGER),
    productBodyValidation, validate,
    logActivity('CREATE', 'products'),
    productController.create
  );

/**
 * GET /api/products/low-stock
 * Harus SEBELUM /:id agar tidak konflik
 */
router.get('/low-stock', authenticate, productController.getLowStock);

/**
 * GET    /api/products/:id  - Detail produk
 * PUT    /api/products/:id  - Update produk (admin, manager)
 * DELETE /api/products/:id  - Hapus produk (admin)
 */
router
  .route('/:id')
  .get(authenticate, idParamValidation, validate, productController.getById)
  .put(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.MANAGER),
    [...idParamValidation, ...productBodyValidation], validate,
    logActivity('UPDATE', 'products'),
    productController.update
  )
  .delete(
    authenticate,
    authorize(ROLES.ADMIN),
    idParamValidation, validate,
    logActivity('DELETE', 'products'),
    productController.remove
  );

/**
 * PATCH /api/products/:id/stock
 * Update stok langsung (admin, manager)
 */
router.patch(
  '/:id/stock',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  productController.updateStock
);

/**
 * POST /api/products/:id/image
 * Upload gambar produk (admin, manager)
 * uploadLimiter → uploadProductImage (Multer) → logActivity → controller
 */
router.post(
  '/:id/image',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  uploadLimiter,
  uploadProductImage,
  logActivity('UPLOAD_IMAGE', 'products'),
  productController.uploadImage
);

module.exports = router;
