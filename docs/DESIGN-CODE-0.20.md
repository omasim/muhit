# Muhit 0.20 · Tasarım–kod eşleştirmesi

[Figma dosyası](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg) · 02 Bileşenler sayfası. Eski bileşenler korunarak 15 modül ailesi ve 30 Content/Attention varyantı eklendi. Muhit semantik yüzey/metin/kenar değişkenleri ve mevcut Manrope / Source Serif 4 stilleri bağlıdır.

Bu setler görsel anatomi örnekleridir. Canlı native kontrol davranışı ve tam responsive düzen için çalışan kod örnekleri kaynak kabul edilir. Native Code Connect yayımlanmadı; bu tablo açık eşleştirme kaydıdır.

| Modül | Figma | Varyantlar | Kod |
|---|---|---|---|
| calendar | [18:26](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-26) | Content, Attention | `muhit-ui/planning` → `mountCalendar` |
| document-editor | [18:47](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-47) | Content, Attention | `muhit-ui/planning` → `mountDocumentEditor` |
| notification-center | [18:64](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-64) | Content, Attention | `muhit-ui/planning` → `mountNotificationCenter` |
| shell | [18:83](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-83) | Content, Attention | `muhit-ui/shell` → `mountShell` |
| advanced-form | [18:104](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-104) | Content, Attention | `muhit-ui/product` → `mountAdvancedForm` |
| saved-filters | [18:121](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-121) | Content, Attention | `muhit-ui/product` → `mountSavedFilters` |
| uploads | [18:138](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-138) | Content, Attention | `muhit-ui/product` → `mountUploads` |
| discussion | [18:155](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-155) | Content, Attention | `muhit-ui/product` → `mountDiscussion` |
| access | [18:176](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-176) | Content, Attention | `muhit-ui/product` → `mountAccess` |
| assistant | [18:197](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-197) | Content, Attention | `muhit-ui/product` → `mountAssistant` |
| analytics | [18:216](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-216) | Content, Attention | `muhit-ui/product` → `mountAnalytics` |
| multi-combobox | [18:233](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-233) | Content, Attention | `muhit-ui/product` → `mountMultiCombobox` |
| inbox | [18:250](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-250) | Content, Attention | `muhit-ui/inbox` → `mountInbox` |
| activity | [18:267](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-267) | Content, Attention | `muhit-ui/activity` → `mountActivity` |
| resources | [18:284](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-284) | Content, Attention | `muhit-ui/resources` → `mountResources` |

P3 inceleme çerçevesi: [18:285](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg?node-id=18-285). Kimlikler `design/figma/modules-0.20.json` içinde saklıdır. Figma, API davranışı veya servis kalıcılığı için test kanıtı değildir.
