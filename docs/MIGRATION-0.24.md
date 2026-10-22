# Muhit 0.24 · Geçiş

0.23 → 0.24.0-beta.1: API imzaları değişmedi. Takvim zaman alanları step=0.001 kullanır. Değişmeyen başlangıç/bitiş alanları orijinal UTC anını korur; değişen yerel saat yine DST ayrıştırma seçimine tabidir. Milisaniye içeren yerel gösterim artık .SSS eki taşır. Bu gösterimi elle ayrıştıran tüketiciler güncellenmelidir.

Üst üste kayıt ve silmede önceki istemci işlemi geçersiz kılınır; başarı/hata/iptal sonrası yeniden kayıt yapılabilir. AbortSignal sunucudaki işlemin geri alındığı garantisi değildir; ürün servisi idempotency ve yeniden eşitleme sağlamalıdır.

Almanca/Arapça messages katalogları planlama denetimlerini içerir. Önceki import yolları korunur. Takvim formu ve editör sütunları artık kapsayıcı genişliğine göre yerleşir.

Performans testi schemas/performance-budgets.json içindeki ürün ve regresyon bütçelerinin ikisini de zorunlu tutar. test:performance-profile script adı korunur.
