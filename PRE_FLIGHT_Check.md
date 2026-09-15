# Pre-Flight Check Log

This active Stable pre-flight log is intentionally compact. Detailed prior Stable records through `PFC-2026-09-14-036` remain preserved in Git history at Stable head `dcf53166a12321cc5bbe1d94133c3d1d29655e59` and earlier.

## PFC-2026-09-15-038 — Final public Texture Quality lifecycle/projected-host acceptance

Date: 2026-09-15

### Scope

Close the public Stable release gate after the approved lifecycle/projected-host candidate was narrowly promoted to `Witch_Scripts`.

### Reviewed

- Stable promotion commit `dac34877b5d02208c99072e67bf0e59b9233b11b`;
- Dev source commit `d0d198cea6f8d755b79ff667c1b3d550956ea0cb`;
- core v0.3.5 / build `0.3.5-preserve-native-source-floor`;
- same-figure drift guard v0.1.0 / build `0.1.0-dev-stable-same-figure-repair`;
- active-decal priority v0.1.1 / build `0.1.1-dev-projected-host-lifecycle-coordination`;
- HF-Chat-Bridge public smoke requests #2549 through #2559.

### Stable provenance/source gate

- `KWWitchDockManifestURL` resolved to `Witch_Scripts/manifest.json` on the live page.
- Public manifest load order was core -> drift guard -> active-decal -> existing UI.
- Every promoted module URL pointed to `Witch_Scripts`, never `WITCH_DEV_UI`.
- Public core/guard/active runtime source text was byte-identical to the exact approved Dev commit and each source compiled successfully.

### Fresh-figure public runtime smoke

Amanda loaded a new figure during the smoke. That gave a fresh public-session target and did not invalidate the source/provenance checks.

Before the active smoke, the scene was HeroForge-idle/ready and Texture Quality correctly reported `OFF — figure changed; enable again for this figure.` Persistence was false, so absence of body/head scale ownership was expected rather than a failed auto-enable.

One at-most-once public `KWTextureQualityNativeReconcile.enable()` completed successfully and returned `true`. Final readback confirmed:

- public manifest provenance still `Witch_Scripts`;
- core: v0.3.5, enabled, idle, no scene-sync pending, no error, verification PASS, one figure;
- status: `ON — 8192×4096`;
- HeroForge renderer idle/ready, atlas 8192×4096, native atlas identity coherent;
- bodyLower: scale 4 / bake 2048 / source 2048 / packed 2048×2048;
- bodyUpper: scale 4 / bake 2048 / source 2048 / packed 2048×2048;
- face: scale 4 / bake 2048 / source 2048 / packed 2048×2048;
- same-figure guard: attached, idle, no drift, previous proven repair count 1, last result true, no error;
- active-decal policy: idle, clean, not lifecycle-blocked, no error;
- projected active accessory slots: `humanWing1L`, `humanWing1R`, `humanWing2L`, `humanWing2R`.

### Release decision

Public Stable Texture Quality lifecycle/projected-host patch: **PASS / CLOSED**.

### Rollback

This closeout commit is documentation only. If runtime rollback is ever required, revert narrow promotion commit `dac34877b5d02208c99072e67bf0e59b9233b11b`.

**Runtime behavior changed by this checkpoint:** no. Documentation only.

---

## PFC-2026-09-15-037 — Texture Quality lifecycle/projected-host Stable promotion

Date: 2026-09-15

### Scope and approval

Amanda explicitly approved the narrow public promotion after the exact committed Dev candidate `d0d198cea6f8d755b79ff667c1b3d550956ea0cb` passed the D4-with-wings visual gate. Scope is limited to the three Texture Quality runtime modules, public manifest wiring, and required release records.

### Proven Dev behavior carried forward

- Interactive kitbash drag was captured as same-figure `character.change` affecting transforms and `atlasScale`, followed by a transient low-quality generation.
- The proven recovery condition is policy drift on the same figure after HeroForge becomes idle/ready and remains the same ready generation for 1200 ms.
- The guard then calls the existing core `reconcile({ sceneSync: true })` exactly once; no readiness checks, settle loops, rollback, snapshots, or ownership boundaries were weakened.
- D4 projected splatter discovery identified all four wing atlas hosts. Exact candidate state promoted those hosts to scale 4 with native 1024 sources and 1024×1024 packed allocations while body/head remained core-owned.
- Final human committed-candidate drag: no visible problem.

### Source identity

- Dev source commit: `d0d198cea6f8d755b79ff667c1b3d550956ea0cb`
- core v0.3.5 blob: `f63665ebd34cdaee865de65b4b6ff973eb85b582`
- same-figure guard v0.1.0 blob: `830328fa2dd6405f9aec98cfa19b8868ad714b96`
- active-decal v0.1.1 blob: `a89c57e09cdaa2f4213f6b3a8eed95118f4c4d14`
- Stable parent before promotion: `dcf53166a12321cc5bbe1d94133c3d1d29655e59`

### Static gate

- Prior Stable manifest reconstructed exactly to blob `965aedcc68faff80e878a297c3237a0d2a470ef8`.
- Candidate public manifest blob: `06df5a4559c748756f4132080348634d06ca0b63`.
- Candidate manifest parses and module/tool IDs are unique.
- Load order is core -> same-figure guard -> active-decal policy -> existing UI.
- Public URLs for all promoted modules point to `Witch_Scripts` with deterministic version/build cache keys.
- Runtime blobs are byte-identical to the syntax-checked, live-validated Dev candidate.
- No HF-Chat-Bridge file or dependency is part of the runtime.

### Required post-promotion smoke

Read the exact public `Witch_Scripts` manifest and runtime sources through HF-Chat-Bridge. Confirm public provenance, versions/builds, load order, source availability/compilation, and healthy live state with the current figure. Any public divergence is a stop/rollback condition.

### Rollback

Revert this narrow promotion commit if the public manifest or runtime files diverge from the accepted candidate.

**Runtime behavior changed:** yes — public Stable receives the approved Texture Quality lifecycle/projected-host patch.
