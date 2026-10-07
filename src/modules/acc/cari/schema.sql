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
