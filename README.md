# Muhit 0.22.0-beta.1

Yerel saat/tekrar/kapasite takvimi, seçili metin ve güvenli medya, kontrollü JSON aktarımı ve prepared/remote search. Ayrıntılar: docs/P3-0.22.md ve MIGRATION-0.22.md. Beta; koşullu servis ve manuel kabul sınırları korunur.

# Muhit 0.21.0-beta.1

Veri yarışı ve taslak düzeltmeleri, sürümlü snapshot, açık saklama tercihi, TR/EN sayfalar ve servis referansı. [Geçiş](docs/MIGRATION-0.21.md) · [Entegrasyon](docs/INTEGRATION-0.21.md) · [Doğrulama](docs/VERIFICATION-0.21.md). Aşağıdaki sürümler tarihsel kayıttır.

# Muhit 0.20.0-beta.1

Takvim, blok belge düzenleyicisi, sürüm karşılaştırması, gruplu/ertelenebilir bildirimler ve iki sektör sayfası. [API ve sınırlar](docs/PLANNING-0.20.md) · [Doğrulama](docs/VERIFICATION-0.20.md) · [Tasarım–kod](docs/DESIGN-CODE-0.20.md). Önceki sürüm notları aşağıda tarihsel bağlamdır.

> Güncel yerel sürüm: **0.19.0-beta.1**. [Ürün modülleri](docs/PRODUCT-SYSTEM-0.19.md), [geçiş](docs/MIGRATION-0.19.md) ve [test kapsamı](docs/VERIFICATION-0.19.md). Registry yayını yapılmadı.

## 0.12 · Muhit Icons ve sayfa yerleşim standardı

[Çalışan dil/sütun örneği](examples/international.html) · [Sütun API](docs/COLUMN-LAYOUT.md) · [Dil API](docs/INTERNATIONALIZATION.md) · [Sürüm notları](CHANGELOG.md) · [Gelişmiş alanlar](examples/advanced.html) · [Görsel katalog](examples/visual-catalog.html)

