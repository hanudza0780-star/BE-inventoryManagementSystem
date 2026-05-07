// ============================================
// constants/messages.js
// Pesan standar yang digunakan di seluruh aplikasi.
// Sentralisasi pesan agar mudah diubah dan konsisten.
// ============================================

const MESSAGES = {
  // Auth
  AUTH: {
    REGISTER_SUCCESS: 'Registrasi berhasil',
    LOGIN_SUCCESS: 'Login berhasil',
    LOGOUT_SUCCESS: 'Logout berhasil',
    INVALID_CREDENTIALS: 'Email atau password salah',
    EMAIL_TAKEN: 'Email sudah terdaftar',
    UNAUTHORIZED: 'Akses ditolak. Token tidak ditemukan.',
    TOKEN_EXPIRED: 'Token sudah kadaluarsa. Silakan login ulang.',
    TOKEN_INVALID: 'Token tidak valid.',
    FORBIDDEN: 'Akses ditolak. Anda tidak memiliki izin.',
  },

  // Products
  PRODUCT: {
    FETCH_ALL: 'Data produk berhasil diambil',
    FETCH_ONE: 'Data produk ditemukan',
    CREATED: 'Produk berhasil dibuat',
    UPDATED: 'Produk berhasil diupdate',
    DELETED: (name) => `Produk '${name}' berhasil dihapus`,
    NOT_FOUND: 'Produk tidak ditemukan',
    SKU_TAKEN: (sku) => `SKU '${sku}' sudah digunakan produk lain`,
    STOCK_UPDATED: 'Stok berhasil diupdate',
    STOCK_INSUFFICIENT: (available) => `Stok tidak mencukupi. Stok saat ini: ${available}`,
    IMAGE_UPLOADED: 'Gambar produk berhasil diupload',
    LOW_STOCK: 'Daftar produk dengan stok rendah',
  },

  // Categories
  CATEGORY: {
    FETCH_ALL: 'Data kategori berhasil diambil',
    FETCH_ACTIVE: 'Daftar kategori aktif',
    FETCH_ONE: 'Data kategori ditemukan',
    CREATED: 'Kategori berhasil dibuat',
    UPDATED: 'Kategori berhasil diupdate',
    DELETED: (name) => `Kategori '${name}' berhasil dihapus`,
    NOT_FOUND: 'Kategori tidak ditemukan',
    NAME_TAKEN: (name) => `Kategori '${name}' sudah ada`,
    HAS_PRODUCTS: (count) =>
      `Kategori tidak bisa dihapus karena masih digunakan oleh ${count} produk`,
  },

  // Stocks
  STOCK: {
    IN_SUCCESS: 'Stok masuk berhasil dicatat',
    OUT_SUCCESS: 'Stok keluar berhasil dicatat',
    HISTORY: 'Riwayat transaksi stok',
    SUMMARY: 'Ringkasan stok produk',
    INSUFFICIENT: (available, requested) =>
      `Stok tidak mencukupi. Stok tersedia: ${available}, diminta: ${requested}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: 'Statistik dashboard berhasil diambil',
  },

  // Logs
  LOG: {
    FETCH_ALL: 'Data activity log berhasil diambil',
  },

  // General
  GENERAL: {
    VALIDATION_FAILED: 'Validasi gagal. Periksa kembali data yang dikirim.',
    NOT_FOUND: 'Data tidak ditemukan',
    SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi.',
    RATE_LIMIT: 'Terlalu banyak request. Silakan coba lagi nanti.',
  },
};

module.exports = { MESSAGES };
