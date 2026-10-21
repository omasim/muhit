# Muhit 0.22 · P3 kapanış ve sınırlar

| Sıra | Önceki P3 maddesi | Sonuç |
|---|---|---|
| 1 | Yerel saat, tekrar/istisna, düzenleme/silme, kapasite | Uygulandı. UTC uyumu korunur; IANA/DST politikası açıktır. Günlük/haftalık sonlu seri, kayıt başına düzenleme ve yerel kapasite kontrolü. |
| 2 | Satır içi biçim, bağlantı/görsel, içe/dışa aktarma, sözcük diff | Uygulandı. Seçim aralıkları, HTTPS medya/bağlantı, geri alınabilir JSON aktarımı, maliyeti sınırlı diff. |
| 3 | Büyük veri araması ve uzak sayfalama | Uygulandı ve 10k/100k sentetik veriyle ölçüldü. Yeni prepared index ve gerçek yerel HTTP sayfalama örneği. **Gerçek proje veri kabulü bekliyor.** |
| 4 | Ortak düzenleme, ödeme/abonelik ve sektör sayfaları | Koşullu kapsam; ürün/sağlayıcı/veri modeli belirtilmediği için uygulanmadı. Genel UI sistemi için zorunlu çekirdek kabul edilmedi. |

110 Node testi ve 88 tipli giriş kontrolü geçti. Önceki 40 planlama + 36 taslak taraması yeniden geçti. Yeni ekran için Chromium/WebKit'te 12 açık/koyu, 320/390/1440 ve 1.25 ölçek taraması; 390 px RTL, gerçek HTTP sayfalama, iptal/hata/taslak ve güvenli URL akışları geçti. Uzak CI üç motorda başarılı; yeni ekran için toplam 18 tarama geçti. Ayrıntılar VERIFICATION-0.22.md içinde tutulur.

Fiziksel cihaz ve manuel ekran okuyucu kabulü tamamlanmadı. Beta etiketi korunur. Ticari rezervasyon kilidi, kimlik doğrulama, ödeme işlemi veya çok kullanıcılı düzenleme servisi sağlandığı iddia edilmez.
