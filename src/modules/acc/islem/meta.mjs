// Auto-generated module metadata for ACC.ISLEM. Safe to regenerate.
export default {
  "code": "ACC.ISLEM",
  "name": "Gelir / Gider",
  "category": "acc",
  "version": "1.0.0",
  "tables": [
    {
      "name": "islem",
      "fields": [
        { "name": "id", "type": "uuid", "options": [] },
        { "name": "tarih", "type": "date", "options": [] },
        { "name": "tur", "type": "select", "options": ["Gelir", "Gider"] },
        { "name": "kategori", "type": "select", "options": ["Satış", "Kira", "Maaş", "Fatura", "Vergi", "Komisyon", "Diğer"] },
        { "name": "tutar", "type": "numeric", "options": [] },
        { "name": "odeme", "type": "select", "options": ["Nakit", "Banka", "Kredi Kartı", "Çek"] },
        { "name": "aciklama", "type": "text", "options": [] }
      ]
    }
  ],
  "pages": [
    { "route": "/islemler", "title": "Gelir / Gider", "table": "islem" }
  ],
  "menu": [
    { "label": "Gelir / Gider", "route": "/islemler", "icon": "swap", "parent": "Muhasebe" }
  ],
  "permissions": [
    "islem.view",
    "islem.manage"
  ],
  "api": [
    { "method": "GET", "path": "/api/t/islem" },
    { "method": "POST", "path": "/api/t/islem" }
  ],
  "widgets": [
    { "title": "İşlem", "table": "islem" }
  ]
};
