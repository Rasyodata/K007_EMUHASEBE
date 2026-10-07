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
