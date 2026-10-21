> 0.20 güncellemesi: 46 sözleşme ve yeni `muhit-ui/planning` ESM modülü. Planlama/sürüm/bildirim sınırları `PLANNING-0.20.md`, testler `VERIFICATION-0.20.md` içinde. Aşağıdaki önceki sürüm notları korunmuştur.

# Muhit sistem yönetimi ve kabul

## Sürüm ve olgunluk

Paket 0.19 beta, sistem sözleşmesi 1.0, tema config 1, UI şeması 1.1 ve logo 3.1 bağımsız sürümlerdir. UI 1.0 uyumluluğu korunur. Yeni sistem modülleri eklemelidir; eski import ve CSS isimleri kaldırılmaz. Sistem modülleri beta kabulündedir; bütün ürünler için 1.0 kararlılık taahhüdü yoktur.

Deneysel → beta → kararlı → kullanım dışı geçişleri bakımcı incelemesiyle yapılır. Kararlı kabul için gerçek tüketici kullanımı, manual ekran okuyucu, mobil cihaz, klavye, yerelleştirme ve performans kanıtı gerekir. Kullanım dışı API için alternatif, uyarı, geçiş örneği ve kaldırılma sürümü zorunludur.

## Değişiklik süreci

1. Kullanıcı ihtiyacı ve mevcut bileşenin neden yetmediğini yaz.
2. Katmanı, public API’yi ve veri sahipliğini belirle.
3. Token, anatomi, durum, davranış, responsive/RTL ve içerik sözleşmesini ekle.
4. En az bir gerçek görev örneği ile hata/iptal yolunu uygula.
5. Otomatik test, paket tüketimi ve gereken manual kabul kanıtını kaydet.
6. Şema, tip, belge, migration ve capability manifestini güncelle.
7. Geriye uyumluluğu incele; sürümlü paket ve belge yayını yap.

## Kalite kapıları

`npm test`, `npm run check:system`, `npm run check:brand`, `npm run test:consumer-types`, `npm run test:system`, mevcut `verify:all` ve sabit platform görsel referansları. Yeni public export tipli olmalı; kaynak/generated ESM davranışı eşleşmeli. Kontrast kontrolleri tek başına yeterli değildir. Performans ölçümü tüketici paketindeki gerçek import grafiğiyle yapılır; system/registry modülleri isteğe bağlıdır.

## İçerik ve sorumluluk

Başarı gerçek sonucu anlatır. Kısmi sonuç başarı diye genellenmez. Native form etiketleri ve hata açıklamaları eyleme yönlendirir. Tarih, sayı, yön ve mesajlar locale sözleşmesine uyar. Örnek veri açıkça etiketlenir. Taslak saklama kapsamı görünürdür. Doğa uyumu enerji/tüketim ölçümü yapılmadan çevresel performans iddiasına çevrilmez.

## Bilinen sınırlar

Native Figma kaynağı ve kapsamı [Figma rehberinde](FIGMA.md) kayıtlıdır. Starter takımında Dev Mode Code Connect yayını yoktur; tasarım örnekleri bütün davranış durumlarının interaktif eşdeğeri değildir. Manuel yardımcı teknoloji ve fiziksel cihaz kabulü açık kalır. Yeni menu/popover kendi headless DOM bağlarıdır; framework kullanıcıları lifecycle cleanup yapmalıdır. Backend, kullanıcı kimliği, server authorization ve veri saklama ürün sorumluluğudur. Bu sınırlar “tamamlandı” etiketiyle gizlenmez.
