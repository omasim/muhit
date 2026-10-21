# Muhit 0.21.0-beta.1 · Doğrulama

Bu rapor kaynak düzeltmeleri, yerel testler ve ayrıca kaydedilecek uzak CI kanıtlarını ayırır.

- P1 eski yenileme/yerel mutasyon yarışı ve programatik update yarışları Chromium/WebKit'te geçti.
- Boş taslak, checkpoint reddi, sürüm snapshot'ı, opt-in session saklama ve remount geçti.
- 320/390/1440 px, açık/koyu ve 1.25 metin ölçeğinde 36 yeni TR/EN uygulama odaklı tarama: axe/taşma sorunu yok; takvim gün hedefi en az 44 px. Bu matris EN sayfalarda yürütülür; TR regresyonları planning/workspace testlerindedir.
- React/Vue: gerçek TGZ kurulumu, typecheck/build, development/production/SSR; calendar draft ve boş editor title remount'ta korunur. React geliştirme testinde StrictMode yürür.
- TypeScript namespace import kontrolüne pozitif API kullanımı ve @ts-expect-error negatif fixture'ları eklendi.
- Gerçek yerel HTTP + dosya adaptöründe atomik sürüm çakışması, idempotent retry ve durable acknowledgment geçti.
- Figma Planning21: üç aile, 36 varyant; 360/800, Content/Focus/ActionDisabled/Loading/Partial/Error. Eski 0.20 anatomi örnekleri korunur; yeni aileler planlama için güncel kaynaktır.

## Kabul sınırı

Manuel VoiceOver/NVDA/JAWS ve fiziksel iOS/Android testleri bu ortamda tamamlanmadı. Otomatik axe, tarayıcı WebKit veya cihaz emülasyonu bu kabulün yerine geçmez. Bu dış kabul maddeleri kapanmadan kararlı 1.0 ilan edilmez; beta etiketi korunur.

Uzak CI sonuçları ve son toplamlar paket hazırlanmadan önce bu belgeye eklenecektir. Önceki 0.20 kanıtları yeni sürüm için otomatik başarı sayılmaz.
