## 2026-09-25 — Issue #37 public v2.1.0 RC launcher

### PASS / public smoke pending

- Public launcher JavaScript parse passed.
- @version / runtime VERSION / SCRIPT_NAME synchronized at v2.1.0.
- BUILD: `2.1.0-dock-size-reset`.
- PAYLOAD_REF: `002e0e62a21798091c96c3eb52668c8ae0844629`.
- Expected Interactions contract synchronized to v0.6.0.
- Payload manifest carries Utilities v1.3.1 and Interactions v0.6.0.
- No High Res runtime/diagnostic files changed.

---

## 2026-09-25 — Issue #37 public RC payload staging

### PASS / launcher pin pending

- Promoted Interactions and Utilities source parse successfully.
- Stable manifest parses with Interactions v0.6.0 and Utilities v1.3.1.
- No High Res runtime/diagnostic files were promoted.
- Existing Stable launcher remains v2.0.3 until the immutable RC payload SHA is established.

---

## 2026-09-24 — Public 2.0.3 corrected Stable candidate gate

### PASS / pending live Stable smoke

- Userscript name/version, runtime VERSION/BUILD, SCRIPT_NAME, and manifest launcher registry are synchronized at v2.0.3.
- Stable channel branch/update/download URLs remain `Witch_Scripts`.
- Immutable payload pin is `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`.
- Payload Texture Quality is exact validated v0.3.7 / `0.3.7-refresh-native-color-bake` blob `09d92a14595077d49ec928263c6aab7ca3ef468a`.
- Candidate diff is limited to launcher identity/pin plus the payload's Texture Quality, manifest, and release records.
- Required next gate: non-forced Stable promotion, then live Stable launcher/loader/module identity and Curvy Body OFF→ON→OFF exact restoration smoke.

---

## 2026-09-24 — Public 2.0.3 immutable payload preflight

### PASS

- Payload is derived directly from current `Witch_Scripts` v2.0.2.
- Texture Quality Native Reconcile source is byte-identical to validated Dev blob `09d92a14595077d49ec928263c6aab7ca3ef468a` at v0.3.7 / `0.3.7-refresh-native-color-bake`.
- Manifest synchronizes Texture Quality v0.3.7, its cache key, and public launcher registry v2.0.3.
- Automated exact A→B→D restore passed on Quinn, D4, and Curvy Body; Curvy Body human visual gate passed.
- #32 and the separate 2048 source-resolution evidence are excluded.
- No unrelated module versions or runtime files changed.

---

## 2026-09-23 — Public 2.0.2 RC launcher gate

### PASS

- Userscript `@name`, `@version`, runtime VERSION/BUILD, SCRIPT_NAME, and manifest launcher registry are synchronized at v2.0.2.
- Stable channel branch/update/download URLs remain `Witch_Scripts`.
- Immutable payload pin is `fa442b99a7376aa31882f66fd20ae8cded32fe67`.
- Texture Quality Native Reconcile in the payload is the exact validated v0.3.6 blob.
- #32 color-zone collapse remains intentionally unresolved and excluded.
- Required next gate: narrow diff verification, then non-forced Stable promotion and live Stable smoke.

---

## 2026-09-23 — Public 2.0.2 immutable payload preflight

### PASS

- Payload is derived directly from current `Witch_Scripts` v2.0.1.
- Texture Quality Native Reconcile source is byte-identical to validated Dev candidate `9b16a2f1b7c4f0f6d5b50188319e2f8c14352af5` (blob `8b182828799c077caa219b9d87ad738c0e3a3384`).
- Manifest synchronizes native reconcile at v0.3.6 / `0.3.6-verify-native-restore-adoption` and public launcher registry at v2.0.2.
- Stable module URL/cache identity for native reconcile is updated to the v0.3.6 build.
- #32 color-zone collapse is explicitly excluded from this release.
- No unrelated module versions or runtime files changed.

---

## 2026-09-21 — Public v2.0.1 final human + smoke gate

### PASS

- Public channel: `Witch_Scripts`, v2.0.1 / `2.0.1-issue-20-booth-json`.
- Immutable payload: `f773cd9607d12a4479e31951973f288fa282543a`.
- Loader: 23/23 enabled/fetched/executed, 0 failed, immutable=23, fallback=0.
- Booth: v27.1.0 / `v27.1.0-booth-json-file-io`.
- Dev channel and Dev Auto Host globals absent.
- Amanda confirmed real public Booth JSON export and load both work.
- Documentation-only closeout; no runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Public 2.0.1 RC launcher gate

### PASS

- Userscript `@name`, `@version`, runtime VERSION/BUILD, SCRIPT_NAME, and manifest launcher registry are synchronized at v2.0.1.
- Stable channel branch/update/download URLs remain `Witch_Scripts`.
- Immutable payload pin is `f773cd9607d12a4479e31951973f288fa282543a`.
- Booth source is the exact Dev-validated v27.1.0 blob.
- Required next gate: static diff verification, then non-forced Stable promotion and live Stable smoke.

---

## 2026-09-21 — Public 2.0.1 immutable payload preflight

