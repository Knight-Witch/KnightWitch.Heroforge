## 2026-09-23 — Public 2.0.2 payload: High Res ON/OFF body tint restore

- Promotes only the Dev-validated #24 restore/adoption fix onto a Stable-derived immutable payload.
- Texture Quality Native Reconcile advances 0.3.5 -> 0.3.6 / `0.3.6-verify-native-restore-adoption` using the exact validated Dev blob.
- Fix restores native per-part source sizes/material mask adoption after High Res ON -> OFF and verifies the restored native generation before reporting success.
- #32 — HR body paint zone collapse remains a separate open bug and is not included in this promotion.
- Launcher registry identity stages public v2.0.2; launcher pin is applied in the following RC commit.
- No unrelated runtime module is changed.

---

## 2026-09-21 — Public v2.0.1 Booth JSON release COMPLETE

- Public Stable v2.0.1 passed live smoke on `Witch_Scripts`.
- Stable channel identity, immutable payload `f773cd9607d12a4479e31951973f288fa282543a`, Loader 23/23, and Booth v27.1.0 all verified live.
- Dev channel / Dev Auto Host globals were absent from the public smoke.
- Amanda independently confirmed public **Save Settings** export and **Load Settings** restore both work.
- Issue #20 runtime scope is fully released.
- This commit records final release evidence only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Public 2.0.1 RC launcher

- Public launcher advances 2.0.0 -> 2.0.1 and pins immutable issue #20 payload `f773cd9607d12a4479e31951973f288fa282543a`.
- Public Booth tool in that payload is v27.1.0, exactly matching the Dev-validated candidate.
- Stable channel identity/update URLs remain `Witch_Scripts`.
- No unrelated public runtime scope is included.

---

## 2026-09-21 — Public 2.0.1 payload: Booth JSON repair

- Promotes only the Dev-validated issue #20 Booth JSON scope onto a Stable-derived immutable payload.
- Booth tool advances 27.0.6 -> 27.1.0 / `v27.1.0-booth-json-file-io`.
- Adds Booth Settings JSON Save/Load controls using current Hero Forge Booth-owned persistence APIs.
- Preserves support for legacy Lob effect-only Booth JSON while rejecting unrecognized JSON before mutation.
- Launcher registry identity advances to 2.0.1; public launcher pin is applied in the following RC commit.
- All unrelated runtime modules remain unchanged from public Stable 2.0.0.

---

# Changelog

## DOCK-2026-09-21-040 — Public license and provenance boundary

Date: 2026-09-21

### Summary

- Added `LICENSE` with the Knight Witch Community Source License v1.0 for Knight Witch-owned portions of Witch Dock.
- Added `THIRD_PARTY.md` documenting the license boundary, unofficial Hero Forge relationship, and historical/community-script provenance.
- Updated `README.md` to remove the overbroad claim that every tool is solely developed by Knight Witch and to link the license/provenance files.
- Normal user installation/use remains permitted, including professional creative workflows. Redistribution, repackaging, competing distributions/services, and commercialization of the software itself remain reserved.
- Third-party material is expressly excluded from relicensing.

Commits: `6a9e85d882f81f45447a4be90de523f5dac75723` (license), `9c5da61f7a0d07742da3446eca268944e7c3d100` (provenance), `37a6493605d11d160daf79fa815c2d4bf52218f5` (README).

**Runtime behavior changed:** no.

## 2026-09-20 — Witch Dock 2.0.0 modular public RC

- Built isolated release candidate from exact current public Stable baseline `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- Replaced the monolithic public `Witch_Dock.user.js` with the small privileged public launcher v2.0.0 / build `2.0.0-immutable-modular-bootstrap`.
- Public launcher pins immutable payload `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`.
- Added the validated modular Core v2.0.0 and extracted Shell/Application/Preferences/Interactions/History/Modals/Bone HUD/Assets/Styles components.
- Loader advances to v0.2.0 immutable payload-root resolution.
- Included only the validated #10 runtime handoff changes required by the modular architecture: Booth Runtime Bootstrap, Booth tool, and Utilities.
- Public payload retains 23 runtime modules, with normal loading from the immutable payload root and public `Witch_Scripts` fallback URLs.
- This is an RC only. Public `Witch_Scripts` remains unchanged pending live RC validation and explicit promotion approval.

**Runtime/module/manifest/public behavior changed:** isolated RC only; public Stable branch unchanged.

---

This active Stable changelog is intentionally compact. Older detailed Stable entries remain durable in Git history.

## DOCK-2026-09-16-039 — Promote parallel module loading to public Stable

Date: 2026-09-16

### Summary

Narrowly promote the issue #9 module-loading repair after committed Dev candidate `547b86462f122cd67e96c861486d129a4cfdb3d5` passed live runtime and human gates in the already-degraded Chrome session.

- Added public `witch-dock-module-loader` v0.1.1 / build `0.1.1-stable-page-fetch-ordered-exec`.
- Public `Witch_Dock.user.js` remains byte-for-byte unchanged at v1.2.1.
- Public manifest now lets the existing core shell fetch one hidden bootstrap; the bootstrap then starts all 23 enabled module requests concurrently and executes them in the exact prior manifest order.
- Public bootstrap and every module URL point only to `Witch_Scripts`; no WITCH_DEV_UI or HF-Chat-Bridge runtime dependency is introduced.
- Deterministic module cache keys, ordered execution, failure isolation, and Utilities' `kw.witchDock.toolEnabled.*` localStorage enablement mirror are preserved.
- No request timeout, retry, readiness, ownership, polling, or feature-module behavior is changed.

Dev validation evidence: 23/23 fetched, 23/23 executed, 0 failures, total loader duration 432.8 ms; Amanda reported the Dock appeared noticeably faster in the same degraded browser session.

**Runtime behavior changed:** yes — public Stable module network fetches now overlap while module execution order remains unchanged.

---

## DOCK-2026-09-15-038 — Close public Texture Quality lifecycle/projected-host rollout

Public Texture Quality lifecycle/projected-host promotion passed its narrow Stable smoke and was closed. Detailed evidence remains in Git history.
