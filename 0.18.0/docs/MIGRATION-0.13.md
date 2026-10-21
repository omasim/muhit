# Muhit 0.13 · ortak ikon ve sayfa standardına geçiş

18 Ekim 2026. Bu sürüm yerel kaynak ve dağıtım paketidir; npm veya GitHub yayını yapılmadı.

## Uygulanan değişiklikler

- 58 SVG içeren Muhit Icons 1.1 tek çizim kaynağıdır. Eski `Muhit.icon()` çağrıları yeni kaynağa yönlenir. Pano, bildirim, form, kilit, zaman ve sütun boyutlandırma dahil mevcut eylemler kapsanır.
- Tablo durumları/sıralama/filtre temizleme, grafik indirme düğmesi, widget gezinmesi ve zaman çizelgesi aynı kaynağı kullanır. Grafik veri yolları, marka logosu ve dekoratif illüstrasyonlar ikon değildir; korunur.
- Seçili yer imi dolgu yerine düğmenin yüzeyi, kenarlığı ve `aria-pressed` ile anlatılır. Eski 1.25 çizgi tercihi kabul edilir, 1.5 olarak görünür. Yeni varsayılan 1.75’tir.
- Türkçe/İngilizce stüdyo, dokuz bağımsız HTML örneği ve React/Vue uygulama kabukları ortak içerik genişliği, boşluk, 4/8/12 sütun ve içeriğe geç kurallarını kullanır. Altı temel sayfa tarifi aynı sistemdedir.
- Gömülü sayfaların ana/yan bölgeleri 8/4 sütundan küçük ekranda sıralı akışa geçer. Yan kenarlıklar mantıksal yöndedir. İç tablo kaydırması korunur; belge gövdesi taşmaz.
- Atlanan başlık seviyeleri, görünür metinle uyuşmayan erişilebilir adlar, küçük ekranda adsız kalan düğme ve klavyeyle kaydırılamayan kod alanları düzeltildi.

## Tüketici geçişi

ESM kullanıcıları ek import yapmak zorunda değildir. Klasik script tüketicileri **icons.js dosyasını components, table, data-grid, charts ve widgets dosyalarından önce** yüklemelidir. Örnekler ve belgeler bu sırayla güncellendi.

```html
<script src="muhit-ui/src/icons.js"></script>
<script src="muhit-ui/src/components.js"></script>
```

`styles/pages.css` hâlâ isteğe bağlıdır. Sayfa örnekleri bu girişi yükler; yalnız bileşen kullanan uygulamalara sayfa kabuğu zorlanmaz. Mevcut agent sözleşmesindeki 18 tür değişmedi. Rota, yetki ve veri kalıcılığı uygulamanın sorumluluğundadır.

## Doğrulama kapsamı

- 70 birim testi; 17 paket girişinin NodeNext/Bundler tip kontrolü.
- Chrome ve Firefox: 24 mevcut ekran/rota × (390, 768, 1440 px açık tema + 390 px koyu RTL %125 metin) = her tarayıcıda 96 görünüm kontrolü. Gövde taşması, tek main/h1, içeriğe geç bağlantısı, eski ikon çizimleri ve axe ihlalleri denetlendi.
- WebKit: ikon kataloğu ve altı temel sayfa, üç genişlikte; koyu/RTL, ikon indirme, arama, form ve klavye geçişi kontrolleri.
- Mevcut tablo, form, grafik, agent, veri yükleme/CSV ve ölçek testleri çalıştırıldı.
- React ve Vue: gerçek paket kurulumu, tip/üretim derlemesi, geliştirme/üretim tarayıcı akışları ve SSR hydration testleri geçti.
- 14 görsel durumun değişen referansları incelendi; eski referanslar paket dışında `outputs/muhit-visual-baselines-0.12.0` altında korundu.
- Logo kilidi ve yetenek belgesi tutarlılığı doğrulandı.

Otomatik sonuçlar ekran okuyucuyla insan incelemesi veya fiziksel cihaz kabul testi yerine geçmez. Önceki 0.12 doğrulama belgesi o sürümün tarihsel kaydıdır.
