# Muhit 0.24 · Kalan manuel erişilebilirlik kabulü

Durum: BEKLİYOR. Otomatik axe ve Playwright sonuçları bu listeyi kapatmaz.

## Ortamlar

- macOS Safari + VoiceOver; Windows Firefox/Chrome + NVDA. JAWS hedef kurumun destek gereksinimindeyse Chrome ile ayrıca.
- Fiziksel iPhone Safari + VoiceOver; Android Chrome + TalkBack.
- Yalnız klavye; %200/%400 zoom, büyük sistem yazısı, açık/koyu tema, hareket azaltma. İşletim sistemi/tarayıcı/AT sürümlerini gerçek cihazdan kaydedin.

## Adımlar ve geçme koşulları

1. Takvimde ay/gün gezin, etkinliği düzenleyin, kaydedin. Gün/etkinlik adları ve odak anlaşılır olmalı; açıklama korunmalı.
2. Kayıt beklerken başlığı değiştirin. İlk başarı ardından ikinci değişikliği kaydedin. Sonuç duyuruları doğru sürümü anlatmalı; odak kaybolmamalı.
3. Dış değişiklik ve kapasite/DST hatası oluşturun. Hata okunmalı, taslak korunmalı, düzeltme yolu klavyeyle ulaşılır olmalı.
4. Silme onayını açın, vazgeçin; sonra gönderimi iptal edin. Onay/iptal ve belirsiz sunucu sonucu doğru anlatılmalı; geç yanıt başarı gibi duyurulmamalı.
5. Editörde metin seçip kalın/italik/bağlantı uygulayın; görsel açıklamasını okuyun. Kontrol adı, seçim ve uygulanan biçim anlaşılır olmalı.
6. Geçersiz JSON aktarın, geçerli aktarımı geri alın. Eski içerik kaybolmamalı; hata ve geri alma sonucu duyurulmalı.
7. Aramada sayfa değiştirin, hizmet hatası ve iptal oluşturun. Sonuç sayısı/sayfa duyurulmalı; önceki sonuçlar ulaşılabilir kalmalı.
8. Mobilde bütün kontrolleri dokunarak kullanın; 44 px hedef, metin yeniden akışı ve yatay kaydırmanın bulunabilirliğini kontrol edin. İçerik yakınlaştırmayla erişilemez hale gelmemeli.

Her senaryo için: paket sürümü + SHA256, tarih, test eden, cihaz/OS, tarayıcı/AT sürümü, adımlar, beklenen/duyulan çıktı, odak davranışı, sonuç ve bulgu bağlantısı kaydedilir. Kritik veri kaybı, klavye tuzağı veya ulaşılamayan eylem üretim kabulünü engeller. Bulgular düzeltildikten sonra aynı cihaz/senaryo tekrar edilir.

## Bu sürüme özel ek kabul

- Kayıt beklerken başka etkinliği silin; başarı, hata ve iptal sonrası kaydetmeye yeniden ulaşın. Taslağın korunmasını, duyurunun doğru işlemi anlatmasını ve odak yerini kontrol edin.
- Saniye/milisaniyeli etkinliği yalnız başlık değiştirerek kaydedin; fiziksel mobil tarih kontrolünün kullanılabilirliğini doğrulayın.
- Almanca ve Arapçada takvim/editör/bildirim merkezi metinlerini ana dil incelemesinden geçirin; RTL okuma sırası ve 320 px/dar kapsayıcı/büyük yazı birleşimini test edin.
