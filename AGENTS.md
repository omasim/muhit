# Muhit UI için çalışma kuralları

Bu paketle arayüz hazırlarken önce `schemas/ui.schema.json`, `schemas/theme.schema.json` ve `schemas/components.json` kaynaklarını okuyun. Çalışan API imzaları `types/index.d.ts`, insan odaklı kullanım örnekleri `README.md` içindedir. Tema sürümü `1`, görünüm şeması `1.1.0` (eski `1.0.0` desteklenir), paket sürümü `0.13.0` farklı sözleşmelerdir.

- Agent görünümü yalnız şemalarda tanımlı 18 bileşen türünden oluşur. Bilinmeyen alan eklemeyin. JSON'u `MuhitAgent.validate` ile denetleyin; başarısız sonucu arayüzün başarılı üretimi olarak raporlamayın.
- Eylemleri `{id,label}` olarak tanımlayın. Kart düğmesinin eylemi kullanıcı tıklamasıyla `onAction` işleyicisine ulaşır. Widget, form ve tablo durum olayları programatik güncellemeden de gelebilir; callback kullanıcı yetkisinin kanıtı değildir. Olay sözleşmesinin tek kaynağı `docs/AGENT-CONTRACT.md` dosyasıdır. JSON içine işlev, HTML, URL veya çalıştırılabilir kod eklemeyin.
- Yeni bileşenlerde sabit renk yerine semantik `--mh-*` değişkenleri kullanın. Metin ve zemin eşlerini koruyun: `--mh-text`/`--mh-surface`, `--mh-on-accent`/`--mh-accent`, `--mh-on-chart-N`/`--mh-chart-N`. Koyu tema için sabit beyaz veya açık zemin kullanmayın.
- Genel öğe sıfırlamalarını `.mh-scope` içine alın. Tüketici uygulamanın `body`, `button`, `input`, başlık veya bağlantılarını global seçiciyle değiştirmeyin. Bileşen sınıfları `mh-` önekini korur.
- Tema yapılandırmasını `normalizeConfig`, `resolve` ve `apply` üzerinden geçirin. Ham JSON'u CSS olarak birleştirmeyin. Özel tema ve büyük metin ölçeğinde taşma, metin kontrastı ve odak görünürlüğünü kontrol edin.
- Yoğunluğu `--mh-space-card` ve `--mh-cell-y`, metin ölçüsünü `--mh-text-scale` ile yönetin. Sık görünümde 44 px kontrol hedefini, 3 px odak görünürlüğünü ve hareket azaltma desteğini koruyun.
- Kullanıcı metnini `textContent` veya uygun kaçışla yerleştirin. Statik ikon SVG'leri dışındaki kullanıcı girdisini `innerHTML` ile çalıştırmayın. CSV metin hücrelerinin formül ön eki korumasını kaldırmayın.
- Kurgu kayıtları örnek olarak etiketleyin. Eksik veriyi başarı veya sıfır diye uydurmayın. Veri kaynağı, kalıcılık ve bağlantı sınırlarını doğru anlatın; paket kendi başına arka uç sağlamaz.
- DOM erişimini `mount`, `render`, `apply` gibi çağrılara bırakın. Modül yüklenirken `document` veya `window` varlığı zorunlu olmamalı. Klasik script ve ESM girişlerinin API davranışı aynı kalmalı.
- Güncelleme öncesinde veriyi doğrulayın; başarısız güncelleme mevcut görünümü bozmamalı. `destroy` ile dinleyici, timer, object URL ve alt bileşenleri temizleyin.
- Değişiklikten sonra ilgili saf yardımcıları Node'da, etkileşimi tarayıcıda kontrol edin. Açık/koyu, küçük ekran, metin ölçeği, klavye ve kullanıcı metni senaryolarını kapsayın. Kontrast ölçümünü bütün ürün için erişilebilirlik sertifikası gibi sunmayın.
- Paketlemede yalnız yeniden kullanılabilir kaynakları, şemaları, tipleri, fontları, belgeleri ve örnekleri dağıtın. `npm pack --dry-run` ile listeyi kontrol edin; fontların OFL dosyalarını ve `NOTICE` belgesini koruyun.

Kullanıcının açık güncel kapsamı bu rehberin uygulama tercihlerinden önce gelir. Büyük API veya şema değişikliklerinde sürümü ve örnekleri birlikte güncelleyin.


0.3.0: MuhitWidgets 10 yeni tür sağlar; kart, metrik, not, tablo ve grafikle birlikte adaptör toplam 18 tür destekler. [Etkileşim bileşenleri](docs/WIDGETS.md) ve schemas/widgets.schema.json sözleşmesini okuyun. Widget olayları id, componentId ve value taşır; kalıcılık uygulamada yönetilir.


## Muhit sabit logo standardı

Onaylı Muhit logosu **3.1** sürümüdür. Ana dosya `assets/brand/muhit-logo.svg`, sembol `assets/brand/muhit-symbol.svg`; kayıt `assets/brand/brand.json`, dosya özeti `assets/brand/brand-lock.json` içindedir.

- Üç akışkan yay, ortada açık alan, hafif dolgun gövdeler ve yumuşak incelen uçlar korunur.
- Logoyu yeniden çizmeyin, AI ile yeniden üretmeyin, eğrileri veya wordmark harf aralıklarını değiştirmeyin. Ana SVG dosyalarını kullanın.
- Boyutlandırma orantılıdır. Döndürme, esnetme, gölge, doku ve parçaları ayrı konumlandırma uygulanmaz.
- Stüdyoda sembol `--mh-link`, yazı `currentColor` olabilir. Statik kullanımda ana, koyu zemin veya tek renk SVG sürümünü seçin.
- Sembol en az 24 px, ana logo 110 px, UI imzası 124 px; koruma alanı sembol kutusunun dörtte biridir.
- Değişiklik yalnız kullanıcının açık isteğiyle yeni sürüm olarak yapılır. Önceki sürümler korunur. Dosya tutarlılığı `npm run check:brand` ile kontrol edilir.

## 0.6 form ve tercih API’leri

`MuhitForm` için `schemas/form.schema.json` ve `docs/FORMS.md` kullanın. 1.1.0 şemasında form, datagrid ve plot türleri de kullanılabilir. Kayıt callback’i yoksa veri kaydedilmiş sayılmaz. `MuhitPreferences` yalnız açık save çağrısıyla yerel tema tercihlerini saklar; kişisel form verilerini bu depoya koymayın.

0.9: schemas/capabilities.json güncel yetenek kaynağıdır; docs/COVERAGE.md bu kaynaktan üretilir. Yeni form bağlantıları docs/ADVANCED-FORMS.md içinde. Grid locale mount seçeneğidir; dil değişiminde getView/restoreView kullanın. Uzak CSV kapsamını açıkça belirtin.

İkon standardı: docs/ICONS.md ve schemas/icons.json. Sayfa standardı: docs/PAGE-STANDARDS.md, schemas/pages.json ve schemas/page.schema.json. Yeni sayfalarda izinli ikon adlarını ve altı yerleşim tarifini kullanın. Bunlar mevcut 18 agent bileşen türünü değiştirmez.
