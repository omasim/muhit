> Current 0.25 manual steps: [MANUAL-ACCEPTANCE-0.25.md](MANUAL-ACCEPTANCE-0.25.md). Pending.

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

## 0.14 kabul kaydı — boş şablon

Her ortam için ayrı kopyalayın; otomatik test sonucu bu tabloyu doldurmaz.

| Alan | Kayıt |
|---|---|
| Test eden / tarih | Bekliyor |
| Paket sürümü / sourceSha256 / commit | 0.14.0 / rapordan doldurun |
| Cihaz / işletim sistemi | Bekliyor |
| Tarayıcı / ekran okuyucu sürümü | Bekliyor |
| Senaryo / adımlar | Yukarıdaki senaryo kimliği ve tam adımlar |
| Beklenen / duyulan çıktı | Bekliyor |
| Odak sırası / dokunma / büyütme | Bekliyor |
| Sonuç / bulgu / kayıt bağlantısı | Bekliyor |

Yeni başlık API'sinde sayfa h1 → widget h2 → alt bölüm h3 gezinmesini kontrol edin. `A → B` ve `10 × 20` etiketlerinin metin olarak korunduğunu, dekoratif simgelerin tekrar okunmadığını doğrulayın. Dil değişimi sırasında bekleyen kayıt iptal edildiğinde yanlış başarı duyurusu oluşmamalı.

## 0.19 beta — manuel kabul bekliyor

Çoklu combobox aktif seçenek/seçim, hata özetinden alana odak, upload ilerleme/iptal, AI akışını durdurma ve mobil shell navigasyonu gerçek VoiceOver/NVDA/JAWS ile dinlenmeli. Fiziksel iOS/Android 44 px hedef ve büyütme kabulü henüz yapılmadı. Otomatik sonuçlar VERIFICATION-0.19.md içinde ayrı tutulur.

## 0.21 beta — bu sürümün açık kabul kapıları

Aşağıdaki kayıtlar **bekliyor**; otomatik axe/Playwright sonuçları yerine geçmez.

| Senaryo | Beklenen davranış | Ortam |
|---|---|---|
| Boş belge başlığı / checkpoint | Başlık boş kalır, hata duyurulur; eski başlık geri gelmez | VoiceOver + Safari, NVDA + Firefox/Chrome, JAWS + Chrome |
| Kayıt / iptal / geç yanıt | İptal duyurulur, taslak korunur; geç başarı okunmaz | Aynı ekran okuyucu matrisi |
| Sekme taslağını etkinleştir / yenile | Açık tercih anlaşılır; içerik ve sürümler geri gelir | Masaüstü + fiziksel iOS/Android |
| Kirli taslakla sayfadan çık / vazgeç | İletişim kutusu anlaşılır; vazgeçince odak ve içerik korunur | Aynı matris |
| Dar takvim | Günler en az 44 px, yatay takvim gezilebilir, sayfa taşmaz | Fiziksel iOS/Android; büyük yazı ve zoom |
| Bildirim tercihleri / kısmi hata | Kaydedilen ve kaydedilmeyen sonuçlar ayrı ve doğru duyurulur | Ekran okuyucu matrisi |

Kayıt alanları: sürüm 0.21.0-beta.1, dağıtım SHA256, tarih, test eden, cihaz/OS, tarayıcı/ekran okuyucu sürümü, adımlar, duyulan çıktı, odak, sonuç, bulgu. Bekleyen kabul üretime hazır veya WCAG sertifikalı diye sunulmaz.

## 0.22 · manuel kabul ekleri (bekliyor)

- Yerel saat/DST hatalarının anlaşılır duyurusu; düzenle, taslağı değiştir, silme onayı ve iptal sonrası odak.
- Metin seçiminden kalın/italik/bağlantı uygulama; görsel alternatif açıklaması ve URL hatası; ins/del karşılaştırma okuması.
- JSON içe aktarma hatasında taslağın korunması ve geri alma; arama sayfası değişimi, sonuç sayısı ve iptal duyurusu.
- VoiceOver/NVDA/JAWS ve fiziksel iOS/Android sonuçları ayrıca kaydedilmeli. Otomatik taramalar bu bölümü kapatmaz.
