# Temalar ve semantik değişkenler

Muhit’in renkleri bileşenin görevine göre adlandırılır. `--mh-surface` kart zemini, `--mh-text` okunacak metin, `--mh-accent` eylem vurgusudur. Böylece bileşen HTML'i değişmeden açık/koyu görünüm ve kişisel vurgu kullanılabilir. Bir rengin adı yerine görevini seçmek, yeni paletlerde metin–zemin ilişkisini korur.

## Sekiz başlangıç paleti

Aşağıdaki renkler presetlerin **açık görünüm başlangıç değerleridir**. Koyu görünüm ve kontrast için çözümlenen son değerleri `MuhitTheme.resolve(config).tokens` üzerinden okuyun. `presets[].colors` tema örneğini tanıtır; tam token tablosu değildir.

| Preset    | Ad     | Arka plan | Ana metin başlangıcı | Varsayılan vurgu |
| --------- | ------ | --------- | -------------------- | ---------------- |
| `grove`   | Koru   | `#F5F4EF` | `#202A25`            | `#356752`        |
| `clay`    | Toprak | `#FAF3ED` | `#352A24`            | `#9E533A`        |
| `tide`    | Kıyı   | `#F0F5F5` | `#203338`            | `#266976`        |
| `atelier` | Atölye | `#F5F2F8` | `#312B3C`            | `#715486`        |

Diğer paletler: `sand` / Kum, `moss` / Yosun, `plum` / Erguvan ve `slate` / Arduvaz. Güncel renk değerleri `MuhitTheme.presets` içinde yer alır.

`styles/tokens.css` JavaScript olmadan Koru/açık varsayılanlarını ve yerel fontları sağlar. Bu dosya `:root` üzerinde adları `--mh-` ile başlayan değişkenler tanımlar; uygulamanın `body` stilini ayarlamaz. Muhit’in öğe sıfırlamaları `.mh-scope` sınırında kalır. Aynı sayfada birden fazla kapsam farklı tema kullanabilir.

## Yapılandırma

```js
const preferences = {
  version: 1,
  preset: "tide",
  mode: "dark",
  accent: "#8FC5AE",
  font: "editorial",
  density: "comfortable",
  radius: "soft",
  scale: 1.125,
  motion: "reduced",
  border: "strong",
};
const resolved = MuhitTheme.resolve(preferences);
console.log(resolved.config, resolved.tokens);
```

| Alan      | Kabul edilen değerler                | Varsayılan    |
| --------- | ------------------------------------ | ------------- |
| `version` | `1`                                  | `1`           |
| `preset`  | `grove`, `clay`, `tide`, `atelier`   | `grove`       |
| `mode`    | `light`, `dark`                      | `light`       |
| `accent`  | `null` veya altı basamaklı `#RRGGBB` | `null`        |
| `font`    | `editorial`, `humanist`, `system`    | `editorial`   |
| `density` | `comfortable`, `compact`             | `comfortable` |
| `radius`  | `soft`, `round`, `square`            | `soft`        |
| `scale`   | `1`, `1.125`, `1.25`                 | `1`           |
| `motion`  | `system`, `reduced`                  | `system`      |
| `border`  | `subtle`, `strong`                   | `subtle`      |

Eksik alanlar varsayılanlarla tamamlanır. Bilinmeyen alan, yanlış tür ve enum dışı değer reddedilir. `accent:null` seçilen preset ve modun vurgusunu kullanır. Özel vurgu korunur; karşıt metin, bağlantı ve odak renkleri uygun eşler olarak hesaplanır. `mode` otomatik işletim sistemi seçimi yapmaz; bu tercihi uygulama yönetir. `normalizeConfig()` normalize edilmiş dondurulmuş yapılandırma, `resolve()` buna ek olarak dondurulmuş token sözlüğü döndürür. Girdi nesnesi değiştirilmez.

## Renk eşleri

