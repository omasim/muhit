# Sürüm ve yayın politikası

0.14.x güncel geliştirme ve düzeltme hattıdır. 0.x sürümlerinde davranış değişiklikleri sürüm notlarıyla duyurulur. Kararlı 1.0 taahhüdü henüz verilmez. Logo 3.1, tema şeması 1 ve agent şeması 1.1.0 paket sürümünden bağımsızdır.

Her kaynak sürümü için: Node testleri, üç tarayıcılı davranış ve erişilebilirlik testleri, React/Vue geliştirme/üretim/SSR-hydration akışları, sabit logolar, paket içeriği ve modül boyutları doğrulanır. Görsel referanslar açık bir güncelleme komutuyla üretilir; normal test çalışması referansı değiştirmez. Referans değişiklikleri görüntü incelemesi gerektirir. Otomatik testler manuel ekran okuyucu uygunluk iddiası değildir.

Yayın adımları: package.json/lock ve capability kaydını güncelle → sürüm notları ve geçiş rehberi → testler → kaynak commit → CI sonucu → sürümlü TGZ/ZIP → gerekiyorsa GitHub sürüm etiketi ve release. npm yayını ayrıca paket sahipliği ve erişim doğrulaması gerektirir. Bu projede npm publish çalıştırılmadı; yerel TGZ doğrudan kurulabilir. Otomatik npm yayın iş akışı veya gizli anahtar eklenmedi.

Kırılan/güncellenen sözleşmeler: 0.9'da Grid locale yalnız mount seçeneğidir; setState ile başka locale vermek hata üretir. Dil değiştirmek için getView → yeni locale ile mount → restoreView kullanın. Uzak seçili/filtrelenmiş CSV için exportCSV ve exportRows kullanın; toCSV mevcut sayfa içindir. Diğer temel API'ler korunur.

0.10 geçişi: yalnız tokens.css kullanan tüketici yerel font istiyorsa fonts.css de yüklemeli. styles/index.css tam giriş davranışını korur. Ek DE/AR katalogları isteğe bağlı import edilir; uygulama metinlerini çevirmek uygulamanın sorumluluğudur.

## Güncel tüketici geçişi ve destek matrisi

- `npm install ./muhit-ui-0.14.0.tgz` ile sürümü sabitleyin; kaynak paket yanında SHA256SUMS dağıtılır. İndirmeden sonra `shasum -a 256 -c SHA256SUMS` ile doğrulayın.
- Tipler: TypeScript 5.9, strict NodeNext ve Bundler, paketlenmiş 17 giriş.
- Çekirdek Node >=18; test/örnek araçları Node >=20.19 (bu yerel koşu Node 25). React 19.2, Vue 3.5 ve Vite 7 örnekleri destek matrisidir; başka sürümler tüketici tarafından doğrulanmalı.
- Güncel Playwright Chromium/Firefox/WebKit otomasyonu hedeflenir; Safari uygulaması ve gerçek cihazlar ayrı kabul listesidir.
- 0.x sürümünde davranış değişikliği minor sürüm ve geçiş notu gerektirir; patch sürümleri geriye uyumlu düzeltmeler içindir.
- Grid yüklenirken veya hata durumunda page CSV çağrısı artık hata verir. Uzak filtered/selected kapsamları exportRows sağlayıcısı üzerinden devam eder.
- Formu yeniden oluştururken getSnapshot ile baseline taşıyın; reset ve isDirty buna göre çalışır.
- Repeater iç içe HTML formu değildir. Sunucu hatası dizisi mevcut grup sırasına göre eşlenir; istekte uygulama kayıt kimliklerini ayrıca doğrulamalı.
- Kaynak paket arşivi node_modules, dist ve eski TGZ dosyalarını içermez. npm publish yapılmadan registry kurulumu vaat edilmez.
