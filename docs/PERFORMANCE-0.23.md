# Muhit · Performans kabulü

İki farklı kapı vardır: regresyon (CI'nin makine değişkenliğine dayanıklı üst sınırı) ve ürün hedefi. Kısıtlı profil 4× CPU yavaşlatma, 150 ms gecikme, 128 KiB/s indirme ve 64 KiB/s yükleme kullanır. Bu emülasyon fiziksel düşük güçlü cihaz testi değildir.

- Yerel: 10 bin uzun metinli kayıt, 20 sorgu. Ürün hedefi p95 <100 ms; regresyon sınırı 1500 ms.
- Uzak: 50 bin sentetik uzun metinli kayıt, gerçek loopback HTTP, 25 kayıt/sayfa, 8 istek. Ürün hedefi p95 <1500 ms; regresyon sınırı 10 s. Gerçek WAN/üretim yükü ölçülmüş sayılmaz.
- Önceki 10k/100k kısa kayıt ölçümü ayrıca `test:search-scale` ile devam eder.

`MUHIT_SEARCH_DATA=/absolute/anonymized.json npm run test:performance-profile` uzak test verisini değiştirir; yerel CPU fixture'ı kontrollü sentetik olarak kalır. Dosya `{id,title}` kayıtları içerir. Rapor kullanıcı metnini/sorgularını yazmaz; yalnız adet, süre ve profil bilgilerini tutar.

Hedef cihazda en az 30 temsilî sorgu, ilk yükleme/indeks maliyeti ve bellek incelenmeli. Yerel p95 100 ms'yi geçiyorsa indeks kurmayı worker'a taşıyın veya sunucu aramasını kullanın. Uzak hedef aşılırsa sayfa boyutu/yanıt alanlarını azaltın, sunucu indeksini ve ağ maliyetini ölçün. Yeni kayıt üst sınırı eklemek performans çözümü sayılmaz.

Son ölçümler sürüm kanıtlarındaki performance.json içindedir. Gerçek proje veri kabulü bekliyor.
