# EMG MUHASEBE (K007_EMUHASEBE)

KAAN PLATFORM tarafından üretildi. Çalıştır:

```bash
npm start                # ilk çalıştırmada better-sqlite3'ü kurar, sonra http://127.0.0.1:3300
npm test                 # smoke testleri
```

- **Veritabanı:** gerçek **SQLite** (`data/app.db`), şema `migrations/all.sql`'den
  açılışta uygulanır. better-sqlite3 yoksa JSON store'a güvenli düşer.
- Modüller `src/modules/**`, jenerik CRUD `/api/t/:table`, metadata `/api/_meta`,
  dashboard `/api/_stats`.
