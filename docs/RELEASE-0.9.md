# Muhit 0.9.0 · P1/P2 tamamlamaları

P1: bölgesel dil devralma düzeltildi; tablo locale değişiminin sözleşmesi netleştirildi; sürümlü görünüm kaydı ve seçim geri yükleme eklendi; tıklanabilir checkbox hedefi 44 px oldu; ortak CSV kaçışı ve uzak kapsam sağlayıcısı eklendi.

P2: React/Vue adaptör seçenekleri, kontrollü güncellemeler ve SSR/hydration örnekleri genişletildi. Tekrarlanan alan grupları ve uzak combobox MuhitFields API'siyle sunulur. Formlarda gecikmeli/iptal edilebilir validateAsync vardır. Agent form ve tablo olaylarını uygulamaya aktarır. Sekiz durumlu görsel katalog PNG referanslarıyla karşılaştırılır. Yetenek listesi sürümlü JSON'dan üretilir; destek ve yayın rehberi güncellendi.

API geçişi: locale, Grid mount seçeneğidir. setState üzerinden farklı locale vermek hata üretir. Dil değiştirmek için getView → yeni locale ile mount → restoreView. Uzak veri CSV'sinde kapsam açık seçilir: mevcut sayfa toCSV; filtrelenmiş/seçilmiş kayıtlar exportCSV({scope}) + exportRows sağlayıcısı. ServerRows doğrulaması azami 100.000 kayıt sınırını korur; çok büyük ihracat için uygulamanın sunucu indirmesi kullanılmalı.

Görsel referanslar yalnız kayıtlı platform/tarayıcı için geçerlidir. Normal test referans oluşturmaz. Yeni referans MUHIT_UPDATE_VISUAL=1 ile açıkça üretilir; farklar görüntü incelemesiyle kabul edilir. Renk kenarlarındaki küçük yumuşatma farkları toleranslı karşılaştırılır; geniş değişiklikler başarısız olur.

Manuel VoiceOver/NVDA/JAWS ve fiziksel mobil cihaz testi yürütülmedi. Bu açık doğrulama, uygulanmış kod işleriyle karıştırılmamalı. Ek dillerin editoryal içeriği, sanallaştırma, grup/sütun veri gruplaması ve Kanban sürükleme sonraki kapsamdadır.

Eski Table/Charts belirli proje ve araştırma panolarına uygun hazır görünümlerdir. Yeni uygulama verilerinde DataGrid/Plot tercih edilir; genel kolon/veri sözleşmeleri bunlardadır. Gelişmiş form, framework ve manuel erişilebilirlik belgeleri ilgili API sınırlarını açıklar.
