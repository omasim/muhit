# 0.19 → 0.20 geçişi

- Yeni `muhit-ui/planning` ESM/TypeScript girişi: takvim, belge ve bildirim merkezi.
- Stile `styles/planning.css` ekleyin; `base.css` ve `suite.css` önkoşuldur. Ana CSS'ye ağır modüller otomatik eklenmedi.
- Bildirim nesnesi artık isteğe bağlı `snoozedUntil` alanını kabul eder. Eski kayıtlar değişmeden çalışır.
- Inbox görünümü isteğe bağlı `groupBy` döndürür; eski query/filter görünümü geri yüklenebilir. Katı tüketici şemalarınızı güncelleyin. `snoozed` filtre değerini tanıyın.
- Bütün mount controller'larını unmount'ta `destroy()` edin; asenkron adaptörlerde gelen AbortSignal'i gerçek isteğe iletin.
- Yeni API'ler Agent JSON'nin 18 türünü değiştirmez. Agent verisini önce doğrulayın; servis callback'lerini güvenilir uygulama kodu bağlar.
- Yerel sürüm/tercih/etkinlik kalıcı sunucu kaydı değildir. Adaptör sonuçları `persisted:true` ile doğrulanmalıdır.
- Eski 0.19/Atölye kanıtları tarihsel olarak korunur; yeni sürüm doğrulaması `VERIFICATION-0.20.md` içindedir.
