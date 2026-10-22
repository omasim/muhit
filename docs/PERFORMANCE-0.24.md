# Muhit 0.24 · Performans kabulü

Tek kaynak: schemas/performance-budgets.json. Yerel sorgu p95 ≤100 ms, uzak sayfalı sorgu p95 ≤1500 ms. Ek regresyon sınırları 1500/10000 ms'dir; ürün sınırının aşılması CI başarısızlığıdır. Gevşek regresyon sınırını geçmek tek başına yeterli değildir. Negatif birim testi bu kuralı doğrular.

Profil: Chromium 4x CPU, 150 ms ağ gecikmesi, 128 KiB/s indirme, 64 KiB/s yükleme. Yerel 10 bin uzun metinli kayıt, uzak 50 bin sentetik kayıt / 25 satırlı sayfa. İndeks kurulum süresi sorgu p95'inden ayrı raporlanır; kurulum için kabul bütçesi henüz tanımlanmamıştır. Ana iş parçacığı bloklanıyorsa hedef üründe worker veya sunucu indekslemesi değerlendirilmelidir.

Komut: `npm run test:performance-profile`. Gerçek veri dosyası için `MUHIT_SEARCH_DATA=/absolute/path/data.json` kullanılabilir (id/title kayıt dizisi). Sağlanan dosya uzak veri profilini değiştirir; yerel test sentetiktir. Bu koşu fiziksel cihaz veya uçtan uca ürün kabulü değildir.

Açık kabul: anonimleştirilmiş müşteri verisi, hedef veri büyüklüğü, fiziksel cihaz, soğuk/sıcak başlangıç, sorgu çeşitliliği, ağ hata/iptal senaryoları ve indeks kurulum hedefi. Sonuçlar cihaz/veri tanımıyla birlikte kaydedilmelidir.
