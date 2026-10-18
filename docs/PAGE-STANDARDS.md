# Muhit sayfa yapı ve yerleşim standardı · 1.0

Bileşenlerin ortak bir sayfa düzeni içinde nasıl kullanılacağını tanımlar. Aynı içerik sırası masaüstünde, telefonda ve RTL görünümünde korunur. Önce kullanıcı görevi ve bilgi önceliği seçilir; sonra uygun tarif uygulanır.

## Ortak sayfa anatomisi

1. Klavyeyle görünür “İçeriğe geç” bağlantısı.
2. Uygulama kimliği ve adlandırılmış ana gezinme. Aktif bağlantı `aria-current=page` taşır.
3. Uygulama çubuğu: kapsam/çalışma alanı ve genel kontroller.
4. Tek `main`, tek `h1`; içerik yolu, başlık ve kısa açıklama.
5. Gerekirse görev araç çubuğu; sonra ana içerik ve destekleyici bölge.
6. Kayıt/işlem durumunu açıklayan geri bildirim ve gerektiğinde sayfa alt bilgisi.

Başlık yanında en fazla bir birincil eylem. İkincil işlemler ayrı araç çubuğunda; yıkıcı işlem sıradan gezinme gibi sunulmaz. Görsel sıra CSS order ile DOM sırasından ayrılmaz. Bir uygulama kabuğunun içinde ikinci main oluşturulmaz: gömülü kullanımda örnek kabuktan yalnız içerik bölümleri alınır.

## Izgara ve ölçüler

| Ekran | Izgara | Davranış |
|---|---|---|
| 0–767 px | 4 sütun | Bölgeler tek akış; ana içerikten sonra destekleyici içerik |
| 768–1199 px | 8 sütun | Metrikler/yarım bölgeler 4 sütun; ana içerik ve bağlam 8 sütun |
| 1200 px ve üzeri | 12 sütun | Ana içerik 8, bağlam 4; yarım bölge 6, metrik 3 |

Yan gezinme 1024 px altında üst bölgeye taşınır ve bağlantılar satıra yayılır. İlk sürümde otomatik gizlenen/offcanvas menü yoktur; odak tuzağı oluşturmaz. İç tablo kendi bölgesinde yatay kayar, belge gövdesi taşmaz. `minmax(0,1fr)` ve `min-width:0` daralmayı sağlar.

Sayfa kenarı `clamp(16px,3vw,40px)`, bölge aralığı `clamp(16px,2vw,32px)`. Kart içi boşluk mevcut `--mh-space-card` tokenından gelir. İçerik genişliği standartta `--mh-content-width` (varsayılan 1240 px), geniş veri görünümünde 1600 px, okuma kabuğunda 80ch; metin satırı en fazla 65ch. Genişlik üst sınırdır; küçük ekranda zorunlu genişlik değildir.

## Altı tarif

| Tarif | Kullanım | Bölge sırası | Kaçınılacak durum |
|---|---|---|---|
| overview | Genel bakış | Metrikler → öncelikli içerik → bağlam | Her metriği birincil eyleme çevirmek |
| collection | Kayıt listesi | Başlık → arama/filtre → tablo → sayfalama | Bütün tabloyu sabit genişliğe zorlamak |
| detail | Kayıt/proje detayı | Ana içerik → kararlar → bağlam | Kritik kararı yalnız sağ panele koymak |
| settings | Tercih/hesap ayarları | Alan grupları → kayıt durumu → yardım | Her input değişiminde sessiz kayıt |
| workspace | Kanban/iş akışı | İş kapsamı → durum sütunları | Sürüklemeyi tek kullanım yolu yapmak |
| editorial | Rehber/uzun metin | Özet → sıralı başlıklar → içerik | Okuma satırını ekran boyunca uzatmak |

Canlı ve kopyalanabilir örnekler: `examples/foundations/{recipe}.html`. Ortak davranış: `pages.mjs`. Stil: `styles/pages.css`. Renk/fontlar mevcut tema sisteminden gelir. Ek stil isteğe bağlıdır; tam CSS girişi bu sayfa kabuğunu otomatik yüklemez.

```js
import 'muhit-ui/styles';
import 'muhit-ui/styles/pages.css';
```

```html
<div class="mh-scope">
  <main class="mh-content" id="main" data-width="standard">
    <header class="mh-content__header"><h1>Proje detayı</h1></header>
    <div class="mh-region-grid">
      <section class="mh-region mh-region--main"><h2>İçerik</h2></section>
      <aside class="mh-region mh-region--rail"><h2>Bağlam</h2></aside>
    </div>
  </main>
</div>
```

## Veri ve durum standartları

- Yükleniyor: önceki verinin yeni sorguya aitmiş gibi gösterilmemesi; bölgenin busy durumu.
- Boş: kayıt olmadığını anlatan başlık ve varsa gerçek bir sonraki adım; uydurma başarı metriği yok.
- Hata: ilgili bölge içinde açıklama ve yeniden deneme; sayfanın diğer sağlam bölgelerini koru.
- Kaydedilmemiş form: taslak/başlangıç ayrımı; başarılı kayıt olmadan tamamlandı bildirimi yok.
- Yetki yok: görünüm ipucu izin kontrolünün yerine geçmez; uygulama sunucuda doğrular.

## AI ve uygulama sınırı

`schemas/pages.json` tarifleri ve ölçüleri, `schemas/page.schema.json` seçim metaverisini tanımlar. Örnek:

```json
{"version":"1.0.0","recipe":"detail","title":"Proje detayı","width":"standard","dir":"ltr"}
```

Bu metaveri doğrudan render edilen yeni bir agent JSON türü değildir. Uygulama seçilen tarifin HTML bölgesine mevcut Muhit bileşenlerini bağlar. Şemadaki `primaryActionId` bir kimliktir, işlev veya URL değildir. Agent rastgele CSS ölçüleri/HTML üretmek yerine tarifi seçer; uygulama bilinmeyen tarifleri reddeder. Bu ilk sürüm CSS ve HTML tarifleri sağlar; rota yönetimi, kimlik doğrulama, sunucu verisi ve tam sayfa JSON renderer sağlamaz.

## Kabul ölçütleri

390 / 768 / 1440 px genişlikte sayfa gövdesi taşmamalı; koyu tema ve RTL'de kenarlık/boşluk yönleri korunmalı. Klavye ile içeriğe geçiş, gezinme ve gerçek form/tablo/Kanban işlemleri çalışmalı. Otomatik erişilebilirlik kontrolü gerçek ekran okuyucu incelemesiyle tamamlanmalıdır. İkon ve sayfa standartları logo kilidini değiştirmez.

## Mevcut örneklerin geçişi · 0.13

Stüdyo ve bağımsız HTML, React, Vue örnekleri aynı `mh-content`, sayfa kenarı ve 4/8/12 sütun ölçülerini kullanır. Mevcut `mh-page` sınıfları gömülü sayfa örnekleri için korunur; ana/yan bölge 8/4 sütundur, 1200 px altında sıralı akışa geçer. Bu gömülü örnekler yeni bir main oluşturmaz. Bileşenlerin kendi tablo/Kanban taşma alanları korunur. Örnek stilinde body ayarı olabilir; yeniden kullanılabilir sayfa CSS’i global body değiştirmez.
