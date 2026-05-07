// ============================================
// server.js
// Entry point aplikasi - file pertama yang dijalankan
// Tugasnya: koneksi database, lalu jalankan server HTTP
// ============================================

require('dotenv').config(); // Load .env PERTAMA sebelum apapun

const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Fungsi async untuk startup server secara berurutan
const startServer = async () => {
  try {
    // 1. Test koneksi database dulu
    await testConnection();

    // 2. Baru jalankan HTTP server
    app.listen(PORT, () => {
      console.log('========================================');
      console.log(`🚀 Server berjalan di port ${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error.message);
    process.exit(1);
  }
};

// Tangani error yang tidak tertangkap (safety net)
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️  Uncaught Exception:', error.message);
  process.exit(1);
});

// Jalankan server
startServer();
