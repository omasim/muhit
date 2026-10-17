# Muhit Vue uygulaması

Node.js 20.19+ (veya 22.12+) ve npm gerekir. Klasörde:

```sh
npm install
npm run dev
npm run build
npm run preview
```

`build`, vue-tsc tip kontrolünü ve Vite üretim derlemesini çalıştırır. Kaynak ağaçta `file:../..` kütüphaneyi kullanır. Dağıtımı sınamak için `npm install /tam/yol/muhit-ui-0.5.1.tgz` kullanın. Ana paketin `npm run test:framework` komutu paketlenmiş sürümü bağımsız uygulamaya kurar.

Vue host div'i, Muhit içeriğini yönetir. Satırların reaktif değişimi deep watcher ile setRows'a aktarılır. Sütun değişimi instance'ı yeniden kurar. onBeforeUnmount destroy çağırır. Güncelleme, sütun değiştirme, arama, kaldırma/yeniden açma ve tema tarayıcı testindedir. Kayıtlar yerel örnek veridir.
