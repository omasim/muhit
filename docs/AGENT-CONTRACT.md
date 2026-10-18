# Muhit JSON arayüz sözleşmesi

MuhitAgent, izin verilen JSON tanımını doğrulayan ve Muhit bileşenlerine dönüştüren deterministik bir adaptördür. Aynı geçerli tanım aynı bileşen düzenini oluşturur. Pakete bağlı bir dil modeli, ajan hizmeti, sunucu, ağ istemcisi veya otonom işlem sistemi yoktur. Bir modelin ürettiği JSON da kullanıcı tarafından yazılan JSON ile aynı kurallardan geçer.

Model bağlantısı ve modelin doğruluğu uygulamanın sorumluluğudur. JSON alanları, kod ya da yetki vermez. Adaptör URL açmaz, HTML çalıştırmaz, veri kaydetmez ve eylem adlarından iş mantığı türetmez.

## Dosyalar

- [UI JSON Schema](../schemas/ui.schema.json): Draft 2020-12 yapısal sözleşme.
- [Tema JSON Schema](../schemas/theme.schema.json): kısmi tema yapılandırması.
- [Bileşen manifesti](../schemas/components.json): izinli JSON türleri, native CSS sınıfları ve davranışlar.
- [Örnek görünüm](../examples/agent-view.json): beş türü bir araya getiren, açıkça kurgusal insan ve doğa odaklı senaryo.
- [Adaptör](../src/agent.js) ve [Node testleri](../tests/agent.test.mjs).

## Yükleme ve ilk çizim

Klasik betikler derleme gerektirmez. Temanın JavaScript olmadan kullanılan varsayılanları ve yerel fontlar `tokens.css` içindedir. CSS dosyalarının tamamı paket içindedir; stüdyo stilleri gerekmez.

```html
<link rel="stylesheet" href="./styles/tokens.css" />
<link rel="stylesheet" href="./styles/components.css" />
<link rel="stylesheet" href="./styles/table.css" />
<link rel="stylesheet" href="./styles/charts.css" />

<main id="agent-view"></main>
<script src="./src/icons.js"></script>
<script src="./src/theme.js"></script>
<script src="./src/table.js"></script>
<script src="./src/charts.js"></script>
<script src="./src/agent.js"></script>
<script>
  const spec = {
    schemaVersion: "1.0.0",
    components: [
      {
        type: "card",
        id: "project",
        title: "Birlikte düşünmek",
        description: "Yalnız örnek bir çalışma notu.",
        action: { id: "review", label: "Notu incele" },
      },
    ],
  };
  const result = MuhitAgent.validate(spec);
  if (result.valid) {
    const view = MuhitAgent.render("#agent-view", spec, {
      onAction({ id, componentId }) {
        // Uygulama yalnız tanıdığı eylemleri açıkça işler.
        if (componentId === "project" && id === "review") {
          console.log("Kullanıcı örnek notu incelemeyi seçti.");
        }
      },
    });
    // view.update(nextSpec); // Önce doğrular, sonra atomik değiştirir.
    // view.destroy();        // Çocuk bileşenleri ve dinleyicileri kaldırır.
  } else {
    console.table(result.errors);
  }
</script>
```

ES modül girişinde `import { MuhitAgent } from './src/index.mjs'` kullanılabilir. `agent.js` tek başına Node ortamında içe aktarılabilir: içe aktarma ve `validate()` DOM'a erişmez. `render()` gerçek bir HTML kapsayıcısı gerektirir. Tema belirtilen çizimlerde MuhitTheme; tablo/grafik türleri kullanıldığında ilgili mount modülü yüklenmiş olmalıdır.

## API

```ts
MuhitAgent.validate(spec: unknown): {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
};

MuhitAgent.render(
  container: Element | string,
  spec: UISpec,
  options?: { onAction?: (action: { id: string; componentId: string }) => void }
): {
  update(spec: UISpec): /* aynı instance */;
  destroy(): void;
};
```

Hata yolları `$.components[0].title` biçimindedir. `validate()` girdiyi değiştirmez ve en fazla 100 hata döndürür. JSON olmayan değerler ve geçersiz tanımlar `valid:false` verir. Metin JSON olarak geliyorsa uygulama önce `JSON.parse()` hatasını ele almalıdır.

