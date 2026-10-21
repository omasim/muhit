# Muhit 0.18 — doğrulama raporu

## Kapsam

Yeni token, flow, page, primitives ve system girişleri; dört referans ekranı; var olan bileşenler ve React/Vue tüketicileri. Rapor manuel yardımcı teknoloji kabulünün yerine geçmez.

## Yerel sonuçlar

- 83 Node testi geçti (12 yeni sistem testi dahil).
- Paketlenmiş 80 public TypeScript girişi NodeNext ve Bundler çözümlemesinde geçti.
- Sistem sözleşmeleri: 30 bileşen, 6 sayfa, 16 token dosyası; her dosyada 185 token; referans döngüsü ve eksik hedef denetimi geçti.
- Chromium sistem testi: 4 ekran × 2 genişlik × 2 görünüm = 16 axe/taşma/landmark kontrolü; koyu görünümde gerçek sayfa RTL. Menü, tooltip, tree, iptal, AI onay sınırı, kayıt taslağı, import önizlemesi, çok adımlı geri dönüş ve toplu kısmi sonuç/retry senaryoları.
- `verify:all` yerel Chromium koşusu geçti. Ardından değişen referans framework bağımlılıkları ve son sistem akışları ayrıca yeniden doğrulanır; uzak CI nihai commit üzerinde tamamını tekrar çalıştırır.
- DataGrid bağımsız minified ESM 27.629 B / 28.000 B sınırı; tek ikon 2.098 B / 5.000 B sınırı. Ölçüm platform ve derleyici sürümüne bağlıdır.
- Logo 3.1: 14 SVG dosyası sabit kaynakla eşleşti.
- Referans Vite 7.3.7 ve Vue 3.5.44 güncellemelerinden sonra React/Vue npm audit çıktıları 0 bilinen açıklık bildirdi. Bu sonuç genel güvenlik sertifikası değildir.

## Figma kanıtı

2.960 değişken; kopuk alias 0; eksik WEB code syntax 0; ALL_SCOPES 0. 30 aile / 49 bileşen örneği, 6 sayfa ve 19 instance. Başlangıç, kart/form/düğme ve sayfa kompozisyonlarında görsel inceleme yapıldı. İlk incelemede bulunan palet fallback rengi ve düğme yüksekliği düzeltildi. Bütün bileşen metinleri paylaşılan stillere bağlı. [Manifest](../design/figma/manifest.json) node kimliklerini ve kapsam sınırını taşır.

## Uzak ve manuel kabul

Uzak üç motorlu CI sonucu sürüm varlıklarında commit/run kimliğiyle kaydedilir; yerel Chromium sonucu Firefox/WebKit sonucu sayılmaz. Manuel VoiceOver/NVDA/JAWS, fiziksel iOS/Android ve gerçek backend entegrasyon kabulü açıktır. Figma Code Connect Starter takımında yayımlanmadı. npm registry yayını yapılmadı.
