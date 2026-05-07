// ============================================
// docs/stock.swagger.js
// Dokumentasi OpenAPI untuk endpoint Stock Management
// ============================================

/**
 * @swagger
 * /api/stocks/in:
 *   post:
 *     summary: Catat stok masuk
 *     description: |
 *       Mencatat transaksi **stok masuk** (barang diterima/dibeli).
 *
 *       Proses yang terjadi:
 *       1. Validasi produk ada
 *       2. Catat transaksi di tabel `stock_transactions` (type: IN)
 *       3. Tambah stok di tabel `products`
 *
 *       Semua operasi menggunakan **MySQL Transaction** untuk menjamin konsistensi data.
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Stocks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockInRequest'
 *           examples:
 *             pembelian:
 *               summary: Stok masuk dari pembelian
 *               value:
 *                 product_id: 1
 *                 quantity: 50
 *                 note: Pembelian dari supplier ABC - Invoice INV-2026-001
 *             retur:
 *               summary: Stok masuk dari retur
 *               value:
 *                 product_id: 2
 *                 quantity: 3
 *                 note: Retur dari pelanggan - kondisi baik
 *     responses:
 *       201:
 *         description: Stok masuk berhasil dicatat
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
 *                   example: Stok masuk berhasil dicatat
 *                 data:
 *                   $ref: '#/components/schemas/StockTransaction'
 *             example:
 *               success: true
 *               message: Stok masuk berhasil dicatat
 *               data:
 *                 id: 15
 *                 type: IN
 *                 quantity: 50
 *                 note: Pembelian dari supplier ABC - Invoice INV-2026-001
 *                 created_at: "2026-05-07T10:30:00.000Z"
 *                 product_id: 1
 *                 product_name: Laptop ASUS VivoBook 14
 *                 product_sku: LAP-ASUS-001
 *                 stock_after: 65
 *                 created_by_name: Manager Gudang
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Produk tidak ditemukan
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/stocks/out:
 *   post:
 *     summary: Catat stok keluar
 *     description: |
 *       Mencatat transaksi **stok keluar** (barang dikeluarkan/dijual/dikirim).
 *
 *       Proses yang terjadi:
 *       1. Validasi produk ada
 *       2. **Validasi stok mencukupi** — jika stok kurang, request ditolak
 *       3. Catat transaksi di tabel `stock_transactions` (type: OUT)
 *       4. Kurangi stok di tabel `products`
 *
 *       Semua operasi menggunakan **MySQL Transaction** untuk menjamin konsistensi data.
 *
 *       **Role yang diizinkan:** admin, manager
 *     tags:
 *       - Stocks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockOutRequest'
 *           examples:
 *             pengiriman:
 *               summary: Stok keluar untuk pengiriman
 *               value:
 *                 product_id: 1
 *                 quantity: 5
 *                 note: Pengiriman ke cabang Surabaya - DO-2026-045
 *             penjualan:
 *               summary: Stok keluar untuk penjualan
 *               value:
 *                 product_id: 3
 *                 quantity: 2
 *                 note: Penjualan ke PT. Maju Jaya
 *     responses:
 *       201:
 *         description: Stok keluar berhasil dicatat
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
 *                   example: Stok keluar berhasil dicatat
 *                 data:
 *                   $ref: '#/components/schemas/StockTransaction'
 *             example:
 *               success: true
 *               message: Stok keluar berhasil dicatat
 *               data:
 *                 id: 16
 *                 type: OUT
 *                 quantity: 5
 *                 note: Pengiriman ke cabang Surabaya - DO-2026-045
 *                 created_at: "2026-05-07T11:00:00.000Z"
 *                 product_id: 1
 *                 product_name: Laptop ASUS VivoBook 14
 *                 product_sku: LAP-ASUS-001
 *                 stock_after: 10
 *                 created_by_name: Manager Gudang
 *       400:
 *         description: Stok tidak mencukupi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Stok tidak mencukupi. Stok tersedia: 3, diminta: 5"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Produk tidak ditemukan
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/stocks/history:
 *   get:
 *     summary: Ambil riwayat transaksi stok
 *     description: |
 *       Mengembalikan riwayat semua transaksi pergerakan stok dengan filter dan pagination.
 *
 *       Bisa difilter berdasarkan:
 *       - **product_id** — riwayat stok produk tertentu
 *       - **type** — hanya tampilkan IN atau OUT
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Stocks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Filter berdasarkan ID produk
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [IN, OUT]
 *           example: IN
 *         description: Filter berdasarkan tipe transaksi
 *     responses:
 *       200:
 *         description: Riwayat transaksi stok
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
 *                   example: Riwayat transaksi stok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockTransaction'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *             example:
 *               success: true
 *               message: Riwayat transaksi stok
 *               data:
 *                 - id: 16
 *                   type: OUT
 *                   quantity: 5
 *                   note: Pengiriman ke cabang Surabaya
 *                   created_at: "2026-05-07T11:00:00.000Z"
 *                   product_id: 1
 *                   product_name: Laptop ASUS VivoBook 14
 *                   product_sku: LAP-ASUS-001
 *                   stock_after: 10
 *                   created_by_name: Manager Gudang
 *                 - id: 15
 *                   type: IN
 *                   quantity: 50
 *                   note: Pembelian dari supplier ABC
 *                   created_at: "2026-05-07T10:30:00.000Z"
 *                   product_id: 1
 *                   product_name: Laptop ASUS VivoBook 14
 *                   product_sku: LAP-ASUS-001
 *                   stock_after: 65
 *                   created_by_name: Manager Gudang
 *               meta:
 *                 total: 16
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 2
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /api/stocks/summary/{productId}:
 *   get:
 *     summary: Ringkasan stok produk
 *     description: |
 *       Mengembalikan ringkasan pergerakan stok untuk satu produk:
 *       - Stok saat ini
 *       - Total stok masuk (semua waktu)
 *       - Total stok keluar (semua waktu)
 *       - Total jumlah transaksi
 *
 *       **Semua role** dapat mengakses endpoint ini.
 *     tags:
 *       - Stocks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Ringkasan stok produk
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
 *                   example: Ringkasan stok produk
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Laptop ASUS VivoBook 14
 *                         sku:
 *                           type: string
 *                           example: LAP-ASUS-001
 *                         current_stock:
 *                           type: integer
 *                           example: 10
 *                         unit:
 *                           type: string
 *                           example: unit
 *                     transactions:
 *                       type: object
 *                       properties:
 *                         total_in:
 *                           type: integer
 *                           example: 65
 *                           description: Total stok masuk sepanjang waktu
 *                         total_out:
 *                           type: integer
 *                           example: 55
 *                           description: Total stok keluar sepanjang waktu
 *                         total_transactions:
 *                           type: integer
 *                           example: 16
 *                           description: Total jumlah transaksi
 *             example:
 *               success: true
 *               message: Ringkasan stok produk
 *               data:
 *                 product:
 *                   id: 1
 *                   name: Laptop ASUS VivoBook 14
 *                   sku: LAP-ASUS-001
 *                   current_stock: 10
 *                   unit: unit
 *                 transactions:
 *                   total_in: 65
 *                   total_out: 55
 *                   total_transactions: 16
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

module.exports = {};
