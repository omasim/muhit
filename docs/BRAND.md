# Muhit — logo ve kullanım

**Görsel kimlik 3.1 · sabit**

Marka dosyalarındaki libraryVersion 0.3.1, kimliğin sabitlendiği paket sürümünü kaydeder. Güncel kütüphane sürümü package.json içindedir; logo sürümü bağımsızdır.

Muhit adı, doğa ve çevreyle ilişkisi nedeniyle kullanıcı tarafından seçildi. Kütüphanenin yaklaşımı insanı çevresinden ayrı düşünmez: iyi bir arayüz, insanlara ortak bir alanda anlaşılır biçimde çalışma imkânı verir.

## Sembolün fikri

Üç akışkan yay ortak bir açık merkezi çevreler. Ortalarda hafifçe dolgunlaşan, uçlara doğru incelen formlar doğanın yumuşak ritmini taşır. Tek renk ve açık merkez korunur.

Bu açıklama logonun tasarım niyetidir. Sembolün küçük boyutta kolay tanınması için ayrıntılı yaprak, ağaç, manzara veya ince çizgi kullanılmaz.

## Ana dosyalar

| Kullanım                             | Dosya                                                      |
| ------------------------------------ | ---------------------------------------------------------- |
| Ana logo, şeffaf zemin               | [muhit-logo.svg](../assets/brand/muhit-logo.svg)           |
| Sembol                               | [muhit-symbol.svg](../assets/brand/muhit-symbol.svg)       |
| UI kütüphanesi imzası                | [muhit-ui.svg](../assets/brand/muhit-ui.svg)               |
| Yazı logosu                          | [muhit-wordmark.svg](../assets/brand/muhit-wordmark.svg)   |
| Tek renk logo                        | [muhit-logo-mono.svg](../assets/brand/muhit-logo-mono.svg) |
| Koyu zemin logosu                    | [muhit-logo-dark.svg](../assets/brand/muhit-logo-dark.svg) |
| Uygulama simgesi                     | [muhit-app-icon.svg](../assets/brand/muhit-app-icon.svg)   |
| Tarayıcı simgesi                     | [favicon.svg](../assets/brand/favicon.svg)                 |
| Kullanım panosu                      | [Logo panosu](../assets/brand/index.html)                  |
| Makine tarafından okunabilir ölçüler | [brand.json](../assets/brand/brand.json)                   |

Yazı logosu, Manrope 620 ağırlığından vektör yollara dönüştürülmüştür. SVG dosyalarında dış font veya raster görüntü bağımlılığı bulunmaz. Yazıyı fontla yeniden yazmak yerine ana SVG dosyasını kullanın.

## Renkler

| Rol      | HEX       | Kullanım            |
| -------- | --------- | ------------------- |
| Orman    | `#356752` | Ana sembol          |
| Mürekkep | `#202A25` | Yazı logosu         |
| Kâğıt    | `#F5F4EF` | Önerilen açık zemin |

Koyu zemin sürümünde sembol `#B5D1B8`, yazı `#F5F4EF` olur. Dış dosyada `-mono.svg` siyah görünür; inline SVG olarak kullanıldığında `currentColor` değerini devralır. Beyaz tek renk kullanım için SVG'yi inline yerleştirip `color: white` verin.

Stüdyoda aynı vektör yolları kullanılır. Sembol `--mh-link`, yazı `currentColor` ile seçili temaya uyum sağlar. Bu, kütüphanenin tema kullanımına özgü bir uygulamadır; statik kurumsal dosyalarda belirtilen ana renkleri koruyun.

## Ölçü ve boşluk

- Sembol 64 × 64 birimlik kutuda tanımlıdır.
- Çevresinde en az sembol kutusunun dörtte biri kadar boşluk bırakın. 64 px kullanımda 16 px boşluk önerilir.
- Sembolü en az **24 px**, ana logoyu en az **110 px**, UI imzasını en az **124 px** genişlikte kullanın.
- Tarayıcı sekmelerinde 16 px için çerçeveli `favicon.svg` dosyasını kullanın.
- En-boy oranını, sembolün yollarını ve yayların konumunu koruyun. Gölge, eğim veya ayrı harf aralığı uygulamayın.
- Fotoğraf veya karmaşık içerik üzerinde logo için sakin ve yeterli kontrastlı bir yüzey ayırın.

## Adın yazımı

Metin içinde **Muhit**, kütüphane adı olarak **Muhit UI** yazılır. Görsel yazı logosu küçük harfle `muhit` biçimindedir. Paket adı `muhit-ui`, JavaScript API öneki `Muhit`, CSS öneki `mh-` olarak kullanılır.

Logo ve isim değişikliği kütüphanenin kimliğini belirler. Logo sabitleme sürümü paket yayınından bağımsızdır. Güncel paket/yayın durumu CURRENT.md ve sürüm notlarında belirtilir.


## Onaylı ana sürüm

2026-10-09 tarihinde kullanıcı tarafından sabitlenen sürüm **3.1**. Üç yay geometrisi, wordmark ve oranlar ana SVG dosyalarından aynen kullanılır. `assets/brand/brand-lock.json` bütün SVG varyantlarının SHA-256 değerlerini içerir. `npm run check:brand` dosya değişikliklerini saptar. Tema renk uyarlaması dışında değişiklik için kullanıcının açık yeni isteği gerekir; bu durumda yeni sürüm oluşturulur ve eskisi korunur.
