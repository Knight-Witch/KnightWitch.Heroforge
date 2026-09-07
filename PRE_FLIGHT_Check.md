# Pre-Flight Check Log

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
