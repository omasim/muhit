# Manuel erişilebilirlik kabul planı

Durum: **manuel yürütülmedi**. Bu oturumda ekran okuyucu ses çıktısını doğrulayabilecek bir oturum ve gerçek mobil cihaz erişimi yoktur. Bu belge sonuç kaydı değil, uygulanacak senaryo listesidir. Otomatik axe/Playwright testleri ayrı raporlanır.

| Ortam | Senaryo | Geçme ölçütü | Durum |
|---|---|---|---|
| macOS VoiceOver + Safari | Sütun genişliği ayırıcısı | Sütun adı, rolü, genişlik değeri duyulur; ok tuşuyla değişir | Bekliyor |
| Windows NVDA + Firefox | Sabit/gizlenen sütunlar | Görsel ve okuma sırası eşleşir; gizli hücreler okunmaz | Bekliyor |
| Windows JAWS + Chrome | Form ve async hata | Hata alanla ilişkilidir; eski yanıt duyurulmaz; kayıtta hataya ulaşılır | Bekliyor |
| VoiceOver / NVDA | Uzak combobox | Açılma, aktif seçenek, sonuç sayısı ve seçim anlaşılır | Bekliyor |
| VoiceOver / NVDA | Alan grubu ekleme/silme | Yeni alana/silme sonrası uygun kontrole odak gider | Bekliyor |
| Safari / Firefox | Dialog | Tab odağı içeride; Escape dönüş odağı açan düğmede | Otomatik geçti; manuel bekliyor |
| Gerçek iOS / Android cihaz | Dokunma ve yatay tablo | 44 px hedefler, sütun kaydırma ve büyütmede kontroller kullanılabilir | Bekliyor |

Kayda tarih, işletim sistemi, tarayıcı ve ekran okuyucu sürümü, yapılan adımlar, duyulan çıktı ve bulgu eklenmeli. Eksik testin yerine “uygun” yazılmamalı.

## 0.11 kabul ekleri — yürütülmedi

1. İki tekrar grubunu gezin: “Grup 1 / Grup 2” ayrı duyulmalı; birincisini silince ad ve odak doğru kalmalı.
2. Grup sunucu hatasında yalnız ilgili e-posta alanı hatalı duyulmalı, odak ilk hataya gelmeli.
3. Kanban taşıma tutamacında Space → oklar → Enter / Escape; başlangıç, hedef ve iptal duyurusu kontrol edilmeli.
4. Combobox required/readOnly/disabled durumları; seçim kimliğinin formda doğru gönderildiği doğrulanmalı.
5. Dil değiştirilen düzenlenmiş formda çıkış uyarısı ve reset davranışı korunmalı.

Kabul kaydı: tarih / cihaz / OS / tarayıcı / ekran okuyucu sürümü / senaryo / duyulan çıktı / sonuç / bulgu. Gerçek cihaz ve sesli okuma oturumu olmadan bu maddeler kapatılmaz.
