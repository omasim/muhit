# Güvenlik bildirimleri

Bakımı yapılan sürüm 0.10.x'tir. Muhit yalnız arayüz katmanıdır; kimlik doğrulama, sunucu yetkilendirmesi ve kalıcı kayıt uygulamanın sorumluluğundadır.

Güvenlik bildiriminde etkilenen sürümü, en küçük tekrar örneğini ve beklenen davranışı belirtin. Gizli anahtar veya kişisel veri eklemeyin. Depoda GitHub Private Vulnerability Reporting etkinse Security bölümünü kullanın; etkin değilse hassas ayrıntıları yayınlamadan önce depo sahibi omasim'den özel bildirim kanalı isteyin. Açık issues alanı normal hata bildirimleri içindir.

Agent tanımları yalnız doğrulanmış JSON kabul eder; HTML/JavaScript çalıştırma aracı değildir. Formun onSubmit ve agent'ın onAction bağlantıları uygulamanın yetkili iş mantığına bağlanmalıdır.
