# 0.7.0 — 17 Ekim 2026

- 56 Node testi ve 14 sabit logo dosyasının özeti geçti.
- Chrome/Chromium, Firefox ve WebKit: üç hata regresyonu, genel tablo işlemleri, grafik boş değerleri, agent 1.1, iki sekme arasında tercih kaydı/silme/abonelik iptali, RTL/dar ekran ve forced-colors odak kontrolü geçti.
- Liste–ayrıntı–düzenleme örneğinde yeni kayıt, agent açma/kapatma ve erişim yok görünümü doğrulandı. 390px sayfa taşması WebKit'te bulunup düzeltildi.
- React/Vue, paketlenmiş TGZ üzerinden geliştirme ve üretimde tip kontrolü/derleme/tarayıcı testlerini geçti. Form güncelleme, kayıt, remount ve widget sekmeleri dahil.
- İzole modül paketleri 35KB minified JS bütçesinin altında; forms/plot/data-grid bağımsız girişleri ilgisiz grafik/tablo/agent modüllerini yüklemiyor. Gerçek boyutlar tests/bundle-verification.json içinde.
- 10.000 satır için DOM'da yalnız 10 satır; 3 saniyelik referans bütçesi geçti. Son yerel Firefox ölçümü 7ms, WebKit 6ms; cihazlar arası performans garantisi değildir.
- İlk GitHub CI koşusu üç işi başarıyla tamamladı: [38985804670](https://github.com/omasim/muhit/actions/runs/38985804670), commit 8cc97ed. Manuel ekran okuyucu, gerçek telefon ve SSR hydration testi yapılmadı.

---

# 0.6.0 — Form ve tercih sistemi · 17 Ekim 2026

- 51 Node testi geçti. Yeni kontroller: alan türleri ve sınırlar, gerçek tarihler, güvenli JSON, bağımsız değerler, bozuk/sürümsüz tercih kaydı, kota/erişim hataları ve geçersiz adlar.
- Chrome akışları geçti: hata özeti odağı, zorunlu e-posta, başarılı kayıt, alan/sunucu hatası, yeniden deneme, kayıtta kilitlenen alanlar, sıfırlama ile iptal, dirty state, yeniden yükleme sonrası saklanan tema, mobil %125 görünüm, destroy sonrası geç yanıt ve başarısız güncellemede eski değeri koruma.
- Mevcut stüdyo/tablo/tema tarayıcı regresyonları geçti; 14 sabit marka SVG dosyası doğrulandı.
- 0.6.0 TGZ ile React ve Vue: tip kontrolleri, üretim derlemeleri ve dört geliştirme/üretim tarayıcı koşusu geçti. Makine kaydı: tests/framework-verification.json.
- Son tercih zarfı kontrolü ayrıca 5 form/tercih testiyle doğrulandı; tüm 51 Node testi yeniden geçti.
- Test tarayıcısı Chrome; Firefox/WebKit, manuel ekran okuyucu testi ve uzak CI çalışması yapılmadı. Tam sınırlar docs/COVERAGE.md içinde.

---

# 0.5.1 — React/Vue gerçek uygulama doğrulaması · 17 Ekim 2026

- React 19.2.0 ve Vue 3.5.22 uygulamaları eklendi; bağımlılıkları sabitlenmiş package.json ve kilit dosyaları mevcut.
- TypeScript 5.9.3 / vue-tsc 3.1.1 tip kontrolleri ve Vite 7.1.9 üretim derlemeleri geçti.
- Muhit TGZ olarak paketlendi, kaynak klasörüne link vermeden iki geçici tüketici uygulamasına kuruldu.
- React geliştirme (StrictMode), React üretim, Vue geliştirme, Vue üretim: dört tarayıcı koşusu geçti.
- Her koşuda veri/sütun güncellemesi, sıralama, arama, literal HTML metni, bekleyen arama sırasında kaldırma, beş yeniden bağlama, tema, klavye, yerel font ve 390px/%125 görünüm kontrol edildi. Console veya runtime hatası yok.
- Makine kaydı: tests/framework-verification.json. Komut: npm run verify:all.
- Önceki “framework uygulamaları çalıştırılmadı” sınırlaması kaldırılmıştır. Uzak GitHub CI ve npm yayını yapılmamıştır.

---

# 0.5.0 doğrulama kaydı — 17 Ekim 2026

- 46 Node testi geçti: tema, agent sözleşmesi, genel veri tablosu, veri türleri ve güvenli enumlar.
- Paket içi tarayıcı regresyonu geçti: özel vurgu kontrastı, sorumlu sıfırlama/etiketi, sabit başlık, tema geri al/yinele, URL sayfa seçimi, 10.000 satırda sayfalı DOM, literal kullanıcı metni, geciken sağlayıcı yanıtı, hata/yeniden deneme ve zengin agent kart durumları.
- Açık/koyu görünüm, 1440/390 px genişlik ve %125 yazı ölçeği taşma kontrolü geçti.
- Sabit logo: 14 SVG hash eşleşiyor.
- Üretilen TGZ temiz yerel tüketiciye kuruldu: ESM girişleri, MuhitDataGrid, zengin agent şeması ve layouts.css doğrulandı.
- React/Vue dosyaları host entegrasyon örnekleridir; bağımsız framework uygulamalarında derleme/çalıştırma bu kontrolde yapılmadı.
- GitHub CI tarifi hazır; uzakta çalıştırılmadı. npm yayını yapılmadı.

Tek komut: `npm run verify`. Kurulum ve kapsam: PRODUCTION.md. DOM kontrast testi seçili örneği doğrular; tam erişilebilirlik uygunluğu iddiası değildir.

---

# 0.3.0 doğrulama kaydı

2026-10-09, yerel Chrome ve Node ortamında:

- 42 Node test grubu geçti: tema doğrulaması, kontrast, şema sınırları, agent yaşam döngüsü ve yeni widget sözleşmeleri.
- 59 mevcut tarayıcı kontrolü geçti: tema, import/export, tablo, grafik, agent, dialog ve mobil düzen.
- 11 yeni tarayıcı senaryosu geçti: sekme klavyesi, akordeon, sayfalama, Kanban, stepper, komut, drawer, seçim/dosya, agent widget olayları, yeni tema ayarları ve mobil taşma.
- 18 marka kontrolü geçti: 14 SVG görünüm sınırı, mevcut tema tercihleriyle uyum, yeni kayıt, navigasyon imzası ve mobil logo rehberi.
- TypeScript tanımları strict modda derlendi. JSON Schema 2020-12 sözleşmeleri ve örnekleri doğrulandı.
- Paketlenmiş TGZ içinden altı ESM API, widget örnekleri, stiller, şemalar ve türler doğrulandı.

Kontrast denetimi seçili 18 token çiftini kapsar; tam ürün erişilebilirlik sertifikası değildir. Kanban, seçim alanıyla sütun değiştirir. Dosyalar yerel kalır. Model, sunucu ve veri kalıcılığı bağlantıları uygulamanın sorumluluğundadır.

## 0.8.0 · 2026-10-17

60 Node testi geçti. Chromium, Firefox ve WebKit üzerinde ileri sütun işlemleri, odağın korunması, RTL sekmeler, Escape dönüş odağı ve dil değiştirme akışı doğrulandı. Test fikstürlerinde açık/koyu tema axe taramaları ihlal bildirmedi; on widget ile mevcut tablo/grafik taramaları da geçti. React/Vue kurulu paketle geliştirme/üretim akışları geçti. İzole ESM paket boyutları bütçe içinde; 14 logo özeti değişmedi. Ayrıntılı makine kaydı: tests/verification-0.8.json. Manuel ekran okuyucu ve gerçek cihaz incelemesi yapılmadı.
