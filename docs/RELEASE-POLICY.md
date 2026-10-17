# Sürüm ve yayın politikası

0.9.x güncel geliştirme ve düzeltme hattıdır. 0.x sürümlerinde davranış değişiklikleri sürüm notlarıyla duyurulur. Kararlı 1.0 taahhüdü henüz verilmez. Logo 3.1, tema şeması 1 ve agent şeması 1.1.0 paket sürümünden bağımsızdır.

Her kaynak sürümü için: Node testleri, üç tarayıcılı davranış ve erişilebilirlik testleri, React/Vue geliştirme/üretim/SSR-hydration akışları, sabit logolar, paket içeriği ve modül boyutları doğrulanır. Görsel referanslar açık bir güncelleme komutuyla üretilir; normal test çalışması referansı değiştirmez. Referans değişiklikleri görüntü incelemesi gerektirir. Otomatik testler manuel ekran okuyucu uygunluk iddiası değildir.

Yayın adımları: package.json/lock ve capability kaydını güncelle → sürüm notları ve geçiş rehberi → testler → kaynak commit → CI sonucu → sürümlü TGZ/ZIP → gerekiyorsa GitHub sürüm etiketi ve release. npm yayını ayrıca paket sahipliği ve erişim doğrulaması gerektirir. Bu projede npm publish çalıştırılmadı; yerel TGZ doğrudan kurulabilir. Otomatik npm yayın iş akışı veya gizli anahtar eklenmedi.

Kırılan/güncellenen sözleşmeler: 0.9'da Grid locale yalnız mount seçeneğidir; setState ile başka locale vermek hata üretir. Dil değiştirmek için getView → yeni locale ile mount → restoreView kullanın. Uzak seçili/filtrelenmiş CSV için exportCSV ve exportRows kullanın; toCSV mevcut sayfa içindir. Diğer temel API'ler korunur.
