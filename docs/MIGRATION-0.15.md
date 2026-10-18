# Upgrading to Muhit 0.15

0.14 APIs remain compatible. No agent type or brand changes. Logo stays 3.1, icon geometry 1.1, theme schema 1 and agent schema 1.1.0.

- Prefer `muhit-ui/icons/leaf` (or another canonical name) for one icon. Full-catalog imports remain supported. No CSS change is required.
- Isolated DataGrid imports no longer include the full icon catalog. Its public API is unchanged.
- Copy new MuhitIcon and MuhitPage reference adapters into React/Vue projects as needed. They are examples bundled with the library, not separately versioned packages.
- Existing foundation URLs retain ready content. State examples use an optional state query parameter and a visible selector. Unknown values fall back to ready.
- 75 concrete public type entries now exist: 17 previous entries and 58 icon entries. TypeScript consumers are checked in NodeNext and Bundler modes.
- Build searchable versioned documentation with `npm run docs:build`; output is docs-site/0.15.0. Serve over HTTP so its search index can load. The site is static and requires no credentials or backend.
- Install the checked TGZ and validate SHA256SUMS. Registry publication is conditional on npm ownership/authentication; local installation does not depend on npm publication.
