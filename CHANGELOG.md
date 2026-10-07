# Changelog

## Latest repository change — 2026-10-07

- #107 Public Beta Tester delivery and closeout policy are now documented against the live Dev implementation.
- Canonical Dev remains v1.17.13 / `1.17.13-public-beta-channel`, paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`; no runtime/module/manifest bytes changed in this documentation/process update.
- GitHub canonical Dev and Bitbucket recovery deliver identical trees for the paired build. Live provider-independent `/beta/ref.json`, `/beta/manifest.json`, and `/beta/Witch_Dock_Beta_Tester.user.js` return 200 with no-cache/CORS headers and resolve canonical `WITCH_DEV_MAIN`.
- The Beta manifest remains intentionally empty until a development item is explicitly staged. Beta module code must remain immutable-payload pinned and reversible under the Public Beta lifecycle contract.
- Normal feature closeout now includes Beta reconciliation: a shipped Beta entry becomes a one-revision disabled `graduated` tombstone so open sessions can deactivate cleanly, then is removed on the next normal Beta-manifest maintenance pass; Git history remains the archive.
- HF.Status issue #112 owns the `wd-beta-qa` / `public-beta-testing` taxonomy and triage lane. Stable reporter auto-attachment of Beta-specific diagnostics still requires the separately gated Bug Capture UI v0.4.6 promotion.
- Public Stable remains v2.4.2 and unchanged.

## Latest Dev delivery context

Dev v1.17.13 / `1.17.13-public-beta-channel` is paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`. Remaining #107 gates are a real Stable+Beta smoke and HF.Status #112 Dev validation.
