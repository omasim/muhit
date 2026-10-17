# Muhit React uygulaması

Node.js 20.19+ (veya 22.12+) ve npm gerekir. Klasörde:

```sh
npm install
npm run dev
npm run build
npm run preview
```

Kaynak ağaçta `muhit-ui` bağımlılığı `file:../..` ile yerel kütüphaneyi kullanır. Gerçek dağıtım paketini sınamak için `npm install /tam/yol/muhit-ui-0.5.1.tgz` kullanın. Ana paketin `npm run test:framework` komutu tam olarak bunu izole geçici uygulamada yapar.

StrictMode açıktır. React host div'i, Muhit host içini yönetir. Sütun dizileri sabit tutulur. Sütun değişince eski instance destroy edilir; satır değişince setRows çağrılır. Kaldırma/yeniden bağlama, bekleyen arama zamanlayıcısı ve tema değişimi tarayıcı testindedir. Uygulamadaki kayıtlar örnektir; ağ servisi veya hesap kaydı yoktur.
