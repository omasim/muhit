# Etkileşim bileşenleri

Güncel sürüm ve doğrulama: [CURRENT.md](CURRENT.md).

MuhitWidgets, framework gerektirmeyen 10 bileşeni tek bir yaşam döngüsüyle sunar. Aynı tanımlar MuhitAgent içinde de kullanılabilir. Yapılandırmalar JSON verisidir; metinler textContent ile gösterilir.

| Tür | Davranış | Olay |
| --- | --- | --- |
| tabs | Ok tuşları, Home/End ile sekme seçimi | select |
| accordion | Native details; tekli veya çoklu açılım | toggle |
| timeline | Durum, açıklama ve zaman gösterimi | Salt okunur |
| kanban | Etiketli seçim alanıyla sütun değiştirme | move |
| choices | Açıklamalı tekli / çoklu seçim kartları | change |
| command | Arama, sonuçlarda ok tuşları, Enter ve Escape | command |
| drawer | Native dialog, sağ yan panel | open / close |
| stepper | Önceki/sonraki ve doğrudan adım seçimi | step |
| filepicker | Dosya seçimi, sürükleyip bırakma, limitler, kaldırma | files |
| pagination | Sınır kontrollü sayfa geçişi | page |

## Kullanım

```js
import { MuhitWidgets } from 'muhit-ui';
import 'muhit-ui/styles/index.css';

const spec = {
  type: 'tabs', id: 'project-tabs', title: 'Ortak çalışma',
  items: [
    { id: 'purpose', label: 'Niyet', content: 'Birlikte üretmek.' },
    { id: 'people', label: 'İnsanlar', content: 'Herkese açık bir alan.' }
  ]
};
const result = MuhitWidgets.validate(spec);
if (!result.valid) throw new Error(JSON.stringify(result.errors));
const instance = MuhitWidgets.mount(container, spec, {
  onAction: ({ type, componentId, value }) => console.log(type, componentId, value)
});
instance.getValue(); // JSON durumunun bağımsız kopyası
instance.update(spec); // yeni tanımla başlangıç durumuna döner
instance.destroy(); // olayları, dialogları ve sahip olduğu DOM'u kaldırır
```

Klasik HTML yükleme sırası: widget-schemas.js → widgets.js → agent.js. Temel stil girişi styles/index.css; tema için theme.js kullanılır. ESM girişi bağımlılıkları otomatik yükler.

## Veri ve yaşam döngüsü

Her bileşen type, id, title gerektirir. Tam alanlar ve sınırlar [widgets.schema.json](../schemas/widgets.schema.json), çalışan 10 örnek [widgets.json](../examples/widgets.json) içindedir. Yapısal JSON Schema kontrolünün yanında runtime, kimliklerin benzersizliğini ve sütun/sekme/seçenek referanslarını doğrular. Doğrulamadan geçmeyen update mevcut görünümü korur. Aynı kapsayıcıya yeniden mount önceki instance'ı kaldırır.

Olaydaki value, bileşene göre seçili kimlik, kimlik dizisi, öğe dizisi veya dosya meta verisidir. Dosyaların kendisine instance.getFiles() ile erişilir. Dosyalar yerelde kalır; yükleme, kötü amaçlı içerik taraması ve kalıcı saklama tüketici uygulamadadır. Dosya türü kontrolü kullanıcı deneyimi içindir; güvenlik doğrulaması değildir.

Kanban seçim alanları kullanır; sürükleyerek sıralama içermez. Stepper bir gezinme ilkelidir, form alanlarını doğrulamaz. Pagination veriyi çekmez, yalnız sayfa durumunu bildirir. Komut menüsü bir eylem kimliği döndürür; yönlendirme veya sunucu çağrısı uygulamaya aittir. Timeline salt okunur. Callback verilmezse bileşenler yerel durumla çalışır.

## Agent bağlantısı

```js
MuhitAgent.render(container, {
  schemaVersion: '1.0.0', components: [spec]
}, {
  onAction: ({ id, componentId, value }) => {
    // Widget olaylarında id = select, move, command vb.
    // Kartlarda id = kartın action.id değeri.
  }
});
```

Agent çıktısında keyfi HTML, stil, URL veya JavaScript kabul edilmez. MuhitAgent bir model çalıştırmaz. Modeliniz tanımı üretir; uygulamanız doğrular, render eder ve olayları yetkili iş mantığına bağlar.

## Başlık ve etiketler

`mount(host, spec, {headingLevel: 2})` kökte h2, alt bölümlerde h3/h4 üretir. 1–4 kabul edilir; varsayılan 3. Hatalı seçenek DOM değişmeden reddedilir. Kullanıcı metnindeki matematik/yön işaretleri aynen korunur; simge metinden türetilmez.
