// ============================================
// constants/roles.js
// Definisi role yang tersedia di sistem.
// Gunakan konstanta ini di seluruh codebase
// agar tidak ada typo string 'admin', 'manager', dll.
// ============================================

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

// Array semua role (berguna untuk validasi)
const ALL_ROLES = Object.values(ROLES);

// Role yang bisa melakukan operasi tulis (create/update)
const WRITE_ROLES = [ROLES.ADMIN, ROLES.MANAGER];

// Role yang bisa melakukan operasi hapus
const DELETE_ROLES = [ROLES.ADMIN];

module.exports = { ROLES, ALL_ROLES, WRITE_ROLES, DELETE_ROLES };
