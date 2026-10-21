# Muhit 0.22.0-beta.1 · Doğrulama

## Test edilen kaynak

- Sürüm: `0.22.0-beta.1`.
- Çalışan kod commit'i: `c383f308c748694c33bbc142520a893dd71ab812`.
- Kaynak SHA-256: `61981298d9614b5fee0d3b024d9860755ac72b28730e5082ce2c44c1b934d350`.
- [Üç motorlu CI koşusu](https://github.com/omasim/muhit/actions/runs/39690129746).
- Kanıt dizini: `tests/evidence/release22/`. Yalnız yukarıdaki kaynak özetiyle eşleşen raporlar sürüm kanıtı sayılır. Kaynak arşivindeki eski test raporları tarihsel kayıttır.

## Yerel doğrulama

110 Node testi geçti: DST boşluğu/çift saat, haftalık tekrar/istisna, kapasite tepe değeri, işaret aralıkları, JSON roundtrip, güvenli URL, arama ve geç yanıt iptali dahil. 88 tipli giriş NodeNext/Bundler tüketici testinden geçti; yeni planlama ve search pozitif/negatif API fixture'ları kullanıldı.

Son kaynakla Chromium ve WebKit'te 12 açık/koyu responsive/axe taraması geçti: 320/390/1440 px, 1.25 ölçek; 390 px RTL. Akış testleri yerel saat dönüşümü, düzenleme/silme, kapasite, DST/tekrar istisnası, satır içi biçim, HTTPS bağlantı/görsel, sözcük diff, kontrollü aktarım, gerçek HTTP sayfalama, hata/iptalde sonuç koruma ve dışarıdan değişen kayıtta eski taslağın korunmasını kapsar. Sıfır raporlanmış axe ihlali ve yatay taşma.

Son yerel sentetik ölçümde 100 bin kaydın indeksi yaklaşık 97 ms; sorgu p95 yaklaşık 3,7 ms. HTTP sayfalama p95 Chromium yaklaşık 3,7 ms, WebKit 5 ms (loopback). Bunlar gerçek müşteri verisi, uzak ağ veya bütün cihazlar için performans garantisi değildir. Ham ölçümler `local/search-scale.json` ve `local/all.json` içindedir.

## Uzak kabul

CI **başarılı**: Chromium, Firefox ve WebKit işlerinin tamamı geçti. Sonuç `tests/evidence/release22/CI-RESULT.json` içinde kayıtlıdır. Yeni ekranın CI taramaları üç motorda toplam 18 açık/koyu responsive/axe kontrolünden geçti. Chromium işi tam verify:all, paketlenmiş React/Vue geliştirme/üretim/SSR tüketimi, dağıtım, tipler ve entegrasyon kontrollerini çalıştırır. Firefox ve WebKit işleri tanımlı çok motorlu regresyon kapılarını çalıştırır. İş adımları ve sonuçları koşu kaydında ayrı ayrı bulunur.

## Açık sınırlar

Gerçek proje verisiyle performans kabulü ve manuel ekran okuyucu/fiziksel cihaz kabulü bekliyor. Otomatik axe testi erişilebilirlik sertifikası değildir. Ödeme/abonelik, ortak düzenleme ve sektörel servisler ürün/sağlayıcı gereksinimine bağlı koşullu kapsamdır. Yeni 0.22 kontrollerinin tam Figma eşliği tamamlanmadı. Beta etiketi korunur; npm registry veya Pages yayını yapılmadı.