`render()` ve `update()` geçersiz tanımda `TypeError` fırlatır. Hatanın `errors` alanı aynı yol/mesaj kayıtlarının bağımsız kopyasını taşır. Eksik modül veya başarısız bileşen kurulumu da hata verir. Yeni görünüm mevcut görünüm kaldırılmadan hazırlanır; başarısız doğrulama/kurulum önceki DOM'u ve çalışan çocuk bileşenleri korur. Başarılı güncelleme tüm görünümü yeniden kurar; eski tablonun filtre/seçim/sıralama veya grafiğin seri görünürlüğü yeni görünüme aktarılmaz.

`destroy()` birden fazla kez çağrılabilir. Kaldırılmış instance'a `update()` hata verir. Aynı kapsayıcıya tekrar `render()` başarılı olduğunda önceki instance kaldırılır. Adaptör kapsayıcının içeriğini sahiplenir; başarılı ilk çizim önceki içeriği değiştirir, `destroy()` önceki içeriği geri getirmez. Kapsayıcının kendisine ait stil ve özellikler değiştirilmez.

## Kök tanım ve tema

```ts
type UISpec = {
  schemaVersion: "1.0.0";
  theme?: Partial<ThemeConfig>;
  components: Component[]; // 0–50
};
```

Kök düzeyinde başka alan yoktur. Tema alanı **atlanırsa** kapsayıcının CSS değişkenleri devralınır; üst temanın sonradan değişmesi de görünümü etkiler. `theme:{}` ise `MuhitTheme.normalizeConfig` varsayılanlarını açıkça ister. Kısmi tema da normalizer ile tamamlanır; kapsayıcı temasının üzerine tek tek yamalanmaz.

Tema yalnız adaptörün oluşturduğu `mh-scope mh-agent mh-stack` iç köküne uygulanır. `destroy()` bu kökü kaldırır; ev sahibi `body`, `:root` veya kapsayıcı stillerini temizlemez. Görünümdeki boşluklar ve görsel kurallar kitaplığın `mh-stack`, `mh-card`, `mh-panel`, `mh-alert` ve ilgili sınıflarından gelir. Özel stüdyo CSS'ine bağımlılık yoktur.

Tema seçenekleri `version:1`, `preset`, `mode`, `accent`, `font`, `density`, `radius`, `scale`, `motion`, `border` alanlarıyla sınırlıdır. `accent` yalnız `null` veya altı basamaklı `#RRGGBB` rengidir; keyfi CSS ve font URL'si kabul edilmez. Tam enum ve varsayılanlar tema şemasındadır.

## Beş bileşen türü

| Tür      | Zorunlu alanlar                          | İsteğe bağlı alanlar               |
| -------- | ---------------------------------------- | ---------------------------------- |
| `card`   | `type`, `id`, `title`                    | `description`, `action:{id,label}` |
| `metric` | `type`, `id`, `label`, `value`           | `note`                             |
| `notice` | `type`, `id`, `title`, `message`, `tone` | Yok                                |
| `table`  | `type`, `id`, `title`, `rows`            | Yok                                |
| `chart`  | `type`, `id`, `title`, `data`            | Yok                                |

`metric.value` bir gösterim metnidir; örneğin `"12 kişi"`. Sayıya dönüştürülmez, başka birimlerle toplanmaz ve otomatik etki iddiası üretilmez. `notice.tone` yalnız `info`, `success`, `warning`, `danger` olabilir. Renge ek olarak görünür durum etiketi bulunur. Statik not `role="note"` taşır; her güncellemede otomatik acil duyuru yapmaz.

Bileşen `id` ve eylem `id` değerleri `^[A-Za-z][A-Za-z0-9_-]{0,63}$` kalıbını izler. Bileşen kimliği tüm görünümde benzersizdir. Eylem kimliği bileşen kapsamındadır: iki ayrı kart aynı `review` eylemini kullanabilir; callback bunları `componentId` ile ayırır. Her kart en fazla bir eylem taşır.

Başlık ve etiketler en fazla 240, kart açıklaması ve notice mesajı 4000, metric notu 2000, metric değer metni ve action etiketi 120 karakterdir. Zorunlu başlık, etiket, değer ve mesajlar yalnız boşluk içeremez. Uzunluk Unicode kod noktası üzerinden sayılır. HTML benzeri metinler metin olarak görünür; `html`, `innerHTML`, `href`, `src`, `style`, `onclick` gibi alanlar sözleşmede yoktur ve reddedilir.

Her dış bileşen native `<section>` üzerinde `data-component="card"` ve `data-component-id="project"` gibi kancalar taşır. Bu kancalar uygulamanın test ve yerleşim koduna açıktır. Başlıklar erişilebilir ad sağlar; action öğesi native `button type="button"` kullanır.

## Tablo verisi

