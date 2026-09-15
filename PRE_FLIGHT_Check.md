# Pre-Flight Check Log

This active Stable pre-flight log is intentionally compact. Detailed prior records through `PFC-2026-09-12-032` remain preserved in Git history at promotion head `d2470ee7d1fbfe052326937a9ba9468ff5339fbf` and earlier.

## PFC-2026-09-14-036 — Final public Texture Quality beta notice acceptance

Date: 2026-09-14

### Scope

Close the public Stable notice release gate after the human-approved Dev popup was narrowly promoted to `Witch_Scripts`.

### Reviewed

- Stable notice promotion commit `2e8662d9d55322aac0d64c67a279052e7de6df77`;
- public notice v0.2.1 / build `0.2.1-frd-warning-assets-signoff`;
- HF-Chat-Bridge #2215 and #2216;
- prior human visual approval of committed Dev v0.2.1 at `bb73e05fcf8ff9f920fb6171d7777d84466c221b`.

### Stable smoke

Bridge #2215 performed one at-most-once hot-load of the exact public `Witch_Scripts` notice while temporarily clearing and then restoring the existing acknowledgement key. Bridge #2216 then confirmed:

- `KWWitchDockManifestURL` points to `Witch_Scripts/manifest.json`;
- notice version `0.2.1`;
- build `0.2.1-frd-warning-assets-signoff`;
- one visible `#kwTextureQualityBetaNoticeOverlay`;
- visible FRD warning header `⚠️ Using Full Res Decals / Textures (+ Other Tweaks)? Read this. ⚠️`;
- visible centered FRD guide sourced from `Witch_Scripts/features/rendering/assets/Texture_Quality_FRD_Decal_Resolution.webp`;
- visible 72×72 emblem sourced from `Witch_Scripts/features/rendering/assets/Witch_Dock_Emblem_White.webp`;
- visible `Hell Yeah!` button;
- Power status `complete` and no Power error.

The public rendering dimensions matched the approved Dev candidate for the FRD guide and emblem, and no Dev asset URL leaked into the public notice.

### Release decision

Public Texture Quality Phase 1 beta notice v0.2.1 release gate: **PASS / CLOSED**.

### Rollback

This closeout commit is documentation only. If the public notice itself ever needs rollback, revert promotion commit `2e8662d9d55322aac0d64c67a279052e7de6df77`; Texture Quality service/UI should remain untouched.

**Runtime behavior changed by this checkpoint:** no. Documentation only.

---

## PFC-2026-09-14-035 — Approved Texture Quality beta notice Stable promotion

Date: 2026-09-14

### Scope and approval

Promote only the approved Texture Quality Phase 1 notice, its two display assets, Stable manifest registration/cache-key wiring, and required release records. Do not change the accepted Texture Quality service/UI or any unrelated Stable module.

Amanda visually approved the committed Dev v0.2.1 popup before promotion. Approved presentation includes:

- `⚠️` framing on both sides of the FRD warning header;
- `FRD` terminology rather than `FRD/T`;
- centered FRD settings screenshot showing the three Decal Resolution toggles to disable;
- normalized sentence punctuation;
- centered white Knight Witch emblem sign-off below the Discord line;
- `Hell Yeah!` confirmation button.

### Source identity

- Dev approval commit: `bb73e05fcf8ff9f920fb6171d7777d84466c221b`;
- Dev notice v0.2.1 / build `0.2.1-frd-warning-assets-signoff`, blob `9c575825179a97e0682caab3f508a21b512bf6ce`;
- Stable-equivalent notice blob: `4802b536d00457d2580100792262cabbef73a5e5`;
- Stable source changes from approved Dev are limited to the userscript label dropping `DEV` and `ASSET_BASE` pointing to `Witch_Scripts` rather than `WITCH_DEV_UI`;
- FRD guide asset blob: `b968a8d622e95ac1b1a42e397731e4be79c0c84d`;
- emblem asset blob: `0615e1d888820677d60332618b6cca918a68b26a`;
- Stable parent before promotion: `38dbf8dc3d69c9ec6ab55f09f9a9185bd4b6d429`.

### Static gate

- reconstructed current Stable manifest hashes exactly to existing blob `094835946282e5e66552a31e18036f56804a7827` before modification;
- Stable notice passes `node --check`;
- candidate manifest parses successfully;
- module registry IDs and tool IDs remain unique;
- the public notice loader URL and notice asset base point only to `Witch_Scripts`, never `WITCH_DEV_UI`;
- Texture Quality service/UI entries remain v0.3.4 / v0.2.0 unchanged.

### Required post-promotion smoke

After moving `Witch_Scripts`, hot-load the exact public notice through HF-Chat-Bridge while preserving acknowledgement state. Confirm public notice version/build, overlay visibility, FRD warning title, centered guide image, emblem image, `Hell Yeah!` button, and `Witch_Scripts` asset provenance. Any public divergence from the approved Dev visual candidate is a stop condition.

