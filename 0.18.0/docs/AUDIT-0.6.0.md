> 0.7 uygulama notu: Bu belge özgün denetim kaydı olarak korunmuştur. Üç hata kapatıldı; yapılan geliştirmeler docs/RELEASE-0.7.md, kalan kapsam docs/COVERAGE.md içinde günceldir.

# Muhit 0.6.0 — Eksik ve hata değerlendirmesi

Tarih: 17 Ekim 2026. Kaynak kodu, paket tanımı, örnekler ve testler incelendi. Üç davranış hatası ayrı Chrome oturumunda yeniden üretildi. Bu incelemede ürün kodu değiştirilmedi. P1: önce düzeltilmeli; P2: genel kullanımdan önce tamamlanmalı; P3: kullanım ihtiyacına göre genişletilmeli.

## 1. Doğrulanmış hatalar

### P1 — DataGrid düğmeleri dış formu gönderiyor

Kaynak: `src/data-grid.js`, düğme oluşturma ve başlık/sayfalama/yeniden deneme akışları. Düğmelere `type="button"` verilmiyor. Grid bir form içine yerleştirildiğinde sıralama düğmesine basmak dış formun submit olayını tetikliyor. Testte bir sıralama tıklaması bir form gönderimi üretti.

Düzeltme ölçütü: tüm eylem düğmeleri açık tip taşımalı; sıralama, sayfalama ve yeniden deneme dış formu göndermemeli. Native submit yalnız açık gönderim düğmesinde kullanılmalı.

### P1 — Geçersiz form değerleri sessizce kayboluyor

Kaynak: `src/forms.js:298` ve `setValues`. Değer türü denetleniyor; DOM'a aktarım öncesinde tarih ve seçenek uygunluğu denetlenmiyor. `setValues({choice:'missing',date:'2025-02-29'})` sonrasında iki değer de boş string oluyor. İsteğe bağlı alanlarda `validate()` sonucu `valid:true`. Bu, yanlış girdinin fark edilmeden kaybolmasıdır.

Düzeltme ölçütü: DOM'da temsil edilemeyen tarih/seçim yazılmadan reddedilmeli ve önceki değerler korunmalı; normalize etme politikası belgelenmeli. Başlangıç değerleri için de aynı sözleşme uygulanmalı.

### P2 — Başka alanı değiştirince sunucu hatası siliniyor

Kaynak: `src/forms.js:393`. Her input olayı tüm hataları yerel doğrulamayla değiştiriyor. Sunucunun A alanına döndürdüğü “zaten kullanılıyor” hatası B alanını düzenleyince kayboluyor; A için aria-invalid true iken false oluyor.

Düzeltme ölçütü: sunucu ve istemci hataları ayrı tutulmalı; sunucu alan hatası yalnız ilgili alan değişince veya yeni yanıt geldiğinde kaldırılmalı. İlgisiz düzenleme hatayı gizlememeli.

## 2. Bileşen ve entegrasyon eksikleri

| Öncelik | Eksik | Tamamlanma ölçütü |
| --- | --- | --- |
| P2 | Form/DataGrid agent renderer'a bağlı değil | Mevcut 15 türü bozmadan sürümlü şema, doğrulama ve eylem sözleşmesi; hatalı girdide önceki görünüm korunmalı |
| P2 | React/Vue örnekleri DataGrid odaklı host adaptörleri | Form, tercihler ve widget'lar için props/olay/temizleme örnekleri; kontrollü güncellemeler ve asenkron sağlayıcı testleri |
| P2 | Genel grafik API'si yok | Seri/etiket/birim/eksen tanımı; boş ve eksik veri politikası; erişilebilir tablo ve dışa aktarım. Mevcut sources/actions/connections sözleşmesini rastgele birimlerle kullanmamak |
| P2 | Genel DataGrid proje tablosunun tüm yeteneklerini taşımıyor | Seçim/toplu eylem, sütun görünürlüğü, filtreleme ve güvenli CSV için genel veri modeli |
| P2 | Form gelişmiş iş akışları eksik | Alanlar arası ve özel doğrulama, readonly/disabled alanlar, koşullu alanlar, değişiklik olayları ve taslak politikası |
| P2 | Sayfa tarifleri uygulama entegrasyonunu sınırlı gösteriyor | Liste–ayrıntı–düzenle, boş/hata/yetkisiz durum ve kaydedilmemiş değişiklik akışı içeren çalışan örnek |
| P3 | DataGrid ileri işlemleri yok | Hücre düzenleme, sütun boyutlandırma/sıralama/sabitleme; büyük veri ihtiyacına göre sanallaştırma |
| P3 | Form ileri kontrolleri yok | Tekrarlanan gruplar, combobox/uzak seçenekler, tarih aralığı; özel kontrollerde klavye sözleşmesi |
| P3 | Kanban doğrudan sürükleme içermiyor | İsteğe bağlı sürükle/bırak yanında mevcut erişilebilir seçim yöntemini korumak |

