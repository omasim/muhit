# 0.17 → 0.18 geçişi

Mevcut API’ler, 18 JSON render türü, tema config 1 ve logo 3.1 korunur. Yeni sistem katmanı isteğe bağlıdır. `MuhitSystem` yeni bir AI servisi veya yetki sunucusu değildir.

```js
import { MuhitTokens } from 'muhit-ui/tokens';
import { MuhitPages } from 'muhit-ui/pages';
import { MuhitFlow } from 'muhit-ui/flow';
import 'muhit-ui/styles';
import 'muhit-ui/styles/pages.css';
import 'muhit-ui/styles/system.css';

const theme = MuhitTokens.compose([
  {preset:'grove'},
  {density:'comfortable',mode:'light'}
]);
const page = MuhitPages.mount(document.querySelector('#app'), {
  version:'1.0.0',recipe:'collection',title:'Çalışmalar'
});
// Alt bileşenleri page.regions.collection içine mount edin.
// Önce alt instance’ları, sonra page.destroy() ile kabuğu temizleyin.
```

Tema uygulaması için mevcut `MuhitTheme.apply(theme, root)` kullanılır. Token JSON dışa aktarımı tema motorunun yerine geçmez. `MuhitFlow` kullanımında uygulama kalıcılığı açıkça bildirir: `persisted:false` taslağı kirli bırakır; yalnız tam başarı + `persisted:true` baseline’ı ilerletir. Sunucuda gerçekleşmiş bir yazmayı AbortSignal geri almaz.

`MuhitPages.mount` host’u ayrı bir div olmalıdır; mevcut main içine nested main koymayın. Sayfa türü değişimi açık yeniden mount ve taslak göçü ister. Tema ve durum kontrolleri içerik gizlenince erişilebilir kalmalıdır.

`MuhitPrimitives` menü/popover mevcut DOM’a bağlanır; tooltip/tree kendi DOM’unu oluşturur. Framework unmount sırasında `destroy()` zorunludur. ESM girişleri import sırasında DOM gerektirmez; render/mount çağrısı tarayıcı gerektirir. SSR uygulamalarında mount’u istemci yaşam döngüsünde çağırın.

Dağıtım: sürüm TGZ dosyasını yükleyin; npm registry’de yayımlandığını varsaymayın. React/Vue örnekleri ayrı paket değil, desteklenen entegrasyon referanslarıdır.
