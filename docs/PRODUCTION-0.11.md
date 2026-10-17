# 0.11.0 — üretim hazırlığı düzeltmeleri

18 Ekim 2026. Bu kayıt 0.10.0 değerlendirmesindeki P1/P2 maddelerini izler.

| Madde | Durum / kanıt |
|---|---|
| P1/1 CSV | Düzeltildi: yükleme/hata sırasında mevcut sayfa dışa aktarılmaz, select-all kapalı; başarı/yeniden denemede açılır. Üç tarayıcı regresyonu. |
| P1/2 NodeNext | Düzeltildi: 16 paket tipi girişi strict NodeNext ve Bundler ile derlenir. Gerçek TGZ kullanılır. |
| P1/3 Form durumu | Düzeltildi: getSnapshot/baseline ile değer ve başlangıç korunur; gerçek React/Vue geliştirme/üretim/SSR kabuğu akışında dil+başlık değişimi, isDirty ve reset kontrol edildi. |
| P1/4 Grup adları | Düzeltildi: indeksli başlıklar silmede güncellenir; çoklu grup axe ve yeniden numaralama üç tarayıcıda geçti. |
| P1/5 Manuel kabul | AÇIK: gerçek ekran okuyucu ve fiziksel iOS/Android oturumu yok. Otomatik sonuçlarla kapatılmadı. ACCESSIBILITY-MANUAL.md senaryoları genişletildi. |
| P2/6 Test matrisi | Üretim regresyonları, paket tip tüketicileri ve React/Vue metadata kontrolleri eklendi. |
| P2/7 Agent belgeleri | llms.txt ve AGENTS.md, AGENT-CONTRACT.md ile hizalandı. Programatik olay kullanıcı yetkisi değildir. |
| P2/8 Dağıtım | 0.11.0 sürümü, geçiş ve destek matrisi, TGZ/kaynak ZIP/SHA256SUMS hazırlama aracı. npm registry yayını yapılmadı. Uzak yayın sonucu ayrıca belirtilir. |
| P2/9 Görsel kapsam | 14 durum: önceki 8 + grup hataları, açık combobox, Kanban hedefi, DE, AR, büyük metin. Yeni macOS görüntüleri incelendi ve normal karşılaştırma yapıldı. Linux adayları CI’dan indirildi ve incelenerek ayrı referanslar olarak eklendi. Yükleme/hata durumundaki seçim kutusunun devre dışı olması beklenen farktır. |
| P2/10 Diller/stüdyo | Eski Table/Charts çeviri çağrıları için DE/AR mesajları ve kapsam testi; TR/EN ortak tema şeması/değer ayrıştırma. Arşiv belgeleri özgün dilinde kalır; native editoryal kabul AÇIK. |
| P2/11 Formlar | Grup bazlı async/sunucu hatası, iptal/eski yanıt koruması; combobox name/required/disabled/readOnly ve FormData desteği. Nested HTML formu desteklenmez, düz gruplama sözleşmesi belgelenmiştir. |

## Doğrulama

- 66 Node testi; 14 sabit marka SVG kontrolü.
- Chromium tam verify:all; React/Vue TGZ kurulumu, tip kontrolü, build, dev/prod/SSR kabuğu hydration.
- Chromium, Firefox, WebKit üretim regresyonları ve erişilebilirlik otomasyonu.
- macOS/Chromium 14 durumlu görsel katalog: grup hatası, açık liste, Kanban hedefi, DE/AR ve büyütülmüş metin görüntüleri ayrıca gözle incelendi.
- Paketlenmiş 16 tip girişi, strict NodeNext/Bundler.
- CSS/font bütçeleri, 20 bin satır ölçek testi ve capability tutarlılığı.

SSR, uygulama kabuğudur; tablo satırlarının sunucuda üretildiği iddia edilmez. Otomatik mobil emülasyon fiziksel cihaz testi değildir. Çeviri anahtar kapsamı ana dil editoryal onayı değildir.

## Kullanım kararı

Dört doğrulanmış kod engeli kapatıldı. Sürüm sabitlenerek pilot ve iç araç projelerine alınabilir. Erişilebilirliği kritik genel yayına çıkış için manuel kabul tamamlanmalı. Uygulama sağlayıcıları, kimlik/izin kontrolü, kalıcılık ve gerçek ağ hata davranışı tüketici projenin sorumluluğundadır.

## Uzak doğrulama

Son karşılaştırmalı CI üç tarayıcıda başarılı: https://github.com/omasim/muhit/actions/runs/39070676595. Test edilen kod commit’i `dd4c7d5b5987a568158d4f0048802c894dcd9fdb`. Linux/Chromium 14 görsel referansı normal karşılaştırmayla geçti. Değişiklikler PR #1 üzerinde incelemeye sunulmuştur; ana dal birleştirmesi ve npm yayını bu çalışmada yapılmadı.
