# Tarihsel kayıt · Atölye 03

Bu belge 0.18 çalışma uzantısını anlatır. Güncel API ve düzeltilmiş paket için [0.19 rehberine](PRODUCT-SYSTEM-0.19.md) bakın. Aşağıdaki görünüm sıfırlama ve locale sınırları 0.19 için geçerli değildir.

# Muhit çalışma alanı modülleri · Atölye 03

Bu çalışma kopyası 0.18.0 tabanına eklenmiş, henüz registry üzerinde yayımlanmamış bir uzantıdır. Önceki sürümün API'lerini korur. Atölye artık 12 ana ekran, bir katalog ve 24 mobil/masaüstü inceleme çerçevesi içerir.

## Katmanlar

Token/tema → temel bileşenler → content kart/satır/bölüm → inbox, activity, resources → sayfa kompozisyonu. Kaynak tablosu mevcut DataGrid'i; komut araması mevcut Widgets command bileşenini kullanır. Yeni bir paralel tablo veya modal altyapısı oluşturulmaz. React/Vue uygulamalarında mount işlemini effect/mounted içinde, destroy işlemini cleanup/unmounted içinde çağırın.

| Giriş | Davranış | Veri sahibi |
|---|---|---|
| `muhit-ui/inbox` | Okundu, arşiv, toplu görünenleri okundu, tek adım geri alma | Uygulama |
| `muhit-ui/activity` | Kronolojik akış, arama, olay türü filtresi | Uygulama |
| `muhit-ui/resources` | Kart/liste/tablo, arama, sıralama, detay callback'i | Uygulama |
| `muhit-ui/content` | Altı kart ailesi, satır ve durum taşıyan bölüm | Uygulama |

## Kurulum örneği

```js
import 'muhit-ui/styles/tokens.css';
import 'muhit-ui/styles/content.css';
import 'muhit-ui/styles/components.css';
import 'muhit-ui/styles/table.css';
import 'muhit-ui/styles/suite.css';
import {mountResources} from 'muhit-ui/resources';

const resources = mountResources(document.querySelector('#resources'), [{
  id: 'research-1', title: 'Mekân araştırması', type: 'Araştırma',
  owner: 'Ece', updatedAt: '2026-10-22T10:00:00.000Z'
}], {locale:'tr', dir:'ltr', headingLevel:2, onOpen(item) {
  // Uygulamanın detay sayfasını veya diyaloğunu açın.
}});
resources.update(nextRecords); // Önce doğrular; hatalı veri mevcut görünümü bozmaz.
resources.destroy(); // Görünümü ve dinleyicileri kaldırır.
```

Her mount API'si `element`, `getSnapshot`, `update`, `destroy` döndürür. Snapshot verileri kopyadır. Ortak seçenekler locale tr/en, dir ltr/rtl, headingLevel 2/3/4 ve title'dır. TypeScript sözleşmeleri ilgili paket girişindedir. Modül başlığı ve kontroller çevrilir; kullanıcı kayıtlarının içeriği otomatik çevrilmez.

## Durum ve entegrasyon sözleşmesi

En fazla 500 kayıt kabul edilir; büyük veri için sunucu sorgusu/paginasyonu entegrasyonu gerekir. Kimlikler harfle başlar, en fazla 64 karakterdir. Tarihler tam UTC ISO (`.000Z` dahil) olmalıdır. Bilinmeyen alan, duplicate id, getter, cycle ve geçersiz tarih reddedilir. Metinler HTML olarak işlenmez.

Inbox `createInbox` ile DOM'suz kullanılabilir. `markRead(ids, value)`, `archive(ids, value)`, `undo()`, `canUndo()` ve `update()` sağlar. `onChange` yalnız yerel kullanıcı değişikliği sonrasında çalışır; sunucu başarısı anlamına gelmez. Yetkili yeni veriyle update yapmak geri alma geçmişini temizler. Modül kendi kendine depolama veya ağ işlemi yapmaz.

Resources kart/liste/tablo geçişi dış arama ve sıralamayı korur. Tablonun kendi sütun/sıralama durumu yeniden mount edildiğinde sıfırlanır. Activity filtre türü yeni veri setinde yoksa tüm türlere döner. Demo dil/yön değişimi kayıtları korur, filtreleri sıfırlar. Bu davranışları ürün seviyesinde gerekiyorsa ayrı state katmanıyla genişletin.

Yükleme/hata/kısmi sonuç için mevcut `mountSection` durumlarını kullanın; yeni veri gelmeden eski kayıtları update([]) ile silmeyin. İstek iptalini AbortController ile veri katmanında yönetin. Gerçek sunucu sonucu gelmeden “kaydedildi” bildirmeyin.

## AI / agent entegrasyonu

`schemas/workspace-modules.json` araçların okuyabileceği yetenek envanteridir; Agent renderer'a yeni tür kaydı yapmaz. Üretilen kayıtları validate fonksiyonundan geçirin. Callback'ler yalnız uygulamanın güvenilir kodunda tanımlanır; AI çıktısı eval edilmez. Kimlik doğrulama, izin denetimi ve veri yazma sunucunun sorumluluğundadır.

## Erişilebilirlik ve sınırlar

Native input/select/button, anlamlı başlık sırası, UTC zaman bilgisi, durum bildirimleri, görünür odak, RTL mantıksal boşluklar ve modal kapanışında odak dönüşü bulunur. Otomatik kontroller manuel ekran okuyucu testinin yerini tutmaz. Firefox ve fiziksel cihazlar bu turda doğrulanmadı. Backend, gerçek zamanlı senkronizasyon, tam uygulama çevirisi ve yeni React/Vue wrapper'ları bu uzantının kapsamı değildir.
