// ============================================
// docs/category.swagger.js
// Dokumentasi OpenAPI untuk endpoint Categories
// ============================================

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Ambil semua kategori
 *     description: |
 *       Mengembalikan daftar kategori dengan fitur **search** dan **pagination**.
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
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
 *                   example: Data kategori berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *             example:
 *               success: true
 *               message: Data kategori berhasil diambil
 *               data:
 *                 - id: 1
 *                   name: ATK
 *                   description: Alat Tulis Kantor
 *                   is_active: 1
 *                   created_at: "2026-01-01T00:00:00.000Z"
 *                   updated_at: "2026-01-01T00:00:00.000Z"
 *                 - id: 2
 *                   name: Elektronik
 *                   description: Perangkat elektronik dan aksesoris
 *                   is_active: 1
 *                   created_at: "2026-01-01T00:00:00.000Z"
 *                   updated_at: "2026-01-01T00:00:00.000Z"
 *               meta:
 *                 total: 4
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 *   post:
 *     summary: Buat kategori baru
 *     description: |
 *       Membuat kategori produk baru.
 *       Nama kategori harus unik.
 *
 *       **Role yang diizinkan:** admin saja
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *           examples:
 *             elektronik:
 *               summary: Kategori Elektronik
 *               value:
 *                 name: Elektronik
 *                 description: Perangkat elektronik dan aksesoris
 *                 is_active: true
 *             atk:
 *               summary: Kategori ATK
 *               value:
 *                 name: ATK
 *                 description: Alat Tulis Kantor
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
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
 *                   example: Kategori berhasil dibuat
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *             example:
 *               success: true
 *               message: Kategori berhasil dibuat
 *               data:
 *                 id: 5
 *                 name: Elektronik
 *                 description: Perangkat elektronik dan aksesoris
 *                 is_active: 1
 *                 created_at: "2026-05-07T10:00:00.000Z"
 *                 updated_at: "2026-05-07T10:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Nama kategori sudah ada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Kategori 'Elektronik' sudah ada"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/categories/active:
 *   get:
 *     summary: Ambil semua kategori aktif
 *     description: |
 *       Mengembalikan daftar kategori yang aktif (`is_active = 1`) tanpa pagination.
 *       Cocok digunakan untuk mengisi **dropdown** di form produk.
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori aktif
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
 *                   example: Daftar kategori aktif
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: ATK
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: Alat Tulis Kantor
 *             example:
 *               success: true
 *               message: Daftar kategori aktif
 *               data:
 *                 - id: 1
 *                   name: ATK
 *                   description: Alat Tulis Kantor
 *                 - id: 2
 *                   name: Elektronik
 *                   description: Perangkat elektronik dan aksesoris
 *                 - id: 3
 *                   name: Furnitur
 *                   description: Perabot dan furnitur kantor
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Ambil detail satu kategori
 *     description: |
 *       Mengembalikan detail lengkap satu kategori berdasarkan ID.
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Data kategori ditemukan
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
 *                   example: Data kategori ditemukan
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *             example:
 *               success: true
 *               message: Data kategori ditemukan
 *               data:
 *                 id: 1
 *                 name: Elektronik
 *                 description: Perangkat elektronik dan aksesoris
 *                 is_active: 1
 *                 created_at: "2026-01-01T00:00:00.000Z"
 *                 updated_at: "2026-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 *   put:
 *     summary: Update kategori
 *     description: |
 *       Memperbarui data kategori berdasarkan ID.
 *
 *       **Role yang diizinkan:** admin saja
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *           example:
 *             name: Elektronik & Gadget
 *             description: Perangkat elektronik, gadget, dan aksesoris
 *             is_active: true
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
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
 *                   example: Kategori berhasil diupdate
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Nama kategori sudah digunakan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Kategori 'Elektronik' sudah ada"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 *   delete:
 *     summary: Hapus kategori
 *     description: |
 *       Menghapus kategori berdasarkan ID.
 *
 *       > ⚠️ **Tidak bisa dihapus** jika masih ada produk yang menggunakan kategori ini.
 *       > Pindahkan atau hapus produk terkait terlebih dahulu.
 *
 *       **Role yang diizinkan:** admin saja
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
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
 *                   example: "Kategori 'Elektronik' berhasil dihapus"
 *                 data:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Kategori masih digunakan oleh produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Kategori tidak bisa dihapus karena masih digunakan oleh 5 produk
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

module.exports = {};
