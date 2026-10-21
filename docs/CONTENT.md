# İçerik aileleri · geliştirme sürümü

22 Ekim 2026. Bu API çalışma kopyasına eklendi; yayımlanmış 0.18.0 paketinde henüz bulunmaz.

`muhit-ui/content`, DOM tabanlı kart, satır ve bölüm oluşturur. İçerikler `textContent` ile yazılır. Bağlantı/görsel kaynaklarında HTTP(S) ve göreli URL kabul edilir; script/data URL’leri reddedilir. Depolama, sunucu yetkisi ve iş sonuçları tüketici uygulamaya aittir. Agent JSON türleri bu modülle genişlemez.

```js
import {mountCard, mountRow, mountSection} from 'muhit-ui/content';
import 'muhit-ui/styles';
import 'muhit-ui/styles/content.css';

const group = mountSection(document.querySelector('#library'), {
  title: 'Araştırma kaynakları', description: 'Projenin ortak okuma listesi'
});
const host = document.createElement('div');
group.region.append(host);
const card = mountCard(host, {
  title: 'Mekân gözlem notları',
  description: 'Ortak alanların kullanımı üzerine araştırma.',
  variant: 'resource',
  href: '/research/notes',
  meta: ['Araştırma', '4 bölüm'],
  status: {label: 'İncelemeye hazır', tone: 'info'},
  action: {label: 'Koleksiyona ekle', onClick: () => addToCollection('notes')}
});
group.setState('loading', 'Kaynaklar yükleniyor.');
group.setState('partial', 'Bazı kaynaklar alınamadı; mevcut içerik korunuyor.');
group.setState('content');
// Önce çocuklar, sonra bölüm temizlenir.
card.destroy();
group.destroy();
```

## Sözleşme

- `mountCard(host, options)` ve `mountRow(host, options)` aynı veri sözleşmesini paylaşır. Host tüketiciye ait boş bir kapsayıcı olmalıdır; ilk mount içeriğini değiştirir.
- Dönen instance `element`, `update(fullOptions)` ve `destroy()` sunar. Update tam yeni seçenekleri alır. Geçersiz seçenekler mevcut DOM’u korur. Destroy edilmiş instance güncellenemez; tekrar mount gerekir.
- `title` zorunlu, `headingLevel` 2–6 arasında (varsayılan 3). Sayfanın hiyerarşisine göre seçilir.
- Varyantlar: editorial, resource, profile, project, metric, proposal. Bunlar görsel sunum amaçlarıdır; otomatik iş akışı sağlamaz.
- `image`: `src` ve boş olmayan `alt`. Dekoratif görsel için görsel alanını kullanmayın.
- `meta`: en fazla sekiz metin. Her metin en fazla 4000 karakter.
- `progress`: sonlu 0–100 sayısı; anlamı açıklayan `progressLabel` gerekir.
- `status`: label + neutral/success/warning/info tonu. Durum yalnız renk olarak iletilmez.
- `action`: görünür label + onClick callback. Asenkron işlem/başarı/hata durumunu uygulama yönetir.
- `mountSection` içerik bölgesini loading/empty/error durumlarında gizler; content/partial durumlarında gösterir. Bölge çocuklarını kaldırmaz. İlgili durumda açıklama metni zorunludur.
- Section destroy, tüketici tarafından eklenen alt bileşenlerin yaşam döngüsünü yönetmez. Önce çocukların destroy işlemleri çağrılır.

## Tema ve responsive

İsteğe bağlı CSS yalnız `.mh-content-kit` alanını biçimlendirir. Muhit’in `--mh-*` değişkenlerini devralır; kendi font dosyasını yüklemez. Köşe ve iç boşluk `--mh-content-radius` / `--mh-content-padding` ile ayarlanabilir. Koleksiyonun ızgara düzenini üst kapsayıcı belirler. CSS framework veya router bağımlılığı yoktur.

## Canlı örnekler

`examples/atelier/index.html?screen=collections` kart ve bölüm; `?screen=team` satır; `?screen=catalog#live-kit` durum ve varyant örneklerini çalıştırır. `?screen=settings` açık/koyu/sistem, üç palet, yoğunluk, köşe ve tipografi tercihlerini önizleme ve açık kaydetme ile sunar.

Bu ilk API’de JSON action yürütme, router, sunucu depolama, otomatik resim yükleme hata yönetimi veya sanallaştırma yoktur. `onClick` uygulama callback’idir; güvenilmeyen JSON’dan fonksiyon üretilmez.
