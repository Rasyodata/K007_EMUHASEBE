# EMG MUHASEBE (K007_EMUHASEBE)

Bu proje **KAAN PLATFORM** üzerinden oluşturuldu. Kaynak modüller merkezi
Module Library'den gelir (arch: BİR KEZ GELİŞTİR — HER PROJEDE KULLAN).

## Amaç
EMG MUHASEBE — modül tabanlı iş uygulaması.

## Mimari
- Teknoloji: pnpm monorepo + TypeScript (varsayılan).
- Reusable modüller merkezi kütüphaneden kurulur; proje içinde fork edilmez.
- Projeye özel davranışlar `extensions/` altında override olarak yazılır.

## Aktif modüller
- `CORE.AUTH` — Authentication (Oturum açma, token, şifre yönetimi.)
- `CORE.USERS` — Users (Kullanıcı yönetimi.)
- `ACC.CARI` — Cari Hesaplar (Müşteri/tedarikçi kartları.)
- `ACC.FATURA` — Faturalar (Satış/alış faturaları, KDV, durum takibi.)
- `ACC.ISLEM` — Gelir / Gider (Kasa hareketleri, kategori, ödeme yöntemi.)
- `ACC.KASA` — Kasa & Banka (Kasa/banka hesapları, para birimi, IBAN.)

## Veritabanı (modül tabloları)
- CORE.AUTH: auth_session
- CORE.USERS: users
- ACC.CARI: cari
- ACC.FATURA: fatura
- ACC.ISLEM: islem
- ACC.KASA: hesap

## Kurallar
1. Yeni özellik istenince önce Module Library'yi kontrol et; varsa kur, yoksa
   reusable ise yeni modül olarak tasarla (arch #18/#19/#45).
2. Çalışan kodu sebepsiz yeniden yazma; destructive migration'ı otomatik çalıştırma.
3. Her işlem bir Claude Job'tur; sonunda Installation Report üret.

## Mevcut durum
Proje iskeleti + çekirdek muhasebe modülleri (ACC.CARI, ACC.FATURA, ACC.ISLEM,
ACC.KASA) kuruldu. Her modül metadata-driven: meta.mjs + schema.sql, registry'ye
bağlı, migrations/all.sql'e işlendi. Generic UI bu metadata'dan CRUD ekranlarını
üretir. Build 6 modül / 6 tablo ile geçiyor; auth korumalı CRUD uçtan uca doğrulandı.

## Devam etmek için
Platformdan "▶ CLAUDE İLE DEVAM ET" ile bu workspace'te `claude --continue` çalışır.
