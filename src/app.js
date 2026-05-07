// ============================================
// app.js
// Konfigurasi utama Express application.
//
// URUTAN MIDDLEWARE (PENTING!):
// 1. Helmet       — security headers
// 2. Morgan       — request logging
// 3. CORS         — cross-origin
// 4. Rate Limiter — global API limit
// 5. Body Parser  — parse JSON body
// 6. Static Files — serve uploaded images
// 7. Swagger UI   — API documentation
// 8. Routes       — logika aplikasi
// 9. Error Handler — tangani semua error
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const swaggerSpec = require('./docs/swagger');

const app = express();

// -----------------------------------------------
// 1. HELMET — Security Headers
// Menambahkan berbagai HTTP header keamanan secara otomatis:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY (mencegah clickjacking)
// - X-XSS-Protection
// - Strict-Transport-Security (HSTS)
// - Content-Security-Policy
// -----------------------------------------------
app.use(
  helmet({
    // Nonaktifkan CSP untuk Swagger UI agar bisa load assets-nya
    contentSecurityPolicy: false,
    // Izinkan gambar dari domain yang sama
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// -----------------------------------------------
// 2. MORGAN — HTTP Request Logger
// -----------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// -----------------------------------------------
// 3. CORS — Cross-Origin Resource Sharing
// -----------------------------------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// -----------------------------------------------
// 4. RATE LIMITER — Global API Limit
// Maks 100 request per menit per IP untuk semua /api
// Endpoint login punya limiter sendiri yang lebih ketat
// -----------------------------------------------
app.use('/api', apiLimiter);

// -----------------------------------------------
// 5. BODY PARSER
// -----------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -----------------------------------------------
// 6. STATIC FILES — Serve uploaded images
// Gambar yang diupload bisa diakses via:
// GET http://localhost:3000/uploads/products/filename.jpg
//
// express.static memetakan URL /uploads ke folder public/uploads
// -----------------------------------------------
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// -----------------------------------------------
// 7. SWAGGER UI — Dokumentasi API Interaktif
// Tersedia di: GET /api-docs
// -----------------------------------------------
const swaggerUiOptions = {
  customSiteTitle: 'Inventory API Docs',
  customCss: `
    .swagger-ui .topbar { background-color: #1a1a2e; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
  `,
  swaggerOptions: {
    docExpansion: 'none',
    tryItOutEnabled: true,
    operationsSorter: 'method',
    displayRequestDuration: true,
    persistAuthorization: true,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Raw OpenAPI spec (untuk Postman import, dll)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// -----------------------------------------------
// 8. ROUTES
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
// 9. ERROR HANDLERS — PALING TERAKHIR
// -----------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
