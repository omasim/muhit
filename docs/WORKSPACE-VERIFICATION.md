> Tarihsel Atölye 03 raporu. Buradaki 84 tip girişinin geçmesi runtime paket kabulü değildi: eski TGZ yeni JS/CSS kaynaklarını içermiyordu. Bu P0 hata 0.19 beta'da düzeltildi; güncel kanıt [VERIFICATION-0.19.md](VERIFICATION-0.19.md) içindedir.

# Atölye 03 doğrulama · 22 Ekim 2026

Yerel çalışma kopyası, 0.18.0 tabanı. Registry yayını veya 1.0 kabulü değildir.

| Kontrol | Sonuç |
|---|---|
| Node testleri | 90/90 geçti |
| Paketlenmiş TypeScript | 84 public giriş, NodeNext + Bundler geçti |
| Yeni sayfalar | 24 axe/taşma taraması; Chromium + WebKit, 1440/390, light/dark; ihlal yok |
| Önceki 10 ekran regresyonu | 80 axe/taşma taraması; aynı matris; ihlal yok |
| Yeni akışlar | İki motorda arşiv/geri al, TR/EN/RTL, görünüm değişimi ve sorgu koruma, detay Escape/odak, hatalı update atomikliği, komut Escape geçti |
| Önceki akışlar | Koleksiyon geri alma, arama, rol iptal/kayıt, tercihler, görev oluşturma ve içerik lifecycle geçti |
| Sistem sözleşmeleri | 30 bileşen, 6 tarif, 16 token modu geçti |
| Logo kilidi | 14 SVG, Muhit 3.1 ile aynı |

Kaynak detayının WebKit'te kapanış sonrası odak dönüşü düzeltildi. API veri sınırları duplicate id, bilinmeyen alan, getter çalıştırmama, 500 kayıt limiti, geçersiz tarih, kopya izolasyonu ve undo reset açısından test edildi.

Yeniden çalıştırma: `node --test tests/*.test.mjs`, `node tools/check-consumer-types.mjs`, `npm run check:system`, `node tools/check-brand.mjs`; yerel sunucu 4397 üzerinde çalışırken `PLAYWRIGHT_BROWSERS_PATH=/tmp/muhit-browsers node examples/atelier/verify-suite.mjs` ve `verify-next.mjs`. Browser ve rapor yolları ortam değişkenleriyle uyarlanabilir.

Firefox, fiziksel mobil cihaz ve manuel ekran okuyucu kabulü yapılmadı. Axe sonucu sertifikasyon değildir. Veriler kurgusal, backend/auth/senkronizasyon bu modüllerde uygulanmaz. Yeni modüller React/Vue gerçek uygulamalarında bu turda çalıştırılmadı; DOM mount/destroy API'si ve paket tipleri doğrulandı.
