# Uygulamaya bağlama · 0.21

Muhit servis veya yetkilendirme ürünü değildir. `examples/integration` referansı açık bir dosyaya yazan yerel HTTP servisiyle adaptör sınırını test eder.

```sh
MUHIT_DATA_FILE=/tmp/my-muhit-reference/data.json PORT=4506 node examples/integration/server.mjs
```

http://127.0.0.1:4506/ açılır. Veri dosyası açıkça belirtilmelidir; mevcut dosya varsa korunur. Yalnız loopback'te dinler. Bu sunucu internete dağıtılmak için hazırlanmış bir auth/backend çözümü değildir.

- GET /api/document: document ve ETag.
- PUT: If-Match ve Idempotency-Key zorunlu. Kayıtlar sıraya alınır, sürüm kontrolü ile dosyaya geçici yazma/rename tek işlemde yürür.
- Eski ETag: 412, taslak korunur. Aynı idempotency key + aynı payload: aynı onay tekrarlanır, iki kayıt oluşmaz. Aynı key farklı payload: 409.
- AbortSignal fetch'e aktarılır. Tarayıcı iptali sunucunun hiç yazmadığının kanıtı değildir; aynı isteğin anahtarı doğrulanmış yanıt gelene kadar korunur.
- Son 100 idempotency kaydı tutulur; üretim saklama süresi ve temizleme politikasını uygulama belirler.
- Başarısız bildirim yazımı için uygulama önceki kayıt kopyasını saklayıp `update(previous)` ile geri alabilir. Bu sırada daha yeni mutasyon varsa kör geri alma yerine kayıt revizyonu kontrol edilmelidir.
- Sunucunun ürettiği kimlikleri gerekiyorsa ayrı okuyup `update(canonicalRecords)` ile aktarın. Calendar onCommit sonucu şu anda yalnız persisted onayıdır; dönüş nesnesine gizli kimlik eşlemesi varsaymayın.

İki sekmeyle okuma → ilk sekmede kaydetme → ikinci sekmede eski sürümle kaydetme örneği çakışmayı görünür kılar. Yeniden okuma, inceleme ve yeniden uygulama ürün kararlarıdır; mevcut taslak otomatik üzerine yazılmaz.

Test: `npm run test:integration`. Saf tip fixture: tests/planning-consumer.ts. React/Vue örneklerinde taslak ve sürüm snapshot'ı uygulama belleğinde unmount/remount arasında saklanır.

## Agent keşfi

schemas/planning.schema.json veri tanımlarını, schemas/workspace-modules.json eylem/validator/transport gereksinimlerini taşır. Runtime validator tarih sırası, benzersiz blok kimliği ve trim edilmiş başlık gibi semantik kuralları ayrıca kontrol eder. Şema içinde işlev/HTML/transport yoktur. 18 Agent JSON render türü aynıdır; imperative modül seçimi güvenilir uygulama koduna aittir. Bir callback'in çağrılması insan onayı veya sunucu yetkisi yerine geçmez.
