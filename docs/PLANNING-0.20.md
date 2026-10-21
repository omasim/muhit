> Bu belge 0.20 temel API kaydıdır. Güncel 0.22 ekleri ve sınırları: [P3 kapsamı](P3-0.22.md), [geçiş](MIGRATION-0.22.md), [doğrulama](VERIFICATION-0.22.md).

# Muhit 0.20 · Planlama, belgeler ve dikkat

0.20.0-beta.1; 22 Ekim 2026. 0.19 ürün sistemine üç modül, dört yeni sayfa ve gelişmiş bildirim akışı ekler. Mevcut Muhit 3.1 logosu, semantik tokenlar, 16 renk modu ve altı yerleşim tarifi korunur. Yeni modüller açık ESM girişleridir; 18 türlük Agent JSON renderer kapsamına otomatik olarak eklenmez.

## P3 kapanış sırası

| Öncelik | Uygulama | Doğrulama / sınır |
|---|---|---|
| P3.1 Takvim | Ay görünümü, seçili gün ajandası, kaynak çakışması, UTC giriş ve yerel saat dilimi gösterimi | Yarı açık zaman aralığı, gece yarısı ve DST testleri. 500 etkinlik. Tekrarlama/drag-resize yok. |
| P3.2 Belge | Paragraf, başlık, alıntı, liste; blok düzeyi kalın/italik, sıra değişimi, kaldırma, önizleme | 100 blok; blok başına 10.000 karakter. Satır içi aralık biçimlendirmesi veya işbirlikli CRDT editörü değil. |
| P3.2 Sürümler | 30 yerel sürüm, 50 geri alma adımı, geri alınabilir sürüm dönüşü, başlık/blok/sıra karşılaştırması | Yerel oturum. Kalıcı geçmiş uygulama adaptörüyle saklanır. |
| P3.3 Bildirim | Türe göre gruplama, bir saat erteleme, ertelenen filtre, erken geri getirme, geri alma | Geçmiş kayıtlar korunur. Erteleme en geç 60 saniyelik kontrolle görünür olur; arka plan sekmelerinde tarayıcı zamanlayıcı sınırı geçerlidir. |
| P3.3 Tercihler | Anında/günlük/kapalı ve sessize alınmış türler | Teslim politikası verisi; e-posta servisi veya scheduler sağlamaz. Sunucu kaydı ancak `persisted:true` sonucuyla bildirilir. |
| P3.4 Büyük veri | Mevcut sayfalama tekrar ölçüldü | 20.000 kayıt, DOM'da 10 satır. Sanallaştırma için ölçülmüş ihtiyaç yok. Grup/çoklu sıralama yeni bir ürün gereksinimi olmadan eklenmedi. |
| P3.5 Tasarım eşleme | 15 modül ailesi, 30 görsel anatomi varyantı; mevcut Figma token ve yazı stilleri | `design/figma/modules-0.20.json`, `docs/DESIGN-CODE-0.20.md`. Şematik anatomi; bütün ekranların piksel eşliği veya native Code Connect yayını değil. |
| P3.6 Sektör sayfaları | Araştırma programı ve ekip proje alanı | Kaynaklar + takvim + tartışma gerçek modül bileşimi. Faturalama/abonelik/ticari rezervasyon ihtiyacı tanımlanmadığından kapsam dışı. |

## Kurulum ve girişler

```js
import {mountCalendar, mountDocumentEditor, mountNotificationCenter} from 'muhit-ui/planning';
import 'muhit-ui/styles/base.css';
import 'muhit-ui/styles/suite.css';
import 'muhit-ui/styles/planning.css';

const calendar = mountCalendar(document.querySelector('#calendar'), [{
  id: 'review', title: 'Araştırma değerlendirmesi',
  start: '2026-10-22T09:00:00.000Z', end: '2026-10-22T10:00:00.000Z',
  resource: 'Atölye'
}], {locale: 'tr', timeZone: 'Europe/Istanbul', date: '2026-10-22'});
// Framework unmount sırasında:
// calendar.destroy();
```

Saatler kanonik UTC ISO (`.000Z` dahil) olarak saklanır. Form açıkça UTC giriş bekler; ajanda `timeZone` ile gösterilir. Çakışma aynı kaynak ve kesişen `[start,end)` aralığı için hesaplanır. Çakışmayan bitiş/başlangıç komşuluğu serbesttir. İstemci denetimi rezervasyon kilidi değildir; sunucu işlemi kendi atomik çakışma ve izin denetimini yapmalıdır.