### PASS

- Payload is derived directly from current `Witch_Scripts`, not merged from Dev.
- Only Booth runtime + manifest/log records differ from Stable in this payload step.
- Booth source is byte-identical to the Dev-validated v27.1.0 candidate.
- Manifest Booth registry/build/cache key synchronized to v27.1.0.
- Launcher registry identity staged at v2.0.1.
- No unrelated module versions or payload files changed.

---

# Pre-Flight Check Log

## PFC-2026-09-21-040 — Public license and provenance boundary

### Scope

Documentation/legal metadata only: `LICENSE`, `THIRD_PARTY.md`, README wording, and tracking records.

### Review

- Confirmed Witch Dock must remain public under the current raw-GitHub manifest/module delivery model.
- Confirmed existing project records identify Lob/Advanced Decal Posing-derived or reconstructed compatibility work whose third-party provenance must not be silently relicensed.
- Selected a source-available license that permits normal user installation/use and private modification while reserving redistribution/repackaging/software-commercialization rights.
- Added an explicit third-party/provenance boundary.
- Corrected the README's overbroad sole-authorship statement.

### Validation

- No launcher, manifest, module, tool, feature, URL, cache key, HeroForge integration, or runtime source changed.
- No runtime testing required for the documentation-only change.
- Public delivery paths remain unchanged.

## 2026-09-20 — Witch Dock 2.0.0 modular public RC

### Static scope

- Base is exact Stable `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- Public launcher v2.0.0 parses and contains no Dev/task-branch identifiers.
- Launcher update/download URLs remain public `Witch_Scripts/Witch_Dock.user.js`.
- Launcher pins immutable public payload `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`.
- Payload manifest contains 23 runtime modules, public launcher registry v2.0.0, Core v2.0.0, Loader v0.2.0, and no WITCH_DEV_MAIN/task-branch fallback URLs.
- Promoted runtime module source bytes are exact copies from the canonical Dev-smoked payload.
- No unrelated Stable file is changed.

### Required RC live gate

Run the exact public launcher/payload in HeroForge without mutating `Witch_Scripts`. Require stable channel identity, Core v2.0.0 running, Loader 23/23 / 0 failed, immutable resolution=23/fallback=0, preserved Dock geometry/interactions/public seams, representative tools, and normal visual appearance.

Do not promote until Amanda explicitly approves the tested RC.

---

This active Stable pre-flight log is intentionally compact. Older detailed Stable records remain durable in Git history.

## PFC-2026-09-16-039 — Issue #9 Stable module-loader promotion

Date: 2026-09-16

### Scope and approval

Amanda explicitly approved the narrow public promotion after Dev live validation. Scope is limited to the public module-loader bootstrap, public manifest wiring, and required release records. `Witch_Dock.user.js` itself is unchanged.

### Proven Dev behavior carried forward

Dev candidate `547b86462f122cd67e96c861486d129a4cfdb3d5` was tested without restarting the already-degraded Chrome session:

- active manifest: WITCH_DEV_UI;
- loader v0.1.1 completed in 432.8 ms;
- 23/23 module requests started, fetched, and executed;
- 0 failures;
- request starts occurred within roughly 3 ms of each other;
- slowest individual fetch was about 320 ms;
- Amanda reported the Dock appeared noticeably faster.

### Stable promotion shape

- new public `witch-dock-module-loader` v0.1.1 / `0.1.1-stable-page-fetch-ordered-exec`;
- existing Stable core remains v1.2.1 / `1.2.1-stable-cache-keyed-loader` and is not edited;
- `manifest.tools` contains only the hidden public bootstrap;
- `manifest.modules` contains the prior 23 public modules in the same order;
- bootstrap starts enabled module fetches concurrently, then awaits/executes them in original order;
- all runtime URLs point to `Witch_Scripts` only;
- no timeout/retry policy change is included;
- HF-Chat-Bridge remains development infrastructure only.

### Static gate

- `node --check features/core/Witch_Dock_Module_Loader.js` passed.
- Candidate manifest parses successfully.
- Registry IDs and module IDs are unique.
- Candidate contains 23 runtime modules and every runtime module ID is present in `moduleRegistry`.
- No candidate loader/module URL contains `WITCH_DEV_UI`.
- Stable loader synthetic concurrency test showed overlapping starts and original-order execution (PASS).

### Required post-promotion smoke

With Stable enabled and Dev disabled, refresh HeroForge once. Through HF-Chat-Bridge confirm:

- `KWWitchDockManifestURL` resolves to `Witch_Scripts/manifest.json`;
- `KWModuleLoader` reports v0.1.1 complete;
- all enabled modules fetch/execute with zero failures;
- normal Witch Dock tabs/tools and existing Texture Quality globals are present.

Human-check that the Dock appears normally and module arrival is no longer visibly serialized. Any public divergence is a rollback condition.

### Rollback

Stable parent before promotion: `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Re-point `Witch_Scripts` to that commit if the narrow smoke fails.

**Runtime behavior changed:** yes — module network fetches overlap; execution order remains preserved.
