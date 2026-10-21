> 0.21 planlama durumları: [DESIGN-CODE-0.21.md](DESIGN-CODE-0.21.md). Güncel planlama aileleri, aşağıdaki eski envanteri bu kapsamda tamamlar.

> 0.20 ek modül eşleştirmesi: [DESIGN-CODE-0.20.md](DESIGN-CODE-0.20.md). Aşağıdaki temel kütüphane envanteri önceki sürüm kapsamıdır.

# Muhit Figma tasarım kaynağı

[Dosyayı aç](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg) · takım: **ömer's Starter team** · paket: 0.18.0.

Üç sayfa: başlangıç ve temeller, bileşenler, sayfa tarifleri. 8 paletin açık/koyu karşılıkları ayrı koleksiyonlardır. Her koleksiyon 185 kod tokenını taşır: toplam 2.960 değişken. Semantik ve bileşen alias zincirleri doğrulandı; kopuk referans, eksik WEB sözdizimi ve ALL_SCOPES yok. Manrope / Source Serif 4 gerçek fontları ve paylaşılan metin stilleri kullanılır.

30 bileşen ailesi için 49 düzenlenebilir tasarım örneği ve bu bileşenlerden üretilen 6 masaüstü sayfa kompozisyonu bulunur. Bu, her davranış durumunun etkileşimli Figma prototipi olduğu anlamına gelmez. Menü klavyesi, form doğrulaması, iptal, grid sanallaştırması ve mobil yeniden akışın çalıştırılabilir kaynağı koddur. Canvas üzerinde başlangıç, kart/form/düğme aileleri ve sayfa kompozisyonları görsel olarak incelendi; bütün metinlerde ortak stil kullanıldığı kontrol edildi.

## Kaynak ve değişiklik süreci

`design/figma/manifest.json` gerçek node kimliklerini ve kabul kapsamını kaydeder. `schemas/component-contracts.json` bileşen API ve davranış kaynağıdır. `tokens/` dosyaları koddan yeniden üretilebilir. Figma değerleri kodu kendiliğinden değiştirmez. Değişiklik sırası: ihtiyacı sözleşmede tanımla → kaynak token/bileşeni güncelle → test et → ilgili Figma varlığını kimliğiyle güncelle → görsel incele.

Logo 3.1 değişmedi. Yeni Figma kapak kompozisyonuna logo eklenmedi; ana marka kaynağı `assets/brand/` altında korunur.

## Code Connect sınırı

Seçilen takım Starter. Code Connect rehberi yayımlanmış takım kütüphanesi ve uygun Organization/Enterprise planı gerektirir; Dev Mode Code Connect yayını yapılmadı. Manifest node–kod envanteridir, yayımlanmış Code Connect kaydı değildir. Uygun takım planında eşleme, gerçek node URL’leri ve kaynak API üzerinden ayrıca yayımlanabilir.

`design/figma/*.js` kompozisyon kaynak parçalarıdır; Node modülü veya otomatik senkronizasyon servisi değildir. Figma Plugin API bağlamında, manifest kimlikleri incelenerek ve tek sayfa seçilerek kullanılır. Yeni dosyaya doğrudan aynı node ID’leriyle çalıştırılmaz.
