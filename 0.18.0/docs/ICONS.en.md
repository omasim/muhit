# Icons · English integration guide

Muhit Icons 1.1 contains 58 canonical SVG geometries. The logo is a separate locked brand asset; never substitute a UI icon for it.

## Single-icon imports

```js
import leaf from 'muhit-ui/icons/leaf';
const handle = leaf.mount(host, {size: 20, label: 'Nature'});
handle.destroy();
```

A single-icon entry imports only its geometry and the shared renderer. `muhit-ui/icons` still exports the complete catalog for galleries and dynamic names. `muhit-ui/data-grid` now depends only on resize-horizontal; import this entry when bundle isolation matters. Classic scripts retain their full catalog and global API.

Options: size 16/20/24/32; stroke 1.5/1.75/2; dir ltr/rtl; label nonempty text. Without a label the SVG is decorative and hidden from assistive technology. Label the enclosing button when it represents an action; do not repeat the same label on both button and icon. Directional arrows mirror in RTL; nature and object icons do not.

`mount` constructs SVG nodes without an HTML sink and returns element/destroy. `svg` returns a safely escaped string, but inserting that string into an HTML sink still requires the consuming application to satisfy Trusted Types. Do not create a permissive policy to bypass it.

## React and Vue reference adapters

Copy `examples/react/MuhitIcon.tsx` or `examples/vue/MuhitIcon.vue` with your source version. Pass the imported single-icon object as `icon`. Options update the mounted SVG and unmount removes it. The wrappers do not render SVG during SSR; they hydrate an empty stable host and mount in the client lifecycle.

```tsx
<MuhitIcon icon={leaf} size={20} label="Nature" />
```

```vue
<MuhitIcon :icon="leaf" :size="20" label="Nature" />
```

These are supported reference adapters, not separate framework packages. Keep the import object stable. Static exported SVG files remain available under assets/icons for design tools and image pipelines.
