// ============================================
// middleware/upload.js
// Middleware Multer untuk upload gambar produk.
//
// FLOW UPLOAD:
// 1. Request masuk dengan multipart/form-data
// 2. Multer memvalidasi mime type (hanya gambar)
// 3. Multer memvalidasi ukuran file (maks 2MB)
// 4. File disimpan ke public/uploads/products/
// 5. Nama file di-generate unik (timestamp + random)
// 6. Path file tersedia di req.file
//
// CARA PAKAI DI ROUTE:
// router.post('/:id/image', authenticate, uploadProductImage, controller)
// ============================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

// -----------------------------------------------
// Pastikan folder upload ada
// -----------------------------------------------
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/products');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// -----------------------------------------------
// Konfigurasi penyimpanan file (diskStorage)
// Menentukan folder tujuan dan nama file
// -----------------------------------------------
const storage = multer.diskStorage({
  /**
   * Tentukan folder tujuan upload
   */
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  /**
   * Generate nama file yang unik
   * Format: product-{timestamp}-{random}.{ext}
   * Contoh: product-1715000000000-a3f2b1.jpg
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// -----------------------------------------------
// Filter file: hanya izinkan gambar
// -----------------------------------------------
const fileFilter = (req, file, cb) => {
  // Mime type yang diizinkan
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Terima file
  } else {
    // Tolak file dengan error
    cb(
      new AppError(
        'Format file tidak didukung. Gunakan: JPG, PNG, atau WebP',
        400
      ),
      false
    );
  }
};

// -----------------------------------------------
// Inisialisasi Multer dengan konfigurasi di atas
// -----------------------------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Maks 2MB (2 * 1024 * 1024 bytes)
  },
});

/**
 * Middleware untuk upload satu gambar produk
 * Field name di form-data harus 'image'
 */
const uploadProductImage = (req, res, next) => {
  // upload.single('image') = terima satu file dengan field name 'image'
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error dari Multer (ukuran file, dll)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('Ukuran file terlalu besar. Maksimal 2MB.', 400));
      }
      return next(new AppError(`Upload error: ${err.message}`, 400));
    }

    if (err) {
      // Error custom (dari fileFilter)
      return next(err);
    }

    // Upload berhasil, lanjut ke controller
    next();
  });
};

module.exports = { uploadProductImage };
