# Önceki çalışma adından Muhit UI'ya geçiş

Muhit UI 0.2.0, önceki Terali UI 0.1.0 çalışma paketinin yeni ad ve logo ile devamıdır. Önceki ZIP/TGZ dosyaları korunur; güncel geliştirme klasörü `muhit-ui` olur.

## Kod adları

| Önceki              | Güncel             |
| ------------------- | ------------------ |
| `terali-ui`         | `muhit-ui`         |
| `Terali`            | `Muhit`            |
| `TeraliTheme`       | `MuhitTheme`       |
| `TeraliTable`       | `MuhitTable`       |
| `TeraliCharts`      | `MuhitCharts`      |
| `TeraliAgent`       | `MuhitAgent`       |
| `.tl-*`             | `.mh-*`            |
| `--tl-*`            | `--mh-*`           |
| `data-tl-*`         | `data-mh-*`        |
| `data-terali-agent` | `data-muhit-agent` |

Importları, bileşen sınıflarını ve kendi CSS token referanslarınızı birlikte güncelleyin. Eski global API veya CSS önekleri için örtük takma ad sunulmaz.

```js
import { MuhitTheme, MuhitAgent } from "muhit-ui";
import "muhit-ui/styles";
MuhitTheme.apply({ preset: "grove", mode: "light" });
```

## Tema ve arayüz JSON dosyaları

Tema alanları ve değerleri değişmedi. Tema `version: 1`, arayüz `schemaVersion: '1.0.0'` kullanmaya devam eder. Önceden dışa aktarılan tema JSON'u yeni stüdyoya doğrudan aktarılabilir. Önceki CSS çıktılarındaki `--tl-` değişkenlerini yeni `--mh-` önekine dönüştürün veya JSON dosyasından yeniden CSS dışa aktarın.

Stüdyo `muhit-ui-studio-v1` kayıt anahtarını kullanır. Bu kayıt yoksa aynı tarayıcı kökeninde erişilebilen `terali-ui-studio-v1` kaydını doğrulayarak devralır. Eski kayıt silinmez. Farklı köken veya dosya adresinde kayıt bulunamazsa JSON içe aktarımı kullanılır.

## Logo

Önceki stüdyo sembolünün yerine `assets/brand` içindeki Muhit ana dosyaları kullanılır. [Logo kılavuzu](BRAND.md) hangi dosyanın nerede kullanılacağını açıklar. Muhit logoları Nevmos ana marka logosunun yerine geçirilmez.

## 0.6 → 0.7

ESM artık globalThis API isimleri oluşturmaz; import edilen API nesnelerini kullanın. Klasik script kullanımı değişmedi. Yeni agent türleri için schemaVersion 1.1.0 seçin. Form geçersiz tarih/seçim atamalarını artık yazmadan reddeder. MuhitDataGrid doğrulaması bilinmeyen sütun alanlarını reddeder. Ayrıntılar RELEASE-0.7.md.
