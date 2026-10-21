# Muhit 0.21.0-beta.1 · Doğrulama

Bu rapor kaynak düzeltmeleri, yerel testler ve ayrıca kaydedilecek uzak CI kanıtlarını ayırır.

- P1 eski yenileme/yerel mutasyon yarışı ve programatik update yarışları Chromium/WebKit'te geçti.
- Boş taslak, checkpoint reddi, sürüm snapshot'ı, opt-in session saklama ve remount geçti.
- 320/390/1440 px, açık/koyu ve 1.25 metin ölçeğinde 36 yeni EN uygulama odaklı tarama: axe/taşma sorunu yok; takvim gün hedefi en az 44 px. Bu matris EN sayfalarda yürütülür; TR regresyonları planning/workspace testlerindedir.
- React/Vue: gerçek TGZ kurulumu, typecheck/build, development/production/SSR; calendar draft ve boş editor title remount'ta korunur. React geliştirme testinde StrictMode yürür.
- TypeScript namespace import kontrolüne pozitif API kullanımı ve @ts-expect-error negatif fixture'ları eklendi.
- Gerçek yerel HTTP + dosya adaptöründe atomik sürüm çakışması, idempotent retry ve durable acknowledgment geçti.
- Figma Planning21: üç aile, 36 varyant; 360/800, Content/Focus/ActionDisabled/Loading/Partial/Error. Eski 0.20 anatomi örnekleri korunur; yeni aileler planlama için güncel kaynaktır.

## Kabul sınırı

Manuel VoiceOver/NVDA/JAWS ve fiziksel iOS/Android testleri bu ortamda tamamlanmadı. Otomatik axe, tarayıcı WebKit veya cihaz emülasyonu bu kabulün yerine geçmez. Bu dış kabul maddeleri kapanmadan kararlı 1.0 ilan edilmez; beta etiketi korunur.

## Yeniden çalıştırılan yerel kontroller

- `MUHIT_BROWSER=chromium npm run verify:all`: exit 0. 104 Node testi, framework, erişilebilirlik, dağıtım, tüketici tipi, sayfa durumları, sistem, felsefe, workspace, planning, paket tarayıcıları, readiness ve gerçek HTTP adaptörü zinciri geçti.
- Son takvim erişilebilir ad düzeltmesinden sonra Chromium/WebKit readiness bütünü yeniden geçti: 36 tam axe taraması, iki RTL/320 kontrolü ve route vazgeç/ayrıl akışları. Geniş verify:all zinciri bu son ad düzeltmesinden önce geçti; son düzeltme hedefli test ve uzak CI ile doğrulanır.
- Son taslak izni değişikliği ayrıca WebKit readiness testinde geçti. Chromium readiness zinciri de son kaynak üzerinden yürüdü. Saklama tercihi her sayfa için ayrıdır; bekleyen kayıt sırasında boş başlık geri gelmez.
- Gerçek TGZ'de calendar/editor/notifications/research/team rotaları çalıştı.
- 87 public type entry NodeNext/Bundler; ek pozitif/negatif planning API fixture'ları geçti. Bu sayı bütün API davranışlarının test sayısı değildir.
- 46 bileşen sözleşmesi, 16 token modu, 6 temel sayfa tarifi ve Muhit 3.1 marka kilidi doğrulandı.

Güncel kaynak SHA256: `8ed8fa0cdd99e6af73b38751a496177d132d6c865bf6250d10e1e60a36d9167a`.

## Uzak CI

Güncel kaynak commit'i: `7a219ea6185db32c0378d49c4a297cf5dda12524`.
Çalışma: https://github.com/omasim/muhit/actions/runs/39686892157
Durum: **başarılı**. Ubuntu 24.04 / Node 22.23.3 üzerinde Chromium, Firefox ve WebKit işleri tamamlandı. Chromium kapsamlı verify:all, framework/TGZ, bundle ve görsel kontrollerini de geçti. CI kanıtlarında kaynak özeti yukarıdaki değerle eşleşir; sourceChanged=false. Önceki çalışmalar son kaynak düzeltmelerinden sonra iptal edildi; başarı kanıtı sayılmaz. Önceki 0.20 raporları da bu sürüme otomatik aktarılmaz.
