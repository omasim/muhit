# Muhit Icons · standart 1.1

İkonlar insanların eylemi, içeriği ve durumu ayırt etmesini sağlar. Muhit’in doğa yaklaşımı açık iç alanlar, dengeli oranlar ve yumuşak uçlarla ifade edilir; bütün kavramlar yaprak simgesine dönüştürülmez. Logo bir ürün kimliğidir ve ikon setinden bağımsız olarak 3.1 sürümünde sabittir.

## Çizim kuralları

- Temel alan 24 × 24. Ana geometri yaklaşık 2–22 alanında; yuvarlak uç ve optik denge için sınırlı taşma olabilir.
- Varsayılan çizgi 1.75 birim, round cap ve round join. İzinli aile ağırlıkları 1.5 / 1.75 / 2. Aynı kontrol grubunda tek ağırlık kullanılır.
- Boyutlar 16 / 20 / 24 / 32 px. Metin içi 16–20, araç çubuğu 20–24, tanıtım/durum alanı 32. Tıklama hedefi ikon boyutundan bağımsız en az 44 × 44 px.
- Dolgu, degrade, gölge ve çok renkli parça yok. `currentColor` ile semantik metin/eylem rengi kullanılır. Sadece renk değiştirerek hata veya seçili durumu anlatmayın.
- Yalnız `arrow-forward`, `arrow-back` ve `chevron-forward` RTL yönünde çevrilir. Saat, kitap, grafik, doğa ve dış bağlantı işaretleri keyfî çevrilmez.
- İkonu döndürerek başka bir kavram yaratmayın; doğru isimli kaynağı kullanın. Seçili durum ikon gövdesini değiştirerek değil kontrolün yüzeyi, metni ve aria-pressed/aria-current bilgisiyle anlatılır.

## 58 işaret / yedi kategori

Gezinme, eylemler, veri, bilgi, insan, doğa ve sistem. Tam isim ve Türkçe anlam listesi `schemas/icons.json`; kaynaklar `assets/icons/*.svg`; canlı katalog `examples/foundations/icons.html`. Bütün geometri bu kütüphane için SVG olarak tanımlanmıştır; dış ikon fontu, CDN veya ağ bağımlılığı yoktur. MIT lisansı paketle birlikte geçerlidir.

```js
import { MuhitIcons } from 'muhit-ui/icons';
// Metnin yanında dekoratif kullanım; varsayılan aria-hidden=true.
const icon = MuhitIcons.mount(button, 'download', {size:20});
button.append(document.createTextNode('Dosyayı indir'));
// Bağımsız anlam taşıyan görsel:
const svg = MuhitIcons.svg('leaf', {label:'Doğa',size:24});
// Bileşenin ömrü bitince:
icon.destroy();
```

`svg` sabit geometri döndürür, label kaçışlanır; bilinmeyen ad, boyut, çizgi ve yön reddedilir. DOM yalnız mount sırasında gerekir. Klasik script için `src/icons.js`; SVG dosyaları doğrudan tasarım araçlarına aktarılabilir. Harici `<img>` içindeki currentColor sayfa rengini miras almaz; tema rengi için inline API kullanın.

Yalnız ikon içeren düğmede erişilebilir ad **düğmede** bulunmalıdır: `<button aria-label="Dosyayı indir">…dekoratif SVG…</button>`. Her ikona ayrı tab durağı eklemeyin. Araç ipucu tek erişilebilir ad kaynağı değildir.

## Uyumluluk ve AI sözleşmesi

0.13 sürümünde mevcut bileşenler ve stüdyo ortak `MuhitIcons` kaynağına geçirilmiştir. `Muhit.icon()` API’si korunur; `arrow → arrow-forward`, `sliders → settings`, `chevron → chevron-forward`, `bookmarkFilled → bookmark` eşleştirmeleri kullanılır. Seçili yer imi artık dolgu değil düğmenin `aria-pressed` durumu ve yüzeyiyle belirtilir. Bilinmeyen eski adlar önceki davranış gibi grid işaretine döner; yeni API bilinmeyen adı reddeder.

**Klasik script geçişi:** `src/icons.js` dosyasını components, table, data-grid, charts ve widgets dosyalarından önce yükleyin. ESM girişleri bağımlılığı kendileri yükler. Tema varsayılanı 1.75’tir. Eski 1.25 tema girdisi uyumluluk için kabul edilir ve 1.5 çizgiye yükseltilir. Açıkça `dir` verilmeyen yönlü ikonlar CSS ile bulundukları bölgenin yönünü izler; açık RTL seçimi SVG geometrisinde uygulanır.

Sıralama kontrolünde `chevron-down` işaretinin yukarı dönmesi aynı sıralama kavramının artan durumunu gösterir; `aria-sort` da güncellenir. Grafik yolları veri görselleştirmesidir ve ikon setiyle değiştirilmez.

Agent yalnız manifestte bulunan `name` değerlerini seçmeli. SVG path, HTML, URL veya onClick kodu üretmek yerine izinli adı ve eylem kimliğini uygulamaya iletmeli. İkon ismi yürütme yetkisi değildir. Bu manifest agent’ın mevcut 18 bileşen şemasına yeni tür eklemez.

0.15: Tek ikon için `muhit-ui/icons/leaf` girişini kullanın; mount/svg seçenekleri aynıdır. Tam katalog girişi korunur. [İngilizce ayrıntılar](ICONS.en.md).
