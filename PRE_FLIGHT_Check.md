# Pre-Flight Check Log

## PFC-2026-09-08-029 — Promote validated fresh-slot gizmo repair to Stable

Date: 2026-09-08

### Scope

Promote only the validated Corrected Bound Decal Gizmo v1.1.1 fresh-slot initializer repair from `WITCH_DEV_UI` to public `Witch_Scripts`.

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- Compatibility `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, and `TESTING.md`;
- current public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`, and gizmo history;
- Dev gizmo v1.1.1 candidate commit `08e776bfb276b281e9b337f3d3ccb866e23e2ca4`;
- Amanda's live Dev PASS for fresh-slot normalization, edited Project ON/OFF preservation, and Project-OFF artwork-swap preservation;
- bridge-confirmed current untouched raw initializer values.

### Confirmed findings

- v1.1.0 still matched only the earlier `v≈1.50394`, `s≈sy≈1.76859` profile;
- current untouched Project-OFF raw state is `v=1.5633519738912582`, `s=sy=1.818040788039411`, with H effectively zero;
- v1.1.1's `1.56 / 1.82 / 1.82` profile at ±0.025 correctly covers those confirmed raw values;
- v1.1.1 only normalizes on `freshBind` plus the existing neutral H/D/rotation gate;
- Move/Rotate/Scale and undo/redo runtime paths are unchanged;
- exact Dev runtime behavior has passed the human gate.

### Target files

- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`

### Preservation requirements

- promote exact Dev gizmo blob;
- do not alter fragment sources;
- do not alter Booth, replay, bootstrap, Utilities, Spinny, High Res, JSON, Developer Mode, Decals, Body, Pose, or public shell;
- public URL must remain `Witch_Scripts`, never `WITCH_DEV_UI`;
- source + canonical manifest version + required tracking docs must land in one atomic Stable commit.

### Gate

JavaScript syntax, manifest JSON, exact Dev gizmo blob parity, exact six-file whitelist, protected unrelated runtime blob equality, `git diff --check`, and one-commit Stable candidate ancestry must pass before moving `Witch_Scripts`.

### Decision

Proceed with the narrow Stable promotion. One quick public fresh-slot smoke is sufficient afterward; no full gizmo regression matrix is required because the same runtime blob already passed Dev.

**Runtime behavior changed:** yes — public gizmo only.

---

## PFC-2026-09-07-028 — Record public Stable Booth/lifecycle acceptance

Date: 2026-09-07

### Scope

Record Amanda's final public Stable acceptance of Witch Dock shell v1.2.1, Booth v27.0.4, Black Canvas replay v0.1.5, Booth runtime bootstrap v0.1.0, and the public loader cache-key repair. This checkpoint is documentation-only and makes no runtime changes.

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- Compatibility `MASTER.md` and the repository architecture/integration rules already reviewed for the immediately preceding Stable promotion;
- current public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`;
- Stable promotion commit `91a78ebaba6e54ee143dbae0053d782495f252fa`;
- final public user smoke result: "everything looks great";
- deferred approximately 1 px checkerboard seam record.

### Confirmed public result

Amanda confirmed the public Stable build looks correct after updating/reloading the `Witch_Scripts` userscript.

The final Stable smoke therefore closes the requested release gate for:

- public shell v1.2.1 and current module delivery;
- saved Booth / Black Canvas startup restoration;
- Black Canvas ON/OFF presentation restoration;
- the previously reliable white-flash regression remaining closed.

The approximately 1 px checkerboard seam remains known, cosmetic, deferred, and explicitly non-blocking.

### Target files

Documentation only:

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_ACCEPTANCE.md`

### Preservation requirements

- no runtime/module/manifest/userscript changes;
- no version bumps;
- no reopening the white-flash investigation;
- no attempt to fix the deferred checkerboard seam in this closeout.

### Decision

Mark the Booth lifecycle / Black Canvas startup-restoration / loader cache-repair release as **public Stable validated** and move to the next separately scoped project.

**Runtime behavior changed:** no.

---

## PFC-2026-09-07-027 — Promote validated Booth lifecycle and cache-keyed public loader

Date: 2026-09-07

### Scope

Promote the final Dev-validated Booth v27.0.4/replay v0.1.5/runtime-bootstrap v0.1.0 set and port only the validated Dev loader cache-key mechanism into public shell v1.2.1. Record the remaining 1 px checkerboard seam as deferred and non-blocking.

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- Compatibility `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current Stable `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`, shell v1.2.0, Booth v27.0.0, replay v0.1.1;
- Dev `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`, `BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`, `BOOTH_RUNTIME_BOOTSTRAP.md`;
- validated Dev head `cecfa43f3ca0096562bb3e9f472c39cbb1823f40`;
- final user live PASS for v27.0.4 environment/component restoration;
- user observation that the thin responsive checkerboard seam remains and is explicitly deferred.

### Confirmed findings