```ts
type TableRow = {
  id: string;
  title: string;
  status: "planned" | "active" | "review" | "complete";
  owner?: string;
  theme?: string;
  note?: string;
  next?: string;
  initials?: string;
  updated?: string;
};
```

Bir tabloda 0–500 satır bulunur. Satır kimlikleri aynı ASCII kalıbına uyar ve o tabloda benzersizdir. Başlık/owner/theme en fazla 240, note/next 2000, initials 12 karakterdir. `updated` boş metin veya gerçek bir `YYYY-MM-DD` tarihidir; örneğin `2026-02-29` reddedilir. Eksik seçimlik alanları MuhitTable kendi varsayılanlarıyla tamamlar.

Adaptör `MuhitTable.mount(host,{rows,title,description,demo:false})` kullanır. Bu seçenek veriyi gerçek olarak doğrulamaz; yalnız kitaplığın kendi demo satırlarını kullanmadığını belirtir. Kurgusal tanımı etiketleme sorumluluğu tanımı hazırlayana aittir. Yayınlanan örnekte bu uyarı baştaki notice'ta ve satır notlarında açıktır.

Tablonun arama, sıralama, görünür sütunlar, yerel durum değişiklikleri ve kullanıcı tarafından başlatılan CSV işlemleri çalışır. Bu değişiklikler JSON tanımına veya bir sunucuya yazılmaz. Adaptör bunları `onAction` callback'ine yönlendirmez. Kayıt değişikliklerini uygulama durumuyla bütünleştirmek için doğrudan MuhitTable API'si kullanılmalıdır.

## Grafik verisi

```ts
type ChartData = {
  rows: Array<{
    sources: number;
    actions: number;
    connections: number;
    date?: string;
    month?: string;
    shortMonth?: string;
    categories?: number[];
    types?: number[];
  }>;
  period?: 6 | 12;
  year?: string;
  label?: string;
  source?: string;
  isExample?: boolean;
  categories?: Array<{ name: string; value: number }>;
  types?: Array<{ name: string; value: number }>;
};
```

Bu, MuhitCharts girişinin daha sıkı JSON alt kümesidir. `year` yalnız metindir; `2026` yerine `"2026"` yazılır. `totals` kabul edilmez: kaynak, eylem ve bağlantı toplamları satırlardan hesaplanır. Her değer ve seri toplamı 0 ile `Number.MAX_SAFE_INTEGER` arasında sonlu sayı olmalıdır. Sayısal metin, `null`, negatif, `NaN` ve sonsuz değer reddedilir.

0–24 satır, 0–12 kategori, 0–8 kaynak türü kabul edilir. Boş satırlar grafik bileşeninin erişilebilir boş durumunu açar; sıfır değerler gerçek sıfır olarak kalır. Üst `categories` toplamı tüm satırların `actions` toplamıyla, `types` toplamı `sources` toplamıyla eşleşir. Satır içindeki isteğe bağlı sayısal dağılımlar da ilgili satır toplamına eşit olmalıdır. Tamsayılar tam eşitlik, ondalıklar en büyük toplam × `Number.EPSILON × 8` toleransı ile karşılaştırılır. Gruplar verilmezse MuhitCharts tek toplam grubu oluşturur.

Metadata metinleri ve grup isimleri en fazla 240 karakterdir. `date`, grafikte dönem etiketi olarak kullanılan metindir; tablo `updated` alanı gibi takvim tarihi kısıtı taşımaz. Böylece `2026-Q1` gibi dönem etiketleri mümkündür. Sayım serilerinin anlamı sabittir: kaynak, eylem ve bağlantı adedi. Çevresel ölçü birimleri bu sayımlara yerleştirilmemelidir.

Adaptör `MuhitCharts.mount(host,{initialPeriod:data.period||6,periodControl:false,getData:()=>copy(data)})` kullanır. Grafik **sabit bir veri görüntüsüdür**; 6/12 dönem değiştirme düğmeleri gösterilmez. Tanımı değiştirmek için `view.update(nextSpec)` çağrılır. Seri gizleme, klavye ile nokta inceleme, erişilebilir veri tabloları ve kullanıcı tarafından başlatılan CSV dışa aktarımı çalışır. `getData()` her çağrıda bağımsız kopya verir. Döneme göre dış kaynaktan yükleme için doğrudan MuhitCharts API'si kullanılmalıdır.

## Model çıktısını kabul etme sınırı

Uygulama gelen metni ayrıştırır, `validate()` çalıştırır ve geçerliyse `render()` veya `update()` çağırır. Geçersiz çıktının hata yolları modele veya düzenleme ekranına iletilebilir. Adaptör çıktıyı kendiliğinden onarmaz; bilinmeyen alanları sessizce silmez.

