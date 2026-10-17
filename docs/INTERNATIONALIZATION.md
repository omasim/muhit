# Dil ve yön sözleşmesi · 0.8

Türkçe varsayılandır. İngilizce etkileşim metinleri form, veri tablosu, widget, bildirim, proje tablosu ve grafik modüllerinde bulunur. Uygulamanın başlığı, alan adları, kayıtları, özel doğrulama/sunucu hataları otomatik çevrilmez; uygulama bunları seçilen dilde sağlar. Stüdyonun tasarım açıklamaları ve eski demo rehberleri Türkçe içeriktir.

```js
import { MuhitI18n, MuhitForm } from 'muhit-ui';
const form = MuhitForm.mount('#form', {
  locale: 'en-US',
  fields: [{name:'email',label:'Email',type:'email',required:true}],
  onSubmit: values => application.save(values)
});
```

`LocaleOptions`: `locale`, isteğe bağlı `dir: 'ltr' | 'rtl'`, `messages: Record<string,string>`. Form, DataGrid, Widgets, Table, Charts ve toast bu seçenekleri kabul eder. Agent `render` seçeneklerini alt bileşenlere aktarır; datagrid/plot tanımında açık bir locale varsa o geçerlidir. Plot dili veri nesnesindeki `locale` üzerinden belirlenir; özel çeviriler kayıtlı katalogdan gelir.

`MuhitI18n.create(options)` bağımsız bağlam döndürür: `locale`, `dir`, `text(source,fallback,params)`, `number(value,options)`, `date(value,options)`. BCP-47 dil etiketleri Intl ile doğrulanır. Arapça, Farsça, İbranice ve Urduca için varsayılan yön RTL'dir. Bu dillerin hazır çeviri paketi yoktur; katalog sağlanmalıdır. Eksik çeviri İngilizce karşılığına, yoksa kaynak metne döner.

```js
MuhitI18n.register('de', {'Kaydet':'Speichern', 'Sıfırla':'Zurücksetzen'});
const language = MuhitI18n.create({locale:'de-DE'});
language.text('Kaydet'); // Speichern
MuhitI18n.setLocale('en-US'); // Sonraki oluşturulan bağlam ve bileşenler için
```

Katalog anahtarları kaynak metindir; değişken metinler `{label}` ve `{count}` gibi yer tutucular kullanır. Mesajlar HTML değildir. Her bağlam katalog ve seçeneklerin kopyasını alır; bir bileşenin dili başka bir bileşeni değiştirmez. `setLocale` mevcut bileşenleri otomatik yeniden çizmez. Dil değiştirmek için mevcut form değerlerini/tablo durumunu alıp yeni dil ile yeniden mount edin. [Çalışan örnek](../examples/international.html) bu akışta form taslağını ve sütun düzenini korur. SSR import DOM gerektirmez; istek başına farklı dil için global varsayılan yerine açık locale kullanın.

Klasik script kullanımında `src/i18n.js` dosyasını bileşenlerden önce yükleyin. ESM alt girişleri bağımlılığı otomatik alır. Uygulama belge kökündeki `lang` ve `dir` değerlerini de güncellemelidir. Muhit kendi bileşen köklerinde bunları yazar; uygulama belgesini değiştirmez.

0.9: bölgesel katalog ana dilin üzerine birleştirilir; bileşen messages son önceliktedir. Grid setState locale değişimini kabul etmez. getView/restoreView ile dili değiştirirken görünürlük ve seçimi de koruyun.

Tablo sayımları sabit `{count} kayıt seçili` ve `{total} kayıt · Bu sayfada {count} kayıt` kaynak anahtarlarını kullanır. Özel messages bu şablonları çevirebilir; sayılar locale ile biçimlenir. Hazır İngilizce tekil/çoğul ifadeler seçer; diğer dillerin özel çoğul kuralları uygulamanın mesaj katmanında sağlanmalıdır.
