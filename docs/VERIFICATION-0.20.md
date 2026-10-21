# Muhit 0.20.0-beta.1 · Doğrulama raporu

22 Ekim 2026. Bu rapor yerel 0.20 çalışmasına aittir. npm veya GitHub Pages yayını bu turda yapılmadı; sürümlü dağıtım dosyaları hazırlandı.

| Kontrol | Sonuç |
|---|---|
| Birim testleri | 101/101 geçti |
| P3 tarayıcı matrisi | 5 sayfa × 2 genişlik (1440/390) × açık/koyu × Chromium/WebKit = 40 tarama; axe WCAG A/AA ihlali ve yatay taşma yok |
| Önceki ürün akışları | 21 rota × aynı görünüm/motor matrisi = 168 tarama ve akış regresyonları geçti |
| Gerçek TGZ | Ayrı klasöre çıkarılan pakette calendar/editor/notifications/research/team açıldı; JavaScript hatası ve eksik HTTP dosyası yok |
| Paket runtime/tipleri | Bütün açık ESM girişleri import edildi. 87 tip girişi NodeNext ve Bundler strict kontrollerinden geçti |
| Registry | 46 sözleşme, 6 sayfa tarifi, 16 token modu; mount girişleri gerçek export'larla eşleşiyor |
| Kimlik | 14 SVG Muhit 3.1 kilidiyle eşleşiyor |
| Boyut | Takvim/editör/bildirim merkezi dahil izole modül ve CSS bütçeleri geçti; planning.css 2.056 bayt, gzip 755 bayt |
| Büyük veri | Chromium 20.000 satır; DOM 10 satır; bağlama 17,8 ms, sıralama 16,2 ms, filtre 23,2 ms, arama 509 ms |
| Figma | 15 modül ailesi / 30 anatomi varyantı; değişkenler ve yazı stilleri bağlı, P3 inceleme çerçevesi görsel olarak kontrol edildi |
| Firefox | Bu macOS ortamında önceki başlatma engeli sürüyor; bu sürüm için geçti sayılmadı. CI üç motoru çalıştıracak biçimde güncellendi; uzak CI çalıştırılmadı |
| Manuel kabul | VoiceOver/NVDA/JAWS ve fiziksel iOS/Android kabulü yürütülmedi |

## Davranış kontrolleri

- Takvim: aynı kaynakta çakışmayı engelleme; farklı kaynakta ekleme; UTC / DST / gece yarısı; geç yanıt iptali; istek sırasında değişen yeni taslağı koruma. 500 kayıtlı ay bağlama için 1.500 ms yerel kabul bütçesi.
- Belge: yerel sürüm oluşturma, geri getirme ve geri alma; doğrulanmamış kayıtta taslak koruma; literal HTML metni; liste biçimlendirmesinde doğru li yapısı; geç yanıt / destroy / iptal temizliği.
- Bildirim: gruplama; erteleme; geri alma; erken uyandırma; kontrollü saatle süre sonunda yeniden görünme; teslim tercihi; iptal/destroy sırasında geç onayı yok sayma.
- Birim sınırları: olay tarihleri, boş/çakışan aralıklar, benzersiz blok kimlikleri, sürüm limiti 30, undo limiti 50, snapshot kopya izolasyonu, bozuk snooze ve tercih değerlerini reddetme.

## Kanıt ve tekrar

- `tests/evidence/planning20/verification-all.json`: 40 tarama, iki motorlu akışlar ve takvim süreleri.
- `tests/evidence/planning20/packed.json`: gerçek paket üzerinden beş rota.
- `tests/evidence/workspace19/verification.json`: bu turda tekrar çalıştırılmış 168 regresyon taraması.
- `tests/scale-verification-chromium.json`: büyük veri ölçümü.
- `tests/bundle-verification.json`, `tests/distribution-verification.json`: boyut ölçümleri.
- `design/figma/modules-0.20.json`: gerçek Figma düğüm kimlikleri.
- Dağıtım `evidence/` dizini: komut logları ve JSON kanıtları.

Komutlar: `npm test`, `npm run test:planning`, `npm run test:workspace`, `npm run test:packed-planning`, `npm run test:consumer-types`, `npm run test:scale`, `npm run check:system`, `npm run check:brand`, `npm run check:capabilities`, `npm run test:bundles`, `npm run test:distribution`.

Yeni testler `verify:all` ve GitHub CI'a eklendi. Bu turda `verify:all` içindeki bütün tarihsel testler çalıştırılmış gibi sunulmaz. React/Vue için 0.19 raporundaki geniş entegrasyon sonuçları tarihseldir; 0.20'de yeni planning modülü native ESM, packed browser ve strict TypeScript ile doğrulandı. Performans süreleri bu makinedeki örnek veriye aittir; ürün SLA'sı değildir.

## Kalan koşullu işler

Manuel erişilebilirlik ve fiziksel cihaz kabulü; uzak Firefox CI; gerçek uygulama backend/izin/sürüm çakışması entegrasyonu. Native Code Connect yayımlanmadı. Sanallaştırma, ticari rezervasyon/faturalama ve işbirlikli metin düzenleme, tanımlanmış ürün ihtiyacı oluşursa ayrıca planlanmalı. Beta etiketi korunur.