## 3. Tema, dil ve erişilebilirlik

- **P2 — Çok dillilik:** UI metinleri ve sayı/arama biçimleri Türkçeye bağlı. Mesaj sözlüğü, locale parametresi ve tarih/sayı biçimleme sözleşmesi gerekli.
- **P2 — RTL doğrulaması:** sağdan sola düzen, mantıksal boşluklar ve gezinme tuşları için test matrisi yok.
- **P2 — Tercih kapsamı:** ayrı MuhitPreferences API'si ve stüdyo davranışı için tek entegrasyon rehberi gerekli. Yerel saklama var; hesap/cihaz senkronu tüketiciye ait bir adaptör olarak açıklanmalı.
- **P2 — Erişilebilirlik kanıtı:** mevcut kontroller Chrome, belirli genişlikler ve büyütülmüş metinle sınırlı. Ekran okuyucu, yüksek kontrast/forced-colors, tam klavye akışı ve tüm widget odak geri dönüşleri doğrulanmalı. Görsel kontrast başarısı tüm ürün uyumluluğu değildir.
- **P3 — Tema paylaşımı:** adlandırılmış kullanıcı temaları, tema koleksiyonu ve sürümler arası taşıma politikası geliştirilebilir. Mevcut JSON/CSS dışa aktarma korunmalı.

## 4. Test ve dağıtım boşlukları

- **P2:** Bu incelemedeki üç hata mevcut testlerden kaçıyor; her biri için kalıcı regresyon testi gerekli.
- **P2:** Sekmeler arası tercih senkronu implementasyonu var; mevcut browser testinde iki gerçek sekmeyle doğrulama yok. save/clear olayları ve unsubscribe ayrıca sınanmalı.
- **P2:** Firefox/WebKit ve gerçek mobil tarayıcı matrisi yok. SSR'da import kontrolü, framework SSR/hydration testi yerine geçmez.
- **P2:** Görsel karşılaştırma testleri ve ölçülmüş performans bütçesi yok. 10.000 satırın sayfalı DOM kontrolü genel performans garantisi değildir.
- **P2:** ESM girişi tüm modülleri yan etkili olarak yükleyip globalThis üzerinden API sunuyor. Bileşen bazında gerçek modül girişleri, çok sürümlü kullanım ve gereksiz kodun paket dışında kalması ölçülmeli. Mevcut tasarım tek bileşen tüketiminde tüm çekirdeğin yüklenmesine yol açabilir.
- **P2:** Bağımsız yayın deposu/npm sürümü ve uzakta çalışan CI doğrulanmış değil; repository/bugs/homepage alanları, yayın politikası ve güvenlik bildirim yolu belirlenmeli.
- **P2:** Katkı rehberi hâlâ 0.2 ve bağımlılık kurmadan çalışma anlatıyor. Çekirdek Node 18+, framework örnekleri Node 20.19+ ayrımı ve test bağımlılıkları güncellenmeli.

## 5. Önerilen uygulama sırası

1. Üç doğrulanmış hatayı düzelt; sınır durumlarını regresyon testlerine ekle.
2. Form/DataGrid agent entegrasyonu ve React/Vue örneklerini genişlet.
3. Genel grafik ve DataGrid API'lerini ortak sözleşmeye bağla.
4. Dil/RTL, erişilebilirlik ve çoklu tarayıcı testlerini tamamla.
5. Modüler paketleme, belgeler ve sürüm yayını altyapısını kapat.

Kimlik doğrulama, veri tabanı, e-posta gönderimi ve AI model yürütme Muhit UI'nın eksik bileşenleri sayılmaz; bunlar uygulamanın altyapısıdır. UI kütüphanesi bunlar için gerçekçi bağlantı örnekleri ve açık durum sözleşmeleri sağlamalıdır.
