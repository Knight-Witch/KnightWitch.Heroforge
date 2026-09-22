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
