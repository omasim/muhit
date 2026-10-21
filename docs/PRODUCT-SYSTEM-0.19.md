# Muhit 0.19.0-beta.1 · Ürün sistemi

Bu beta, 0.18 tabanını paketlenebilir çalışma alanı modülleri ve ürün akışlarıyla birleştirir. Backend, kimlik doğrulama veya gerçek AI servisi sağlamaz; bunların UI bağlantısını ve sonuç sözleşmesini sağlar. Logo 3.1 sabittir. Agent JSON hâlâ 18 render türüdür.

## Katmanlar ve girişler

| Giriş | API | Kapsam |
|---|---|---|
| `muhit-ui/content` | mountCard, mountRow, mountSection | Altı içerik ailesi, durum taşıyan bölümler |
| `muhit-ui/inbox` | createInbox, mountInbox | Okundu/arşiv/geri al |
| `muhit-ui/activity` | mountActivity | Kronolojik ve filtrelenebilir akış |
| `muhit-ui/resources` | mountResources | Kart/liste/tablo, ortak sorgu ve tablo görünümü |
| `muhit-ui/shell` | mountShell | Altı MuhitPages tarifini kullanan ortak navigasyon, toolbar, bölgeler |
| `muhit-ui/product` | mountAdvancedForm | Metin, e-posta, parola, textarea, çoklu seçim, etiket metni, tarih aralığı, saat/saat dilimi; alan hata özeti |
| aynı | mountMultiCombobox | Klavyeli çoklu seçim, kaldırılabilir seçimler, iptal edilebilir uzak arama |
| aynı | mountSavedFilters | Aktif filtreler, oturumluk adlandırılmış görünümler |
| aynı | createUploadQueue, mountUploads | Kuyruk, ilerleme, iptal, tekrar deneme, güvenli resim önizlemesi |
| aynı | mountDiscussion | Yanıt dizisi, çözümleme, korunmuş yorum taslağı |
| aynı | mountAccess | Üye rolü, davet durumu, izin rehberi ve servis callback'i |
| aynı | mountAssistant | Akış halinde metin, kaynak, araç durumu, karşılaştırma, durdurma ve açık onay |
| aynı | mountAnalytics | Dönem isteği, karşılaştırma, veri kaynağı/güncelliği, eksik veri, ayrıntı callback'i |

Ana envanter `schemas/component-contracts.json`; çalışma alanı manifesti `schemas/workspace-modules.json`; oluşturulmuş registry aynı kaynakları taşır. TypeScript tanımları her public girişin yanındadır. Bu kayıtlar yeni Agent JSON türü oluşturmaz. Callback'ler güvenilir uygulama kodudur; AI çıktısından fonksiyon veya HTML yürütülmez.

## Kurulum ve tema

```js
import 'muhit-ui/styles/fonts.css'; // İsteğe bağlı font yüklemesi
import 'muhit-ui/styles/base.css';
import 'muhit-ui/styles/pages.css';
import 'muhit-ui/styles/system.css';
import 'muhit-ui/styles/content.css';
import 'muhit-ui/styles/table.css';
import 'muhit-ui/styles/suite.css';
import 'muhit-ui/styles/product.css';
import {MuhitTheme} from 'muhit-ui/theme';
import {mountResources} from 'muhit-ui/resources';

MuhitTheme.apply({mode:'dark',density:'compact',radius:'square',scale:1.25});
const api=mountResources(document.querySelector('#resources'),records,{
  locale:'tr-TR', timeZone:'Europe/Istanbul', headingLevel:2,
  onOpen: record => openDetail(record)
});
const view=api.getView();
api.restoreView(view);
await api.load(async signal => ({outcome:'success',items:await service.list({signal})}));
api.cancel();
api.destroy();
```

Suite ve product boyutları semantik renk, köşe, boşluk ve metin ölçeğini kullanır. TR/EN kontrol metinleri hazırdır; BCP47 locale, `messages`, `dir` ve `timeZone` ortak MuhitI18n bağlamından gelir. Kayıt içeriği ve referans sayfaların editoryal metinleri otomatik çevrilmez. DE/AR tam editoryal çeviri iddiası yoktur. `styles/index.css` eski tam giriş davranışını korur; yeni özellik CSS'lerini açıkça ekleyin.

## Durum, bağlam ve yaşam döngüsü

Inbox/activity/resources: `setState(content|loading|refreshing|empty|error|partial|cancelled)`, `getState`, `load`, `cancel`, `getView`, `restoreView`, `getSnapshot`, `update`, `destroy` sağlar. Yenileme eski içeriği korur; boş durumda DOM silinmeden gizlenir. `load` açık success/partial sonucu ister; iptal edilmiş veya daha eski isteğin sonucu uygulanmaz. Retry son loader'ı yeniden çağırır. Sunucu güncellemesi undo geçmişini temizler. Dış `update` veri doğrulamasından sonra görünümü değiştirir.