- Stable replay's v24 diagnostic fallback is present in Dev replay v0.1.5, so exact-blob promotion is monotonic;
- v27.0.4 live state repair passed all four requested environment/component tests;
- live bridge evidence showed `CK.environment.background.visible === true` while `CK.environment.background.mesh.visible === false`, confirming the explicit mesh restoration targets the observed failure;
- the rejected v27.0.3 `getTokenViewOffset()` DOM matte is not part of the promoted source;
- public fixed branch URLs have a confirmed delivery-cache defect; Dev's cache-keyed loader passed static validation and is ported surgically to the public shell rather than copying the Dev shell.

### Target files

Runtime / delivery:
- `Witch_Dock.user.js`
- `manifest.json`
- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `features/booth/Booth_Runtime_Bootstrap.js`

Documentation:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`

### Conflict risks / preservation requirements

- candidate parent must be current Stable head `f218244b2a6010e4d299ca5641a8d4f6f56f38f9`;
- Booth/replay/bootstrap must equal the exact validated Dev blobs;
- do not modify Utilities, gizmo, Spinny, High Res, JSON, Developer Mode, Decals, or other unrelated modules;
- public shell must retain the existing emblem/UI bytes outside the cache-key/header delta;
- bootstrap must load before Booth;
- public raw URLs must point to `Witch_Scripts`, never `WITCH_DEV_UI`;
- no HF-Chat-Bridge/Compatibility-main public runtime dependency;
- deferred checkerboard seam must remain documented rather than silently treated as fixed.

### Gate

Before advancing `Witch_Scripts`:

- JavaScript syntax: shell, Booth, replay, bootstrap PASS;
- manifest JSON parse PASS;
- exact Dev blob parity PASS for Booth/replay/bootstrap;
- public cache helper block equals the validated Dev helper block;
- manifest/tool registry IDs resolve and bootstrap precedes Booth;
- public URLs contain no `WITCH_DEV_UI` for the promoted modules;
- exact changed-file whitelist PASS;
- protected unrelated runtime blobs PASS;
- `git diff --check` PASS.

### Decision

Proceed to a narrow Stable promotion candidate. After branch movement, require one final public refresh/smoke; the 1 px seam is not an acceptance blocker.

**Runtime behavior changed:** yes.

---

## PFC-2026-09-07-026 — Promote Booth v27 and Utilities v1.2.1 to Stable

Date: 2026-09-07

### Scope

Correct the incomplete public promotion after the Black Canvas replay release. Promote the exact Dev-tested Booth v27 and Utilities v1.2.1 module blobs while preserving the already-public Black Canvas replay. Do not merge `WITCH_DEV_UI` wholesale.

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- HeroForge.Compatibility `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, and `TESTING.md`;
- current public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`;
- public Booth v24 and Utilities v1.1.0;
- Dev Booth v27 and Utilities v1.2.1;
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`;
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`;
- public replay commit `b0bc170af613fc31615cd4ce78e030db3012b426`;
- user screenshot confirming public still exposed Booth v24 / old Utilities;
- user live validation that the Dev v27 + Utilities v1.2.1 + replay combination eliminated the formerly reliable white flash.

### Confirmed findings

- the public screenshot is not a cache failure: `Witch_Scripts` still contained Booth v24 and Utilities v1.1.0 because the prior promotion intentionally moved only the replay module;
- exact Dev Booth v27 blob: `434b5382c9e8b01e9f9e8bf53d772e72eaf53090`;
- exact Dev Utilities v1.2.1 blob: `036fca4d7f68a1dee0f7d160777d453ac53274af`;
- those exact modules were loaded during the successful Dev replay smoke;
- replay v0.1.1 already prefers v27 `KW_WD_BOOTH.getState().sessionBlackCanvas`, so no replay runtime edit is required;
- Booth v27 and Utilities v1.2.1 are manifest-delivered modules; public userscript shell can remain v1.2.0.

### Target files

- `tools/Booth.js`
- `tools/Utilities.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`

### Conflict risks / preservation requirements

- copy the exact tested Dev Booth/Utilities blobs; do not reconstruct them;
- keep public Black Canvas replay runtime byte-unchanged;
- keep Corrected Bound Decal Gizmo runtime/fragments unchanged;
- keep Spinny, High Res, JSON, Developer Mode, Decals host, and tab shell unchanged;
- preserve Booth storage keys and Utilities/Booth default-vs-session ownership;
- do not promote the Dev loader or unrelated Dev branch files;
- no HF-Chat-Bridge runtime dependency.

### Gate

Before advancing `Witch_Scripts`:

- candidate parent must equal current Stable head;
- final runtime delta must contain only `tools/Booth.js` and `tools/Utilities.js`;
- Booth blob must equal `434b5382c9e8b01e9f9e8bf53d772e72eaf53090`;
- Utilities blob must equal `036fca4d7f68a1dee0f7d160777d453ac53274af`;
- manifest must report Booth 27.0.0/build v27 and Utilities 1.2.1;
- replay remains 0.1.1 and unchanged;
- public shell remains 1.2.0;
- final changed-file list must be limited to the seven target files above.

### Decision

Proceed as a narrow Stable module promotion. Require one clean public refresh/smoke after branch movement.

**Runtime behavior changed:** yes — Booth v27 and Utilities v1.2.1 public module promotion.

---

Historical pre-flight entries through PFC-2026-09-07-025 are preserved in Git history at public commit `b0bc170af613fc31615cd4ce78e030db3012b426`.
