# Muhit 0.23 · Tasarım–kod ekleri

[Figma inceleme çerçevesi](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=25-865).

| Kontrol ailesi | Component set | Kod karşılığı |
|---|---|---|
| Tekrar ve kapasite | 25:213 | createRecurringEvents, capacityAvailable; planning örneği |
| Metin ve medya | 25:418 | mountDocumentEditor; marks, URL ve alternatif açıklama |
| JSON aktarımı | 25:587 | exportDocument/importDocument; editör aktarım alanı |
| Uzak arama | 25:720 | createRemoteSearch; sorgu, sayfa, sonuç ve iptal |

Her ailede Width=360/800 ve Content/Focus/Loading/Error/Cancelled/Conflict: toplam 48 varyant. Mevcut Muhit semantik tokenları, Manrope/Source Serif 4 ve paylaşılan metin stilleri kullanıldı. Çok satırlı metin/alan yüksekliği içerikle büyür; inceleme çerçevesindeki mobil Content/Error örnekleri görsel olarak kontrol edildi ve taşmalar düzeltildi.

Bu ekler, 0.21 tam takvim/editör anatomisinin üzerine gelen kontrol desenleridir. Senkron yerel aktarım/tekrar işleminin kendi başına ağ beklemesi veya iptal servisi olduğu iddia edilmez; Loading/Cancelled/Conflict varyantları üst uygulama akışı için tasarım durumlarıdır. Etkileşim davranışının kaynağı çalışan kod ve testlerdir; Figma çalışır uygulama prototipi veya her durumda piksel eşliği değildir. Code Connect yayını yapılmadı.

Kimlikler ve kapsam: design/figma/planning-0.23.json. Önceki 0.21/0.20 varlıkları korunur.