[![Verify Muhit](https://github.com/omasim/muhit/actions/workflows/verify.yml/badge.svg)](https://github.com/omasim/muhit/actions/workflows/verify.yml)

# Muhit UI

**0.18.0 · HTML, CSS ve JavaScript ile tema uyarlayan bileşenler.**

Muhit; kartları, formları, tabloları ve grafikleri ortak bir görsel dille kurmanıza yardımcı olur. Klasik script olarak derleme olmadan çalışır; ESM girişi ve TypeScript tanımları da bulunur. Tema yapılandırması renk, yazı ailesi, yoğunluk, köşe, metin ölçeği ve hareket tercihini birlikte yönetir. JSON şemasına uyan bir görünüm, aynı bileşenlerle güvenilir biçimde çizilir.

Muhit adı, doğa ve çevreyle ilişkisi nedeniyle seçildi. [Logo ve kullanım kılavuzu](docs/BRAND.md), [görsel logo panosu](assets/brand/index.html) ve [önceki sürümden geçiş](docs/MIGRATION.md) paketle birlikte gelir.

Bu teslim yerel bir kaynak paketidir. Bir kayıt servisinde yayımlandığı veya paket adının kullanım haklarının doğrulandığı iddia edilmez. Çalışan örneği doğrudan [examples/basic.html](examples/basic.html) ile açabilirsiniz. Fontlar ve scriptler yereldir; örnek ağ bağlantısı kurmaz.

Bileşen tarifleri: [COMPONENTS](docs/COMPONENTS.md). Tema ve kapsam: [TOKENS](docs/TOKENS.md). JSON adaptörü: [AGENT-CONTRACT](docs/AGENT-CONTRACT.md).

## Yerel kurulum

Kaynak klasöründe Node.js 18 veya üzeri ve npm ile:

```sh
npm run check
npm pack --dry-run
npm pack
```

Oluşan arşivi kendi projenizin klasöründe kurun:

```sh
npm install /tam/yol/muhit-ui/muhit-ui-0.18.0.tgz
```

`npm pack`, kaynak modüllerini, stilleri, şemaları, tipleri, fontları ve kullanım örneklerini içerir. Tema stüdyosu dağıtılır; test dosyaları npm paketine dahil edilmez. `npm run check` Node ortamında ESM girişini yükler; tarayıcı etkileşim testlerinin yerine geçmez.

Tam kaynak kopyasında `npm run dev` stüdyoyu yerel HTTP sunucusunda açar; `npm test` Node testlerini çalıştırır. `tools/` ve `tests/` npm arşivine dahil edilmez; bu iki komut kurulu npm paketinde çalıştırılmak için değildir. `npm run check` ise dağıtılan pakette de kullanılabilir.

## Klasik HTML kullanımı

`styles`, `src` ve `assets` klasörlerinin göreli ilişkisini koruyun. `styles/index.css` yerel fontları da içeren temel stilleri yükler. Normal HTML kontrollerini etkileyen sıfırlamalar `.mh-scope` içinde kalır; uygulamanızın dışındaki `body` veya düğmeleri değiştirmez.

```html
<link rel="stylesheet" href="./styles/index.css" />
<div class="mh-scope" id="app">
  <article class="mh-card">
    <h2 class="mh-card__title">Bir sonraki adım</h2>
    <p class="mh-card__body">Bağlamı görünür tutun.</p>
    <button class="mh-button mh-button--primary" id="save">Kaydet</button>
  </article>
  <div id="projects"></div>
</div>
<script src="./src/icons.js"></script>
<script src="./src/components.js"></script>
<script src="./src/table.js"></script>
<script src="./src/charts.js"></script>
<script src="./src/theme.js"></script>
<script src="./src/widget-schemas.js"></script>
<script src="./src/widgets.js"></script>
<script src="./src/agent.js"></script>
<script>
  const app = document.getElementById("app");
  MuhitTheme.apply({ preset: "grove", mode: "dark" }, app);
  document.getElementById("save").onclick = () =>
    Muhit.toast("Örnek işlem tamamlandı.", { container: app });
  const table = MuhitTable.mount("#projects", {
    title: "Proje listesi",
    demo: false,
    rows: [{ id: "P-01", title: "İlk çalışma", status: "planned" }],
  });
</script>
```

`apply` için kapsam kökü verilmezse tema belge köküne uygulanır. Yerel bir kapsam kullanırken toast için aynı `container` öğesini verin. Native `<dialog class="mh-dialog">` öğelerini de tema kapsamının içinde tutun. `.mh-scope` görsel sınıfı kendi başına yeni bir tema oluşturmaz; değişkenleri üst öğeden alır.

## ESM ve Node kullanımı

Bir paketleyici kullanan uygulamada:

```js
import { Muhit, MuhitTheme, MuhitTable } from "muhit-ui";
import "muhit-ui/styles";

MuhitTheme.apply({ preset: "clay", density: "compact" });
const table = MuhitTable.mount("#projects", { rows: myRows, demo: false });
```

Tarayıcıda doğrudan ESM için HTTP üzerinden `./src/index.mjs` yolunu kullanın. Dosya protokolünde ESM kısıtlarıyla karşılaşmamak için çevrimdışı örnek klasik scriptleri kullanır. Node ortamında paket içe aktarılabilir; `normalizeData`, `toCSV`, `resolve`, `audit` ve `validate` gibi saf yardımcılar DOM gerektirmez. `mount`, `render`, `apply`, `toast` ve dialog işlemleri için uygun DOM nesneleri gerekir. Bu paket sunucuda HTML üretimi veya sanal DOM katmanı sağlamaz.

## Tema sözleşmesi

```js
const config = {
  version: 1,
  preset: "tide",
  mode: "dark",
  accent: "#7095D8",
  font: "humanist",
  density: "comfortable",
  radius: "soft",
  scale: 1.125,
  motion: "reduced",
  border: "strong",
};
const { tokens } = MuhitTheme.resolve(config);
const checks = MuhitTheme.audit(config);
const css = MuhitTheme.toCSS(config);
const restored = MuhitTheme.fromJSON(MuhitTheme.toJSON(config));
```

Dört hazır tema `grove`, `clay`, `tide`, `atelier`; yazı seçimleri `editorial`, `humanist`, `system` değerleridir. Koyu/açık görünüm açıkça seçilir. Eksik yapılandırma alanları varsayılanlarla tamamlanır; bilinmeyen alan ve geçersiz değer reddedilir. JSON dışa aktarımı normalize edilmiş **yapılandırmayı** içerir; hesaplanan CSS değişkenleri `resolve` veya `toCSS` üzerinden alınır.

Yeni bileşenlerde `--mh-bg`, `--mh-surface`, `--mh-surface-2`, `--mh-text`, `--mh-muted`, `--mh-border`, `--mh-accent`, `--mh-on-accent`, `--mh-focus` ve durum değişkenlerini kullanın. Grafiklerde `--mh-chart-1`…`4` ile bunların `--mh-on-chart-1`…`4` karşılıkları eşleşir. Sabit açık zemin veya sabit beyaz yazı eklemeyin. Yoğunluk `--mh-space-card` ve `--mh-cell-y`; metin boyutu `--mh-text-scale` üzerinden değişir. Sık görünüm dokunma hedeflerini küçültmez.

## Bileşen API'leri

Tam imzalar [types/index.d.ts](types/index.d.ts) içinde tanımlıdır.

- `Muhit.icon(name)` sabit SVG işaretlemesi döndürür. `toast(message, {container, duration})` metni HTML olarak yorumlamaz; varsayılan süre 7000 ms, `0` elle kapama anlamındadır. Odak veya işaretçi toast üzerine geldiğinde otomatik kapanma durur. Aynı kapsayıcıda en çok üç bildirim tutulur. `openDialog` ve `closeDialog` native dialog yaşam döngüsünü kullanır.
- `MuhitTable.mount(host, options)` arama, durum filtresi, sıralama, sayfalama, seçim, sütun görünürlüğü, sık görünüm, toplu durum değişimi, geri alma ve kayıt ayrıntısı sağlar. `getRows()` kopya döndürür; `setRows(rows)` veriyi doğrular, kalan kimliklerin seçimini korur ve geri alma geçmişini temizler. `onChange(rows, reason)` yalnız `bulk-status` veya `undo-status` işlemlerini bildirir. Sunucuya kayıt yapmaz. Filtreli CSV tüm sonuçları; seçili CSV bütün sayfa ve filtrelerdeki seçimi içerir.
- `MuhitCharts.mount(host, {getData, initialPeriod, onPeriodChange})` çizgi, çubuk, halka ve küçük grafik görünümü kurar. Sağlayıcı `6` veya `12` değerini alır ve nesne/Promise döndürür. `refresh()`, `setData(data)` ve `getData()` kopyalarla çalışır; hata, boş veri, eski istek veya kaldırılmış örnekte sonuç `null` olabilir. `destroy()` dinleyicileri ve görünümü kaldırır. Dönem filtresini uygulamak özel sağlayıcının görevidir. Sabit veri görüntüsünde `periodControl: false` dönem düğmelerini kaldırır ve sabit görünüm notu gösterir.

Tablo ve grafikte `showGuidance: true`, tasarım/entegrasyon açıklamalarını gösterir; varsayılan `false` olduğundan ürün görünümüne rehber eklenmez. Veri niteliği ve kaynak bilgisi korunur.

Tablo satırında `id`, `title`, `status` zorunludur; durumlar `planned`, `active`, `review`, `complete` olabilir. Grafik satırında `sources`, `actions`, `connections` sayıları gereklidir; en çok 24 satır, 12 kategori ve 8 kaynak türü kabul edilir. Sayılar sonlu ve negatif olmayan değerler olmalıdır. Toplamlar satırlardan hesaplanır; verilmiş kategori ve tür toplamları bunlarla eşleşmelidir. Varsayılan kayıtlar kurgu olarak etiketlenir. CSV'de metin formüllerine karşı ön ek kullanılır; tablo ayıracı noktalı virgül, grafik ayıracı virgüldür.

## Agent sözleşmesi

Agent adaptörü bir model çalıştırmaz. Uygulamanızın veya bir modelin ürettiği JSON'u doğrular ve izin verilen 18 türü çizer: `card`, `metric`, `notice`, `table`, `chart` ve [10 etkileşim bileşeni](docs/WIDGETS.md).

```js
const spec = {
  schemaVersion: "1.0.0",
  theme: { preset: "atelier", mode: "light" },
  components: [
    {
      type: "card",
      id: "next-step",
      title: "Çalışmayı gözden geçir",
      description: "Öneriyi değerlendirin ve sonraki adıma karar verin.",
      action: { id: "review", label: "İncele" },
    },
  ],
};
const result = MuhitAgent.validate(spec);
if (!result.valid) console.log(result.errors);
else {
  const view = MuhitAgent.render("#agent-view", spec, {
    onAction({ id, componentId }) {
      console.log(id, componentId);
    },
  });
  // view.update(nextSpec); view.destroy();
}
```

Eylem kimliği yalnız kullanıcı tıklamasında callback'e iletilir; ağ çağrısı, HTML, çalıştırılabilir kod veya dış URL içermez. Callback'in yapacağı iş uygulamanızın sorumluluğudur. Görünüm en çok 50 bileşen içerir. Geçersiz `render`/`update` çağrısı `.errors` içeren `TypeError` fırlatır; mevcut görünüm korunur. `update`, `destroy` sonrasında hata verir. Agent grafik girdisinde `year` metindir ve `totals` alanı gönderilmez. Agent grafiği verilen anlık veri kümesini gösterir; dönem düğmeleri kapalıdır. Yeni dönem verisi için görünüm yeni JSON ile güncellenir.

Makine kaynakları: [UI şeması](schemas/ui.schema.json), [tema şeması](schemas/theme.schema.json), [bileşen manifestosu](schemas/components.json), [örnek görünüm](examples/agent-view.json), [agent çalışma kuralları](AGENTS.md).

## Erişilebilirlik ve sınırlar

Kontrollerde en az 44 px hedef yüksekliği ve görünür odak; grafiklerde tablo alternatifleri, seri şekilleri ve klavye hareketi; durumlarda metin etiketleri bulunur. Hareket tercihi desteklenir. `audit` belirli renk çiftlerinin kontrastını hesaplar; bütün bir ürün için WCAG uygunluk belgesi değildir. İçerik, odak sırası, dialog akışı, ekran okuyucu davranışı, özel renkler ve hedef tarayıcılar entegrasyonda ayrıca sınanmalıdır. Önemli işlem sonucunu yalnız süreli toast içinde bırakmayın.

Bileşenler modern CSS değişkenleri, native dialog, SVG ve güncel tarayıcı API'leri kullanır. Kimlik doğrulama, arka uç, veri saklama ve otomatik senkronizasyon sağlamaz. Kart/sekme gibi HTML örneklerinde gereken iş davranışını uygulamanız bağlar.

## Lisans

Kod ve paket belgeleri [MIT](LICENSE) lisanslıdır. Dahil edilen Manrope ve Source Serif 4 fontları kendi SIL Open Font License 1.1 koşullarını korur; [NOTICE](NOTICE) ve font lisans dosyalarını dağıtımda saklayın.


## 0.7.0 ile genişleyen sistem

- 8 palet: Koru, Toprak, Kıyı, Atölye, Kum, Yosun, Erguvan, Arduvaz; açık/koyu görünüm ve kişisel vurgu.
- 64 CSS tokenı; kişiselleştirme ekranında 16 kontrol; üç görünüm tarifi.
- 10 yeni etkileşim bileşeni ve toplam 15 agent türü.
- Üç doğal yaydan oluşan sabit Muhit görsel kimlik 3.1; vektör logo ve tek renk sürümleri.

Yeni API: `import { MuhitWidgets } from "muhit-ui"`. [Bileşen rehberi](docs/WIDGETS.md), [10 JSON örneği](examples/widgets.json), [çalışan HTML örneği](examples/workflow.html). Yükleme sırası ve olay sözleşmeleri rehberde açıklanır. Paket yerel dağıtım içindir; kayıt sistemine otomatik yayımlanmaz.

## 0.7.0: kartlar ve sayfalar

Yatay kartlar, çalışma alanı/koleksiyon/ayrıntı tarifleri, sorumlu filtresi ve dört yeni tema alanı: [kullanım rehberi](docs/LAYOUTS.md). Bağımsız örnek: [pages.html](examples/pages.html).

## 0.7.0 — sağlamlaştırma ve uygulama bileşenleri

Kontrast/filtre/sabit başlık düzeltmeleri, kart durumları, agent sayfaları, genel `MuhitDataGrid`, stüdyo tema geçmişi, URL ile sayfa seçimi ve React/Vue host örnekleri eklendi. [Uygulama sözleşmeleri](docs/PRODUCTION.md) API sınırlarını, veri sağlayıcılarını ve doğrulamayı açıklar. Tek yerel kalite komutu `npm run verify` (önce geliştirme bağımlılıklarını ve Playwright tarayıcısını kurun).

## React ve Vue uygulamaları

[React](examples/react/README.md) ve [Vue](examples/vue/README.md) örnekleri artık bağımsız Vite uygulamalarıdır. `npm run test:framework` paketi TGZ olarak iki tüketiciye kurar, tip kontrolü/üretim derlemesi yapar ve geliştirme/üretim modlarını tarayıcıda sınar. Tüm kontroller: `npm run verify:all`.

## Formlar ve kalıcı görünüm · 0.7.0

`MuhitForm` doğrulanmış alanlar, asenkron kayıt, hata özeti, sıfırlama ve temizleme sağlar. `MuhitPreferences` tema tercihlerinin isteğe bağlı yerel saklanmasını yönetir. [Rehber](docs/FORMS.md) · [Çalışan ayarlar sayfası](examples/settings.html) · [Kapsam ve kalan işler](docs/COVERAGE.md).


Güncel sözleşme ve sınırlar: [0.11 üretim hazırlığı](docs/PRODUCTION-0.11.md). CSV yükleme/hata davranışı ve form snapshot geçişi için [yayın politikası](docs/RELEASE-POLICY.md).

## 0.10: ölçek, hareket ve diller

[İngilizce stüdyo](studio-en.html) · [English guide](docs/GETTING-STARTED.en.md) · [P3 kararları ve sınırlar](docs/P3-0.10.md) · [Kanban ve büyük veri](examples/scale.html). Ek kataloglar: `muhit-ui/locales/de` ve `/ar`. İsteğe bağlı CSS/font girişleri dağıtım boyutunu azaltır.

## İkonlar ve sayfa standardı · 0.12

[58 ikon kataloğu](examples/foundations/icons.html) · [Altı sayfa düzeni](examples/foundations/overview.html) · [İkon kuralları](docs/ICONS.md) · [Sayfa kuralları](docs/PAGE-STANDARDS.md). `muhit-ui/icons` bağımsız SVG API; `styles/pages.css` isteğe bağlı sayfa stilleri. Eski ikon çağrıları ortak MuhitIcons kaynağına yönlenir. Klasik script kullanımında icons.js önce yüklenmelidir. Sayfa tarifleri HTML/CSS kompozisyonudur, yeni bir agent renderer değildir.

[0.13 geçiş notları ve test kapsamı](docs/MIGRATION-0.13.md)

Güncel kabul ve test kanıtı: [CURRENT](docs/CURRENT.md). Adaptör ve CSP kapsamı: [CONSUMER-CONTRACT](docs/CONSUMER-CONTRACT.md).

Tasarım felsefesi: docs/DESIGN.md. Uygulanabilir ilkeler: docs/PRINCIPLES.md. Çalışan bağlam ve toparlanma örneği: examples/foundations/principles.html.

## 0.17 davranış sözleşmesi

[Taslak, bağlam, sonuç ve iptal](docs/INTERACTION-CONTRACT.md): Form ve Repeater `cancelSubmit()`, Agent `cancelPending()` ve `update(spec, {resetState:true})`. Stüdyo bölüm geçişlerinde taslakları aynı sekmenin belleğinde korur.

## Muhit tasarım sistemi

[Çalışan sistem ve üç referans ürün](examples/system/index.html) · [Mimari](docs/SYSTEM-ARCHITECTURE.md) · [Tokenlar](docs/SYSTEM-TOKENS.md) · [Bileşenler](docs/SYSTEM-COMPONENTS.md) · [Sayfalar ve akışlar](docs/SYSTEM-PATTERNS.md) · [AI sözleşmesi](docs/SYSTEM-AI.md) · [Yönetim ve kabul](docs/SYSTEM-GOVERNANCE.md).

Yeni bağımsız ESM girişleri: `muhit-ui/tokens`, `muhit-ui/flow`, `muhit-ui/pages`, `muhit-ui/primitives`, `muhit-ui/system`. Sistem stilleri: `muhit-ui/styles/system.css`; sayfa stilleri: `muhit-ui/styles/pages.css`.

[Figma tasarım kaynağı](docs/FIGMA.md) · [Teknoloji ve entegrasyon](docs/SYSTEM-TECHNOLOGY.md) · [0.18 geçişi](docs/MIGRATION-0.18.md) · [Güncel kabul](docs/CURRENT.md)

[System overview in English](docs/SYSTEM.en.md)

## Geliştirme dalı: içerik aileleri ve Atölye 02

Henüz yayımlanmamış `muhit-ui/content` kart/satır/bölüm API’si için [CONTENT.md](docs/CONTENT.md).
[Atölye 02](examples/atelier/boards.html), dokuz ekranın mobil/masaüstü düzenlerini; koleksiyon, ekip ve görünüm tercihleriyle birlikte gösterir. Yeni örneklerdeki yerel saklama ve örnek veri sınırları [tasarım notlarında](examples/atelier/DESIGN.md) açıklanır.

### Atölye 03 · çalışma alanı modülleri

Bildirim merkezi, etkinlik akışı, kart/liste/tablo kaynak tarayıcısı ve ortak komut gezintisi eklendi. [API ve entegrasyon rehberi](docs/WORKSPACE-MODULES.md) · [Canlı örnek](examples/atelier/index.html?screen=resources). Bu ekler mevcut çalışma kopyasındadır; registry yayını yapılmadı.
