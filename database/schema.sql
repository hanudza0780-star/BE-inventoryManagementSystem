-- ============================================
-- database/schema.sql
-- Script lengkap untuk setup database inventory_db
-- Jalankan: mysql -u root -p < database/schema.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS inventory_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE inventory_db;

-- -----------------------------------------------
-- Tabel: users
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)    NOT NULL,
  email       VARCHAR(150)    NOT NULL UNIQUE,
  password    VARCHAR(255)    NOT NULL                  COMMENT 'Bcrypt hash',
  role        ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB COMMENT='Data pengguna sistem';

-- -----------------------------------------------
-- Tabel: categories
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)    NOT NULL UNIQUE,
  description VARCHAR(500)    NULL,
  is_active   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB COMMENT='Kategori produk';

-- -----------------------------------------------
-- Tabel: products
-- Kolom category_id mereferensikan tabel categories
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200)    NOT NULL,
  sku           VARCHAR(100)    NOT NULL UNIQUE          COMMENT 'Kode unik produk',
  category_id   INT UNSIGNED    NULL                     COMMENT 'FK ke tabel categories',
  category      VARCHAR(100)    NOT NULL                 COMMENT 'Nama kategori (denormalized untuk kemudahan query)',
  description   TEXT            NULL,
  price         DECIMAL(15, 2)  NOT NULL DEFAULT 0,
  stock         INT             NOT NULL DEFAULT 0,
  unit          VARCHAR(50)     NOT NULL DEFAULT 'pcs',
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sku        (sku),
  INDEX idx_category   (category),
  INDEX idx_category_id (category_id),
  INDEX idx_is_active  (is_active),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Data produk inventaris';

-- -----------------------------------------------
-- Tabel: stock_transactions
-- Mencatat setiap pergerakan stok (masuk/keluar)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS stock_transactions (
  id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED    NOT NULL                  COMMENT 'FK ke tabel products',
  type        ENUM('IN', 'OUT') NOT NULL                COMMENT 'IN=masuk, OUT=keluar',
  quantity    INT             NOT NULL                  COMMENT 'Jumlah stok yang bergerak',
  note        VARCHAR(500)    NULL                      COMMENT 'Catatan transaksi',
  created_by  INT UNSIGNED    NULL                      COMMENT 'FK ke tabel users',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id),
  INDEX idx_type       (type),
  INDEX idx_created_at (created_at),
  CONSTRAINT fk_stock_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_stock_user
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Riwayat pergerakan stok';

-- -----------------------------------------------
-- SEED DATA
-- -----------------------------------------------

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
  ('Administrator', 'admin@inventory.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('Manager Gudang', 'manager@inventory.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
  ('Staff Gudang', 'staff@inventory.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff')
ON DUPLICATE KEY UPDATE id=id;

-- Kategori
INSERT INTO categories (name, description) VALUES
  ('Elektronik', 'Perangkat elektronik dan aksesoris'),
  ('ATK', 'Alat Tulis Kantor'),
  ('Furnitur', 'Perabot dan furnitur kantor'),
  ('Konsumsi', 'Barang konsumsi dan habis pakai')
ON DUPLICATE KEY UPDATE id=id;

-- Produk (menggunakan category_id dari tabel categories)
INSERT INTO products (name, sku, category_id, category, description, price, stock, unit) VALUES
  ('Laptop ASUS VivoBook 14', 'LAP-ASUS-001',
   (SELECT id FROM categories WHERE name='Elektronik'), 'Elektronik',
   'Laptop ringan, RAM 8GB, SSD 512GB', 7500000.00, 15, 'unit'),
  ('Mouse Wireless Logitech M185', 'MOU-LOG-001',
   (SELECT id FROM categories WHERE name='Elektronik'), 'Elektronik',
   'Mouse wireless dengan receiver USB nano', 185000.00, 50, 'unit'),
  ('Keyboard Mechanical Rexus', 'KEY-REX-001',
   (SELECT id FROM categories WHERE name='Elektronik'), 'Elektronik',
   'Keyboard mechanical switch blue', 450000.00, 30, 'unit'),
  ('Kertas HVS A4 80gsm', 'KER-HVS-001',
   (SELECT id FROM categories WHERE name='ATK'), 'ATK',
   'Kertas HVS A4, 80 gram, 500 lembar/rim', 55000.00, 200, 'rim'),
  ('Pulpen Pilot G2 Hitam', 'PUL-PIL-001',
   (SELECT id FROM categories WHERE name='ATK'), 'ATK',
   'Pulpen gel hitam', 12000.00, 500, 'pcs'),
  ('Meja Kerja Minimalis', 'MEJ-KAY-001',
   (SELECT id FROM categories WHERE name='Furnitur'), 'Furnitur',
   'Meja kerja kayu jati 120x60cm', 1200000.00, 8, 'unit'),
  ('Kursi Ergonomis', 'KUR-ERG-001',
   (SELECT id FROM categories WHERE name='Furnitur'), 'Furnitur',
   'Kursi kantor ergonomis dengan lumbar support', 3500000.00, 5, 'unit'),
  ('Tinta Printer Canon PG-745', 'TIN-CAN-001',
   (SELECT id FROM categories WHERE name='Elektronik'), 'Elektronik',
   'Tinta printer Canon warna hitam', 95000.00, 40, 'botol')
ON DUPLICATE KEY UPDATE id=id;

SELECT 'Setup database selesai!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_categories FROM categories;
SELECT COUNT(*) AS total_products FROM products;
