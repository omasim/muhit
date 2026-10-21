> Tarihsel sürüm kaydıdır. Güncel kapsam ve kanıt: [CURRENT.md](CURRENT.md).

# React / Vue adaptör sözleşmesi

examples/react ve examples/vue içindeki Grid adaptörleri DataGridOptions alanlarını, selected ve onReady seçeneklerini alır. Rows, state, columnLayout ve selected kontrollü verilebilir. Locale/direction, veri sağlayıcısı veya sütunlar değişince görünüm snapshot'ı geri yüklenir; yeni sütunlar görünür olur, kaldırılan sütunlar ayıklanır. Callback'ler güncel props üzerinden çağrılır. Sütun/load gibi yapısal referansları sabit tutun.

Form adaptörleri FormOptions, validateAsync/validationDelay ve onReady kabul eder. Başlık artık sabit değildir. Dil gibi yapısal seçenekler değişirken taslak korunur; values prop değişimi uygulamanın açık değer güncellemesidir. Aynı durumun tekrar verilmesi gereksiz callback döngüsü üretmez.

SSR sınırı: sunucuda uygulama kabuğu ve boş Muhit kapsayıcıları üretilir. Bileşen DOM'u mount sonrası istemcide oluşur. Bu, veri tablosunun satırlarının sunucuda render edildiği anlamına gelmez. React hydrateRoot ve Vue createSSRApp akışları gerçek sunucu çıktısı üzerinde test edilir. İstek bazında locale seçeneklerini açık verin; global varsayılanı SSR istekleri arasında değiştirmeyin.

Adaptörler dağıtılan örnek dosyalardır; ayrı React/Vue npm paketi yayımlanmadı. Üretimde kullanılan adaptörü projeye alın ve sürümünü çekirdekle birlikte takip edin.