Kart eylemleri native düğme click olayından gelir. Widget, form ve tablo olayları da `onAction` üzerinden aktarılır; kontrollü API değişimleri tablo durum olayları üretebilir. Bu olaylar yetkilendirilmiş bir kullanıcı komutu olarak kabul edilmemeli. Callback yoksa eylem düğmesi devre dışıdır. Callback bir yetkilendirme sistemi değildir: kullanıcı niyeti, uygulama izinleri ve sunucu doğrulaması gerekiyorsa uygulama bunları ayrıca değerlendirir. Adaptör eylemin adından bir URL veya komut çıkarmaz. JavaScript ile programatik click üretilebilmesi tarayıcının normal davranışıdır; bu sözleşme kullanıcı kimliği kanıtı sağlamaz.

DOM metinleri `textContent` ile oluşturulur. Çocuk grafik bileşeni SVG üretirken kendi metin kaçışını uygular. Tanımın kopyası alınır; çağıranın nesneyi sonradan değiştirmesi çizilmiş görünümü veya eylem kimliğini değiştirmez. Fonksiyon, getter/setter, Symbol, BigInt, Date/Map, döngüsel nesne, boş dizi yuvası ve gizli alan gibi JSON dışı değerler reddedilir. Güvenilir taşıma biçimi ayrıştırılmış JSON'dur; keyfi JavaScript Proxy nesneleri bir güvenlik izolasyonu sınırı değildir.

JSON Schema alanları, tipleri ve boyutları doğrular. Standart şema tek başına kimliğe göre benzersizlik veya alanlar arası sayısal toplam eşitliği ifade edemez. Bu nedenle `MuhitAgent.validate()` son kapıdır; gerçek takvim tarihini ve bu anlamsal kuralları da kontrol eder. Yalnız JSON Schema doğrulamasından geçmiş veri doğrudan atlanarak çizilmemelidir.

## Yerel kontrol

Tam kaynak / geliştirme kopyasının kökünde `node --test tests/agent.test.mjs` çalıştırılır. npm dağıtım arşivinde `tests` klasörü bulunmaz; `tools` yalnız paketleme yardımcılarını içerir; bu kontrol için tam kaynak ZIP’ini kullanın. Testler DOM'suz içe aktarma, hatalı JSON/tema/tarih/kimlik/sayı reddi, toplam eşleşmesi, literal metin üretimi, tema devralma, atomik güncelleme ve çocuk bileşen temizliğini kapsar. Adaptör yaşam döngüsü testleri küçük bir DOM test nesnesi kullanır; gerçek tarayıcıda klavye, odak, grafik ve responsive kontrollerinin yerine geçmez.


## Yeni etkileşim türleri

0.3.0 ile tabs, accordion, timeline, kanban, choices, command, drawer, stepper, filepicker ve pagination eklenmiştir. [WIDGETS.md](WIDGETS.md) API, olaylar, sınırlar ve çalışan örnekleri açıklar. Toplam 15 adaptör türü desteklenir. Widget olayları {id, componentId, value} taşır.

## 1.1.0 — Form, genel tablo ve grafik

Yeni `form`, `datagrid`, `plot` türleriyle toplam 18 tür vardır. Eski `schemaVersion: "1.0.0"` tanımları geçerlidir; yeni türler `1.1.0` gerektirir. Çalışan tanım: [extended-agent.json](../examples/extended-agent.json).

ESM için `import {MuhitAgent} from 'muhit-ui/agent'` bağımlılıkları taşır. Klasik script kullanımında form için forms.js, genel tablo için data-grid.js, grafik için plot.js dosyalarını agent.js öncesinde yükleyin. Form gönderimi onAction sonucunu bekler; `signal` iptal bilgisini taşır. Callback sonucu `{errors:{alan:mesaj}}` olabilir. Gönderim ağ adresi veya yetki içermez; bunlar uygulama işleyicisindedir.

## 0.9 olay sözleşmesi

`form-change`: value içinde values ve dirty. `edit`: value içinde güncel rows ve change. `state`: sorgu/filtre/sayfalama durumu. `column-layout`: sıralı yerleşim. `selection`: seçili kimlikler. Hepsi componentId taşır. `submit` async sonucu bekler ve signal taşır; diğer olaylar bildirimdir. Yerleşim/durum güncellemeleri uygulama API’sinden de gelebilir. Eşit kontrollü değer tekrarları olay döngüsü üretmez. Ağ, kayıt ve yetkilendirme uygulamanın sorumluluğundadır.
