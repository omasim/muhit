# Muhit 0.25 · Geçiş

0.24 → 0.25.0-beta.1. Kayıt adaptörlerinin persisted:true sözleşmesi değişmez.

Takvim/editör/bildirim merkezindeki onChange, onDirtyChange ve onDraftChange gözlemcileri artık kayıt hatası sayılmaz. Senkron throw ve Promise reddi onObserverError(error, observer) kanalına gider. Bu kanal yoksa console.error kullanılır; tanılama callback'i de reddedilirse konsola raporlanır. Kalıcılık adaptörü hataları hâlâ işlem başarısızlığıdır. Gözlemciler doğrulama/işlem veto mekanizması olarak kullanılmamalıdır. Bu değişiklik tüketici uygulamanın kendi dış yan etkilerini geri almaz.

Yeni muhit-ui/search createSearchIndexAsync(rows, options) Promise döndürür. signal ve sliceMs (1–16 ms, varsayılan 8) kabul eder; aralarda event loop'a döner. İptalde kısmi indeks sunmaz. Kurulum tamamlanana kadar girdi kayıtlarını değiştirmeyin. Senkron createSearchIndex API'si küçük veri/Node kullanımı için korunur.

README güncel başlangıç noktasıdır. Eski metin docs/history/README-before-0.25.md içinde korunur. Belge sitesi CURRENT.md ile açılır.
