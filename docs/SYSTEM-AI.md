# AI ve Agent kompozisyon sözleşmesi

Geliştirme agent’ı önce `schemas/component-contracts.json`, `schemas/patterns.json`, `schemas/pages.json`, token manifesti ve tipleri okumalı. UI görünümünde yalnız mevcut 18 tür kullanılır. Kompozisyon üst katmanıdır: `schemas/system.schema.json`.

```js
const review = MuhitSystem.review(proposal);
if (!review.valid) showErrors(review.errors);
const session = MuhitSystem.createSession(proposal, {
 approve: async (action,payload,signal) => askUser(action.confirmation),
 authorize: async (action,signal) => checkApplicationPermission(action.id,signal),
 execute: async (action,payload,signal) => executeRegisteredAction(action.id,payload,signal),
 onEvent: event => renderOperationStatus(event)
});
session.preview(host); // Hiçbir execute çağrısı yapmaz.
await session.apply('approved-action',payload);
session.cancel();
session.destroy();
```

Review: sayfa/UI şemaları, gerçek component referansları, benzersiz action id, form submit bağı, onay açıklaması ve veri kaynağı/kalıcılık beyanını denetler. JSON serbest kod veya HTML taşımaz. Fazla bileşen ve eksik grafik birimi uyarı üretir; uyarılar tasarım incelemesinde değerlendirilmelidir.

Önizlemedeki tıklama ve form submit dış işlem başlatmaz; submit `persisted:false` ile sonuçlanır. `apply` için uygulama tarafından verilen authorize zorunludur. Write/destructive ayrıca approve gerektirir. Bu callback’ler güvenlik sınırının UI tarafıdır; sunucu her isteği yeniden yetkilendirmelidir. JSON’un onay metni izin değildir. Tool/MCP sunucusu veya model hizmeti bu paket tarafından kurulmaz.

`update(nextProposal)` geçersiz öneriyi reddeder; mevcut Agent taslağının korunma sözleşmesini uygular. Uyumsuz kirli form güncellemesi reddedilir. Bekleyen operation iptal edilir. Önizleme host değiştirmek için session destroy gerekir. Onay geçerli öneriye bağlanmalı, öneri değişince tüketici onayını temizlemelidir; referans stüdyo bunu yapar.

Eylem id’leri uygulamanın kayıtlı handler’larına eşlenmeli; modelden gelen isimle rastgele fonksiyon veya URL çalıştırılmamalı. Birbirinden farklı eylemler için işlemsel kilit ve sunucu idempotency uygulamanın sorumluluğudur. İptal sırasında onay/izin yanıtı geç gelirse execute çağrılmaz.

Onay ve yetki callback’leri yalnız boolean `true` döndürdüğünde işlem yürütülür; truthy nesne veya metin kabul edilmez. Bu sınır sunucu yetkilendirmesinin yerine geçmez.