Resources tablo sütun görünümü kart/liste geçişinde saklanır. Dil/yön demo remount'u görünüm snapshot'ını geri yükler. Activity yeni veride bulunmayan tür filtresini tüm türlere indirger. Görünüm verisi izin belgesi değildir. İlk kayıt modülleri en fazla 500 kayıt içindir; daha büyük veri için server pagination/filtre adaptörü kullanın.

`mountShell` altı mevcut sayfa tarifinin bölgelerini sunar; tek main/h1 ve mobil navigasyon sağlar. Sayfa `setState` alanların DOM'unu korur. Ana sayfa durumları content/loading/empty/error/forbidden/partial'dır. Metinleri gerekirse uygulama sağlar.

## Servis sözleşmeleri

- Form `onSubmit(values, signal)` → `{outcome:'success'|'partial', persisted:boolean, errors?:{fieldId:message}}`. Kısmi sonuç ve hatada taslak korunur. Alan hataları özet ve ilgili kontrole bağlanır. Servis yoksa yalnız doğrulanmış yerel sonuç bildirilir. Parola alanlarını depolamayın.
- Upload `upload(file,{signal,onProgress})` → `{persisted:true,...}`. `true` gelmeden “yüklendi” durumu oluşmaz. İptal geç yanıtı geçersiz kılar; yeniden deneme yeni attempt açar. Varsayılan 20 dosya/20 MiB, MIME allowlist opsiyoneldir. Resim önizleme yalnız PNG/JPEG/WebP/GIF; object URL kapanış/destroy'da bırakılır. Bu istemci doğrulaması sunucu dosya taramasının yerine geçmez.
- Access `onCommit(change,signal)` → `{persisted:true}`. Doğrulama gelmeden rol güncellenmez. Davet gönderme ve erişim denetimi uygulamaya aittir; izin tablosu bir UI rehberidir.
- AI `run(prompt,signal)` async iterable: text, source, tool, proposal olayları. Kaynaklar HTTP(S), kullanıcı metni textContent'tir. `apply(proposal,signal)` yalnız inceleme onayından sonra çağrılır; persisted true olmadan kayıt başarı bildirilmez. Durdurma taslağı/yanıtı korur. Geç yanıt uygulanmaz.
- Analytics `onPeriod(period)` veri isteğidir; eski veri yeni dönemin verisi gibi sunulmaz. Yeni kayıtlar `update(items)` ile verilmelidir. `null` eksik veridir, sıfıra dönüştürülmez.
- Discussion ve saved-filters yerel UI durumlarıdır; callback/snapshot ile uygulamaya aktarılır. Yorum sayısı 500, yorum metni 4000, kayıtlı görünüm sayısı 20 ile sınırlıdır. Kalıcı kayıt ve conflict çözümü üründe yönetilir.

## Sayfa aileleri

`examples/product/` içinde 12 ana sayfa: başlangıç, kayıt yönetimi, hesap/organizasyon, dosya merkezi, arama, sistem durumları, AI, analitik, yorum, ekip/erişim, bildirim ve etkinlik. Bunlar mevcut Atölye'nin 12 ana ekranını değiştirmeden tamamlar.

Alt akışlar: giriş/davet/alan oluşturma; oluştur/düzenle/incele/arşivle/sil/çakışma; profil/güvenlik/bildirim tercihleri; 403/404/oturum/çevrimdışı/hata. Üst durum seçicisi bütün sayfalarda yüklenme/boş/hata/yetkisiz/kısmi durumları gösterir. Referans adaptörler gerçek kimlik doğrulaması, davet veya dosya yüklemesi yapmaz. Kayıt örneğinde yalnız açık kaydet ile sessionStorage kullanılır.

## React / Vue

`examples/react/WorkspaceExtension.tsx` ve `examples/vue/WorkspaceExtension.vue` paket girişinden import eder. React effect, Vue mounted/watch sonrasında mount; cleanup/unmount sırasında destroy uygulanır. Framework testleri TGZ'yi temiz projeye kurar; development/production/SSR kiplerinde açma, veri güncelleme, kaldırma ve yeniden açma kontrol edilir. Bunlar bağımsız framework paketleri değildir.

## Sınırlar ve kabul

Beta, 1.0 kararlılık garantisi değildir. Manuel VoiceOver/NVDA/JAWS ve fiziksel iOS/Android kabulü ayrı kalır; otomatik axe bunu kanıtlamaz. Etiket alanı virgülle ayrılan metin girişidir; zengin editör değildir. Yorumlar tek yanıt düzeyi kullanır. Upload resumable chunk protokolü içermez. AI çalışma geçmişi instance belleğindedir. Bu sınırların dışına çıkarken yeni sürümlü sözleşme gerekir.

Yeni workspace/product modülleri ESM-only dağıtılır. Eski klasik script API’leri değişmez. Klasik script eşdeğeri varmış gibi kullanılmamalıdır.
