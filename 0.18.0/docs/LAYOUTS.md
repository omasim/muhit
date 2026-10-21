# Kartlar, sayfalar ve tablo

Güncel sürüm ve doğrulama: [CURRENT.md](CURRENT.md).

`styles/index.css` artık `layouts.css` dosyasını içerir. Yeni sınıflar mevcut bileşenleri tamamlar; agent görünümüne yeni bileşen türü eklenmemiştir. HTML sayfa tarifleri uygulama tarafından birleştirilir.

- `mh-card-grid`: duyarlı kart koleksiyonu.
- `mh-card--horizontal`: yatay kaynak kartı; dar ekranda alt alta geçer.
- `mh-card__meta`, `mh-card__eyebrow`: kaynak bağlamı, tür ve durum bilgisi.
- `mh-page`, `mh-page__header`, `mh-page__body`, `mh-page__main`, `mh-page__aside`: çalışma alanı ve ayrıntı sayfası iskeleti.
- `mh-page__empty`: açıklayıcı boş durum.

Bağımsız örnek: `examples/pages.html`. Stüdyo > Bileşenler > Sayfalar altında çalışma alanı, koleksiyon ve ayrıntı tarifleri bulunur. Görev kartı ve kaydetme örnekleri oturum içidir; sunucu kaydı yoktur.

## Yeni tema alanları

| Alan | Seçenekler | Varsayılan |
| --- | --- | --- |
| cardSurface | plain, tinted, outline | plain |
| layoutGap | compact, balanced, airy | balanced |
| tableRows | plain, striped | plain |
| tableHeader | static, sticky | static |

Tümü normalizeConfig, apply, JSON/CSS dışa aktarımı ve agent tema doğrulaması tarafından desteklenir. Önceki yapılandırmalarda eksik alanlar varsayılanlarla tamamlanır. Yeni alanları içeren dosyalar eski motorlarda reddedilir; tüketicide 0.4.0 kullanın. Tema sürümü 1, agent görünüm şeması 1.0.0 olarak kalır.

Kart yüzeyi standart kartlara uygulanır; özel sage/ink kartları kendi semantik yüzeylerini korur. Sabit tablo başlığı en yakın kaydırma kapsayıcısına bağlıdır. Şeritler dekoratiftir; satır bilgisi renk dışında metinle korunur.

Tablonun yeni Sorumlu filtresi veri içindeki kişilerden oluşur; arama ve durum filtresiyle birlikte çalışır. Filtrelenmiş CSV aynı sonucu kullanır. setRows sonrasında kişiler yenilenir; artık bulunmayan kişi filtresi temizlenir. Hiçbir kayıt dışarı gönderilmez.
