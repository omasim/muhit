# Tüketici entegrasyon sözleşmesi · 0.14.0

## React ve Vue

`examples/react` ve `examples/vue` desteklenen referans adaptörlerdir; ayrı resmi React/Vue paketleri değildir. Çekirdek sürümüyle birlikte kopyalayın ve kendi uygulamanızda test edin. Test matrisi React 19.2, Vue 3.5, Vite 7; geliştirme, üretim ve SSR/hydration. Beş remount tetikleyicisi × altı kipte seçim/filtre/sütun düzeni; form baseline değişimi ve dil değişirken devam eden kaydın iptali test edilir. SSR uygulama kabuğunu üretir; interaktif Muhit içeriği istemcide mount edilir.

Grid: columns, load, exportRows, locale, dir, messages, selectable, title ve description değişince yeniden kurulur. Snapshot, kullanıcı durumunu taşır. Açık `state`, `columnLayout`, `selected` prop'ları snapshot'tan önceliklidir; onReady bu son durumu görür. Verilmeyen değerler snapshot'tan korunur. Props iki yönlü otomatik bağlama değildir: sürekli uygulama kontrolü için onStateChange/onSelectionChange/onColumnLayoutChange olaylarını uygulama deposuna yansıtın. Sabit dizi/fonksiyon kimlikleri gereksiz yeniden kurulumları önler.

Form: dil/başlık/mesaj değişimi taslak ve kaydetme sonrası baseline'ı korur. Yeni bir `baseline` nesnesi verildiğinde reset hedefi değişir; mevcut taslak korunur. Yeni values, setValues ile uygulanır. Vue baseline nesnesini yerinde mutasyona uğratmak yerine değiştirin. Alan şeması eski taslağa uymuyorsa yeni props kullanılır. Yeniden kurulum eski formu destroy eder ve devam eden isteğin AbortSignal'ini iptal eder; uygulama sağlayıcısı signal'i kontrol etmeli, ağ istemcisine geçirmeli ve iptal edilen yanıtla dış uygulama durumunu değiştirmemelidir.

## Başlık düzeni

```js
MuhitWidgets.mount(host, spec, { headingLevel: 2 });
```

1–4 aralığı kabul edilir; varsayılan 3 geriye uyumludur. Timeline/kanban başlıkları bir, kanban kart başlığı iki seviye aşağıdadır; h6 aşılmaz. Yanlış seçenek DOM değiştirilmeden reddedilir. Sayfa h1'inden sonra bağımsız widget h2 kullanın. Dialog başlığı widget köküyle aynı seviyeyi kullanır.

## Güvenlik politikası ve kapsama

`test:consumer`, aynı kaynaktan ESM/CSS yükleme ve `script-src 'self'; require-trusted-types-for 'script'; trusted-types 'none'` altında Icons.mount, Widgets, DataGrid ve Forms kurulum/kaldırmasını denetler. Icons.mount SVG öğelerini DOM ile kurar; bir Trusted Types passthrough politikası oluşturmaz. Kullanıcı etiketleri metindir.

HTML şablonlarını kullanan eski Components/Table/Charts, agent ve stüdyo bu katı politika desteğine dahil değildir. Bunlar için CSP politikasını gevşetmeyi otomatik çözüm olarak önermiyoruz; strict Trusted Types gerektiren projelerde doğrulanmış modülleri seçin. Muhit CSS kapsamı dışındaki öğelerin biçimi korunmalıdır; tüketicinin global `!important` kurallarını kütüphane geçersiz kılamaz.

Rota değişiminde bütün instance'larda destroy çağırın. Yeni sayfanın başlığına/geri dönüş kontrolüne odak verme uygulama router'ının sorumluluğudur. Consumer testi bu yaşam döngüsünü örnekler; belirli router paketleri için destek iddiası değildir. Ağ hatası, tekrar deneme ve eski yanıt koruması production testinde denetlenir.
