# Muhit 0.24 · Doğrulama

Yeni testler: tests/readiness24.test.mjs ve tests/browser/readiness24-flows.mjs. Zaman hassasiyeti, DST anı, işlem yarışı, Almanca/Arapça mesaj anahtarları, RTL/dar kapsayıcı ve performans bütçesi negatif testleri.

Son kaynak test ve CI sonuçları aşağıdadır. Manuel kabul: MANUAL-ACCEPTANCE-0.24.md. Gerçek veri performansı açık: PERFORMANCE-0.24.md.

## Son yerel kaynak

- Runtime commit: `bf9560a72ce7c6d51f9332bf856f0ab980e5ffac`.
- Kaynak SHA-256: `c7e65b768671be425bd17ac7ba4edca73001da93a26750869f51e7f49174e849`.
- 116/116 birim testi geçti.
- Chromium/WebKit: yeni zaman hassasiyeti, ardışık kayıt/silme başarı-hata-iptal ve Almanca/Arapça dar kapsayıcı akışları geçti. Planlama sayfasında 12 açık/koyu, 320/390/1440 px axe taramasında ihlal yok.
- Paketlenmiş NodeNext/Bundler: 88 tipli giriş geçti.
- Kısıtlı yerel performans: sorgu p95 12,3 ms; uzak p95 419,4 ms; indeks kurulum 138,3 ms. Sentetik profil; fiziksel cihaz kabulü değildir.
- Kaynakla eşleşen yerel kanıtlar: `tests/evidence/release24/local/`.

[CI koşusu](https://github.com/omasim/muhit/actions/runs/39708796485). CI tamamlandı: başarılı.

## CI kabulü: 8/8 başarılı

Chromium, Firefox, WebKit ve Node 18/20/22/24/26 geçti. Chromium verify:all zincirinde paketlenmiş React/Vue development/production/SSR, dağıtım, TypeScript, entegrasyon, performans ve görsel kontroller geçti. Planlama sayfası üç motorda toplam 18 responsive/axe taramasını geçti; yeni P1 ve çeviri akışları her motorda başarılı.

Kanıtlar `tests/evidence/release24/ci/`; iş sonuçları `tests/evidence/release24/CI-RESULT.json`. Başka kaynak özetli tarihsel raporlar güncel kabul değildir.

CI kısıtlı profil: yerel sorgu p95 12.6 ms; uzak sorgu p95 412.6 ms; indeks kurulumu 298.6 ms. İki ürün bütçesi geçti. Gerçek veri/fiziksel cihaz kabulü açık.

Son belge/kanıt commit'i runtime kaynak özetini değiştirmez. PROVENANCE.json son belge commit'ini gösterebilir. npm registry veya Pages yayını yapılmadı.
