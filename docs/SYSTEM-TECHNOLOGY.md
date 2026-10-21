# Teknoloji ve entegrasyon

Çekirdek: bağımlılıksız browser JavaScript, native HTML semantiği ve CSS custom properties. Kaynak klasik script modüllerinden aynı davranışlı ESM üretilir. TypeScript declaration dosyaları bütün public girişleri kapsar. Paket import’u SSR-safe; DOM oluşturan işlemler yalnız istemci lifecycle’ında çalışır.

| Sorumluluk | Muhit | Ürün uygulaması |
|---|---|---|
| Görsel tutarlılık | Tema, tipli token grafiği, CSS, ikonlar | Marka tercihi ve tema kapsamı |
| Etkileşim | Bileşen, klavye, odak, iptal, snapshot | Eylemin iş kuralı |
| Sayfa | 6 bölge tarifi ve durum kabuğu | Router, URL ve veri yükleme |
| AI | JSON doğrulama, önizleme, onay/yetki hook’ları | Model, server authorization, araç yürütme |
| Veri | Render, filtre, seçim, form taslağı | Kalıcı kayıt, auth, tenant izolasyonu |
| Kalite | Node/Playwright/axe, paket tipi, framework örnekleri | Gerçek kullanıcı ve cihaz kabulü |

React/Vue adaptörleri effect/mount ile bağlanır; unmount temizliği ve controlled değer öncelikleri korunur. Yeni Flow ve System framework bağımsız olduğu için React state/Vue ref ile subscribe edilebilir; listener temizliği ve pending operation iptali uygulamada yapılır.

İstemci tarafında `authorize:()=>true` yalnız örnektir; güvenlik denetimi değildir. Üretimde sunucu kullanıcı ve kaynak yetkisini tekrar doğrular. Sunucu adapter’ı idempotency, pagination/filter sözleşmesi ve gerçek hata sınıflandırmasını sağlar. Kullanıcıya gösterilen başarı gerçek sunucu sonucu veya açıkça belirtilen yerel işlemle eşleşmelidir.

Performans için feature import’ları ve opt-in CSS kullanın. Tam giriş küçük bir button örneği için zorunlu değildir. System registry tam katalog taşır; yalnız form kullanan sayfa `muhit-ui/forms` seçebilir. Sayfa bölgesini saklamak DOM durumunu korur, bellekten kaldırmaz; büyük ekranlarda uygulama sınırları ve virtualization politikası gerekir.

Test araçları devDependency’dir; üretim runtime’ına Playwright/axe/TypeScript dahil edilmez. CSS tokenlar ve yerel fontlar JS olmadan temel görünüm sağlar; JS gerektiren etkileşimler için gerçek native fallback veya açık açıklama sunulmalıdır.
