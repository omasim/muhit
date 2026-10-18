# Muhit 0.14.0 — güncel kabul durumu

Bu sayfa güncel sürümün tek doğrulama girişidir. Önceki sürümlerin raporları tarihsel kanıttır; bu sürüme aktarılmaz. 0.x kapsamında kontrollü proje kullanımı hedeflenir; genel 1.0 kararlılık veya eksiksiz erişilebilirlik sertifikası verilmez.

## Değişiklikler

1. P1: CI tarayıcı matrisi migration dahil bütün adımlara aktarılır.
2. P1: Kullanıcı etiketlerindeki `× → ← ✓ ↗` korunur. Simgeler düğme metninden çıkarılmaz; yalnız kütüphanenin kendi kontrollerine açık parametreyle eklenir.
3. P1: React Grid yeniden kurulduğunda açık state, columnLayout ve selected değerleri snapshot üzerine uygulanır; onReady son durumu alır. Vue ile öncelik sırası aynıdır.
4. P1: 0.12/0.13 kaynakları yayın deposuyla eşitlenir. Güncel CI ve paket kanıtı aşağıdaki kayıtla izlenir.
5. P2: Widget headingLevel API'si; React/Vue baseline değişimi; HTML sink kullanmayan Icons.mount ve buna geçen DataGrid/Widgets.
6. P2: Tüketici güvenlik politikası ve yeni framework regresyonları; sürüm/destek belgelerinin güncellenmesi; kaynak parmak izli rapor üretimi.

## Doğrulama

Güncel koşu sonuçları `tests/evidence/` altında komut, tarih, kaynak SHA-256, mevcutsa Git commit, çıkış kodu ve tam log ile kaydedilir. Kaynak parmak izi hesaplama kapsamı raporda yazılıdır; tüm arşivin hash'i değildir. Yayın arşivlerinin ayrı SHA256SUMS dosyası vardır. `tools/record-test.mjs` ile çalıştırılmayan tarihsel raporlar yeni kanıt sayılmaz.

Yerel tarayıcı başlatımı bu oturumun işletim sistemi kısıtına takıldı. Tarayıcı kabulü GitHub CI üzerinden yürütülüyor; nihai sonuçlar bu sayfaya eklenecek. Başarısız/bekleyen koşular geçti olarak işaretlenmez.

## Açık kabul

- VoiceOver/Safari, NVDA/Firefox, JAWS/Chrome ve fiziksel iOS/Android: insan tarafından yürütülecek kabul bekliyor. [Senaryolar ve kayıt şablonu](ACCESSIBILITY-MANUAL.md).
- Strict Trusted Types desteği: Icons.mount, Widgets, DataGrid ve Forms tüketici testi kapsamındadır. HTML şablonu üreten eski Components/Table/Charts, agent ve stüdyo bu taahhüde dahil değildir. `svg()` dize API'sini bir HTML sink'e doğrudan atamak da dahil değildir. [Entegrasyon sözleşmesi](CONSUMER-CONTRACT.md).
- npm registry yayını yapılmadı; doğrulanmış yerel TGZ ile kullanım ve GitHub kaynak deposu kapsamındadır.
