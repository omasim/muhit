# Muhit Atölye 02 — kütüphane ve deneyim geliştirmesi

22 Ekim 2026. Önceki Atölye 01 teslimi `outputs/muhit-atelier-01` paketinde korunur.

Bu turda ilk altı ekrana Koleksiyonlar, Ekip ve Görünüm ayarları eklendi. 18 mobil/masaüstü görünüm; ayrıca bileşen kataloğu bulunur. Yeni `muhit-ui/content` modülü Koleksiyonlar, Ekip ve katalog laboratuvarında kullanılır. İlk ekranlardaki tüm eski şablonlar bu turda modüle taşınmış değildir.

## Yeni davranışlar

- Koleksiyon: kaydedilen gerçek örnek içerikleri gösterir; kaldırma/geri alma ve boş durum sağlar.
- Ekip: örnek rolleri yerel olarak düzenler; iptal değişiklik uygulamaz; dialog sonrası odak geri döner.
- Görünüm: açık/koyu/sistem; Koru/Toprak/Kıyı paletleri; rahat/kompakt yoğunluk; yumuşak/belirgin köşeler; editoryal/işlevsel tipografi. Önizleme bağımsızdır, yalnız kaydet arayüzü ve yerel tercihi değiştirir.
- Arama: liste/ızgara görünümü URL’de filtrelerle birlikte korunur.
- Proje: görev oluşturma ve durumlar proje kimliğine göre sekmede tutulur. İptal edilen görev formunun taslağı aynı sayfada korunur.
- Kart/satır/bölüm modülü: güvenli metin renderı, tam update, destroy ve çocukları koruyan bölüm durumları. API için `docs/CONTENT.md`.

## Teslim sınırı

Yerel geliştirme ve çalışan referans örnekleridir. Gerçek ekip yetkilendirmesi, backend, davet gönderme veya AI çağrısı yoktur. Yeni npm/GitHub yayını ve Figma aktarımı yapılmadı. Muhit 3.1 logo geometrisi ve marka dosyaları değiştirilmedi.

## Tasarım dili

Mevcut Muhit tokenları, sabit 3.1 logo, Manrope/Source Serif 4 ve özgün yerel illüstrasyonlar kullanılır. Editoryal keşif alanlarıyla görev odaklı çalışma ekranları farklı yoğunluklarda aynı kimliği taşır. Kart bütünü tıklama alanı değildir; başlık bağlantısı ve ikincil eylem ayrıdır. Mobilde panolar dikey gruplara, bağlam alanları içeriğin altına geçer.

## Çalıştırma

Depo kökünde `PORT=4397 node tools/serve.mjs`. İnceleme panosu `/examples/atelier/boards.html`.
Yeni test: `PLAYWRIGHT_BROWSERS_PATH=/tmp/muhit-browsers node examples/atelier/verify-next.mjs`.
API: `docs/CONTENT.md`. Envanter: `catalog.json`. Güncel kabul: `TEST-REPORT.md`.

Önceki ayrıntılı ekran anatomisi 01 paketinin DESIGN.md dosyasında korunur. Yeni gelişmeler için bu belge ve CONTENT.md esas alınır.
