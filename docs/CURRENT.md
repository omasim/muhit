# Muhit 0.17.0 — güncel kabul durumu

0.17 kapsamı: ortak Form/Repeater/Agent ve stüdyo akışlarında taslak koruma, iptal ve doğru sonuç bildirimleri; çalışan stüdyonun belge yayınına eklenmesi. 0.16 kapsamı: derinleştirilmiş tasarım felsefesi, sekiz sınanabilir ilke ve bağlam/hata/iptal/yerel onay örneği. Önceki P3 kapsamı: ikon başına ESM girişleri ve küçük DataGrid bağımlılığı; altı sayfa tarifinde dört ek durum; React/Vue ikon ve sayfa kabuğu adaptörleri; İngilizce kılavuzlar; aramalı ve sürümlü statik belgeler; paket/yükseltme hazırlığı.

Doğrulama kaynağı `tests/evidence/` ve sürüm dağıtımındaki CI kaydıdır. Tarihsel 0.14 sonuçları yeni sürümün kanıtı değildir. Güncel çalışma sonuçları P3 sürüm raporunda toplanır. 71 Node testi, 75 tip girişi ve güncel tarayıcı koşuları bu sürüm için çalıştırılır.

DataGrid hedefi 28 KB; ikon başına hedef 5 KB. Klasik script ve tam ikon galerisi davranışları korunur. Yeni JSON agent türü eklenmedi.

Manuel VoiceOver/NVDA/JAWS ve gerçek iOS/Android kabulü açık kalır. CSP/Trusted Types kapsamı Icons.mount, Widgets, DataGrid ve Forms ile sınırlıdır. npm registry yayını için ayrı yayın yetkisi gerekir. React/Vue adaptörleri desteklenen referans kodudur; ayrı paketler değildir. 1.0 kararlılık taahhüdü verilmez.

Kılavuzlar: [Icons](ICONS.en.md), [Pages](PAGES.en.md), [0.15 geçişi](MIGRATION-0.15.md), [tüketici sözleşmesi](CONSUMER-CONTRACT.md), [manuel kabul](ACCESSIBILITY-MANUAL.md).

[Felsefe](DESIGN.md) · [Tasarım ilkeleri](PRINCIPLES.md). İlkeler bir uygunluk sertifikası değildir; uygulanmış davranış ve açık kabul işleri ayrı tutulur.

[0.17 etkileşim sözleşmesi](INTERACTION-CONTRACT.md) ve `test:principles` regresyonu: iptal sırasında taslak, geç yanıt, gerçek dışı kayıt bildirimi, Agent güncellemesi ve stüdyo geçişleri. Güncel CI kaydı sürüm varlıklarında yayımlanır.
