// Auto-generated module metadata for ACC.FATURA. Safe to regenerate.
export default {
  "code": "ACC.FATURA",
  "name": "Faturalar",
  "category": "acc",
  "version": "1.0.0",
  "tables": [
    {
      "name": "fatura",
      "fields": [
        { "name": "id", "type": "uuid", "options": [] },
        { "name": "fatura_no", "type": "text", "options": [] },
        { "name": "tarih", "type": "date", "options": [] },
        { "name": "cari", "type": "text", "options": [] },
        { "name": "tur", "type": "select", "options": ["Satış", "Alış"] },
        { "name": "tutar", "type": "numeric", "options": [] },
        { "name": "kdv", "type": "numeric", "options": [] },
        { "name": "toplam", "type": "numeric", "options": [] },
        { "name": "durum", "type": "select", "options": ["Taslak", "Kesildi", "Ödendi", "İptal"] },
        { "name": "aciklama", "type": "text", "options": [] }
      ]
    }
  ],
  "pages": [
    { "route": "/faturalar", "title": "Faturalar", "table": "fatura" }
  ],
  "menu": [
    { "label": "Faturalar", "route": "/faturalar", "icon": "invoice", "parent": "Muhasebe" }
  ],
  "permissions": [
    "fatura.view",
    "fatura.manage"
  ],
  "api": [
    { "method": "GET", "path": "/api/t/fatura" },
    { "method": "POST", "path": "/api/t/fatura" }
  ],
  "widgets": [
    { "title": "Fatura", "table": "fatura" }
  ]
};
