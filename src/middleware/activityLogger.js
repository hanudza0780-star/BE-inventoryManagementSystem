// ============================================
// middleware/activityLogger.js
// Middleware untuk otomatis mencatat activity log
// setiap kali ada operasi penting (login, CRUD, stok).
//
// CARA PAKAI DI ROUTE:
// router.post('/products', authenticate, logActivity('CREATE', 'products'), controller)
//
// ATAU di dalam service/controller setelah operasi berhasil:
// await createLog({ user_id, action, module, description, ip_address })
// ============================================

const { pool } = require('../config/db');

/**
 * Simpan activity log ke database
 * Fungsi ini dipanggil langsung dari service/controller
 *
 * @param {object} logData
 * @param {number|null} logData.user_id - ID user yang melakukan aksi
 * @param {string} logData.action - Aksi yang dilakukan (LOGIN, CREATE, UPDATE, DELETE, dll)
 * @param {string} logData.module - Module yang diakses (auth, products, categories, stocks)
 * @param {string} logData.description - Deskripsi detail aksi
 * @param {string|null} logData.ip_address - IP address user
 */
const createLog = async ({ user_id, action, module, description, ip_address = null }) => {
  try {
    await pool.execute(
      `INSERT INTO activity_logs (user_id, action, module, description, ip_address)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id || null, action, module, description, ip_address]
    );
  } catch (error) {
    // Jangan crash aplikasi hanya karena log gagal
    // Cukup log ke console
    console.error('⚠️  Gagal menyimpan activity log:', error.message);
  }
};

/**
 * Helper untuk mendapatkan IP address dari request
 * Mendukung proxy (X-Forwarded-For header)
 *
 * @param {object} req - Express request object
 * @returns {string}
 */
const getIpAddress = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

/**
 * Factory function untuk membuat middleware activity logger
 * Digunakan sebagai middleware di route
 *
 * @param {string} action - Aksi (CREATE, UPDATE, DELETE, dll)
 * @param {string} module - Nama module
 * @returns {Function} Express middleware
 */
const logActivity = (action, module) => {
  return async (req, res, next) => {
    // Simpan reference ke res.json asli
    const originalJson = res.json.bind(res);

    // Override res.json untuk menangkap response
    res.json = async function (data) {
      // Hanya log jika response sukses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const description = buildDescription(action, module, req, data);
        await createLog({
          user_id: req.user.id,
          action,
          module,
          description,
          ip_address: getIpAddress(req),
        });
      }

      // Panggil res.json asli
      return originalJson(data);
    };

    next();
  };
};

/**
 * Build deskripsi log berdasarkan aksi dan data
 */
const buildDescription = (action, module, req, responseData) => {
  const userName = req.user?.name || `User #${req.user?.id}`;
  const resourceId = req.params?.id || req.params?.productId || '';
  const resourceName = responseData?.data?.name || responseData?.data?.product_name || '';

  const descriptions = {
    CREATE: `${userName} membuat ${module} baru${resourceName ? `: ${resourceName}` : ''}`,
    UPDATE: `${userName} mengupdate ${module} #${resourceId}${resourceName ? ` (${resourceName})` : ''}`,
    DELETE: `${userName} menghapus ${module} #${resourceId}`,
    STOCK_IN: `${userName} mencatat stok masuk${resourceName ? ` untuk ${resourceName}` : ''}`,
    STOCK_OUT: `${userName} mencatat stok keluar${resourceName ? ` untuk ${resourceName}` : ''}`,
    UPLOAD_IMAGE: `${userName} mengupload gambar untuk produk #${resourceId}`,
  };

  return descriptions[action] || `${userName} melakukan ${action} pada ${module}`;
};

module.exports = { createLog, logActivity, getIpAddress };
