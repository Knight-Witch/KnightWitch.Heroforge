# Pre-Flight Check

## 2026-10-08 — #112 immutable Dev source/launcher pairing

- PASS: complete source payload snapshot commit 94d54f20614d5057c9ee6c2ef593d6553a8afa4b has coherent manifest launcher 1.17.15 and edited-module versions.
- PASS: launcher 1.17.15 target payload points at that immutable source commit. Dev identity, @namespace, update/download URLs, and Stable boundary retained.
- PASS: four synthetic tests for native decal fallback, Core Tweaks legacy, incompatibility fail-closed, and channel-local child request.
- PASS: no feature registry impact; #112 is same user-facing feature and owner. No Stable changes, no High Res changes.
- PENDING: live HeroForge Dev module-loader status, real full-list selection, projected/unprojected smoke, visual approval, Bitbucket recovery parity.