`mountCalendar` sözleşmesi: `element`, `getSnapshot()`, `update(events)`, `destroy()`. `onCommit(event, signal)` verilmezse ekleme yereldir. Verilirse `Promise<{persisted:boolean}>` döner. Hata/iptal taslağı korur; iptal ve `update/destroy` geç yanıtların uygulanmasını engeller. İstek beklerken değiştirilen yeni form taslağı, eski isteğin başarısıyla sıfırlanmaz. `onChange(events)` uygulamaya yeni yerel veri kopyasını iletir.

## Belge modeli

```js
const editor = mountDocumentEditor(document.querySelector('#editor'), {
  title: 'Araştırma notları',
  blocks: [
    {id:'intro', type:'paragraph', text:'İnsan ölçeğinde bir çevre.', bold:true},
    {id:'steps', type:'list', text:'Gözlemle\nDeğerlendir\nGeliştir'}
  ]
}, {locale:'tr', onSave: async (document, signal) => {
  const response = await fetch('/api/documents/research', {
    method:'PUT', signal,
    headers:{'Content-Type':'application/json'}, body:JSON.stringify(document)
  });
  if (!response.ok) throw new Error('Save failed');
  const result = await response.json();
  return {persisted:result.persisted === true};
}});
```

Örnekteki `/api/...` uygulamanın sağlayacağı uç noktadır; Muhit backend oluşturmaz. Yetki, sürüm çakışması, kalıcı saklama ve yanıt doğrulaması uygulamaya aittir. Muhit kaydı doğrulanmayan sonucu başarı olarak göstermez. İstek sırasında yeni değişiklik yapılırsa gönderilen sürümün kaydedildiği ve yeni taslağın kaldığı ayrı bildirilir.

Headless API: `validateDocument`, `createDocument`, `compareDocuments`. `createDocument` controller: `getSnapshot`, `edit`, `undo`, `checkpoint`, `restore`, `destroy`. Görsel editör: `element`, `getSnapshot`, `destroy`. Liste satırları `\n` ile ayrılır. Bütün içerik metin düğümleri olarak işlenir; HTML çalıştırılmaz. Karşılaştırma blok kimlikleriyle yapılır; sözcük düzeyinde diff/merge değildir. Yerel sürümler sayfa kapanınca gider; uygulama açık saklama politikası belirlemelidir.

## Bildirim merkezi

```js
const center = mountNotificationCenter(document.querySelector('#notifications'), [
  {id:'review', title:'Yeni inceleme', type:'Araştırma',
   createdAt:'2026-10-22T09:00:00.000Z', read:false}
], {
  locale:'tr', preferences:{delivery:'daily',mutedTypes:[]},
  onChange: items => { /* uygulama isterse değişiklikleri saklar */ }
});
const snapshot = center.getSnapshot();
// snapshot.preferences: uygulanmış politika
// snapshot.draftPreferences: henüz uygulanmamış seçimler
// snapshot.items / query / filter / groupBy: gelen kutusu durumu
```

`onPreferences(preferences, signal)` adaptörü varsa sunucu onayı aranır; yoksa açıkça yalnız oturum içi uygulama bildirilir. Tercihler geçmiş gelen kutusunu silmez veya gizlemez; uygulama teslim katmanı politikayı uygular. `mutedTypes` en fazla 50 benzersiz tür; `delivery` immediate/daily/off.

`center.inbox` önceki Inbox controller'ını sunar. `mountInbox` yeni `groupBy:'none'|'type'` ve testler için `now:()=>number` seçeneklerini kabul eder. `View.groupBy` isteğe bağlıdır; eski `{query,filter}` geri yüklemeleri çalışır. Yeni `snoozed` filtresi ve `Notification.snoozedUntil?:string|null` alanı vardır. Headless `createInbox.snooze(ids, until)` geri alınabilir. `destroy` zamanlayıcıları ve dinleyicileri temizler.

## Sayfa kataloğu

`examples/product/?page=calendar`, `?page=editor`, `?page=notifications`, `?page=research`, `?page=team`. Böylece 16 ana ürün sayfası olur. İlk iki sektör şablonu mevcut modülleri tekrar kullanır, özel kopya veri tabloları oluşturmaz. Hizmet örnekleri kurgusal ve yereldir.

## Erişilebilirlik ve kabul

Native form/label/select/button, görünür odak, klavye ile blok taşıma, durum bildirimleri, mantıksal yön ve responsive sütunlar kullanılır. Tarih hücreleri native düğmelerdir; karmaşık ARIA grid klavye davranışı iddia edilmez. Otomatik axe taraması manuel ekran okuyucu kabulünün yerine geçmez. Ayrıntılı güncel sonuç: `VERIFICATION-0.20.md`.
