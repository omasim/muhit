# Muhit Tasarım Sistemi Mimarisi v1

Muhit, insan emeğini koruyan ve tasarımcı, geliştirici ve agent’ın aynı sözleşmeleri kullandığı bir arayüz sistemidir. Marka/tema, UI davranışı ve ürün iş mantığı ayrı sorumluluklardır. Logo 3.1 sabittir.

## Katmanlar ve kaynak sahipliği

| Katman | Kaynak | Sorumluluk |
|---|---|---|
| İlkeler | DESIGN.md / PRINCIPLES.md | Karar gerekçeleri ve inceleme ölçütleri |
| Tema | src/theme.js | Kontrast uyarlaması, paletler ve mevcut CSS tokenlarının tek kaynağı |
| Temeller | schemas/foundations.json | Boşluk, katman ve hareket ölçekleri |
| Token sözleşmesi | MuhitTokens | DTCG dışa aktarma, referans doğrulama, tema önceliği |
| Davranış | MuhitFlow + mevcut Form/Widgets | İşlem, iptal, taslak ve yaşam döngüsü |
| Bileşenler | schemas/component-contracts.json | Anatomi, API, durum, sınırlamalar ve kabul ölçütleri |
| Sayfa | MuhitPages + schemas/pages.json | Bölgeler, durumlar ve yerleşim |
| Örüntüler | schemas/patterns.json | Liste–detay, form, toplu işlem, AI inceleme |
| AI kompozisyonu | MuhitSystem + system.schema.json | Sayfa/bileşen/eylem ilişkisinin doğrulanması |
| Ürün | examples/system | Kurumsal site, yönetim ve veri uygulaması |
| Yönetim | SYSTEM-GOVERNANCE.md | Sürüm, sahiplik, test, kabul ve geçiş |

Üst katman alt katmanı kullanır. Ürün veri servisleri, kimlik doğrulama ve yetkilendirmeyi sağlar. Bir UI callback’i yetki kanıtı değildir. Çekirdek modüller import sırasında DOM gerektirmez. ESM ve klasik script aynı kaynaktan üretilir.

## Uygulama sırası

1. Mimari, sözleşmeler ve kaynak envanteri.
2. Üç düzey token modeli, tema önceliği ve doğrulanmış dışa aktarma.
3. Bileşen sözleşmeleri, ortak işlem yaşam döngüsü ve erişilebilir yerleşim temelleri.
4. Sayfa kabuğu, durumlar, örüntüler ve çalışan kullanım örnekleri.
5. AI manifestleri, kompozisyon doğrulama ve uygulama yetki sınırı.
6. Üç referans ürün üzerinde tarayıcı, klavye, erişilebilirlik, tip ve paket kabulü.

## Tamamlanma ölçütü

Her public API: tip, örnek, hata yolu, iptal/cleanup, klavye ve yerelleştirme sözleşmesi ile dağıtılır. CSS sınıfları native HTML semantiği ister. Referans adaptörleri gerçek framework tüketicilerinde test edilir. Otomasyon manuel ekran okuyucu ve fiziksel mobil cihaz kabulünün yerine geçmez. Native Figma dosyası ile kod eşitliği ancak tasarım dosyası ayrıca doğrulanınca iddia edilir; token dışa aktarımı tek başına bunu kanıtlamaz.

“Tam sistem” belirli bir kapsamın birlikte çalışmasıdır; sınırsız bileşen veya bütün uygulama alanları için tamamlanmışlık vaadi değildir. Desteklenen, deneysel ve ertelenmiş kapsam katalogda görünürdür.
