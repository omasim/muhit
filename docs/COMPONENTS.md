# Bileşenleri projeye eklemek

Muhit iki kullanım katmanı sunar: native HTML üzerine `mh-` sınıfları ve kendi DOM'unu kuran tablo/grafik/JSON adaptörleri. CSS sınıfı bir eylemi çalıştırmaz; veri kaydı, yönlendirme ve form gönderimi uygulamanıza aittir. Desteklenen 18 JSON türünün dışındaki HTML bileşenlerini `MuhitAgent` tanımına eklemeyin.

## Kapsam ve yükleme

```html
<link rel="stylesheet" href="./styles/index.css" />
<main class="mh-scope mh-stack" id="project-app">
  <!-- Bileşenler burada -->
</main>
<script src="./src/icons.js"></script>
<script src="./src/components.js"></script>
<script src="./src/table.js"></script>
<script src="./src/charts.js"></script>
<script src="./src/theme.js"></script>
<script src="./src/agent.js"></script>
```

`styles/index.css`, tokenları ve tüm bileşen stillerini yükler; stüdyo CSS'i gerekmez. Klasik betikler yerel dosyada çalışabilir. Paketleyicide `import { MuhitTable } from 'muhit-ui'` ve `import 'muhit-ui/styles'` kullanılır. Tablo/grafik kendi `.mh-scope` kökünü oluşturur. Kendi HTML'inizde kapsamı ekleyin; genel öğe sıfırlamaları bu sınırın dışına çıkmaz. `.mh-stack` dikey aralık, `.mh-row` sarılabilen yatay düzen, `.mh-between` iki uç arasında dağılım sağlar.

## Kart ve eylem

```html
<article class="mh-card" aria-labelledby="project-title">
  <p class="mh-kicker">Çalışma notu</p>
  <h2 class="mh-card__title" id="project-title">İlk araştırma</h2>
  <p class="mh-card__body">
    Görüşmelerden önce açık soruları birlikte inceleyin.
  </p>
  <footer class="mh-card__footer">
    <span class="mh-badge mh-badge--info">Planlandı</span>
    <button type="button" class="mh-button mh-button--primary">İncele</button>
  </footer>
</article>
```

Başlığı sayfanın gerçek hiyerarşisine göre seçin. Kartın gövdesi açıklama, alt bölümü durum ve eylem içindir. `.mh-card--sage` semantik yumuşak vurgu zemini; `.mh-card--ink` vurgu ve karşıt metin eşini kullanır. Bu uyumluluk adları sabit bir renk vaat etmez. `.mh-card--interactive` yalnız hover görünümüdür; karta `onclick` eklemek yerine native düğme veya bağlantı kullanın.

| Parça         | Sınıf ve anlam                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Düğme         | `.mh-button`; `--primary`, `--quiet`, `--danger`, `--small` değiştiricileri                       |
| İkon eylemi   | `.mh-button--icon`; görünür metin yoksa `aria-label` gerekli                                      |
| Bağlantı      | `<a class="mh-text-link" href="…">`; gerçek hedefi uygulama verir                                 |
| Panel         | `.mh-panel`, `.mh-panel__header`, `.mh-panel__title`                                              |
| Sayısal özet  | `.mh-metric__label`, `.mh-metric__value`, `.mh-metric__delta`; birim ve karşılaştırma açıklanmalı |
| Durum etiketi | `.mh-badge--success`, `--warning`, `--danger`, `--info`; anlamı metinle de taşıyın                |

`Muhit.icon('search')` yalnız sabit SVG üretir; tanımsız ad grid ikonuna döner. İkon `aria-hidden="true"` taşır. `button.innerHTML = Muhit.icon('search')` bu sabit sonuç için uygundur; kullanıcı metnini `textContent` ile ekleyin.

## Native form ve doğrulama

