# Muhit 0.25 · Performans

createSearchIndexAsync büyük yerel veri için önerilen kurulum yoludur. Kayıt kopyalama ve metin hazırlama yaklaşık 8 ms'lik dilimlerden sonra setTimeout ile tarayıcıya kontrol bırakır. signal ile iptal edilir; önceki indeks tüketici tarafından korunabilir. Çalışan örnek: examples/async-search.html.

schemas/performance-budgets.json ürün kapıları: yerel sorgu p95 <100 ms; uzak sorgu p95 <1500 ms; asenkron indeks toplam kurulum <2000 ms; kurulum sırasında timer örnekleri arasındaki en büyük boşluk <50 ms. Son ölçüm etkileşim kesintisi göstergesidir, gerçek INP ölçümü değildir. Bütün kapılar zorunludur. Senkron API otomatik olarak asenkron hale gelmez; tüketici yeni API'ye geçmelidir.

Profil: 4x CPU, 150 ms gecikme, 128 KiB/s indirme; yerelde 10 bin uzun metinli kayıt, uzakta 50 bin kayıt ve 25 satır. MUHIT_SEARCH_DATA ile verilen dosya uzak profili değiştirir; yerel test sentetiktir. Komut: npm run test:performance-profile.

Tek bir aşırı büyük kaydın structuredClone maliyeti bölünmez. Kayıt başına boyutu sınırlandırın; büyük binary/nested veri veya daha ağır arama için Worker/sunucu kullanın. Bu sürüm Worker eklemez. Gerçek veri, bellek, fiziksel cihaz, soğuk başlangıç ve giriş gecikmesi pilot kabulünde ayrıca ölçülür.
