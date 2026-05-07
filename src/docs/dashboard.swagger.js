// ============================================
// docs/dashboard.swagger.js
// Dokumentasi OpenAPI untuk endpoint Dashboard & Health Check
// ============================================

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Ambil statistik dashboard
 *     description: |
 *       Mengembalikan ringkasan statistik sistem inventaris:
 *       - Total produk, kategori, user
 *       - Transaksi stok bulan ini
 *       - Daftar produk stok rendah
 *       - 5 transaksi terbaru
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik dashboard berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Statistik dashboard berhasil diambil
 *               data:
 *                 products:
 *                   total: 8
 *                   active: 8
 *                   out_of_stock: 0
 *                   total_stock_value: 849
 *                 categories:
 *                   total: 4
 *                 stocks:
 *                   total_in_this_month: 200
 *                   total_out_this_month: 50
 *                   total_transactions_this_month: 12
 *                 users:
 *                   total: 3
 *                 low_stock_products:
 *                   - id: 3
 *                     name: Keyboard Mechanical Rexus
 *                     sku: KEY-REX-001
 *                     stock: 3
 *                     minimum_stock: 10
 *                     unit: unit
 *                     category: Elektronik
 *                 recent_transactions:
 *                   - id: 5
 *                     type: OUT
 *                     quantity: 2
 *                     created_at: "2026-05-07T10:00:00.000Z"
 *                     product_name: Laptop ASUS VivoBook 14
 *                     product_sku: LAP-ASUS-001
 *                     created_by: Manager Gudang
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /api/dashboard/stock-chart:
 *   get:
 *     summary: Data grafik stok bulanan
 *     description: |
 *       Data stok masuk dan keluar per bulan untuk 12 bulan terakhir.
 *       Cocok untuk ditampilkan sebagai grafik line/bar chart.
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data grafik stok bulanan
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Data grafik stok bulanan
 *               data:
 *                 - month: "2026-01"
 *                   stock_in: 150
 *                   stock_out: 80
 *                 - month: "2026-02"
 *                   stock_in: 200
 *                   stock_out: 120
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /api/dashboard/top-products:
 *   get:
 *     summary: Top 5 produk berdasarkan transaksi
 *     description: |
 *       Mengembalikan 5 produk dengan jumlah transaksi stok terbanyak.
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top produk berdasarkan transaksi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Top produk berdasarkan transaksi
 *               data:
 *                 - id: 1
 *                   name: Laptop ASUS VivoBook 14
 *                   sku: LAP-ASUS-001
 *                   stock: 15
 *                   transaction_count: 25
 *                   total_out: 85
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check server
 *     description: |
 *       Mengecek status server dan koneksi database.
 *       Tidak membutuhkan autentikasi.
 *
 *       Berguna untuk monitoring dan load balancer health check.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server berjalan normal
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               status: ok
 *               message: Server berjalan dengan baik
 *               data:
 *                 api: ok
 *                 database: connected
 *                 db_latency_ms: 3
 *                 uptime_seconds: 3600
 *                 environment: development
 *                 timestamp: "2026-05-07T10:00:00.000Z"
 *                 version: "2.0.0"
 *       503:
 *         description: Database tidak terhubung
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               status: degraded
 *               message: Database tidak terhubung
 *               data:
 *                 api: ok
 *                 database: disconnected
 *                 db_latency_ms: null
 *                 uptime_seconds: 120
 *                 environment: production
 *                 timestamp: "2026-05-07T10:00:00.000Z"
 *                 version: "2.0.0"
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Ambil activity logs
 *     description: |
 *       Mengembalikan riwayat semua aktivitas pengguna di sistem.
 *       Bisa difilter berdasarkan user, action, dan module.
 *
 *       **Role yang diizinkan:** admin saja
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filter berdasarkan ID user
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [LOGIN, CREATE, UPDATE, DELETE, STOCK_IN, STOCK_OUT, UPLOAD_IMAGE]
 *           example: LOGIN
 *         description: Filter berdasarkan tipe aksi
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *           enum: [auth, products, categories, stocks]
 *           example: products
 *         description: Filter berdasarkan module
 *     responses:
 *       200:
 *         description: Data activity log berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Data activity log berhasil diambil
 *               data:
 *                 - id: 10
 *                   action: LOGIN
 *                   module: auth
 *                   description: Administrator (admin) berhasil login
 *                   ip_address: "127.0.0.1"
 *                   created_at: "2026-05-07T10:00:00.000Z"
 *                   user_id: 1
 *                   user_name: Administrator
 *                   user_role: admin
 *               meta:
 *                 total: 50
 *                 page: 1
 *                 limit: 20
 *                 totalPages: 3
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /api/logs/filters:
 *   get:
 *     summary: Ambil opsi filter log
 *     description: |
 *       Mengembalikan daftar action dan module unik yang tersedia
 *       untuk digunakan sebagai opsi filter dropdown.
 *
 *       **Role yang diizinkan:** admin saja
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filter options
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Filter options
 *               data:
 *                 actions: [CREATE, DELETE, LOGIN, STOCK_IN, STOCK_OUT, UPDATE, UPLOAD_IMAGE]
 *                 modules: [auth, categories, products, stocks]
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Ambil produk dengan stok rendah
 *     description: |
 *       Mengembalikan produk yang stoknya berada di bawah atau sama dengan
 *       nilai `minimum_stock` yang ditetapkan per produk.
 *
 *       Response juga menyertakan field `shortage` (selisih kekurangan stok).
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
 *         description: Filter berdasarkan kategori
 *     responses:
 *       200:
 *         description: Daftar produk dengan stok rendah
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Daftar produk dengan stok rendah
 *               data:
 *                 - id: 3
 *                   name: Keyboard Mechanical Rexus
 *                   sku: KEY-REX-001
 *                   category: Elektronik
 *                   stock: 3
 *                   minimum_stock: 10
 *                   unit: unit
 *                   image_url: null
 *                   shortage: 7
 *                 - id: 4
 *                   name: Kertas HVS A4 80gsm
 *                   sku: KER-HVS-001
 *                   category: ATK
 *                   stock: 4
 *                   minimum_stock: 20
 *                   unit: rim
 *                   image_url: null
 *                   shortage: 16
 *               meta:
 *                 total: 2
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /api/products/{id}/image:
 *   post:
 *     summary: Upload gambar produk
 *     description: |
 *       Upload atau ganti gambar produk.
 *
 *       **Format yang didukung:** JPG, PNG, WebP
 *       **Ukuran maksimal:** 2MB
 *
 *       Request harus menggunakan `multipart/form-data` dengan field `image`.
 *
 *       Jika produk sudah memiliki gambar, gambar lama akan **otomatis dihapus**
 *       dari server dan diganti dengan yang baru.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar (JPG, PNG, WebP, maks 2MB)
 *     responses:
 *       200:
 *         description: Gambar produk berhasil diupload
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Gambar produk berhasil diupload
 *               data:
 *                 id: 1
 *                 name: Laptop ASUS VivoBook 14
 *                 sku: LAP-ASUS-001
 *                 image_url: "http://localhost:3000/uploads/products/product-1715000000000-a3f2b1.jpg"
 *       400:
 *         description: File tidak valid (format salah atau terlalu besar)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Format file tidak didukung. Gunakan JPG, PNG, atau WebP
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         description: Terlalu banyak upload
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Terlalu banyak upload. Silakan coba lagi nanti.
 */

module.exports = {};
