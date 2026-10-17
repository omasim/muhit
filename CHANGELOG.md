# 0.10.0

Ölçüme dayalı büyük veri sorgu iyileştirmeleri; klavye/fare/dokunma Kanban taşıma; isteğe bağlı CSS/font girişleri ve WOFF2; DE/AR çekirdek katalogları; İngilizce stüdyo ve rehber. tokens.css artık font yüklemez; tam index.css davranışı korunur. P3 kapsam ve sınırlar docs/P3-0.10.md içinde.

## 0.9.0

P1 dil/görünüm/CSV düzeltmeleri; 44 px seçim hedefleri; genişletilmiş framework adaptörleri ve SSR/hydration; async doğrulama, alan grupları, uzak combobox; agent olayları; görsel referanslar ve tek kaynaklı yetenek belgesi. Geçişler: docs/RELEASE-0.9.md.

## 0.8.0

İleri sütun düzeni, ortak i18n ve RTL desteği, odak/kontrast düzeltmeleri ve üç tarayıcılı erişilebilirlik testi. Ayrıntılar: docs/RELEASE-0.8.md.

# 0.7.0 — 2026-10-17

Üç doğrulanmış hata düzeltildi. Form koşulları/özel doğrulama, DataGrid seçim/filtre/düzenleme/CSV, MuhitPlot, agent 1.1, framework form/widget örnekleri, izole ESM alt girişleri ve üç tarayıcı CI matrisi eklendi. Ayrıntılar docs/RELEASE-0.7.md.

# 0.6.0 — 2026-10-17

- MuhitForm: 7 alan türü, JSON alan şeması, doğrulama, hata özeti, kayıt/iptal ve dirty state.
- MuhitPreferences: sürümlü yerel tema saklama, bozuk kayıt/kota geri dönüşü ve sekme senkronu.
- Çalışan ayarlar sayfası, TypeScript API ve form/tercih regresyonları.
- Bileşen belgelerindeki eski 5 tür ifadesi düzeltildi; kapsam ve kalan işler belgelendi.

# 0.5.1

React/Vue örnekleri gerçek Vite uygulamalarına dönüştürüldü. Sabit bağımlılıklar ve kilit dosyaları, TypeScript kontrolleri, paketlenmiş TGZ üzerinden dört tarayıcı koşusu ve verify:all/CI entegrasyonu eklendi. macOS geçici yol normalizasyonu ve örnek favicon isteği düzeltildi.

# 0.4.0

Yatay kaynak/görev kartları, üç sayfa tarifi, sorumlu filtresi ve dört taşınabilir görünüm seçeneği. Ayrıntılar: docs/LAYOUTS.md. Sabit logo 3.1 korunur.

# Değişiklik günlüğü

## 0.3.1 — Onaylı Muhit kimliği

- Kullanıcı tarafından onaylanan logo 3.1 ana sürüm olarak sabitlendi.
- Logo dosyaları, kullanım rehberi, stüdyo ve paketler eşleştirildi.
- SVG dosya özetleri ve `check:brand` tutarlılık kontrolü eklendi.
- Bileşen API’leri ve tema yapılandırması korunur.


## 0.3.0 — Organik kimlik ve etkileşim sistemi

- Muhit logo v2: ortak boşluk etrafında üç organik fırça formu; SVG ve tek renk varyantları.
- Kum, Yosun, Erguvan ve Arduvaz paletleri; toplam 8 palet.
- 10 yeni kişiselleştirme alanı; kitap tipografisi, ferah yoğunluk, organik köşe.
- MuhitWidgets: 10 etkileşim türü; mount, update, destroy, getValue ve getFiles.
- Agent adaptörü 15 türü destekler; JSON şemaları ve TypeScript sözleşmesi güncellendi.
- Bileşen kataloğu 9 gruba ayrıldı; yeni iş akışı örneği ve API rehberi.

# Değişiklik kaydı

## 0.2.0 — 2026-10-09

Muhit UI adı ve yeni SVG logo sistemi. Önceki 0.1.0 çalışma paketi arşiv olarak korunur.

- Paket, API, CSS önekleri ve arayüz metinleri Muhit adına taşındı.
- Ana, tek renk ve koyu zemin logo dosyaları; sembol, favicon ve kullanım kılavuzu eklendi.
- Önceki tema JSON dosyaları desteklenmeye devam eder. Aynı kökendeki eski stüdyo tercihi doğrulanarak devralınır.

- Koru, Toprak, Kıyı ve Atölye paletleri; açık/koyu görünüm ve özel vurgu rengi.
- 53 CSS tokenı; metin, odak, durum ve grafik eşleri için 18 ölçümlü kontrast kontrolü.
- Yazı ailesi, yoğunluk, köşe, metin ölçeği, hareket ve sınır kişiselleştirmesi.
- JSON tema içe/dışa aktarımı, CSS dışa aktarımı ve yerel stüdyo tercih kaydı.
- Kartlar, metrikler, butonlar, formlar, durumlar, dialog ve bildirimler.
- Arama, filtre, sıralama, seçim, CSV ve toplu güncelleme destekli tablo.
- Çizgi, çubuk, halka ve küçük grafikler; veri tablosu alternatifleri ve kapsayıcıya uyumlu yerleşim.
- Beş bileşen türü için doğrulama ve DOM oluşturma sağlayan agent adaptörü.
- ESM girişi, TypeScript tanımları, JSON şemaları ve kurulum örnekleri.
- MIT kod lisansı ve ayrı OFL font lisansları.

Kaynak paket hazırlanmıştır; dış bir kayıt servisine yayın yapılmamıştır.

# 0.5.0

- P1: editoryal kart özel vurgu kontrastı ve tablo sorumlu sıfırlaması düzeltildi.
- P2: sınırlı kaydırma alanında sabit başlık; güncel kurulum belgeleri; paket içi tarayıcı testi ve CI tarifi.
- Kart durumları, meta/variant ve agent sayfa düzeni; eski tanımlar korunur.
- MuhitDataGrid: özel sütunlar, nullable değerler, yerel/sağlayıcı tabanlı veri, hata/yeniden deneme, iptal ve eski yanıt koruması.
- Tema geri al/yinele, değişiklik karşılaştırması, URL'ye bağlı sayfa seçimi.
- React/Vue host yaşam döngüsü örnekleri; üretim sözleşmeleri.