### Rollback

Revert the narrow notice promotion commit if the public notice or assets diverge. Texture Quality service/UI must not be rolled back for a notice-only issue.

**Runtime behavior changed:** yes — public Stable gains the approved one-time announcement UI only.

---

## PFC-2026-09-14-034 — Final public Stable multi-figure Texture Quality acceptance

Date: 2026-09-14

### Scope

Close the public Stable release gate after the accepted Dev Texture Quality service/UI were narrowly promoted to `Witch_Scripts` and validated from the actual public loader.

### Reviewed

- public Stable runtime promotion commit `d2470ee7d1fbfe052326937a9ba9468ff5339fbf`;
- exact public service v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- exact public UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- Amanda's public Stable persistence/visual confirmation;
- HF-Chat-Bridge #2204 through #2208.

### Confirmed public load and persistence

Bridge #2204 confirmed `KWWitchDockManifestURL` points to `Witch_Scripts/manifest.json`, proving the page was Stable-owned rather than Dev-owned. The exact promoted service/UI identities were loaded, HeroForge was idle, and Texture Quality reported `ON — 3 figures · native atlases verified` with no error.

Amanda independently confirmed the public behavior: High Res was toggled ON, all three figures looked correct, no errors appeared, and High Res remained enabled after a normal page refresh. This closes the prior v0.1.0 persistence defect in public Stable.

### Confirmed native high-resolution state

Bridge #2204 and the final #2208 readback both confirmed:

- coherent native atlas: 4096×4096;
- generation adoptions: 1;
- bodyLower: 2048×2048 allocation / used 2048;
- bodyUpper: 2048×2048 allocation / used 2048;
- face: 2048×2048 allocation / used 2048;
- bodyLower and bodyUpper color-bake masks: exact 1024×1024, pinned yes;
- all three figures verified;
- `CK.character._needsUpdating=false` and `_inUpdate=false`;
- Texture Quality `data-error=0`.

### Disable / restore / final enable smoke

Bridge #2205 executed one at-most-once controlled `disable()`. Bridge #2206 read back the resulting Stable state as `OFF for this session — Persistent High Res will return after reload`, with no Texture Quality error and an idle renderer. This confirmed the service can relinquish its active session without destroying the saved desired preference.

Bridge #2207 then executed one at-most-once controlled final `enable()`. Bridge #2208 confirmed Stable provenance again and returned to the same healthy three-figure verified state. High Res was intentionally left ON.

### Release decision

Public Stable Texture Quality v0.3.4 / UI v0.2.0 release gate: **PASS / CLOSED**.

No Stable runtime divergence from the accepted Dev behavior was found. No unrelated Dev feature, beta notice, public shell change, or development-infrastructure runtime dependency is part of the release.

### Rollback

This closeout commit is documentation only and may be reverted without changing runtime behavior. If runtime rollback is ever required, revert the narrow promotion commit `d2470ee7d1fbfe052326937a9ba9468ff5339fbf`; it contains only the two Texture Quality blobs, their manifest wiring, and release records.

**Runtime behavior changed by this checkpoint:** no. Documentation only.

---

## PFC-2026-09-14-033 — Accepted multi-figure Texture Quality Stable promotion

Date: 2026-09-14

### Scope and source identity

Promoted only the accepted Texture Quality service/UI from `WITCH_DEV_UI` into public `Witch_Scripts` plus the required registry/cache-key wiring and release logs.

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`, exact Dev blob `cf2f5974177a65bc6a5419ace824cc9565b79710`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`, exact Dev blob `863b5ccb4f76ffac105f2e0f8d3f46ac8a37ff94`;
- Stable parent before promotion: `c93485d741fe9d1801b0f6924b7204a8d922792c`;
- runtime promotion commit: `d2470ee7d1fbfe052326937a9ba9468ff5339fbf`.

### Pre-move gate

- both exact runtime blobs passed `node --check`;
- local Git blob hashing matched the accepted Dev SHAs exactly;
- candidate `manifest.json` parsed successfully with unique module/tool IDs;
- public Texture Quality URLs pointed to `Witch_Scripts`, never `WITCH_DEV_UI`;
- candidate differed from the prior Stable head in exactly five files: the two Texture Quality runtime files, `manifest.json`, `CHANGELOG.md`, and `PRE_FLIGHT_Check.md`;
- public shell and all unrelated Stable modules remained inherited byte-for-byte.

### Validated behavior carried forward

The accepted runtime preserves primary-only `Data.change()`, HeroForge-owned child display propagation, session-global first snapshots for shared Part objects, native color material setup, dynamic multi-figure reconciliation, persistent preference with fresh page/figure readiness, owned-state restore, atlas scale 4, bake target 2048, and a validated 1024 source/allocation floor with native promotion toward 2048 where available.

**Runtime behavior changed:** yes — public Stable advanced from Texture Quality v0.1.0 to service v0.3.4 / UI v0.2.0.
