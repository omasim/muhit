# Muhit 0.23 · Doğrulama

P1: açıklama korunması (yerel ve onMutation), kayıt sırasında yeni taslak ve ikinci kayıt, gerçek dış değişiklik, anahtar sırasından bağımsız çakışma kontrolü.

P2: paketlenmiş React/Vue development/production/SSR içinde tekrar-kapasite, biçim, medya/JSON aktarımı, uzak sayfalama, hata/iptal ve remount. Node 18/20/22/24/26 birim/import CI matrisi. Kısıtlı CPU/ağ sentetik performans profili. Figma dört kontrol ailesi ve 48 durum.

Son kaynak ve başarılı CI sonuçları aşağıda kayıtlıdır. Paket dosyaları PROVENANCE.json ve SHA256SUMS ile doğrulanır. Gerçek veri ve manuel cihaz/AT kabulü açık; MANUAL-ACCEPTANCE-0.23.md ve PERFORMANCE-0.23.md içindedir.

## Kaynak kimliği

- Runtime commit: `2dc6ab63796087df20a0383cfe56a93c9f362448`.
- Kaynak SHA-256: `d47ce50cd49294a7079155b5bc40b0909c5d2907fb73dff1b39891fc66c24f17`.
- [CI koşusu](https://github.com/omasim/muhit/actions/runs/39707326057).
- Yerel son kaynak: 112/112 Node testi; Chromium/WebKit yeni planlama akışları ve 12 açık/koyu responsive/axe taraması geçti. 88 girişin paketlenmiş NodeNext/Bundler tip kontrolü geçti.
- Son kaynak kanıtları `tests/evidence/release23/` altında toplanır. Başka kaynak özetli eski raporlar bu sürümün kabul kanıtı değildir.

## Manuel kabul sınırı

Gerçek proje verisi ve hedef fiziksel cihaz sağlanmadığı için sentetik performans sonuçları gerçek ürün kabulü diye sunulmaz. MANUAL-ACCEPTANCE-0.23.md içindeki adımlar ekran okuyucu ve fiziksel cihazda uygulanıp kaydedilmelidir. Figma kontrol desenleri kodun etkileşim testlerinin yerine geçmez.

## Son CI sonucu: başarılı

8/8 iş geçti: Chromium, Firefox, WebKit ve Node 18/20/22/24/26. Chromium tam verify:all zinciri, paketlenmiş React/Vue development/production/SSR, tipler, entegrasyon, paket ve görsel testleri geçti. Yeni takvim/editör ekranı üç motorda toplam 18 responsive/axe taramasından geçti. Test komutlarının exitCode ve kaynak özeti release23 kanıtlarında bulunur.

CI kısıtlı performans: 10 bin uzun metinli kaydın indeks kurulumu yaklaşık 427 ms, sorgu p95 14,4 ms. 50 bin uzun metinli kayıtta 25 satırlı HTTP yanıtı p95 414,5 ms; yanıt 33.038 bayt. Profil 4x CPU, 150 ms gecikme, 128 KiB/s indirme. İndeks kurulum maliyeti sorgu süresinden ayrıdır; ana iş parçacığında görünür donmaya yol açıyorsa worker/sunucu yaklaşımı gerekir. Sentetik sonuç gerçek cihaz veya müşteri verisi kabulü değildir.

Son belge/kanıt commit'i runtime kaynak özetini değiştirmez; CI yukarıdaki runtime commit'inde çalıştı. Dağıtım PROVENANCE kaydı son belge commit'ini gösterebilir. npm registry veya Pages yayını yapılmadı.
