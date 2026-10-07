-- ACC.KASA schema (generated from manifest)
CREATE TABLE IF NOT EXISTS hesap (
  id TEXT PRIMARY KEY,
  ad TEXT NOT NULL,
  tur TEXT,
  para_birimi TEXT DEFAULT 'TRY',
  iban TEXT,
  acilis_bakiye NUMERIC DEFAULT 0
);
