// ============================================
// routes/index.js
// Pusat semua route. app.js hanya import file ini.
// Tambahkan route baru di sini.
// ============================================

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const stockRoutes = require('./stockRoutes');

// Mount semua route dengan prefix masing-masing
router.use('/auth', authRoutes);           // /api/auth/...
router.use('/products', productRoutes);    // /api/products/...
router.use('/categories', categoryRoutes); // /api/categories/...
router.use('/stocks', stockRoutes);        // /api/stocks/...

// Health check - tidak butuh autentikasi
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server berjalan dengan baik',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      stocks: '/api/stocks',
    },
  });
});

module.exports = router;
