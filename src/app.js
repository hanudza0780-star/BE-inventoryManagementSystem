// ============================================
// app.js
// Konfigurasi utama Express application.
// File ini TIDAK menjalankan server (itu tugas server.js).
//
// URUTAN MIDDLEWARE SANGAT PENTING:
// 1. Morgan (logging) - harus paling awal agar semua request ter-log
// 2. CORS - sebelum route agar preflight request bisa dihandle
// 3. Body parser - sebelum route agar req.body tersedia
// 4. Routes - logika utama aplikasi
// 5. Error handlers - PALING TERAKHIR
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// -----------------------------------------------
// 1. MORGAN - HTTP Request Logger
// Mencatat setiap request: method, URL, status, response time
//
// Format 'dev': GET /api/products 200 15.234 ms
// Format 'combined': Apache-style log (cocok untuk production)
// -----------------------------------------------
if (process.env.NODE_ENV === 'development') {
  // Format 'dev' lebih mudah dibaca saat development
  app.use(morgan('dev'));
} else {
  // Format 'combined' lebih detail untuk production logging
  app.use(morgan('combined'));
}

// -----------------------------------------------
// 2. CORS - Cross-Origin Resource Sharing
// Mengizinkan request dari domain frontend yang berbeda.
// Tanpa ini, browser akan memblokir request dari frontend.
// -----------------------------------------------
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// -----------------------------------------------
// 3. BODY PARSER
// Mengubah body request (JSON string) menjadi JavaScript object
// sehingga bisa diakses via req.body
// -----------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -----------------------------------------------
// 4. ROUTES
// Semua endpoint API dimulai dengan /api
// -----------------------------------------------
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management System API v2.0',
    docs: '/api/health',
  });
});

// -----------------------------------------------
// 5. ERROR HANDLERS
// Harus dipasang PALING TERAKHIR setelah semua route
// -----------------------------------------------
app.use(notFound);    // Tangani 404
app.use(errorHandler); // Tangani semua error lainnya

module.exports = app;
