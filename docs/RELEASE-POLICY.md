# Muhit yayın ve destek politikası · 0.24.0-beta.1

Bu dosya package.json, örnek paketleri ve component-contracts kaynağından tools/build-support.mjs ile üretilir. Önceki metin docs/history/RELEASE-POLICY-before-0.21.md içinde korunur.

- Durum: beta. Kararlı 1.0 kabulü verilmez.
- Çekirdek Node: >=18. Araç/örnek bağımlılıklarının kendi engines koşulları ayrıca geçerlidir. Tarayıcı CI Node 22; runtime birim/import matrisi Node 18/20/22/24/26 kullanır.
- Tipli giriş: 88; import kontrolüne ek olarak planning API çağrıları ve beklenen tip hataları sınanır.
- React/Vue örneklerinin tam bağımlılık aralıkları schemas/support.json içindedir; bütün framework sürümlerine destek vaat edilmez.
- 46 sözleşme, 18 Agent render türü; bunlar farklı katmanlardır.
- Chromium/Firefox/WebKit otomasyonu, manuel ekran okuyucu ve gerçek cihaz kabulü ayrı kanıtlardır. Sonuçlar docs/VERIFICATION-0.24.md içinde, eksik kapılar açıkça raporlanır.
- Logo 3.1, tema şeması 1 ve Agent şeması 1.1.0 bağımsız sürümlenir.

## Kurulum

npm install ./muhit-ui-0.24.0-beta.1.tgz

Registry yayını yapılmış varsayılmaz. SHA256SUMS ile yerel dağıtım doğrulanır. npm yayımlamak ayrı bir adımdır.

## Kabul sırası

Kaynak değişikliği → ilgili birim/yarış/taslak testleri → packed runtime/tipler → React/Vue development/production/SSR → üç motor CI → manuel hedef ürün kabulü → kaynak commit ve kanıt bağlantıları → sürümlü TGZ/ZIP. Kısmi doğrulama tam kabul olarak sunulmaz.

0.x davranış/snapshot sözleşmesi değişikliği minor sürüm ve migration belgesi gerektirir. Ana dalı birleştirmek ve kamuya paket yayımlamak yerel dağıtım hazırlamaktan ayrı işlemlerdir.
