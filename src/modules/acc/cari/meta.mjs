// Auto-generated module metadata for ACC.CARI. Safe to regenerate.
export default {
  "code": "ACC.CARI",
  "name": "Cari Hesaplar",
  "category": "acc",
  "version": "1.0.0",
  "tables": [
    {
      "name": "cari",
      "fields": [
        { "name": "id", "type": "uuid", "options": [] },
        { "name": "kod", "type": "text", "options": [] },
        { "name": "unvan", "type": "text", "options": [] },
        { "name": "tur", "type": "select", "options": ["Müşteri", "Tedarikçi", "Her İkisi"] },
        { "name": "vergi_dairesi", "type": "text", "options": [] },
        { "name": "vergi_no", "type": "text", "options": [] },
        { "name": "telefon", "type": "text", "options": [] },
        { "name": "eposta", "type": "text", "options": [] },
        { "name": "adres", "type": "text", "options": [] }
      ]
    }
  ],
  "pages": [
    { "route": "/cari", "title": "Cari Hesaplar", "table": "cari" }
  ],
  "menu": [
    { "label": "Cari Hesaplar", "route": "/cari", "icon": "contacts", "parent": "Muhasebe" }
  ],
  "permissions": [
    "cari.view",
    "cari.manage"
  ],
  "api": [
    { "method": "GET", "path": "/api/t/cari" },
    { "method": "POST", "path": "/api/t/cari" }
  ],
  "widgets": [
    { "title": "Cari Hesap", "table": "cari" }
  ]
};
