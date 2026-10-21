# İşlem, sayfa ve örüntüler

`MuhitFlow.create(initial,{run,validate,onChange})` UI bağımsız işlem modelidir. Durumlar: idle, editing, validating, submitting, success, partial, error, cancelled. `run` açık `{outcome:'success'|'partial',persisted:boolean}` döndürür; belirsiz dönüş hata sayılır. `persisted:true` yalnız tam başarıda baseline’ı ilerletir. Kısmi sonuçta başarısız kayıtlar uygulama tarafından açıklanır; taslak kirli kalır.

```js
const flow = MuhitFlow.create({note:''}, {
 run: async (draft, signal) => {
   const result = await service.save(draft, {signal});
   return {outcome:'success',persisted:true,data:result};
 }
});
flow.setDraft({note:'Taslak'});
await flow.submit();
flow.cancel(); // Bekleyen işlemi geçersiz kılar; taslağı korur.
flow.reset();  // Son kabul edilmiş baseline’a döner.
const snapshot = flow.getSnapshot();
flow.restore(snapshot); // Bekleyen işlemi devam ettirmez; editing durumuna geçer.
flow.destroy();
```

Aynı işlemde çift gönderim engellenir. Geç yanıtlar revizyon kontrolünden geçer. Geçersiz kılınan submit çağrısının Promise sonucu kendi gönderim taslağıyla cancelled döner; daha yeni işlemin başarı sonucunu ödünç almaz. Başarılı iptal sunucudaki bir yazmanın geri alındığı anlamına gelmez. Tüketici idempotency, yetki ve gerçek sonuç sorgulamasını uygulamalıdır. Değerler sonlu düz JSON olmalıdır; DOM, fonksiyon, accessor ve döngü reddedilir. JSON nesne anahtar sırası değişmişse dirty karşılaştırması konservatif olarak değişiklik sayabilir.

## Sayfa API

```js
const page = MuhitPages.mount(host,{
 version:'1.0.0',recipe:'collection',title:'Kayıtlar'
},{locale:'tr',onRetry:()=>reload()});
MuhitDataGrid.mount(page.regions.collection, gridOptions);
page.setState('loading');
page.setState('content');
page.update({version:'1.0.0',recipe:'collection',title:'Araştırmalar'});
page.destroy();
```

Altı tarif mevcut `schemas/pages.json` kaynağından gelir. İçerik bölgeleri state geçişinde kaldırılmaz; `hidden` ile korunur. Loading, empty, error ve forbidden içerik bölgelerini gizler. Partial içerikle durum mesajını birlikte gösterir. Host ayrı bir div olmalı; `main` içine yeniden `main` yerleştirmeyin. `page.destroy` çağıranın bölgelere bağladığı alt bileşenleri destroy etmez; uygulama önce çocuk instance’ları temizler. Recipe değişimi açık yeni mount gerektirir; taslak göçü uygulamaya aittir.

## Referans akışlar

- Kurumsal site: ortak yüzeyler ve indirilen görüşme notu; kayıt yapılmadığını açıklar.
- Yönetim: arama → kayıt detayı → düzenleme → başka kayıt → taslağa dönüş; yerel kayıt ve iptal; toplu işlemde seçim koruma, kısmi sonuç ve yalnız başarısız kaydı yeniden deneme.
- Veri uygulaması: grid + plot; hata/retry sırasında grid görünümünü koruma; JSON doğrulama → tablo önizlemesi → açık yerel uygulama.
- Sistem stüdyosu: token export, bileşen arama, menü/popover/tree, işlem hata/kısmi/iptal, AI inceleme; çok adımlı hazırlıkta geri dönüş ve taslak koruma.

Bütün örnekler kurgu veridir. İşletme backend’i veya çok kullanıcılı veri senkronizasyonu içermez.