| Değişkenler                               | Kullanım                                           |
| ----------------------------------------- | -------------------------------------------------- |
| `--mh-bg`                                 | Kapsamın ana zemini                                |
| `--mh-surface`, `--mh-surface-2`          | Kart/alan zemini ve ikincil yüzey                  |
| `--mh-text`, `--mh-muted`                 | Ana ve ikincil okunabilir metin                    |
| `--mh-border`, `--mh-border-strong`       | Dekoratif ayrım ve belirgin kontrol sınırı         |
| `--mh-accent`, `--mh-on-accent`           | Vurgulu düğme/alan ve onun üzerindeki metin        |
| `--mh-accent-soft`                        | Hafif vurgulu içerik zemini                        |
| `--mh-link`, `--mh-focus`                 | Bağlantı metni ve klavye odağı                     |
| `--mh-success`, `--mh-success-bg`         | Başarı metni ve zemini                             |
| `--mh-warning`, `--mh-warning-bg`         | Uyarı metni ve zemini                              |
| `--mh-danger`, `--mh-danger-bg`           | Hata metni ve zemini                               |
| `--mh-info`, `--mh-info-bg`               | Bilgi metni ve zemini                              |
| `--mh-chart-1`…`4`, `--mh-on-chart-1`…`4` | Grafik dolgu/çizgisi ve aynı renk üzerindeki metin |
| `--mh-backdrop`, `--mh-shadow-overlay`    | Modal arka perdesi ve üst katman gölgesi           |

Vurgulu yüzeyde `--mh-text` yerine `--mh-on-accent`, grafik dolgusu üzerinde ilgili `--mh-on-chart-N` kullanın. Durumu yalnız renk ile anlatmayın. `border:subtle` dekoratif sınırları hafif tutar; kontrol kenarları `--mh-border-strong` kullanabilir. `border:strong` genel sınırı da güçlü eşe taşır.

```css
.my-panel {
  background: var(--mh-surface);
  color: var(--mh-text);
  border: 1px solid var(--mh-border);
  border-radius: var(--mh-radius-md);
  padding: var(--mh-space-card);
}
.my-panel__note {
  color: var(--mh-muted);
}
.my-panel__action {
  min-height: 44px;
  background: var(--mh-accent);
  color: var(--mh-on-accent);
}
.my-panel__action:focus-visible {
  outline: 3px solid var(--mh-focus);
  outline-offset: 3px;
}
```

## Yazı, yoğunluk ve hareket

`--mh-font-body` kontrol/gövde, `--mh-font-heading` başlık içindir. `editorial`, Manrope gövde ile Source Serif 4 başlık kullanır; `humanist` ikisinde Manrope; `system` sistem sans ailesi kullanır. `--mh-font-sans` ve `--mh-font-serif` yerel aileleri; `--mh-font-ui` ve `--mh-font-display` seçili rolleri sunar. Font dosyalarının göreli yerlerini ve OFL lisanslarını koruyun.

| Tercih                | Üretilen değer                                                                 |
| --------------------- | ------------------------------------------------------------------------------ |
| `density:comfortable` | `--mh-space-card:24px`; `--mh-cell-y:16px`                                     |
| `density:compact`     | `--mh-space-card:16px`; `--mh-cell-y:10px`                                     |
| `radius:soft`         | sm/md/lg: `6px / 10px / 16px`                                                  |
| `radius:round`        | sm/md/lg: `10px / 18px / 24px`                                                 |
| `radius:square`       | sm/md/lg: `0px / 0px / 0px`                                                    |
| `scale`               | `--mh-text-scale`: `1`, `1.125` veya `1.25`                                    |
| `motion:system`       | `--mh-motion:160ms ease`; sistemin hareket azaltma tercihi CSS ile desteklenir |
| `motion:reduced`      | `--mh-motion:0ms`; temalı kapsamda animasyon/geçiş azaltılır                   |

Yoğunluk düzen boşluğunu etkiler; native eylemlerde 44 px hedef korunur. Metin ölçeği bileşen font hesaplarına katılır; tarayıcı zoom'unu devre dışı bırakmaz. Uzun metin, büyük ölçek ve dar kapsayıcı birleşimini kendi yerleşiminizde sınayın. Grafikler kapsayıcı sorgularıyla uyarlanır; çizgi ve veri tablosu kendi kaydırma bölgesini kullanabilir.

