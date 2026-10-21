> Tarihsel sürüm kaydıdır. Güncel kapsam ve kanıt: [CURRENT.md](CURRENT.md).

# Muhit 0.7 — tamamlanan geliştirmeler

## Hata düzeltmeleri

- DataGrid düğmeleri type=button kullanır; dış form gönderilmez.
- Form başlangıç/setValues aşamasında DOM'da temsil edilemeyen tarih ve seçimler reddedilir; eski değerler korunur. Tek satırlı alanda satır sonu reddedilir, e-posta çevresindeki boşluklar normalize edilir.
- Sunucu hataları alan bazında tutulur; ilgisiz düzenleme hatayı silmez.

## Form

`disabled`, metin/sayı/tarih için `readOnly`, `{visibleWhen:{field,equals}}` koşulu, `onChange(values,{dirty})` ve `validate(values)` özel alanlar arası doğrulama desteklenir. Görünmeyen/devre dışı alanlar doğrulamadan çıkar; değerleri getValues ve gönderim kopyasında korunur. Kaydetme politikasına göre uygulama bunları filtrelemelidir. Koşul yalnız başka alanın değerine eşitlik kontrolüdür; kod çalıştırmaz.

Taslaklar otomatik saklanmaz. onChange ile uygulamanın seçtiği taslak deposuna bağlanır; isDirty ile yönlendirme uyarısı kurulabilir. workspace örneği kayıt değiştirirken kaydedilmemiş değişiklikleri korur.

## Genel tablo

- `selectable`, `getSelected`, `clearSelection`, `onSelectionChange`: sayfalar arasında ID tabanlı seçim.
- `state.filters`: sütun başına metin içerme filtresi; locale arama ve sayı biçimine uygulanır.
- `setVisibleColumns(keys)` ve Sütunlar menüsü: en az bir sütun kalır.
- `columns[].editable`, `updateCell`, `onRowsChange`: yerel veride tür doğrulamalı düzenleme. Uzak sağlayıcının kayıt işlemi uygulamaya aittir.
- `toCSV({selectedOnly})`: görünür sütunlar; yerelde filtrelenmiş sonuçlar, uzak sağlayıcıda yalnız yüklenmiş sayfa. Gizli/uzak tüm veriyi indirdiğini iddia etmez. Formül öneki korumalı UTF-8 BOM CSV.
- Türkçe ve İngilizce kontrol metinleri; locale parametresi. Tüm eski widget'ların dili bu sürümde değiştirilmez.

## Genel grafik

`MuhitPlot` başlık, birim, etiketler ve 1–6 seriyi kabul eder. Çizgi/çubuk görünümü, negatif değerler, sıfır ve eksik `null` değerler desteklenir. Eksik veri çizgide boşluk bırakır. Seri uzunlukları etiketlerle eşleşmeli; 200 nokta sınırı vardır. Her grafik tek birim kullanır; farklı birimler ayrı grafiklere ayrılır.

Legend düğmeleri seriyi açar/kapatır. Eşdeğer veri tablosu ve toCSV tüm kaynak verilerini korur. SVG etiketlidir; ayrıntılı değerlerin erişilebilir karşılığı tablodur.

## Agent

`schemaVersion:'1.1.0'` ile `form`, `datagrid`, `plot` eklendi; toplam 18 tür. Eski 1.0 tanımları çalışır. Form `onAction({id:'submit',componentId,value,signal})` sonucunu bekler; alan hataları `{errors:{alan:mesaj}}` ile döner. Callback olmadan kaydedilmiş gibi davranmaz. Tablo seçim eylemi `selection` kimliği taşır. Tanımlarda URL veya çalıştırılabilir kod yoktur.

## Paketleme

`muhit-ui/forms`, `/data-grid`, `/plot`, `/theme`, `/preferences`, `/widgets`, `/agent`, `/components`, `/table`, `/charts` alt girişleri vardır. ESM sürümleri bağımlılıklarını açık import eder; globalThis API'si oluşturmaz. Klasik src/*.js dosyaları eski global API'yi korur. React/Vue örnekleri form ve widget yaşam döngüsüyle genişletilmiştir.

## Kalan sınırlar

Hücre düzenleme yereldir. Sanallaştırma, sütun sürükleme/boyutlandırma/sabitleme, tekrarlanan form grupları, uzak seçenekli combobox ve Kanban sürükleme henüz yoktur. Tam ürün dil sözlüğü, manuel ekran okuyucu doğrulaması, gerçek iOS/Android cihaz matrisi ve framework SSR/hydration testi tamamlanmış sayılmaz. Test tarayıcısı WebKit, gerçek Safari/iPhone sertifikası değildir.
