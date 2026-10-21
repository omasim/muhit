# Muhit 0.21 · Tasarım ve kod eşleştirmesi

Figma dosyası: https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=20-2132

| Aile | Component set | Kod |
|---|---|---|
| Calendar | 20:1385 | mountCalendar |
| Document editor | 20:1794 | mountDocumentEditor |
| Notification center | 20:2131 | mountNotificationCenter |

Üç ailede toplam 36 varyant: 360 ve 800 px; Content, Focus, ActionDisabled, Loading, Partial, Error. Gerçek düğme, alan, liste ve önizleme anatomileri; Manrope/Source Serif 4 stilleri ve semantik token bağları kullanılır. ActionDisabled yalnız gönderme eylemini devre dışı bırakır; taslak düzenlenebilir. Mobil içerik örnekleri 20:2132 çerçevesinde ve 800 px editör 20:1590 düğümünde görsel olarak incelendi; satır kesilmesi ve seçili gün sarmalanması düzeltildi.

`design/figma/planning-0.21.json` gerçek node envanteridir. Boyutlar ilk üretim anına aittir; metin taşması düzeltildikten sonra otomatik yerleşim yükseklikleri değişebilir. 0.20 anatomi örnekleri korunur. Diğer ailelerin tüm durumları için piksel eşliği veya yayımlanmış Code Connect iddiası yoktur. Klavye, iptal ve kayıt davranışı için çalıştırılabilir kaynak kod ve tarayıcı testleri esastır.
