// ============================================
// utils/fileHelper.js
// Helper untuk operasi file (hapus gambar, dll).
// Digunakan saat update/delete produk yang punya gambar.
// ============================================

const fs = require('fs');
const path = require('path');

/**
 * Hapus file dari filesystem secara aman.
 * Tidak throw error jika file tidak ditemukan.
 *
 * @param {string} filePath - Path relatif dari root project
 *                            Contoh: 'public/uploads/products/image.jpg'
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  // Buat path absolut dari root project
  const absolutePath = path.join(process.cwd(), filePath);

  // Cek apakah file ada sebelum dihapus
  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
      console.log(`🗑️  File dihapus: ${filePath}`);
    } catch (error) {
      // Log error tapi jangan crash aplikasi
      console.error(`⚠️  Gagal hapus file ${filePath}:`, error.message);
    }
  }
};

/**
 * Ekstrak path relatif dari URL gambar produk
 * Contoh input:  'http://localhost:3000/uploads/products/image.jpg'
 * Contoh output: 'public/uploads/products/image.jpg'
 *
 * @param {string} imageUrl - URL gambar dari database
 * @returns {string|null}
 */
const extractFilePath = (imageUrl) => {
  if (!imageUrl) return null;

  // Ambil bagian path setelah domain
  // '/uploads/products/image.jpg' → 'public/uploads/products/image.jpg'
  const urlPath = imageUrl.replace(/^https?:\/\/[^/]+/, '');
  return `public${urlPath}`;
};

module.exports = { deleteFile, extractFilePath };
