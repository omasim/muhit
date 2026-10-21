# Muhit system layer — 0.18

Muhit connects design principles, typed tokens, interaction behavior, component contracts, page recipes and reviewed AI composition. The existing 18 Agent render kinds and public component APIs remain compatible. New system modules are beta.

## Architecture

Principles → theme/foundations → interaction primitives → components → patterns → pages → products. Product applications own identity, authorization, persistence, routing and server-side execution. Muhit provides consistent presentation and explicit interaction contracts, not a backend.

The runtime uses native HTML/CSS/JavaScript with no framework dependency. Classic scripts and isolated ESM are generated from the same source; all public imports have TypeScript declarations. Imports do not require DOM, while mount/render calls belong in the client lifecycle. React/Vue reference adapters are tested as installed package consumers with development, production and SSR hydration flows.

## Public additions

- `muhit-ui/tokens`: compose theme layers, export the primitive/semantic/component graph, reject missing or cyclic references. There are 16 mode files with 185 typed tokens each. The portable typed subset is not a general-purpose DTCG validator; compound CSS values live in an extension.
- `muhit-ui/flow`: draft/baseline, validation, pending work, cancellation, partial results and snapshots. A handler must explicitly report `outcome` and `persisted`. Only fully successful persisted results advance the baseline. Abort does not roll back a server write.
- `muhit-ui/primitives`: menu, nonmodal popover, hover/focus tooltip and single-select tree. Native semantics, keyboard support and explicit `destroy()` cleanup.
- `muhit-ui/pages`: six semantic region recipes; loading, empty, error, forbidden and partial states preserve region DOM. Mount into a div rather than nesting main landmarks.
- `muhit-ui/system`: validate page/component/action references, preview without executing external operations, then explicitly apply an approved action. Approval and authorization callbacks must return boolean `true`. Product servers must enforce real permissions independently.

```js
import { MuhitTheme } from 'muhit-ui/theme';
import { MuhitTokens } from 'muhit-ui/tokens';
import { MuhitPages } from 'muhit-ui/pages';
import 'muhit-ui/styles';
import 'muhit-ui/styles/pages.css';
import 'muhit-ui/styles/system.css';

const config = MuhitTokens.compose([{preset:'grove'}, {mode:'dark'}]);
MuhitTheme.apply(config, document.body);
const page = MuhitPages.mount(document.querySelector('#app'), {
  version:'1.0.0', recipe:'collection', title:'Research'
}, {locale:'en'});
// Mount components into page.regions.collection.
// Destroy child instances before page.destroy().
```

## References and acceptance

`examples/system/` contains a system studio and corporate, admin and data reference products. Workflows include per-record draft preservation, partial batch retry, cancellable operations, multi-step back navigation, reviewed JSON imports and explicit download-only outcomes. Data is fictional; persistence scope is visible.

[Native Figma source](https://www.figma.com/design/PllwZjMHfzcRJfEoMrMJkg): 16 collections, 2,960 variables, 30 component families / 49 representative specimens, six desktop page compositions. These are editable design references, not exhaustive interactive behavioral prototypes. Starter-plan Code Connect is not published. The immutable 3.1 logo source remains in the package.

Automated acceptance covers unit, typed package consumers, browser workflows, axe checks, responsive/RTL layouts, bundle budgets, and brand integrity. Current evidence is listed in [the verification report](SYSTEM-VERIFICATION-0.18.md). Manual screen-reader and physical-device acceptance remain open. A downloadable TGZ release does not imply npm registry publication or a 1.0 stability guarantee.
