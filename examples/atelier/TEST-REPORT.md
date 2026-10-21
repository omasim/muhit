# Muhit Atölye 02 — doğrulama raporu

22 Ekim 2026 · Yayımlanmamış geliştirme sürümü.

## Kapsam

9 ana ekran + katalog. Koleksiyonlar, ekip ve görünüm ayarları yeni. Aramada liste/ızgara; projede görev oluşturma ve sekme saklaması. `muhit-ui/content` modülünde kart/satır/bölüm, güvenli metin renderı, URL doğrulama, update/destroy ve korunan içerik bölgeleri.

## Sonuçlar

- 86 Node birim testi geçti; üç yeni içerik doğrulama testi dahil.
- Paketlenmiş 81 TypeScript giriş noktası NodeNext ve Bundler çözümlemesinde geçti.
- Chromium + WebKit: 10 görünüm × 2 genişlik (1440/390) × 2 mod (açık/koyu) × 2 motor = 80 axe/taşma kontrolü, sıfır ihlal/taşma/JS hatası.
- Chromium: Toprak/Kıyı × açık/koyu × ayarlar/koleksiyon/katalog/AI = 16 ek axe kontrolü, sıfır ihlal. Bu kontroller örnek kaydedilmiş içerikleri de kapsar.
- İki motorda: koleksiyondan kaldır/geri al, arama görünümü ve sorgu koruma, rol iptali/uygulama, tercih önizleme/kaydet/yenileme, görev oluşturma/saklama/metin güvenliği, bölümde taslak koruma testleri geçti.
- Son lifecycle düzeltmesi ayrıca Chromium’da doğrulandı: update sonrası eski düğme, destroy sonrası son düğme artık eylem üretmiyor.
- Sistem sözleşmesi kontrolü geçti: mevcut 30 bileşen, 6 tarif ve 16 token modu bozulmadı. Yeni content API, eski Agent JSON kataloğunu kendiliğinden genişletmez.
- Muhit 3.1 marka kontrolü: 14 SVG hash değeri değişmedi.
- 21 ekran görüntüsü üretildi: 9 ana ekran + katalog, mobil/masaüstü; ayrıca koyu ayarlar. Ayarlar ve koleksiyon görünümleri görsel olarak incelendi.

## Düzeltmeler

AI inceleme alanındaki sabit beyaz yüzey koyu temaya bağlandı. Kart güncelleme/yok etme olay temizliği eklendi. Dinamik görev metinleri HTML olarak çalıştırılmadan gösterilir. Detay ekranındaki kaydet eylemi doğru içerik kimliğiyle eşleştirildi.

## Sınırlar

Bu tur Firefox, fiziksel cihaz ve manuel ekran okuyucu kabulü yapılmadı. Otomatik tarama tam erişilebilirlik sertifikası değildir. Üçüncü parti backend, gerçek davet/yetki sistemi ve model çağrısı yoktur. Figma ve uzak yayın güncellenmedi. Paket sürüm numarası 0.18.0 olarak korunmuş çalışma kopyasıdır; bu arşiv daha önce yayımlanmış 0.18.0 sürümüyle aynı içerik değildir. Resmî sürüm yayımlamadan önce sürüm numarası artırılmalıdır.
