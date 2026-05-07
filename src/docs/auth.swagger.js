// ============================================
// docs/auth.swagger.js
// Dokumentasi OpenAPI untuk endpoint Auth
//
// File ini berisi JSDoc comments dengan tag @swagger
// yang akan dibaca oleh swagger-jsdoc dan dikonversi
// menjadi bagian dari OpenAPI specification.
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Daftarkan user baru
 *     description: |
 *       Membuat akun pengguna baru. Password akan di-hash menggunakan bcrypt
 *       sebelum disimpan ke database.
 *
 *       **Role yang tersedia:** admin, manager, staff (default: staff)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             staff:
 *               summary: Daftar sebagai staff
 *               value:
 *                 name: Budi Santoso
 *                 email: budi@example.com
 *                 password: rahasia123
 *                 role: staff
 *             admin:
 *               summary: Daftar sebagai admin
 *               value:
 *                 name: Administrator
 *                 email: admin@example.com
 *                 password: admin123
 *                 role: admin
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Registrasi berhasil
 *               data:
 *                 id: 4
 *                 name: Budi Santoso
 *                 email: budi@example.com
 *                 role: staff
 *                 created_at: "2026-05-07T10:00:00.000Z"
 *       409:
 *         description: Email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email sudah terdaftar
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dan dapatkan JWT token
 *     description: |
 *       Autentikasi pengguna dengan email dan password.
 *       Mengembalikan JWT Bearer token yang digunakan untuk mengakses
 *       endpoint yang membutuhkan autentikasi.
 *
 *       **Akun default untuk testing:**
 *       | Email | Password | Role |
 *       |-------|----------|------|
 *       | admin@inventory.com | admin123 | admin |
 *       | manager@inventory.com | admin123 | manager |
 *       | staff@inventory.com | admin123 | staff |
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin:
 *               summary: Login sebagai admin
 *               value:
 *                 email: admin@inventory.com
 *                 password: admin123
 *             manager:
 *               summary: Login sebagai manager
 *               value:
 *                 email: manager@inventory.com
 *                 password: admin123
 *             staff:
 *               summary: Login sebagai staff
 *               value:
 *                 email: staff@inventory.com
 *                 password: admin123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT Bearer token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     token_type:
 *                       type: string
 *                       example: Bearer
 *                     expires_in:
 *                       type: string
 *                       example: 7d
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Login berhasil
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBpbnZlbnRvcnkuY29tIiwicm9sZSI6ImFkbWluIn0.abc123
 *                 token_type: Bearer
 *                 expires_in: 7d
 *                 user:
 *                   id: 1
 *                   name: Administrator
 *                   email: admin@inventory.com
 *                   role: admin
 *                   created_at: "2026-01-01T00:00:00.000Z"
 *       401:
 *         description: Email atau password salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email atau password salah
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Ambil profil user yang sedang login
 *     description: |
 *       Mengembalikan data profil pengguna berdasarkan JWT token yang dikirim.
 *       Token diambil dari header `Authorization: Bearer <token>`.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Data user
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Data user
 *               data:
 *                 id: 1
 *                 name: Administrator
 *                 email: admin@inventory.com
 *                 role: admin
 *                 created_at: "2026-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

// File ini hanya berisi JSDoc comments untuk swagger-jsdoc
// Tidak ada kode JavaScript yang dieksekusi
module.exports = {};
