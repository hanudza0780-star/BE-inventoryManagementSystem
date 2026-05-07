// ============================================
// docs/swagger.js
// Konfigurasi utama Swagger / OpenAPI 3.0
//
// File ini bertugas:
// 1. Mendefinisikan info API (judul, versi, deskripsi)
// 2. Mendaftarkan server (localhost dev, production)
// 3. Mendefinisikan security scheme (JWT Bearer)
// 4. Mendaftarkan semua reusable components/schemas
// 5. Mengumpulkan semua file docs (paths) menjadi satu
//
// swagger-jsdoc akan membaca konfigurasi ini + file
// yang didaftarkan di 'apis', lalu menghasilkan
// objek OpenAPI spec yang siap dipakai swagger-ui-express
// ============================================

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// -----------------------------------------------
// Definisi OpenAPI Specification
// -----------------------------------------------
const swaggerDefinition = {
  openapi: '3.0.0',

  // ---- Info API ----
  info: {
    title: 'Inventory Management System API',
    version: '2.0.0',
    description: `
## Inventory Management System — REST API Documentation

Backend API untuk sistem manajemen inventaris yang dibangun dengan **Node.js**, **Express.js**, dan **MySQL**.

### Fitur Utama
- 🔐 **JWT Authentication** — Register, login, dan proteksi endpoint
- 👥 **Role-based Access Control** — Admin, Manager, Staff
- 📦 **Products CRUD** — Kelola data produk dengan search & pagination
- 🗂️ **Categories** — Manajemen kategori produk
- 📊 **Stock Management** — Catat stok masuk/keluar dengan riwayat lengkap

### Cara Menggunakan Autentikasi
1. Login via \`POST /api/auth/login\`
2. Salin nilai \`token\` dari response
3. Klik tombol **Authorize** di atas
4. Masukkan: \`Bearer <token_anda>\`
5. Semua endpoint yang membutuhkan auth akan otomatis menggunakan token tersebut

### Role & Hak Akses
| Role | Hak Akses |
|------|-----------|
| **admin** | Akses penuh ke semua endpoint |
| **manager** | Baca semua data, buat/edit produk & stok |
| **staff** | Hanya baca data |
    `,
    contact: {
      name: 'Inventory System Support',
      email: 'support@inventory.com',
    },
    license: {
      name: 'ISC',
    },
  },

  // ---- Server ----
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development Server',
    },
    {
      url: 'https://api.inventory.com',
      description: 'Production Server',
    },
  ],

  // ---- Tags (Grouping Endpoint) ----
  tags: [
    {
      name: 'Auth',
      description: 'Autentikasi pengguna — register, login, dan profil',
    },
    {
      name: 'Products',
      description: 'Manajemen produk inventaris — CRUD dan update stok',
    },
    {
      name: 'Categories',
      description: 'Manajemen kategori produk',
    },
    {
      name: 'Stocks',
      description: 'Manajemen pergerakan stok — masuk, keluar, dan riwayat',
    },
  ],

  // ---- Components (Reusable Schemas & Security) ----
  components: {
    // ---- Security Schemes ----
    securitySchemes: {
      // JWT Bearer Authentication
      // Cara pakai: Authorization: Bearer <token>
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan JWT token. Contoh: **Bearer eyJhbGci...**',
      },
    },

    // ---- Reusable Schemas ----
    schemas: {

      // ==========================================
      // RESPONSE SCHEMAS
      // ==========================================

      /**
       * Format response sukses standar
       */
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operasi berhasil',
          },
          data: {
            description: 'Data hasil operasi (bisa object, array, atau null)',
          },
        },
      },

      /**
       * Format response error standar
       */
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Pesan error',
          },
        },
      },

      /**
       * Format response error validasi (422)
       */
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Validasi gagal. Periksa kembali data yang dikirim.',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email',
                },
                message: {
                  type: 'string',
                  example: 'Format email tidak valid',
                },
              },
            },
          },
        },
      },

      /**
       * Metadata pagination untuk response list
       */
      PaginationMeta: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: 'Total seluruh data',
            example: 100,
          },
          page: {
            type: 'integer',
            description: 'Halaman saat ini',
            example: 1,
          },
          limit: {
            type: 'integer',
            description: 'Jumlah data per halaman',
            example: 10,
          },
          totalPages: {
            type: 'integer',
            description: 'Total halaman',
            example: 10,
          },
        },
      },

      // ==========================================
      // ENTITY SCHEMAS
      // ==========================================

      /**
       * Schema User
       */
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Budi Santoso',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'budi@example.com',
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'staff'],
            example: 'staff',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-15T08:00:00.000Z',
          },
        },
      },

      /**
       * Schema Category
       */
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Elektronik',
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'Perangkat elektronik dan aksesoris',
          },
          is_active: {
            type: 'integer',
            enum: [0, 1],
            example: 1,
            description: '1 = aktif, 0 = nonaktif',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-15T08:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-15T08:00:00.000Z',
          },
        },
      },

      /**
       * Schema Product
       */
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Laptop ASUS VivoBook 14',
          },
          sku: {
            type: 'string',
            example: 'LAP-ASUS-001',
            description: 'Stock Keeping Unit — kode unik produk',
          },
          category_id: {
            type: 'integer',
            nullable: true,
            example: 1,
          },
          category: {
            type: 'string',
            example: 'Elektronik',
          },
          category_name: {
            type: 'string',
            nullable: true,
            example: 'Elektronik',
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'Laptop ringan untuk kerja, RAM 8GB, SSD 512GB',
          },
          price: {
            type: 'number',
            format: 'float',
            example: 7500000,
          },
          stock: {
            type: 'integer',
            example: 15,
          },
          unit: {
            type: 'string',
            example: 'unit',
            description: 'Satuan produk: pcs, unit, kg, liter, rim, botol, dll',
          },
          is_active: {
            type: 'integer',
            enum: [0, 1],
            example: 1,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-15T08:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-15T08:00:00.000Z',
          },
        },
      },

      /**
       * Schema StockTransaction
       */
      StockTransaction: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          type: {
            type: 'string',
            enum: ['IN', 'OUT'],
            example: 'IN',
            description: 'IN = stok masuk, OUT = stok keluar',
          },
          quantity: {
            type: 'integer',
            example: 50,
          },
          note: {
            type: 'string',
            nullable: true,
            example: 'Pembelian dari supplier ABC',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-15T08:00:00.000Z',
          },
          product_id: {
            type: 'integer',
            example: 1,
          },
          product_name: {
            type: 'string',
            example: 'Laptop ASUS VivoBook 14',
          },
          product_sku: {
            type: 'string',
            example: 'LAP-ASUS-001',
          },
          stock_after: {
            type: 'integer',
            example: 65,
            description: 'Jumlah stok setelah transaksi',
          },
          created_by_name: {
            type: 'string',
            example: 'Manager Gudang',
          },
        },
      },

      // ==========================================
      // REQUEST BODY SCHEMAS
      // ==========================================

      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'Budi Santoso',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'budi@example.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'rahasia123',
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'staff'],
            default: 'staff',
            example: 'staff',
          },
        },
      },

      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@inventory.com',
          },
          password: {
            type: 'string',
            example: 'admin123',
          },
        },
      },

      ProductRequest: {
        type: 'object',
        required: ['name', 'sku', 'category', 'price', 'stock'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 200,
            example: 'Laptop ASUS VivoBook 14',
          },
          sku: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            pattern: '^[A-Za-z0-9\\-_]+$',
            example: 'LAP-ASUS-001',
          },
          category_id: {
            type: 'integer',
            nullable: true,
            example: 1,
          },
          category: {
            type: 'string',
            maxLength: 100,
            example: 'Elektronik',
          },
          description: {
            type: 'string',
            nullable: true,
            maxLength: 1000,
            example: 'Laptop ringan untuk kerja, RAM 8GB, SSD 512GB',
          },
          price: {
            type: 'number',
            minimum: 0,
            example: 7500000,
          },
          stock: {
            type: 'integer',
            minimum: 0,
            example: 15,
          },
          unit: {
            type: 'string',
            maxLength: 50,
            default: 'pcs',
            example: 'unit',
          },
          is_active: {
            type: 'boolean',
            default: true,
            example: true,
          },
        },
      },

      CategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'Elektronik',
          },
          description: {
            type: 'string',
            nullable: true,
            maxLength: 500,
            example: 'Perangkat elektronik dan aksesoris',
          },
          is_active: {
            type: 'boolean',
            default: true,
            example: true,
          },
        },
      },

      StockInRequest: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            example: 50,
            description: 'Jumlah stok yang masuk (minimal 1)',
          },
          note: {
            type: 'string',
            nullable: true,
            maxLength: 500,
            example: 'Pembelian dari supplier ABC',
          },
        },
      },

      StockOutRequest: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            example: 5,
            description: 'Jumlah stok yang keluar (minimal 1, tidak boleh melebihi stok tersedia)',
          },
          note: {
            type: 'string',
            nullable: true,
            maxLength: 500,
            example: 'Pengiriman ke cabang Surabaya',
          },
        },
      },
    },

    // ---- Reusable Parameters ----
    parameters: {
      PageParam: {
        in: 'query',
        name: 'page',
        schema: { type: 'integer', minimum: 1, default: 1 },
        description: 'Nomor halaman',
      },
      LimitParam: {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        description: 'Jumlah data per halaman (maks 100)',
      },
      SearchParam: {
        in: 'query',
        name: 'search',
        schema: { type: 'string', maxLength: 100 },
        description: 'Kata kunci pencarian',
      },
      IdParam: {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer', minimum: 1 },
        description: 'ID data',
      },
    },

    // ---- Reusable Responses ----
    responses: {
      Unauthorized: {
        description: '**401** — Token tidak ada atau tidak valid',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              message: 'Akses ditolak. Token tidak ditemukan.',
            },
          },
        },
      },
      Forbidden: {
        description: '**403** — Token valid tapi role tidak memiliki izin',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              message: 'Akses ditolak. Anda tidak memiliki izin.',
            },
          },
        },
      },
      NotFound: {
        description: '**404** — Data tidak ditemukan',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              message: 'Data tidak ditemukan',
            },
          },
        },
      },
      ValidationError: {
        description: '**422** — Validasi input gagal',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      InternalError: {
        description: '**500** — Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
            },
          },
        },
      },
    },
  },
};

// -----------------------------------------------
// Opsi swagger-jsdoc
// 'apis' mendaftarkan file yang berisi JSDoc comments
// swagger-jsdoc akan scan file-file ini untuk @swagger
// -----------------------------------------------
const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, './auth.swagger.js'),
    path.join(__dirname, './product.swagger.js'),
    path.join(__dirname, './category.swagger.js'),
    path.join(__dirname, './stock.swagger.js'),
  ],
};

// Generate OpenAPI spec dari definisi + JSDoc comments
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
