> Tarihsel sürüm kaydıdır. Güncel kapsam ve kanıt: [CURRENT.md](CURRENT.md).

# Muhit UI 0.8.0

- DataGrid: klavye ve pointer ile genişlik, sürükleme ve düğmelerle sıralama, başlangıç/son sabitleme, doğrulanan düzen snapshot'ı ve callback.
- Agent datagrid sözleşmesine columnLayout eklendi. Eski tanımlar geçerlidir.
- Ortak dil bağlamı, TR/EN bileşen metinleri, uygulama katalogları, dil başına sayı/tarih biçimi ve RTL yönü.
- Seçim ve hücre düzenlemesinde odak koruma; RTL sekme tuşları; koyu temada form hata bağlantısının kontrastı düzeltildi.
- Dil ve sütun düzeni örneği; otomatik axe taraması ve davranış testleri CI matrisine eklendi.

Otomatik tarama ve klavye testleri manuel ekran okuyucu/gerçek cihaz incelemesinin yerini tutmaz. NVDA, JAWS ve VoiceOver ile manuel uygunluk değerlendirmesi bu sürümde yapılmadı. Sanallaştırma, tekrarlanan form grupları ve uzak combobox bu sürümün kapsamı değildir.
