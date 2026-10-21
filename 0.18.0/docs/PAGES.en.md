# Pages · English integration guide

Six recipes define information order: overview, collection, detail, settings, workspace and editorial. Choose a recipe based on the task, not the number of cards. Each page has one main landmark, one h1, a visible keyboard skip link, a named navigation region and meaningful action labels. Do not nest MuhitPage inside an existing main; use the content regions directly in that case.

Import `muhit-ui/styles/pages.css` with the base styles. At 0–767 px the grid has four columns; at 768–1199 it has eight; from 1200 it has twelve. Main/support regions become a vertical flow on smaller screens. Navigation wraps at 1024 px. Visual order follows DOM order in LTR and RTL.

## Working state catalog

Open any recipe under examples/foundations and use the page-state selector, or add `?state=loading`, `empty`, `error` or `unauthorized`. Ready is the default. All 24 recipe/state combinations are executable examples. Sample actions do not call a server and never grant access.

| State | Required behavior | Review |
|---|---|---|
| Loading | Busy content region, explanatory status, cancel/finish sample control | No fabricated data or success |
| Empty | Explanation and a meaningful start action | Distinguish zero results from failure |
| Error | Visible error and keyboard-operable retry | Preserve the page heading and context |
| Unauthorized | Explain access requirement; no protected content | Request/info action must not pretend access was granted |
| Ready | Real task content and state-appropriate actions | One main/h1, responsive layout and logical focus |

Review all states in light/dark, LTR/RTL, narrow viewport and with keyboard. The P3 browser suite checks 48 combinations (24 states at two viewports/themes), semantics, axe, overflow and actions. This does not replace manual screen-reader/device acceptance.

## Framework page shells

React `MuhitPage` props: title, description, width (reading/standard/wide/fluid), navigation, actions, aside, children, skipLabel and navigationLabel. Vue uses the same text/width props and navigation/actions/aside/default slots. Both generate a unique skip target, one main and h1, optional sidebar and a responsive content/support grid. Without navigation the shell uses the whole available width.

The shell does not fetch data, implement routing or authorize access. Keep application state in the host framework; after changing routes, focus the appropriate page heading/main. Nested content should start at h2; mount Widgets with headingLevel: 2 for independent sections. The lifecycle examples demonstrate the icon and shell adapters in actual React/Vue apps, including SSR/hydration.
