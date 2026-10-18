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

18 Ekim 2026: [üç tarayıcılı CI başarılı](https://github.com/omasim/muhit/actions/runs/39152881655), commit `c7b085aa77f4555c1933257b8d29115117e4b7d4`. Doğrulanan kaynak SHA-256: `6f8500bc8148ee5ecd9a934dd0ea826dcd9f709a0226dd03b94dfb9e2be54b53`.

- 70 birim testi; 17 paket tip girişi (NodeNext/Bundler).
- Chromium, Firefox, WebKit: her birinde 96 sayfa/görünüm ve 21 temel sayfa kontrolü; davranış, ölçek, erişilebilirlik ve üretim regresyonları.
- React/Vue: paketlenmiş TGZ ile geliştirme, üretim ve SSR/hydration; 30 yeniden kurulum kombinasyonu; baseline ve iptal edilen kayıt kontrolleri.
- Katı CSP/Trusted Types tüketici testi; host CSS ve yaşam döngüsü/odak kontrolü.
- Linux Chromium: 14 görsel referans normal karşılaştırmayla geçti. Eşik değiştirilmedi.
- DataGrid 31.891, Forms 17.477, Plot 11.206 bayt; her biri 35 KB bütçesinin altında. Logo 3.1 kontrolü geçti.

Yerel tarayıcı başlatımı işletim sistemi kısıtına takıldığı için tarayıcı sonuçları Linux CI'ya aittir; bu tur macOS tarayıcı başarısı iddia edilmez. Sürüm paketinin PROVENANCE.json dosyası paketlenen commit'i, SHA256SUMS dosyası arşiv bütünlüğünü belirtir. Sonraki belge/rapor commit'leri aynı kaynak parmak izini korur.

## Açık kabul

- VoiceOver/Safari, NVDA/Firefox, JAWS/Chrome ve fiziksel iOS/Android: insan tarafından yürütülecek kabul bekliyor. [Senaryolar ve kayıt şablonu](ACCESSIBILITY-MANUAL.md).
- Strict Trusted Types desteği: Icons.mount, Widgets, DataGrid ve Forms tüketici testi kapsamındadır. HTML şablonu üreten eski Components/Table/Charts, agent ve stüdyo bu taahhüde dahil değildir. `svg()` dize API'sini bir HTML sink'e doğrudan atamak da dahil değildir. [Entegrasyon sözleşmesi](CONSUMER-CONTRACT.md).
- npm registry yayını yapılmadı; doğrulanmış yerel TGZ ile kullanım ve GitHub kaynak deposu kapsamındadır.
