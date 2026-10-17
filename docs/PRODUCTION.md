# Muhit 0.9.0 — uygulama sözleşmeleri

## Öncelikli düzeltmeler

Editoryal kart `accent/on-accent` eşini korur. Sorumlu filtresi aktif etiket, kaldırma ve sıfırlama akışına dahildir. Tablo kaydırma alanı en fazla 60vh/560px yüksekliktedir; `tableHeader:sticky` bu alanın içinde sabitlenir. Temel seçenekler ile mevcut gelişmiş ayarlar ayrımı korunur; stüdyo 30 değişikliğe kadar geri al/yinele ve oturum başlangıcından fark listesi sağlar.

## Kartlar ve agent sayfaları

`variant`: default, horizontal, sage, ink. `state`: default, selected, disabled, loading, error. Durumlar metinle belirtilir; loading/disabled eylemleri kapatır. Hata kartının eylemi yeniden deneme için kullanılabilir. Kart bütünü tıklanabilir yapılmaz; eylem native button'dır. Uzun metin sarılır. Seçili kart seçim sisteminin kendisi değildir; uygulama durumunu yansıtır.

`UISpec.page = {title, description?, layout?: 'stack'|'grid'}` ile agent sayfası üretilebilir. Sayfa yeni bir bileşen türü değildir; doğrulanmış bileşenleri saran isteğe bağlı bir düzendir. Mevcut 1.0.0 tanımları çalışır; yeni alanları eski kütüphane reddeder. `examples/rich-agent.json` tüm kart durumlarını gösterir. Ham HTML, URL ve çalıştırılabilir içerik kabul edilmez.

Stüdyo bileşen ve sayfa seçimini URL'de taşır; yenileme ve tarayıcı geri dönüşü desteklenir. Agent JSON taslağı sayfadan ayrılmadan önce değişmişse tarayıcının yerel uyarısı istenir. Muhit bir router veya hesap veri deposu değildir; uygulamadaki kayıt/rota engelleme politikası tüketiciye aittir.

## Genel tablo

`MuhitTable` önceki proje tablosudur ve korunur. `MuhitDataGrid` herhangi bir metin/sayı/tarih şeması için ayrı API'dir. ESM girişi ve klasik `src/data-grid.js` aynı global API'yi verir. Kolonlar `{key,label,type?,sortable?}`; satır kimliği benzersiz string; eksik değerler `—` gösterilir, sıfır uydurulmaz.

```js
const grid = MuhitDataGrid.mount(host, {
  columns: [
    { key: 'name', label: 'Başlık' },
    { key: 'amount', label: 'Miktar', type: 'number' },
    { key: 'date', label: 'Tarih', type: 'date' },
  ],
  rows: [{ id: 'a', name: 'Kaynak', amount: 12, date: null }],
  onStateChange(state) { /* URL veya uygulama deposuna aktar */ }
});
grid.setState({query:'Kaynak',page:1});
grid.setRows(nextRows); // Önce doğrulanır; başarısızsa eski veri korunur.
grid.destroy();
```

Uzaktan kullanımda `rows` yerine `load(state, signal)` verilir. Uygulama sağlayıcısı `{rows,total}` döndürür; arama, sıralama ve sayfalama sunucuda yapılmalıdır. `state`: query, sort, direction, page, pageSize. Sağlayıcı AbortSignal'i taşımalı; Muhit ayrıca eski yanıtları sürüm numarasıyla yok sayar. Bekleme, boş sonuç, hata ve yeniden dene görünümü vardır. `refresh()` tekrar yükler; `destroy()` isteği ve gecikmeli aramayı iptal eder. Muhit ağ adresi veya kimlik bilgisi yönetmez.

10.000 satırlık yerel test, yalnız seçili sayfanın DOM'a yazıldığını denetler. Bu tüm cihazlar için performans garantisi değildir. 100.000 üstü veri yerel doğrulamada reddedilir; büyük veride sunucu sağlayıcısı kullanın. Grid yerel hücre düzenleme sunar; sütun boyutlandırma, sıralama ve sabitleme sunar; sanallaştırma ve gruplama sunmaz. Bu özellikler gelecekte ayrı kapsamdır.

## Framework yaşam döngüsü

`examples/react/MuhitGrid.tsx` ve `examples/vue/MuhitGrid.vue` host tabanlı entegrasyon örnekleridir. Framework host öğeyi, Muhit host içini yönetir. React StrictMode yeniden bağlamasında destroy çağrılır. Kolon değişikliği yeniden mount, satır değişikliği setRows kullanır. Bu klasörler bağımsız Vite uygulamaları içerir; geliştirme ve üretim modları paketlenmiş TGZ ile test edilir. Asenkron uygulamada istemci tarafında mount edin; SSR sırasında DOM çağırmayın.

## Doğrulama ve yayın

```sh
npm install
npx playwright install chromium
npm run verify:all
npm pack --dry-run
```

`verify:all`, temel doğrulamaya iki framework uygulamasının derleme ve tarayıcı testini ekler. `verify`: Node import kontrolü, saf sözleşme testleri, sabit logo hash kontrolü ve gerçek Chrome/Chromium tarayıcı regresyonları. Test sunucusu geçici yerel port açar ve kapanır. CI tarifi `.github/workflows/verify.yml` bağımsız kütüphane deposunun köküne göre hazırlanmıştır; monorepoda working-directory ayarlanmalıdır. Kaynak deposu omasim/muhit; uzak CI sonucu VERIFICATION.md içinde izlenir. npm yayını yapılmadı.

Yerel tarayıcı alternatifi: `MUHIT_CHROME=/.../Chrome`. Geliştirme ortamında Playwright başka yerdeyse `MUHIT_PLAYWRIGHT_MODULE` mutlak modül yolunu alabilir. Tüketici paketinde test araçları çalıştırma bağımlılığı değildir.

0.7 form, genel tablo, grafik ve agent ayrıntıları: [sürüm rehberi](RELEASE-0.7.md).

0.9 sözleşmeleri: RELEASE-0.9.md, FRAMEWORKS-0.9.md, ADVANCED-FORMS.md ve RELEASE-POLICY.md. Manuel erişilebilirlik durumu ACCESSIBILITY-MANUAL.md içinde ayrıca izlenir.
