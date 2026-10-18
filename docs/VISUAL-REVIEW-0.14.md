# Linux görsel referans incelemesi · 0.14.0

18 Ekim 2026. Kaynak koşu: https://github.com/omasim/muhit/actions/runs/39152479933 (37692af). 14 yeni ekran görüntüsü incelendi; light görünüm eski referansla tam boyutta karşılaştırıldı; büyük yazı/RTL görünümü ayrıca tam boyutta kontrol edildi.

Görülen farklar: sayfa standardının kenar boşlukları (24 → 33 px geniş görünüm), kanonik SVG boyutlandırma tutamacı ve buna bağlı başlık yüksekliği. Önceki Linux referansları 0.11 kaynağındandı. Yükleniyor/boş/hata, açık/koyu/sık/özel tema, grup/combobox/kanban, DE/AR ve büyütme görünümü tutarlı. Dar RTL tablosu kendi kaydırma alanında kalıyor; tam sayfa taşması yok. Bu inceleme manuel ekran okuyucu veya fiziksel cihaz kabulü değildir.

Eski PNG'ler outputs/muhit-visual-baselines-before-0.14 altında korundu. Adaylar tek tek referans dosyalarına alındı; karşılaştırma eşiği gevşetilmedi ve testte otomatik güncelleme açılmadı. Sonraki normal CI koşusunda 14 referansın eşleşmesi zorunlu.