## Belge kökü veya yerel kapsam

```js
// Bütün belge için tokenları :root öğesine uygular.
MuhitTheme.apply({ preset: "grove", mode: "light" });

// Yalnız bir uygulama parçası için.
const panel = document.getElementById("report");
MuhitTheme.apply({ preset: "atelier", mode: "dark" }, panel);
```

```html
<section id="report" class="mh-scope my-report">
  <article class="mh-card">Rapor içeriği</article>
</section>
<style>
  .my-report {
    background: var(--mh-bg);
    color: var(--mh-text);
    padding: 24px;
  }
</style>
```

`apply` değişkenleri seçilen öğenin inline stiline yazar; ayrıca `data-mh-root`, `data-mh-mode`, `data-mh-density`, `data-mh-motion` özelliklerini ayarlar. Bir kapsayıcının zeminini veya boyutunu kendiliğinden kurmaz; örnekteki gibi kendi kapsamınızda boyayın. `MuhitAgent` kendi `.mh-agent` iç kökünü oluşturup bu zemini sağlar. Agent'te `theme` atlanırsa üst tokenlar devralınır; `theme:{}` açıkça varsayılanları uygular. Kısmi config üst config'e yama değildir; eksikleri varsayılanlardan tamamlanır.

Yerel temalı toast için `Muhit.toast(message,{container:panel})` kullanın. Dialog'u aynı kapsamın içine koyun. Üst öğeye tema uygulanması, daha aşağıda açıkça temalanmış bir alt kökün tokenlarını geçersiz kılmaz. `apply` için geri alma API'si yoktur; uygulama önceki config'i saklayıp yeniden uygulayabilir. Stil sınıfları yerleşimi, tema API'si tokenları yönetir.

## Kişisel tercihi saklama ve dışa aktarma

```js
const configText = MuhitTheme.toJSON(preferences);
const restored = MuhitTheme.fromJSON(configText);
const stylesheet = MuhitTheme.toCSS(restored);
const tokenMap = MuhitTheme.resolve(restored).tokens;
```

`toJSON` yalnız tam normalize edilmiş config'i verir; renk tablosu veya uygulama verisi içermez. `fromJSON` JSON ayrıştırma ve yapılandırma hatalarını fırlatır. `toCSS` hesaplanan tokenları ve native kontrol renk şemasını `:root { … }` bloğunda verir; seçili/sistem hareket azaltma kurallarını `.mh-scope` ve `[data-mh-root]` kapsamları için ekler. Bu dosyayı `styles/index.css` sonrasında yükleyin. Yeni bir paket sürümü farklı hesaplama yapabileceğinden tekrar üretilebilir görünüm için paket sürümünü config ile birlikte kaydedin.

Kapsamlı CSS üretmek için `resolve().tokens` kullanın; seçiciyi uygulamanız belirlesin:

```js
const { tokens } = MuhitTheme.resolve(preferences);
const scopedCSS =
  ".my-report {\n" +
  Object.entries(tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n") +
  "\n}";
```

Bu örnekte seçici sabittir ve değerler doğrulanan motor çıktısıdır. Ham kullanıcı girdisini CSS'e birleştirmeyin. Tam `toCSS` çıktısı hareket ve renk şeması kurallarını da içerir; `apply` tarafından yazılan `data-mh-*` özelliklerine ihtiyaç duymaz. Yukarıdaki elle üretilmiş **yalnız token** kapsamı bu ek kuralları taşımaz: native kontroller için `data-mh-mode="dark"`, azaltılmış hareket için `data-mh-motion="reduced"` gibi config ile eşleşen özellikleri de ekleyin.

Motor tercihi saklamaz. `localStorage` veya bir hesap profili kullanmak uygulamanın tercihidir; okuma/yazma hatalarını yakalayın ve başarısız kaydı saklanmış diye göstermeyin. Config içe aktarımı font URL'si, script veya keyfi CSS kabul etmez.

## Kontrast denetimi ve uyumluluk adları