```html
<form class="mh-stack" id="project-form" novalidate>
  <div class="mh-field">
    <label for="project-name">Proje adı</label>
    <input
      class="mh-input"
      id="project-name"
      name="title"
      required
      aria-describedby="name-help name-error"
    />
    <p class="mh-field__help" id="name-help">
      Ekibin tanıyacağı kısa bir ad yazın.
    </p>
    <p class="mh-field__error" id="name-error" aria-live="polite"></p>
  </div>
  <label class="mh-check">
    <input type="checkbox" name="share" /> Ekiple paylaş
  </label>
  <button class="mh-button mh-button--primary" type="submit">Devam et</button>
</form>
<script>
  const form = document.getElementById("project-form");
  const field = document.getElementById("project-name");
  const error = document.getElementById("name-error");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = field.value.trim().length > 0;
    field.setAttribute("aria-invalid", String(!valid));
    error.textContent = valid ? "" : "Proje adını yazın.";
    if (!valid) return field.focus();
    // Doğrulanmış form verisini uygulamanız işler.
  });
</script>
```

`novalidate` yalnız kendi hata akışınızı kurduğunuzda kullanılır. Etiket ve hata ilişkilendirmesi CSS tarafından otomatik kurulmaz. Native doğrulama tercihinde `novalidate` kaldırılabilir. `.mh-select` native `<select>`, `.mh-textarea` native `<textarea>` içindir. `readonly` bilgiyi okunabilir tutar; `disabled` alan form gönderimine katılmaz.

Checkbox ve radio etiketleri `.mh-check` kullanır. İlişkili radioları aynı `name` ile `<fieldset><legend>` içinde gruplayın. Anahtar görünümü için `<label class="mh-switch"><input type="checkbox" role="switch">Bildirimleri aç</label>` kullanın. `checked` gerçek durumu taşır; dekoratif bir düğmeyi checkbox gibi göstermeyin.

## Durumlar ve geri bildirim

| Durum      | Uygulama tarifi                                                                      |
| ---------- | ------------------------------------------------------------------------------------ |
| Hazır      | İçerik, görünür etiket ve kullanılabilir eylem                                       |
| Odak       | Kapsam içinde 3 px `:focus-visible`; odak halkasını kaldırmayın                      |
| Devre dışı | Native `disabled`; nedenini gereken yerde ayrı açıklayın                             |
| Hata       | `aria-invalid="true"`, alanla ilişkili açık hata ve düzeltme yolu                    |
| Yükleniyor | Kapsayıcıya `aria-busy="true"`; durum metni; dekoratif skeleton `aria-hidden="true"` |
| Boş        | `.mh-empty`; neyin boş olduğu ve uygun sonraki eylem                                 |
| Başarı     | Görünür sonuç; kısa toast destek olabilir, tek kanıt olmamalı                        |

```html
<section class="mh-panel mh-stack" aria-busy="true">
  <p role="status">Kayıtlar yükleniyor.</p>
  <div class="mh-skeleton mh-skeleton--heading" aria-hidden="true"></div>
  <div class="mh-skeleton" aria-hidden="true"></div>
</section>
<div class="mh-alert mh-alert--warning" role="note">
  <div>
    <strong>Eksik bilgi</strong>
    <p>Kaynak tarihini ekleyin.</p>
  </div>
</div>
<label for="upload">Yükleme ilerlemesi</label>
<progress class="mh-progress" id="upload" max="100" value="40">%40</progress>
```

Statik notta `role="note"` yeterlidir; acil yeni hatalar için bağlama uygun `role="alert"` seçilir. Skeleton gerçek verinin yerine sürekli bırakılmaz. Sonuç geldiğinde `aria-busy` kaldırılır ve durum metni güncellenir. Hareket azaltma desteklenir.

## Dialog ve toast

Dialog öğesini temanın uygulandığı kapsamın içinde tutun; native üst katmana açılsa da değişkenlerini bu ağaçtan devralır.

