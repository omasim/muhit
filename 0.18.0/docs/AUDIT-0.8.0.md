> 0.9 takip notu: kod ve belge bulgularının uygulamaları RELEASE-0.9.md içinde; manuel erişilebilirlik doğrulaması açık kalır. Bu dosya ilk denetimin tarihsel kaydıdır.

# Muhit 0.8.0 — genel değerlendirme ve öncelikler

İnceleme: 17 Ekim 2026. Kaynak, API, örnek adaptörler, dağıtım tanımı ve test kapsamı incelendi. 60 Node testi yeniden çalıştırıldı ve geçti. Yeni davranış tekrarları yerel Chromium üzerinde yapıldı. Önceki sürümün üç tarayıcılı CI sonucu başarılıdır; bu değerlendirmede bütün tarayıcı/React/Vue paketi yeniden çalıştırılmadı. Ürün kodu değiştirilmedi.

## Genel karar

Muhit; görsel kimliği, semantik tema sistemi, bağımsız bileşenleri, JSON doğrulaması ve çalışan örnekleri olan kullanılabilir bir çekirdektir. Kontrollü projelerde kullanılabilir. Genel amaçlı, uzun vadeli kararlı açık kaynak kütüphane olarak konumlandırmadan önce durum/dil sözleşmeleri, framework adaptörleri, doğrulama kapsamı ve yayın belgeleri tamamlanmalıdır. Yeni bileşen sayısından önce mevcut bileşenlerin tutarlı davranışı gelir.

Bu incelemede P0 düzeyinde doğrulanmış bir engel bulunmadı. Bu ifade kapsamlı bir güvenlik denetimi veya bütün erişilebilirlik gereklerinin sağlandığı anlamına gelmez.

## P1 — bir sonraki düzeltme sürümü

### 1. Bölgesel dil sözlüğü devralma hatası — doğrulandı

`MuhitI18n.create` tam locale kataloğu varsa ana dil kataloğunu tamamen bırakıyor. `de` içinde Reset çevirisi, `de-CH` içinde yalnız Save çevirisi tanımlanınca Reset Almancadan devralınmak yerine İngilizce oluyor.

Kaynak: `src/i18n.js`, katalog birleştirme. Kabul ölçütü: varsayılan → ana dil → bölgesel dil → bileşen mesajları sıralı birleşmeli; her katman yalnız verdiği anahtarı değiştirmeli. Çakışma ve eksik anahtar testleri eklenmeli.

### 2. Tablo dil durumu ile görünümü ayrışıyor — doğrulandı

TR tabloya `setState({locale:'en-US'})` verildiğinde state EN oluyor; kökün `lang` değeri TR ve 1234.5 gösterimi `1.234,5` kalıyor. Sıralama/arama locale'i ile gösterim dili farklılaşıyor. Mevcut belgeler dil değişimi için yeniden mount önerse de public state aynı alanı kabul ediyor.

Kaynak: `src/data-grid.js`, mount locale'i, setState ve sayı biçimleme. Kabul ölçütü: locale tek sözleşmeyle yönetilmeli; değişebiliyorsa metin/biçim/lang/dir eşzamanlı güncellenmeli, değişemiyorsa state üzerinden kabul edilmemeli. Çoğul ve dinamik sayım mesajları sabit anahtar/yer tutuculara taşınmalı; `1 records selected` gibi ifadeler düzeltilmeli.

### 3. Görünümü eksiksiz saklama/geri yükleme yok — doğrulandı

`getColumnLayout` sıra, genişlik ve sabitlemeyi döndürüyor; görünürlük yok. Bir sütunu gizleyince dönen snapshot değişmiyor. Dil değişimi/remount için seçimleri geri yükleyen bir `setSelected` da yok. Yeni dil örneği form taslağı ve sütun yerleşimini koruyor; bütün tablo durumunu koruyan genel çözüm değil.

Kaynak: `src/data-grid.js`, public API; `examples/international.html`. Kabul ölçütü: sürümlü görünüm snapshot'ı; görünür sütunlar, yerleşim, sorgu/filtre/sıralama/sayfa ve gerektiğinde seçili kimlikler için kontrollü geri yükleme. Veri/kolon şeması değişiminde geçersiz kimlikler güvenle ayıklanmalı.

### 4. Erişilebilirlik doğrulamasını tamamlamak — doğrulama açığı

Axe ve klavye testleri var; VoiceOver/NVDA/JAWS ve gerçek dokunmatik cihaz değerlendirmesi yapılmadı. Özellikle ayarlanabilir sütun ayırıcısı, sabit sütunların okuma sırası, modal dönüş odağı ve dinamik hata duyuruları kontrol edilmeli. Grid checkbox'ları CSS'te 24 px hedef kullanıyor; proje standardındaki 44 px hedefe uygun tıklanabilir kapsayıcı sağlanmalı. Bu 24 px bulgusu tek başına WCAG 2.2 AA ihlali olarak değerlendirilmez.

Kabul ölçütü: belgelenmiş ekran okuyucu/klavye/dokunma senaryoları ve sonuçları; büyütülmüş metin ile küçük ekran matrisi; bulunan sorunlara regresyon testi.

### 5. Dışa aktarma sözleşmesini netleştirmek — koruma tutarsızlığı ve kapsam sınırı

