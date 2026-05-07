# Database Setup

## Cara menjalankan schema SQL

### Option 1: Via terminal
```bash
mysql -u root -p < database/schema.sql
```

### Option 2: Via MySQL Workbench
1. Buka MySQL Workbench
2. File > Open SQL Script > pilih `database/schema.sql`
3. Klik tombol Execute (petir)

## Default Login (semua password: `admin123`)

| Email | Password | Role |
|-------|----------|------|
| admin@inventory.com | admin123 | admin |
| manager@inventory.com | admin123 | manager |
| staff@inventory.com | admin123 | staff |

## Tabel yang dibuat

| Tabel | Keterangan |
|-------|------------|
| users | Data pengguna sistem |
| categories | Kategori produk |
| products | Data produk inventaris |
| stock_transactions | Riwayat pergerakan stok |
