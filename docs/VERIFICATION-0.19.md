# Muhit 0.19.0-beta.1 · Doğrulama raporu

22 Ekim 2026. Yerel çalışma kopyası; registry yayını yapılmadı. Testler belirli davranışları doğrular, bütün ürünler için 1.0 kabulü oluşturmaz.

| Kontrol | Gerçek sonuç |
|---|---|
| Node | 97/97 geçti |
| TGZ runtime | Export edilen gerçek JavaScript girişleri Node'da import edildi; workspace CSS, demo ve dev server dosyaları mevcut |
| TGZ TypeScript | 86 public tip girişi, NodeNext ve Bundler geçti |
| Ürün sayfaları | 21 ana/alt rota × 1440/390 × açık/koyu × Chromium/WebKit = 168 axe/taşma taraması; ihlal yok |
| Önceki Atölye | 80 Chromium/WebKit axe/taşma taraması ve akış regresyonları geçti |
| Atölye suite | 24 ek Chromium/WebKit axe/taşma taraması ve arşiv/undo, locale/RTL, tablo/liste, dialog/odak geçti |
| MuhitSystem | Chromium'da 16 responsive/axe taraması ve mevcut ürün akışları geçti |
| React ve Vue | Temiz TGZ kurulumu, typecheck/build, development/production/SSR hydration akışları geçti; yeni resources mount/update/unmount/remount dahil |
| Sistem ve registry | 43 bileşen/modül sözleşmesi, 6 yerleşim tarifi, 16 token modu; yeni registry girişleri çalıştırılabilir export'larla eşleşiyor |
| Logo | 14 SVG Muhit 3.1 kilidiyle aynı |
| Paket bütçeleri | İzole eski modüller + resources/product/shell ve ek CSS bütçeleri geçti |
| Firefox | Yerelde başlatılamadı: macOS sandbox extension / SWGL framebuffer hatası; test geçti sayılmadı |
| Manuel kabul | VoiceOver/NVDA/JAWS ve fiziksel iOS/Android yürütülmedi |

## Davranış kanıtları

İki motorlu yeni akışlar: alan hata özeti/odak, gerçek olmayan kayıt sonucunu ayırma, conflict'te taslak koruma, upload iptal/geç yanıt/yeniden deneme, yorumda metni HTML olarak çalıştırmama, AI durdurma ve onay kapısı, kaydı doğrulanmayan öneriyi başarı saymama, tablo görünümünü geri yükleme, locale/saat dilimi, metin ölçeği, çoklu combobox klavyesi, eksik metriği sıfır saymama ve destroy temizliği.

Node ek sınırları: upload doğrulanmamış sonuç, iptal sonrası geç başarı, kaldırılan dosyanın geri gelmemesi, destroy sırasında abort, atomik dosya limiti, bozuk/duplicate kayıtlar, getter çalıştırmama ve veri kopyası izolasyonu.

## Kanıt dosyaları

- `tests/evidence/workspace19/verification.json`: 168 tarama.
- `tests/evidence/workspace19/flows.json`: son API düzenlemeleri sonrası iki motorlu işlem kontrolü.
- `tests/evidence/workspace19/verification-firefox.json`: başlatma engeli.
- `tests/framework-verification.json`: temiz paket React/Vue sonuçları.
- Dağıtım arşivinin `evidence/` klasörü: Atölye, suite, sistem, test ve paket çıktıları.

Yeni test `test:workspace` olarak `verify:all` ve üç tarayıcılı CI'a eklendi. Uzak GitHub CI bu oturumda çalıştırılmadı. `verify:all` komutunun bütün tarihsel testleri bu turda baştan çalıştırılmış gibi sunulmaz; yukarıdaki seçilmiş kontroller yürütüldü.

## Tekrarlama

`npm test`, `npm run check:system`, `npm run check:capabilities`, `npm run check:brand`, `npm run test:consumer-types`, `npm run test:workspace`, `npm run test:framework`, `npm run test:system`, `npm run test:bundles`, `npm run test:distribution`.

Workspace testi kendi yerel sunucusunu açar; `MUHIT_TEST_PORT` ile port, `MUHIT_BROWSER` ile motor seçilir. Varsayılan Chromium+WebKit'tir; CI her üç motoru ayrı çalıştırır. `PLAYWRIGHT_BROWSERS_PATH` kurulu tarayıcı konumuna göre ayarlanabilir.
