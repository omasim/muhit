# Muhit 0.25.0-beta.1

İnsan, doğa ve ortak üretim odağında, framework bağımsız arayüz sistemi. Durum: beta.

## Başlangıç

```sh
npm install ./muhit-ui-0.25.0-beta.1.tgz
```

```js
import 'muhit-ui/styles';
import { mountCalendar } from 'muhit-ui/planning';
const calendar = mountCalendar(document.querySelector('#calendar'), [], {
  locale: 'tr',
  onObserverError(error, observer) { console.error(observer, error); }
});
// Ekran kapandığında: calendar.destroy();
```

Kayıt adaptörü verilmezse değişiklikler yereldir. Gerçek kalıcılık, yetkilendirme ve çakışma çözümü uygulamanın sorumluluğudur. Registry yayını yapılmış varsayılmaz.

## Güncel rehberler

- [Kabul ve kapsam](docs/CURRENT.md), [test kanıtları](docs/VERIFICATION-0.25.md), [geçiş](docs/MIGRATION-0.25.md).
- [Mimari](docs/SYSTEM-ARCHITECTURE.md), [tokenlar ve bileşen sözleşmeleri](schemas/component-contracts.json), [sayfa standartları](docs/PAGE-STANDARDS.md).
- [React](examples/react/README.md), [Vue](examples/vue/README.md), [entegrasyon sınırı](docs/CONSUMER-CONTRACT.md).
- [Performans ve asenkron indeks](docs/PERFORMANCE-0.25.md), [çalışan örnek](examples/async-search.html).
- [Manuel kabul ve gerçek proje pilotu](docs/MANUAL-ACCEPTANCE-0.25.md), [çeviri kabulü](docs/LOCALIZATION-0.25.md).
- [Önceki README arşivi](docs/history/README-before-0.25.md), [sürüm geçmişi](CHANGELOG.md).

## Geliştirme

`npm ci`, `npm test`, `npm run verify:all`. Paketlenmiş React/Vue development/production/SSR, tipler ve tarayıcı kontrolleri CI kapsamındadır. Logo 3.1 bağımsız ve sabittir.
