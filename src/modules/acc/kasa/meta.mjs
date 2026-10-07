// Auto-generated module metadata for ACC.KASA. Safe to regenerate.
export default {
  "code": "ACC.KASA",
  "name": "Kasa & Banka",
  "category": "acc",
  "version": "1.0.0",
  "tables": [
    {
      "name": "hesap",
      "fields": [
        { "name": "id", "type": "uuid", "options": [] },
        { "name": "ad", "type": "text", "options": [] },
        { "name": "tur", "type": "select", "options": ["Kasa", "Banka"] },
        { "name": "para_birimi", "type": "select", "options": ["TRY", "USD", "EUR"] },
        { "name": "iban", "type": "text", "options": [] },
        { "name": "acilis_bakiye", "type": "numeric", "options": [] }
      ]
    }
  ],
  "pages": [
    { "route": "/hesaplar", "title": "Kasa & Banka", "table": "hesap" }
  ],
  "menu": [
    { "label": "Kasa & Banka", "route": "/hesaplar", "icon": "wallet", "parent": "Muhasebe" }
  ],
  "permissions": [
    "hesap.view",
    "hesap.manage"
  ],
  "api": [
    { "method": "GET", "path": "/api/t/hesap" },
    { "method": "POST", "path": "/api/t/hesap" }
  ],
  "widgets": [
    { "title": "Kasa/Banka", "table": "hesap" }
  ]
};
