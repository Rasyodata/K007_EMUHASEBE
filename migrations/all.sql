-- ===== AUTH (scaffold) =====
CREATE TABLE IF NOT EXISTS _auth_user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  pass TEXT NOT NULL,
  role TEXT,
  created TEXT
);
CREATE TABLE IF NOT EXISTS _auth_session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created TEXT,
  expires TEXT
);

-- ===== CORE.AUTH =====
-- CORE.AUTH schema (generated from manifest)
CREATE TABLE IF NOT EXISTS auth_session (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  token TEXT,
  expires_at TEXT
);

-- ===== CORE.USERS =====
-- CORE.USERS schema (generated from manifest)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  active INTEGER DEFAULT 1
);

-- ===== ACC.CARI =====
-- ACC.CARI schema (generated from manifest)
CREATE TABLE IF NOT EXISTS cari (
  id TEXT PRIMARY KEY,
  kod TEXT,
  unvan TEXT NOT NULL,
  tur TEXT,
  vergi_dairesi TEXT,
  vergi_no TEXT,
  telefon TEXT,
  eposta TEXT,
  adres TEXT
);

-- ===== ACC.FATURA =====
-- ACC.FATURA schema (generated from manifest)
CREATE TABLE IF NOT EXISTS fatura (
  id TEXT PRIMARY KEY,
  fatura_no TEXT,
  tarih TEXT,
  cari TEXT,
  tur TEXT,
  tutar NUMERIC DEFAULT 0,
  kdv NUMERIC DEFAULT 0,
  toplam NUMERIC DEFAULT 0,
  durum TEXT DEFAULT 'Taslak',
  aciklama TEXT
);

-- ===== ACC.ISLEM =====
-- ACC.ISLEM schema (generated from manifest)
CREATE TABLE IF NOT EXISTS islem (
  id TEXT PRIMARY KEY,
  tarih TEXT,
  tur TEXT,
  kategori TEXT,
  tutar NUMERIC DEFAULT 0,
  odeme TEXT,
  aciklama TEXT
);

-- ===== ACC.KASA =====
-- ACC.KASA schema (generated from manifest)
CREATE TABLE IF NOT EXISTS hesap (
  id TEXT PRIMARY KEY,
  ad TEXT NOT NULL,
  tur TEXT,
  para_birimi TEXT DEFAULT 'TRY',
  iban TEXT,
  acilis_bakiye NUMERIC DEFAULT 0
);
