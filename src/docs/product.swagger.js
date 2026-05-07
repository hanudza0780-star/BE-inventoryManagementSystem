// ============================================
// docs/product.swagger.js
// Dokumentasi OpenAPI untuk endpoint Products
// ============================================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Ambil semua produk
 *     description: |
 *       Mengembalikan daftar produk dengan fitur **search**, **filter kategori**,
 *       dan **pagination**.
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: Elektronik
 *         description: Filter berdasarkan nama kategori
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
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
 *                   example: Data produk berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *             example:
 *               success: true
 *               message: Data produk berhasil diambil
 *               data:
 *                 - id: 1
 *                   name: Laptop ASUS VivoBook 14
 *                   sku: LAP-ASUS-001
 *                   category_id: 1
 *                   category: Elektronik
 *                   category_name: Elektronik
 *                   description: Laptop ringan, RAM 8GB, SSD 512GB
 *                   price: 7500000
 *                   stock: 15
 *                   unit: unit
 *                   is_active: 1
 *                   created_at: "2026-01-15T08:00:00.000Z"
 *                   updated_at: "2026-01-15T08:00:00.000Z"
 *                 - id: 2
 *                   name: Mouse Wireless Logitech M185
 *                   sku: MOU-LOG-001
 *                   category_id: 1
 *                   category: Elektronik
 *                   category_name: Elektronik
 *                   description: Mouse wireless dengan receiver USB nano
 *                   price: 185000
 *                   stock: 50
 *                   unit: unit
 *                   is_active: 1
 *                   created_at: "2026-01-15T08:00:00.000Z"
 *                   updated_at: "2026-01-15T08:00:00.000Z"
 *               meta:
 *                 total: 8
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 *   post:
 *     summary: Buat produk baru
 *     description: |
 *       Membuat produk baru di inventaris.
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *           examples:
 *             elektronik:
 *               summary: Produk elektronik
 *               value:
 *                 name: Laptop ASUS VivoBook 14
 *                 sku: LAP-ASUS-001
 *                 category_id: 1
 *                 category: Elektronik
 *                 description: Laptop ringan untuk kerja, RAM 8GB, SSD 512GB
 *                 price: 7500000
 *                 stock: 15
 *                 unit: unit
 *                 is_active: true
 *             atk:
 *               summary: Produk ATK
 *               value:
 *                 name: Kertas HVS A4 80gsm
 *                 sku: KER-HVS-001
 *                 category_id: 2
 *                 category: ATK
 *                 description: Kertas HVS A4, 80 gram, 500 lembar/rim
 *                 price: 55000
 *                 stock: 200
 *                 unit: rim
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
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
 *                   example: Produk berhasil dibuat
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: SKU sudah digunakan produk lain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "SKU 'LAP-ASUS-001' sudah digunakan produk lain"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Ambil detail satu produk
 *     description: |
 *       Mengembalikan detail lengkap satu produk berdasarkan ID.
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Data produk ditemukan
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
 *                   example: Data produk ditemukan
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               success: true
 *               message: Data produk ditemukan
 *               data:
 *                 id: 1
 *                 name: Laptop ASUS VivoBook 14
 *                 sku: LAP-ASUS-001
 *                 category_id: 1
 *                 category: Elektronik
 *                 category_name: Elektronik
 *                 description: Laptop ringan, RAM 8GB, SSD 512GB
 *                 price: 7500000
 *                 stock: 15
 *                 unit: unit
 *                 is_active: 1
 *                 created_at: "2026-01-15T08:00:00.000Z"
 *                 updated_at: "2026-01-15T08:00:00.000Z"
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
 *     summary: Update produk
 *     description: |
 *       Memperbarui seluruh data produk berdasarkan ID.
 *       Semua field wajib dikirim (full update).
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *           example:
 *             name: Laptop ASUS VivoBook 14 (Updated)
 *             sku: LAP-ASUS-001
 *             category_id: 1
 *             category: Elektronik
 *             description: Laptop ringan, RAM 16GB, SSD 512GB
 *             price: 8500000
 *             stock: 12
 *             unit: unit
 *             is_active: true
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
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
 *                   example: Produk berhasil diupdate
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: SKU sudah digunakan produk lain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "SKU 'LAP-ASUS-001' sudah digunakan produk lain"
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 *   delete:
 *     summary: Hapus produk
 *     description: |
 *       Menghapus produk secara permanen berdasarkan ID.
 *       Semua riwayat transaksi stok produk ini juga akan terhapus (CASCADE).
 *
 *       **Role yang diizinkan:** admin saja
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
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
 *                   example: "Produk 'Laptop ASUS VivoBook 14' berhasil dihapus"
 *                 data:
 *                   nullable: true
 *                   example: null
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

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Update stok produk langsung
 *     description: |
 *       Mengubah stok produk secara langsung dengan nilai delta (selisih).
 *       - Nilai **positif** → menambah stok
 *       - Nilai **negatif** → mengurangi stok
 *
 *       > ⚠️ Endpoint ini tidak mencatat riwayat transaksi.
 *       > Untuk pencatatan riwayat, gunakan `POST /api/stocks/in` atau `POST /api/stocks/out`.
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Delta stok. Positif = tambah, negatif = kurangi
 *                 example: 10
 *           examples:
 *             tambah:
 *               summary: Tambah stok 10
 *               value:
 *                 quantity: 10
 *             kurangi:
 *               summary: Kurangi stok 5
 *               value:
 *                 quantity: -5
 *     responses:
 *       200:
 *         description: Stok berhasil diupdate
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
 *                   example: Stok berhasil diupdate
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Stok tidak mencukupi untuk dikurangi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Stok tidak mencukupi. Stok saat ini: 3"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

module.exports = {};
