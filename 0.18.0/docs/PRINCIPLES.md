# Muhit tasarım ilkeleri

Sürüm 1.0 · 19 Ekim 2026. Paket 0.16.0 ile uygulanır. Bu ilkeler yeni bir agent bileşen türü eklemez.

## P01 · Bağlamı ve emeği koru

Görünümler arasında filtre, seçim ve taslak doğru kapsamda korunur. Saklama süresi açıkça belirtilir; hassas veri kendiliğinden kalıcı depoya yazılmaz.

Kabul sorusu: Liste → ayrıntı → geri akışında aynı filtre ve seçim bulunur; yenilemede kaybolacak taslak önceden açıklanır.

## P02 · Yalnız gerçekleşen sonucu bildir

Bekleyen işlem başarı sayılmaz. Eksik veri sıfır diye doldurulmaz. Yerel onay, sunucu kaydı ve örnek veri ayrı adlandırılır.

Kabul sorusu: Hata senaryosu başarı mesajı üretmez; tamamlanan işlem kapsamını açıkça söyler.

## P03 · Kararı insanda bırak

Eylemler sonuçlarını anlatır. İptal, inceleme ve geri dönüş yolları görünürdür. Onay ihtiyacı işlemin etkisiyle orantılıdır.

Kabul sorusu: Bekleyen işlem iptal edilebilir; iptal edilmiş yanıt sonradan başarıya dönüşmez.

## P04 · Farklı erişim biçimlerini temel kabul et

Anlam yalnız renk, hareket veya sürüklemeyle taşınmaz. Klavye, okunabilir metin, görünür odak ve azaltılmış hareket temel sözleşmedir.

Kabul sorusu: Klavye ile bütün görev tamamlanır; açık/koyu ve dar ekranda içerik kaybolmaz. Manuel ekran okuyucu kabulü ayrıca kaydedilir.

## P05 · Hatadan dönüş yolunu tasarla

Boş, hata, yükleniyor ve yetki durumları ayrıdır. Hata kullanıcının yaptığı işi silmez; sonraki adım sorunla ilişkilidir.

Kabul sorusu: Başarısız onay taslağı korur ve yeniden deneme sunar; erişim bilgisi eylemi yetki verilmiş gibi davranmaz.

## P06 · Dikkati ve kaynağı ölçülü kullan

Her vurgu bir öncelik, her hareket bir anlam taşır. Gereken modül ve font yüklenir; dikkat gerektirmeyen alanlar yarışmaz.

Kabul sorusu: Tek ikon tam kataloğu getirmez; animasyonsuz kullanım mümkündür. Ölçülmeyen çevresel kazanç ileri sürülmez.

## P07 · İfade değişsin, anlam korunsun

Projeler palet, tipografi ve yoğunlukla kendi karakterini kurar. Eylem, durum, odak ve metin-zemin ilişkileri korunur.

Kabul sorusu: Tema değişimi veri ve taslağı değiştirmez; seçili ve hatalı durum metinle de anlaşılır.

## P08 · Öneriyi yetkiden ayır

AI çıktısı izinli şemadan geçer. Görünüm tanımı kod, doğruluk belgesi veya işlem izni değildir. Uygulama yetkiyi ve gerçek sonucu doğrular.

Kabul sorusu: Bilinmeyen tanım reddedilir; callback yokken yapılmamış işlem tamamlandı gösterilmez.

## Çelişen ihtiyaçlarda karar sırası

Önce doğru bilgi ve insanın kontrolü; ardından erişim ve işin sürekliliği; sonra görev verimliliği ve görsel ifade. Daha sıkı yerleşim dokunma hedefini küçültemez. Taslak koruma, açık bir ihtiyaç olmadan kişisel veriyi kalıcı saklamayı haklı çıkarmaz. Daha hızlı akış, başarısız isteği başarı gibi göstermeyi haklı çıkarmaz.

## Uygulama haritası

P01: DataGrid getView/restoreView, Form getSnapshot ve framework adaptörleri. P02/P05: Form gönderim sonucu, sayfa durum kataloğu ve hata/boş ayrımı. P03: iptal sinyalleri ve odak dönüşü. P04/P07: semantik tokenlar, erişilebilir kontroller ve tema testleri. P06: ikon başına ESM girişleri, font seçimi ve modül bütçeleri. P08: Agent validate ve uygulamanın onAction işleyicisi.

Çalışan yeni örnek, P01/P02/P03/P05'i bir kayıt akışında birleştirir: filtre ve taslak görünüm geçişinde korunur; başarısız yerel işlem taslağı silmez; yeniden deneme veya iptal mümkündür. Yalnız sayfa belleğinde tutulan onay kalıcı kayıt diye adlandırılmaz.

## Yeni bir bileşenin kabulü

Bileşenin anlamını ve durumlarını yaz. En az bir hata ve toparlanma senaryosunu çalıştır. Klavye ve odak dönüşünü, tema/ölçek/dar ekranı kontrol et. Ağ veya kalıcılık sınırını belirt. Desteklenen davranışı test et; manuel doğrulanmamış alanı açık bırak. Estetik incelemede hiyerarşi ve içerik ritmini değerlendir. Test sayısını insan deneyiminin yerine koyma.

Manuel ekran okuyucu ve gerçek cihaz kabulü hâlâ açıktır: [Kabul planı](ACCESSIBILITY-MANUAL.md).