DataGrid CSV'sinde başında boşluk bulunan ` =1+1` aynen kalıyor. Eski Table'ın CSV koruması boşluk öneklerini de kontrol ediyor. Elektronik tablo uygulamasında formül yürütme bu incelemede denenmedi; istismar doğrulandı denmiyor. İki modül ortak ve testli hücre kaçışına alınmalı.

Uzak sağlayıcı kullanılırken `toCSV` yalnız yüklenmiş sayfayı dışa aktarır. Başka sayfalardaki seçili kimlikler için kayıt yükleme/ihracat sözleşmesi yok. Kabul ölçütü: “bu sayfa / tüm filtrelenmiş kayıtlar / seçilenler” kapsamı açıkça belirtilmeli; tüm sonuçlar için uygulamanın sağlayıcı callback'i olmalı. Eksik sonuç tamamlanmış dışa aktarma gibi sunulmamalı.

## P2 — yeniden kullanım ve ürün olgunluğu

6. **React/Vue adaptör kapsamı:** mevcut Grid örnekleri yalnız columns/rows alıyor. Locale, yerleşim, seçim, async provider ve olaylar dışarı açılmamış. Form örneğinde başlık sabit. Bunlar çalışan entegrasyon örnekleri; tam framework bileşen paketi değiller. Ortak prop/event sözleşmesi, kontrollü durum ve remount sırasında koruma eklenmeli. SSR/hydration ayrı doğrulanmalı.

7. **Belge ve sürüm tutarlılığı:** SECURITY.md hâlâ 0.7.x diyor; PRODUCTION.md sütun boyutlandırma olmadığını söylüyor. Güncel yetenek/limit tabloları tek kaynaktan üretilmeli. npm yayını, sürüm etiketi, release akışı, yükseltme ve destek politikası netleşmeli. GitHub kaynağı yayımlanmış olması npm yayını demek değildir.

8. **Görsel ve durum matrisi:** ekran görüntüsü almak görsel regresyon karşılaştırması değildir. Açık/koyu, yoğunluk, büyük metin, RTL, uzun içerik, loading/empty/error ve dar ekran kombinasyonlarında onaylı karşılaştırma tabanı kurulmalı. Birkaç başarılı fikstür bütün bileşen/tema birleşimlerini doğrulamıyor.

9. **Form kullanım alanları:** tekrarlanan alan grupları, uzak aramalı combobox, gecikmeli/iptal edilebilir async doğrulama ve daha genel kontrollü form entegrasyonu. Her biri klavye, hata duyurusu, iptal ve eski yanıt testiyle tamamlanmalı.

10. **Agent ile uygulama durumunun bütünlüğü:** JSON doğrulama güçlü; bütün tablo yerleşimi/düzenleme olayları ortak agent olay sözleşmesinden dışarı çıkmıyor. Olaylar, izin verilen eylemler, doğrulama hataları ve durum geri beslemesi ortaklaştırılmalı. Agent JSON'u sunucu yetkilendirmesinin yerine geçmemeli.

11. **Görsel kişiselleştirme tutarlılığı:** mevcut semantik değişkenleri bütün bileşenlerde aynı davranışla uygulayan bir durum kataloğu gerekli. Kullanıcı teması kontrastı ve yoğunluk/44 px hedefi birlikte denetlenmeli. Eski Table/Charts ve yeni DataGrid/Plot için hangi kullanımda hangisinin seçileceği açıklanmalı; yinelenen yardımcılar azaltılmalı.

## P3 — gerçek kullanım ihtiyacına göre

12. **Büyük veri:** mevcut sayfalama varken sanallaştırma ilk öncelik değil. Önce büyük veri arama/sıralama, uzun metin ve çok sütun performansı ölçülmeli; ihtiyaç oluşursa sanallaştırma, gruplama ve çoklu sıralama eklenmeli. 10 bin satır mount testi bütün işlem maliyetini ölçmüyor.

13. **Kanban sürükleme:** mevcut alternatif hareket kontrolü korunarak klavye ve dokunma eşdeğeriyle eklenmeli.

14. **Dağıtım yükü:** ana CSS girişi bütün bileşen stillerini içe alıyor; fontlar TTF. İsteğe bağlı font/stil girişleri, WOFF2 ve bileşen başına toplam CSS/font/ağ bütçeleri değerlendirilmeli. JS alt girişlerinin mevcut boyut bütçeleri olumlu.

15. **Ek diller ve stüdyo çevirisi:** öncelikle mevcut TR/EN doğruluğu tamamlanmalı. RTL altyapısı Arapça/İbranice çeviri paketi bulunduğu anlamına gelmiyor. Stüdyo ve rehberlerin editoryal çevirisi ayrı teslimat olmalı.

## Önerilen uygulama sırası

1. 0.8.x: dil devralma, locale sözleşmesi, görünüm snapshot'ı, ortak CSV kaçışı ve belge düzeltmeleri.
2. 0.9: tam adaptör seçenekleri, agent olayları, manuel erişilebilirlik ve görsel regresyon matrisi.
3. Ardından: form genişletmeleri ve ölçüme dayalı performans işleri; kararlı API/yayın koşulları sağlanınca 1.0.

Veritabanı, hesap yönetimi, kimlik doğrulama veya AI model çalıştırıcısı olmaması Muhit'in UI kütüphanesi kapsamı açısından eksiklik değildir. Bu sistemlerle güvenilir entegrasyon sözleşmeleri gereklidir.