`MuhitTheme.audit(config)` seçili token eşleri için 18 kayıt döndürür: ana/ikincil metin, bağlantı, odak, vurgu üzeri, güçlü sınır, dört durum, dört grafik ve bunların karşıt metinleri. `ratio` yuvarlanmamış sonuçtur; `pass` bunun eşiğe karşılaştırılmasıdır. Normal metin çiftleri 4.5, odak/güçlü sınır/grafik renkleri 3 eşiğiyle değerlendirilir. Denetim dekoratif `--mh-border` için 3 oranı vaat etmez. `contrast('#112233','#FFFFFF')` iki altı basamaklı rengin oranını hesaplar.

Bu ölçüm gerçek DOM'u, arka plan görsellerini, saydamlık katmanlarını, kullanıcı CSS'ini veya odak akışını taramaz; tüm ürün için WCAG uygunluk belgesi değildir. Özel CSS ile bir token çiftini değiştirirseniz `audit(config)` o override'ı görmez. Yeni çiftleri ayrıca ölçün ve gerçek ekranda sınayın.

Önceki sınıf sözleşmelerini koruyan adlar eş değer token çıktılarıdır; yeni bileşenlerde sağ sütundaki roller tercih edilir:

| Uyumluluk adı                     | Semantik karşılığı                  |
| --------------------------------- | ----------------------------------- |
| `--mh-sand`, `--mh-ink`           | `--mh-bg`, `--mh-text`              |
| `--mh-line`, `--mh-line-strong`   | `--mh-border`, `--mh-border-strong` |
| `--mh-logo-ink`, `--mh-logo-sage` | `--mh-accent`, `--mh-chart-1`       |
| `--mh-sage`, `--mh-sky`           | `--mh-accent-soft`, `--mh-info-bg`  |
| `--mh-terra`, `--mh-ochre`        | `--mh-chart-4`, `--mh-chart-3`      |

Adında `logo` geçmesi bir logo varlığı veya marka hakkı tanımlamaz. Çözümlenen alias değerleri aynı anda yazılır; tek bir semantik değişkeni sonradan elle override etmek alias değerlerini otomatik güncellemez. Tema bütünlüğü için `apply`/`resolve` üzerinden üretin.

Tam seçenek sözleşmesi [tema şemasında](../schemas/theme.schema.json), API imzaları [tip dosyasında](../types/index.d.ts), yerleşim tarifleri [bileşen rehberinde](COMPONENTS.md) bulunur.


## 0.3.0 kişiselleştirme seçenekleri

| Alan | Değerler |
| --- | --- |
| `preset` | `grove`, `clay`, `tide`, `atelier`, `sand`, `moss`, `plum`, `slate` |
| `mode` | `light`, `dark` |
| `font` | `editorial`, `humanist`, `system`, `book` |
| `density` | `comfortable`, `compact`, `spacious` |
| `radius` | `soft`, `round`, `square`, `organic` |
| `scale` | `1`, `1.125`, `1.25` |
| `motion` | `system`, `reduced` |
| `border` | `subtle`, `strong` |
| `elevation` | `flat`, `soft`, `raised` |
| `buttonStyle` | `solid`, `soft`, `outline` |
| `controlSize` | `sm`, `md`, `lg` |
| `headingScale` | `0.9`, `1`, `1.15` |
| `lineHeight` | `1.45`, `1.65`, `1.85` |
| `contentWidth` | `focused`, `balanced`, `wide` |
| `borderWidth` | `1`, `2` |
| `iconWeight` | `1.25`, `1.5`, `2` |
| `accentIntensity` | `soft`, `balanced`, `vivid` |
| `chartPalette` | `natural`, `contrast`, `mono` |

64 token Theme.resolve(config).tokens ile alınır. `contentWidth`, `.mh-container` kullanan yerleşimlerin azami genişliğidir; dar ekranlarda kapsayıcıya uyar. Küçük ve orta kontrollerde 44 px dokunma alanı korunur, yatay boşluk değişir; büyük kontrolde yükseklik 52 px olur. `book` metinlerde Source Serif 4 kullanır. Eski eksik yapılandırmalar yeni varsayılanlarla tamamlanır. JSON ve CSS dışa aktarımı bütün alanları taşır.
