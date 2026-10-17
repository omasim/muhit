# Muhit UI'ya katkı · 0.7

Muhit; okunabilirlik, insan kontrolü ve kaynak verimliliğini birlikte koruyan bir arayüz kütüphanesidir. Kaynak depo: https://github.com/omasim/muhit.

## Ortam

Çekirdek ES modülleri Node 18+ üzerinde DOM olmadan import edilebilir. Geliştirme, CI ve Vite örnekleri için **Node 22** kullanın; React/Vue örnekleri en az Node 20.19 gerektirir.

```sh
npm ci
npx playwright install chromium firefox webkit
npm run dev
npm run verify:all
MUHIT_BROWSER=firefox npm run test:extended
MUHIT_BROWSER=webkit npm run test:extended
npm --prefix examples/react ci
npm run test:bundles
npm pack --dry-run
```

`src/*.js` klasik script kaynaklarıdır. `npm run build:modules` aynı kaynaklardan global isim alanını kirletmeyen `esm/*.mjs` dosyalarını üretir. Üretilen dosyaları elle değiştirmeyin; kaynak değişince yeniden üretin. `npm test`, check ve paketleme bu işlemi yapar. ESM alt girişleri bağımlılıkları açıkça taşır.

## Değişiklik ölçütleri

- Semantik tema tokenları, native etiketli kontroller ve klavye odağı kullanın.
- Kullanıcı metinlerini textContent ile gösterin; CSV formül korumasını kaldırmayın.
- API, types, şema, manifest, çalışan örnek ve regresyon testini birlikte güncelleyin.
- Başarısız güncelleme eski görünümü korumalı; destroy olayları, istekleri ve dinleyicileri temizlemeli.
- Chrome/Firefox/WebKit, dar ekran, koyu tema, RTL ve hareket azaltma kontrollerini çalıştırın.
- Logo 3.1 kilitlidir. Geometri ve yazı formunu değiştirmeyin; npm run check:brand geçmeli.

## Sözleşme ve yayın

Paket 0.7.0, UI şeması 1.1.0, tema şeması 1 ayrı sürümlerdir. Eski UI 1.0.0 tanımları desteklenir; yeni form/datagrid/plot türleri 1.1.0 ister. Geçişler CHANGELOG ve docs/MIGRATION.md içinde açıklanır.

GitHub Actions üç tarayıcı matrisi ile test eder; Chromium işinde React/Vue paket tüketimi, üretim derlemesi ve bağımsız modül boyutları da kontrol edilir. npm yayını otomatik değildir. Paket adı ve yayın yetkisi doğrulandıktan sonra ayrıca yapılır.
