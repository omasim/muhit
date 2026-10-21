# 0.21 → 0.22

- Yeni `muhit-ui/search` girişini gerektiğinde ayrı içe aktarın; eski root API değişmedi.
- Takvim inputTimeZone varsayılan UTC'dir. Yerel giriş için IANA bölgesini açıkça verin. CalendarDraft v1'e isteğe bağlı editingId/inputTimeZone eklendi; farklı bölgeye restore reddedilir. Düzenleme kimliği yüklenen kayıtlarda bulunmalıdır.
- onCommit eski oluşturma akışında çalışır. Sunuculu düzenleme/silme için onMutation ekleyin; aksi halde bu eylemler devre dışıdır. Silme onay ve iptal davranışını uygulama testinize ekleyin.
- Belge Block türüne image, url ve marks eklendi. 0.21'e geri dönerken bu alanları sessizce silmeyin; eski istemci yeni belgeyi reddetmelidir. Eski işaretsiz belgeler aynen çalışır.
- JSON dışa aktarma taslak aktarımıdır, kayıt onayı değildir. Görsel URL ve açıklamasını kayıt sınırında doğrulayın.
- Eski snapshot/type fixture'larını yeni alanlarla kontrol edin. 18 Agent JSON render türü aynı kaldı; yeni yardımcılar imperative uygulama katmanındadır.
- Entegrasyon sunucusunun statik kök yolu düzeltildi; / ana sayfası artık gerçekten sunulur ve test edilir.
