# Muhit’in tasarım yaklaşımı

Muhit UI, Nevmos arayüz çalışmalarından bağımsızlaştırılan bir bileşen kütüphanesidir. Muhit adı, kullanıcının doğa ve çevreyle kurduğu ilişkiyi merkeze alarak seçildi. Tasarım yaklaşımı; içinde yaşadığımız çevreyi, komşuluğu ve ortak üretim alanlarını birlikte düşünür.

## İnsan: anlaşılır ve denetlenebilir

Arayüz bir kişinin ne olduğunu, ne yapabileceğini ve bir işlemin sonucunu anlamasına yardım eder. Butonun anlamı metninde görünür. Formun hatası ilgili alanın yanında anlatılır. Veri grafiklerinin erişilebilir tablo karşılıkları bulunur. Agent eylemleri uygulamanın tanımladığı callback'lere dönüşür; arayüz tanımı kendi başına dış işlem çalıştırmaz.

## Doğa: ritim ve kaynak farkındalığı

Koru, Toprak ve Kıyı; doğadaki renk ilişkilerinden hareket eden tasarım yorumlarıdır. Sakin yüzeyler, ölçülü vurgu ve nefes alan boşluk kullanılır. Bunlar sağlık, verim artışı veya çevresel etki ölçümü değildir.

Kütüphanenin çalışma zamanı framework ya da uzaktaki font servisini gerektirmez. Gereken modül ve stil ayrı kullanılabilir. Sistem fontu seçimi ve azaltılmış hareket desteği vardır. Enerji veya karbon tasarrufu sayısal olarak ileri sürülmez; gerçek ürün için ölçülmesi gerekir.

## Sanat: tutarlılık içinde kişilik

Atölye paleti pigment ilişkilerine, editoryal tipografi ise metnin anlatım gücüne alan açar. Bir arayüzün kişiliğini logoyu her yere yerleştirmekten çok; yazı hiyerarşisi, boşluk, renk rolleri ve eylem dili taşır. Bu nedenle Nevmos logoları bağımsız kütüphanenin dağıtımına dahil edilmez.

## Sabit kalanlar, değişebilenler

| Sabit sözleşme                             | Projeye uyarlanabilen ifade             |
| ------------------------------------------ | --------------------------------------- |
| Metin, zemin, vurgu, durum ve odak rolleri | Palet ve özel vurgu değeri              |
| Etiketli kontrol ve görünür odak           | Font ailesi, metin ölçeği               |
| Bileşen veri ve eylem API'si               | Rahat veya kompakt içerik               |
| Geçersiz girdinin reddedilmesi             | Yumuşak, yuvarlak veya keskin köşeler   |
| Verinin kaynağı ve örnek niteliği          | Açık/koyu görünüm ve sınır belirginliği |

Bir projede kendi temasını uygulayan agent görünümü yalnız kendi kapsayıcısını etkiler. Tema belirtmeyen görünüm, ev sahibi uygulamanın canlı tokenlarını devralır. Aynı kaynak hem insan tarafından stüdyoda düzenlenebilir hem bir agent tarafından JSON sözleşmesiyle önerilebilir.

## İlk sürümün kapsamı

Bu sürüm bir tasarım stüdyosu, taşınabilir kütüphane ve deterministik agent adaptörüdür. Kullanıcı hesabı, bulut tema senkronizasyonu, AI sağlayıcı bağlantısı veya uygulama backend'i içermez. Bu bağlantılar projeye özel katmanda kurulabilir. Beş agent bileşeni mevcut kullanım örneklerini kapsar; yeni bir tür API, şema, tipler ve testlerle birlikte eklenmelidir.
