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
