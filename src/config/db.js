// ============================================
// config/db.js
// Konfigurasi dan koneksi ke database MySQL
// Menggunakan mysql2 dengan Promise (async/await)
// ============================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Buat connection pool (lebih efisien dari single connection)
// Pool otomatis mengelola banyak koneksi secara bersamaan
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  // Tunggu jika semua koneksi sedang dipakai
  connectionLimit: 10,        // Maksimal 10 koneksi bersamaan
  queueLimit: 0,              // 0 = antrian tidak terbatas
  timezone: '+07:00',         // Sesuaikan timezone (WIB)
});

// Fungsi untuk test koneksi saat server pertama kali start
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database MySQL terhubung!');
    connection.release(); // Kembalikan koneksi ke pool setelah selesai
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:', error.message);
    process.exit(1); // Hentikan server jika database tidak bisa konek
  }
};

module.exports = { pool, testConnection };
