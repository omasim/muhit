# Muhit UI · Integration guide

Muhit is a framework-independent UI library for shared work. Semantic colors, typography and spacing provide a consistent visual language. The fixed Muhit 3.1 logo is independent of the package version. Use the canonical SVG assets unchanged.

## Install and choose the delivery size

Install the supplied `muhit-ui-0.11.0.tgz` with your package manager. The npm registry package has not been published. For local HTML, serve the distribution over HTTP and import `src/index.mjs`.

```js
import { MuhitDataGrid } from 'muhit-ui/data-grid';
import 'muhit-ui/styles/data-grid-entry.css';
// Optional font: omit if your application already provides typography.
import 'muhit-ui/styles/font-sans.css';
```

`styles` imports all reusable styles and both WOFF2 fonts. Choose `base.css` plus a feature entry to avoid unrelated styles. Feature entries: `form-entry.css`, `data-grid-entry.css`, `plot-entry.css`, `interactive-entry.css`. `font-sans.css` loads Manrope; `font-serif.css` loads Source Serif 4. Source TTFs and OFL licenses remain available. Bundle CSS imports in production to reduce request count.

## Theme and customization

Use `MuhitTheme.normalizeConfig`, `apply`, `toJSON`, `fromJSON` and `toCSS`. The English studio exposes every public schema setting, undo/redo, import and export. Presets, typography, spacing, surfaces, controls and chart colors share semantic `--mh-*` tokens. Custom colors are resolved into compatible foreground/background pairs. Reduced motion and forced colors still require application-level verification. Theme JSON contains appearance settings, not personal form data.

## Data and scale

DataGrid supports up to 100,000 local rows and 30 columns. Pagination bounds rendered rows; it does not make search or sorting asynchronous. For wide, long-text or frequently refreshed datasets, supply `load(state, signal)` and let the server filter/sort/page. Ignore aborted responses in the provider. Treat the published performance measurements as a reference workload, not a device-independent latency guarantee.

`getView` / `restoreView` preserve layout, visibility, filters, page and selection across remounts. Locale is fixed per mount. To change it, save the view, remount with a new locale and restore the view. `toCSV` handles the current remote page; `exportCSV` needs an `exportRows` provider for filtered or selected remote records. Never label a partial page as a complete export.

## Forms and workflows

Form supports sync and abortable async validation. The application supplies `onSubmit`; the library does not store or send records. Fields adds a remote combobox and repeatable field groups. Repeated groups own their forms and must not be nested inside another HTML form.

Kanban cards can be dragged by their Move button with a mouse or touch pointer. Keyboard: focus Move, press Space/Enter to start, use Left/Right to choose a column, Enter/Space to commit, Escape to cancel. The visible native status selector remains available. Moves change columns; within-column reordering is not part of this contract. The application persists emitted events.

## Languages

Turkish and English are built in. Optional German and Arabic catalogs cover core Form, DataGrid, Fields, Plot, Widgets and notification controls. They also cover literal UI messages in legacy Table/Charts. Application records and archived documentation remain application-owned. Arabic sets RTL automatically. System fallback supplies Arabic glyphs; the included Latin fonts are not an Arabic type family.

```js
import { MuhitI18n } from 'muhit-ui/i18n';
import de from 'muhit-ui/locales/de';
MuhitI18n.register('de', de);
// Pass locale: 'de-DE' when mounting a component.
```

Regional dictionaries overlay the base language. Pass `messages` for application overrides. Count labels in the extra catalogs use neutral constructions, preserving placeholders and locale-specific number formatting. Editorial review by native speakers remains advisable before product publication.

## Agent and framework contracts

Agent schema 1.1 accepts 18 declarative component types. Validate before render. JSON cannot contain functions, HTML or network instructions. `onAction` carries component events; it is not authorization. The application owns permissions, model calls, storage and networking.

React and Vue adapters are supplied as source examples with controlled props and cleanup. Their SSR flow renders an application shell and hydrates it; inner Muhit controls mount in the client. They are not standalone framework packages.

## Verification and maintenance

Run `npm run verify:all`, `npm run test:scale`, `npm run test:distribution` and `npm run test:visual`. CI runs Chromium, Firefox and WebKit. PNG references are platform-specific and normally read-only. Update them only after reviewing the resulting changes. Automated accessibility scans do not replace VoiceOver/NVDA/JAWS or physical-device acceptance. See `ACCESSIBILITY-MANUAL.md`, `VERIFICATION.md` and `RELEASE-POLICY.md` for current evidence and limits.

## 0.11 upgrade

Page CSV export throws while the current page is loading or has failed. Handle the error and only enable download for a successful current query. Form remounts should spread `getSnapshot()` (values and baseline), not only getValues. NodeNext and Bundler are checked against all 16 packaged type entries. Repeater accepts group-indexed async/server error maps; combobox supports name/required/readOnly/disabled and native FormData. See PRODUCTION-0.11.md for evidence and remaining manual acceptance.
