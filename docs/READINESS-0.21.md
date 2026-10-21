# Muhit 0.21 · P1/P2 kapanış kaydı

| Öncelik | Önceki bulgu | 0.21 sonucu / kanıt |
|---|---|---|
| P1.1 | Geç loader yanıtı yerel değişikliği eziyordu | Yerel içerik değişmişse sonuç uygulanmaz; programatik update eski isteği iptal eder. Readiness yarış testleri. |
| P1.2 | Boş başlık modelden ayrılıyor, checkpoint eski başlığı geri getiriyordu | Ham taslak ve kayıt doğrulaması ayrıldı; boş başlık korunur, checkpoint reddedilir. Unit + browser. |
| P1.3 | Taslak, geçmiş ve dirty sözleşmesi yoktu | Sürümlü snapshot, restore, dirty/change callback; opt-in sekme saklama ve çıkış koruması. React/Vue remount. |
| P1.4 | Güncel sürüm entegrasyon ve kabul kanıtı eksikti | Gerçek 0.21 TGZ ile framework ve tüketici testleri eklendi. Üç tarayıcılı uzak CI başarılı; sonuç VERIFICATION-0.21 içinde. **Manuel fiziksel cihaz/ekran okuyucu kabulü bekliyor.** |
| P2.1 | 320 px takvim hedefleri küçülüyordu | 44 px alt sınırı ve takvim içinde kaydırma; sayfa taşması yok. |
| P2.2 | İngilizce sayfada Türkçe örnek içerik ve ham diff kodları | Uygulama sözlüğü ve okunabilir diff çevirileri; EN taramaları, TR regresyonları. |
| P2.3 | Sürüm ve export sayıları belgelerde eskiydi | RELEASE-POLICY ve support.json paket manifestinden üretilir; prepack tutarlılığı denetler. |
| P2.4 | Yeni planlama modüllerinin tasarım durumları yetersizdi | Üç Figma ailesinde 36 düzenlenebilir durum/boyut varyantı. Diğer eski ailelerin tam durum/piksel eşliği iddia edilmez. DESIGN-CODE-0.21. |
| P2.5 | Gerçek kayıt adaptörü örneği yoktu | Yerel HTTP + dosya, ETag/If-Match, idempotency, conflict ve kalıcı onay örneği. Üretim kimlik doğrulama servisi değildir. |
| P2.6 | Agent modül veri/eylem sözleşmeleri eksikti | Planning JSON Schema ve module manifest actions/authorization/transport alanları. 18 renderer kind değişmedi. |

## Kullanım kararı

Kontrollü proje entegrasyonuna uygun beta. Üretim uygulaması kendi kimlik doğrulama/yetkilendirme, kalıcı servis, veri saklama politikası ve gerçek kullanıcı kabulünü tamamlamalıdır. Açık manuel kabul, tam Figma durum eşliği ve üretim servisleri tamamlanmış gibi gösterilmez. 1.0/koşulsuz üretim onayı verilmez.