```html
<button class="mh-button" type="button" id="open-note">Notu aç</button>
<dialog class="mh-dialog" id="note-dialog" aria-labelledby="note-title">
  <div class="mh-dialog__content">
    <h2 class="mh-dialog__title" id="note-title">Çalışma notu</h2>
    <p>Sonraki adımı ekipçe netleştirin.</p>
    <form method="dialog" class="mh-dialog__actions">
      <button class="mh-button" value="close">Kapat</button>
    </form>
  </div>
</dialog>
<script>
  document.getElementById("open-note").onclick = () =>
    Muhit.openDialog(document.getElementById("note-dialog"));
  // Muhit.closeDialog(document.getElementById('note-dialog'));
  // Muhit.toast('Not güncellendi.', {
  //   container: document.getElementById('project-app'), duration: 7000
  // });
</script>
```

`openDialog` native `showModal()` çağırır; Escape ve modal odak davranışı tarayıcıya aittir. Uygun ilk odak, geri dönüş ve kapatma akışını kendi içeriklerinizle sınayın. Toast varsayılan olarak `document.body` altına eklenir; kapsam teması için `container` verin. Süre `0` elle kapamadır; varsayılan 7000 ms. Hover veya odak otomatik kapanmayı durdurur. Aynı kapsayıcıda en fazla üç toast tutulur.

## Veri tablosu

```js
const table = MuhitTable.mount("#projects", {
  title: "Araştırma projeleri",
  description: "Ekibin güncel kayıtları",
  demo: false,
  showGuidance: false,
  rows: [
    {
      id: "P-01",
      title: "İlk araştırma",
      status: "planned",
      owner: "Ekip",
      updated: "2026-10-09",
    },
  ],
  onChange(rows, reason) {
    console.log(reason, rows); // Uygulama durumu veya kayıt katmanına aktarın.
  },
});
const snapshot = table.getRows();
table.setRows(snapshot);
// Sayfadan ayrılırken table.destroy();
```

`id`, `title`, `status` zorunludur. Durumlar `planned`, `active`, `review`, `complete`; `owner`, `theme`, `note`, `next`, `initials`, `updated` seçimliktir. Tarih boş veya gerçek `YYYY-MM-DD` olmalıdır. `rows` verilmezse 14 kurgu kayıt her zaman demo diye işaretlenir. `demo:false` dış veriyi doğrulanmış gerçek olarak onaylamaz.

Arama, durum filtresi, başlık/durum/tarih sıralaması, sütun seçimi, 5/10 satır sayfalama ve ayrıntı dialog'u hazırdır. Üst checkbox yalnız mevcut sayfayı seçer; seçimler filtre ve sayfalar arasında korunur. Toplu durum değişimi ve son değişikliği geri alma `onChange` çağırır; `setRows` çağırmaz. Geçersiz `setRows` mevcut veriyi korur; geçerli güncelleme kalan ID seçimlerini korur ve geri alma geçmişini temizler. Veri bellektedir; sunucu veya kalıcı depolama yoktur.

Filtreli CSV tüm filtre sonuçlarını, seçili CSV görünmeyen seçili satırları da içerir. Gizlenen sütunlar CSV'den çıkarılmaz. Tablo ayıracı noktalı virgül; UTF-8 BOM, CRLF ve metin formülü ön eki bulunur. Dar kapsayıcıda tablo kendi bölgesinde yatay kayar. `showGuidance:true` yalnız tasarım rehberi ve entegrasyon kodunu ekler; varsayılan kapalıdır.

## Grafik görünümü

```js
const payload = {
  period: 6,
  year: "2026",
  label: "Ocak–Şubat 2026",
  source: "Yerel örnek kayıtlar",
  isExample: true,
  rows: [
    { month: "Ocak", sources: 12, actions: 5, connections: 7 },
    { month: "Şubat", sources: 18, actions: 8, connections: 11 },
  ],
};
const charts = MuhitCharts.mount("#charts", {
  initialPeriod: 6,
  periodControl: false,
  getData: () => payload,
});
// await charts.refresh();
// await charts.setData(nextPayload);
// const snapshot = charts.getData();
// charts.destroy();
```

