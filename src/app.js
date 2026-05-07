// ============================================
// app.js
// Konfigurasi utama Express application.
// File ini TIDAK menjalankan server (itu tugas server.js).
//
// URUTAN MIDDLEWARE SANGAT PENTING:
// 1. Morgan (logging) - harus paling awal agar semua request ter-log
// 2. CORS - sebelum route agar preflight request bisa dihandle
// 3. Body parser - sebelum route agar req.body tersedia
// 4. Swagger UI - dokumentasi API interaktif
// 5. Routes - logika utama aplikasi
// 6. Error handlers - PALING TERAKHIR
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./docs/swagger');

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
// 4. SWAGGER UI — Dokumentasi API Interaktif
// Tersedia di: GET /api-docs
// Hanya aktif di development (opsional, bisa dibuka di production juga)
//
// swaggerUi.serve  → menyajikan file statis Swagger UI (CSS, JS)
// swaggerUi.setup  → mengkonfigurasi Swagger UI dengan spec kita
// -----------------------------------------------
const swaggerUiOptions = {
  // Kustomisasi tampilan Swagger UI
  customSiteTitle: 'Inventory API Docs',
  customCss: `
    .swagger-ui .topbar { background-color: #1a1a2e; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info .title { color: #1a1a2e; }
  `,
  swaggerOptions: {
    // Collapse semua section secara default
    docExpansion: 'none',
    // Tampilkan tombol "Try it out" secara default
    tryItOutEnabled: true,
    // Urutkan endpoint berdasarkan method HTTP
    operationsSorter: 'method',
    // Tampilkan request duration
    displayRequestDuration: true,
    // Persist authorization (token tidak hilang saat refresh)
    persistAuthorization: true,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Endpoint untuk mengambil raw OpenAPI spec dalam format JSON
// Berguna untuk tools lain (Postman import, code generator, dll)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// -----------------------------------------------
// 5. ROUTES
// Semua endpoint API dimulai dengan /api
// -----------------------------------------------
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management System API v2.0',
    docs: '/api-docs',
    spec: '/api-docs.json',
    health: '/api/health',
  });
});

// -----------------------------------------------
// 6. ERROR HANDLERS
// Harus dipasang PALING TERAKHIR setelah semua route
// -----------------------------------------------
app.use(notFound);    // Tangani 404
app.use(errorHandler); // Tangani semua error lainnya

module.exports = app;
