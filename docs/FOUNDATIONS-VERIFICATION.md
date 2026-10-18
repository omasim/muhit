> Tarihsel sürüm kaydıdır. Güncel kapsam ve kanıt: [CURRENT.md](CURRENT.md).

# Muhit 0.12 · ikon ve sayfa temelleri doğrulaması

Tarih: 18 Ekim 2026. Bu kayıt yerel 0.12.0 paketi içindir; uzak CI veya npm yayını sonucu değildir.

## Teslim edilen kapsam

- Muhit Icons 1.0: 48 bağımsız SVG, aynı geometrileri kullanan `MuhitIcons` API’si, katalog, izinli adlar manifesti ve kullanım kuralları.
- Sayfa standardı 1.0: genel bakış, koleksiyon, detay, ayarlar, çalışma alanı ve editoryal sayfa tarifleri. İsteğe bağlı sayfa CSS’i, 4/8/12 sütun, üç içerik genişliği, RTL ve mevcut tema desteği.
- AI için ikon adları ve sayfa seçim metaverisi. Yeni bir agent renderer veya sunucu altyapısı eklenmedi.
- Logo 3.1 korunur. Eski `Muhit.icon()` çağrıları korunur; yeni ikon ailesine bütün geçmiş ekranları taşıma bu sürümün kapsamı değildir.

## Geçen kontroller

| Kontrol | Sonuç |
|---|---|
| Birim testleri | 69/69 |
| Paket tüketicisi TypeScript | 17 giriş, NodeNext ve Bundler |
| Logo kilidi | 14 dosya |
| Yetenek belgesi tutarlılığı | Başarılı |
| Dağıtım bütçeleri | Başarılı; isteğe bağlı pages.css 4.160 bayt |
| Chrome, Firefox, WebKit | Her tarayıcıda 7 sayfa × 3 ekran genişliği = 21 birleşim |
| Yeni sayfaların otomatik erişilebilirliği | Açık tema ve koyu RTL görünümünde axe ihlali yok |
| İkon kataloğu | Açık/koyu tema, arama, boyut seçimi, SVG indirme |
| Etkileşimler | İçeriğe geç bağlantısı, tablo araması, örnek form kaydı |

Tarayıcı senaryosu: `tests/browser/foundations.mjs`. Ekran genişlikleri 390, 768 ve 1440 piksel. macOS WebKit’te bağlantılara klavye erişimi için sistemin Option+Tab davranışı kullanılır; bağlantı Enter ile ana içeriğe odak aktarır. Testlerde hareket azaltılır; tema geçişinin ara renkleri yerine tamamlanmış durum kontrol edilir.

## Sınırlar

Otomatik axe sonucu, ekran okuyucuyla insan incelemesi veya fiziksel cihaz kabul testi yerine geçmez. Bu kayıt yeni temellerin testini kapsar; mevcut tüm ürün akışlarının yeniden uçtan uca test edildiği anlamına gelmez. Sayfa örneklerinin verileri demodur. Gerçek kimlik doğrulama, izin, yönlendirme ve sunucuya kayıt uygulamanın sorumluluğundadır.