Çizgi, kategori çubukları, kaynak dağılımı ve bağlantı özeti aynı veri kümesinden hesaplanır. Seri anlamları kaynak/eylem/bağlantı **adedi** olarak sabittir; başka birimleri bu alanlara yerleştirmeyin. `period` kontrol değeridir; satırları kendi başına kesmez. Dönem kontrolü açıksa `getData(period)` uygun 6/12 veri kümesini döndürmelidir. Nesne veya Promise kabul edilir; `onPeriodChange` yalnız kullanıcı dönem değiştirdiğinde çağrılır. Sabit kümede `periodControl:false` kullanın.

0–24 satır, en fazla 12 kategori ve 8 kaynak türü kabul edilir. Sayılar sonlu, negatif olmayan ve `Number.MAX_SAFE_INTEGER` sınırındadır. Toplamlar türetilir; sağlanan kategori toplamı eylemlerle, tür toplamı kaynaklarla eşleşmelidir. Gruplar yoksa tek toplam grubu oluşturulur. `normalizeData()` geçersiz girişte hata fırlatır. `refresh()` ve `setData()` ise hata/boş/eski istek/kaldırılmış örnekte `null`, başarıda bağımsız veri kopyası döndürür; hatayı görünümde gösterir. `getData()` hazır durumda kopya, diğer durumlarda `null` verir.

Seri gizleme CSV verisini eksiltmez. CSV virgül ayracı kullanır; aylık değerleri ve grup toplamlarını içerir. Veri tabloları, klavye ile nokta inceleme ve seri şekilleri renk bilgisini destekler. Çizgi grafik dar kapsayıcıda kendi içinde kayabilir; diğer paneller kapsayıcı genişliğine göre sıralanır. `showGuidance:true` entegrasyon kodunu açar; kaynak bilgisi her zaman korunur.

## JSON görünümleri ve gezinme

`MuhitAgent.render` yalnız [Agent sözleşmesindeki](AGENT-CONTRACT.md) 18 türü kurar. Tema verilmezse üst kapsam devralınır; tema verilirse kendi `.mh-agent` kökü zeminiyle birlikte temalanır. Geçersiz güncelleme önceki görünümü korur. Yeni görünüm çocuk tablo/grafik durumlarını yeniden kurar; kaldırırken `destroy()` çağırın.

`.mh-tablist`, `.mh-tab` ve `.mh-segment` görsel sınıflardır. Sekmelerin `aria-selected`, `tabindex`, panel ilişkisi, ok/Home/End klavye akışı uygulama tarafından yönetilir. Segment düğmeleri `aria-pressed` kullanır. Bu sınıflar router, sayfalama hizmeti veya otomatik davranış paketi değildir.

Tam imzalar [TypeScript tanımlarında](../types/index.d.ts), tema tarifleri [Token rehberinde](TOKENS.md), çalışan çevrimdışı örnek [basic.html](../examples/basic.html) içindedir.


## Yeni etkileşim türleri

0.3.0 ile tabs, accordion, timeline, kanban, choices, command, drawer, stepper, filepicker ve pagination eklenmiştir. [WIDGETS.md](WIDGETS.md) API, olaylar, sınırlar ve çalışan örnekleri açıklar. Toplam 15 adaptör türü desteklenir. Widget olayları {id, componentId, value} taşır.

## Uygulama formları ve saklanan tercihler

`MuhitForm` ve `MuhitPreferences` için [form ve ayarlar rehberini](FORMS.md) okuyun. [Çalışan ayarlar örneği](../examples/settings.html) doğrulama, kayıt hataları, tema kalıcılığı ve mobil düzeni bir arada gösterir.
