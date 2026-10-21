# Token ve tema sistemi 1.0

Kaynak sırası: `src/theme.js` mevcut renk/kontrast kararlarını, `schemas/foundations.json` yeni ölçü ölçeklerini yönetir. `npm run build:tokens` 8 palet × 2 görünüm için 16 dosya üretir. Çıktılar elle düzenlenmez.

`MuhitTokens.document(config)` temel (`primitive`), anlamsal (`semantic`) ve bileşen (`component`) referanslarını üretir. `validate` eksik referans, döngü, tip uyuşmazlığı ve geçersiz değerleri reddeder. DTCG renk/dimension/duration/number/fontFamily tipleri kullanılır. CSS gölge, birleşik transition, sticky gibi taşınamayan değerler standart token tipi gibi uydurulmaz; `org.muhit.cssValues` extension alanında saklanır. Doğrulayıcı Muhit’in bu sınırlı formatını destekler, bütün DTCG standardının genel doğrulayıcısı değildir.

```js
import {MuhitTokens, MuhitTheme} from 'muhit-ui';
const config = MuhitTokens.compose([
  {preset:'grove'},                   // sistem/marka
  {density:'compact'},               // ürün
  {mode:'system',scale:1.125},        // kullanıcı
  {contentWidth:'focused'}            // izinli yerel tercih
], {systemMode:'dark'});
MuhitTheme.apply(config, document.querySelector('#product'));
const file = MuhitTokens.exportJSON(config);
```

Katmanlar soldan sağa uygulanır. Bilinmeyen alanlar reddedilir. `system` görünümü çağıranın verdiği sistem tercihiyle çözülür; saf fonksiyon kendi başına ekran tercihini dinlemez. Referans uygulama matchMedia değişimini dinler ve cleanup yapar. Marka varyasyonu mevcut palet/özel accent ve tipografi seçenekleriyle yapılır; bu API sınırsız ham renk override kabul etmez.

Kullanıcı tercihi ürün politikasıyla filtrelenmelidir. Tema config’i dışa aktarılır; taslak/kişisel veri bu nesneye konmaz. Kontrast `MuhitTheme.audit` ile denetlenir. Bu ölçüm bütün ürünün erişilebilirlik sertifikası değildir.

`styles/system.css`, `foundations.css` ölçeklerini ve ortak layout yardımcılarını yükler. Mevcut `--mh-*` isimleri semantik uyumluluk katmanıdır; kaldırılmaz. Token graph bu isimlerle aynı kaynağa bağlıdır. Var olan light/dark görünüm değişmez.

Figma: DTCG destekleyen içe aktarma aracı ile `tokens/*.tokens.json` aktarılabilir. Koleksiyon/mode ve font eşlemesi tasarım dosyasında kontrol edilmelidir. Native Figma bileşen kütüphanesi bu kod paketinin oluşturduğu bir çıktı değildir; bu sürümde tasarım dosyası eşitliği iddia edilmez.
