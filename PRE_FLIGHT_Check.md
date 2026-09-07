# Pre-Flight Check Log

## PFC-2026-09-07-025 — Promote validated Black Canvas display replay to Stable

Date: 2026-09-07

### Scope

Promote only the Dev-validated Black Canvas post-display replay as a hidden manifest-delivered Stable compatibility module. Do not promote Booth v27 or merge `WITCH_DEV_UI` wholesale.

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, and `TESTING.md`;
- public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`, and public `tools/Booth.js` v24;
- Dev replay commit `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1` and its durable investigation record;
- user live validation that the formerly reliable white flash no longer reproduced and the fix worked perfectly;
- current HeroForge target `heroforge07.1.9.98`;
- public Stable head `9fa5c52fdbe2de220457a961be05e633d4b89349`.

### Confirmed compatibility findings

- the validated replay behavior wraps only the current primary `CK.character.display.update()` instance, always calls the native update, and reasserts Black Canvas state in `finally`;
- public Booth v24 does not expose Dev v27's `KW_WD_BOOTH.getState()` API;
- public Booth v24 does expose existing `KW_WD_BOOTH_DIAG()` JSON with `blackCanvasOn`;
- therefore Stable v0.1.1 adds only a state-source compatibility fallback: prefer `KW_WD_BOOTH.getState().sessionBlackCanvas`, otherwise read `KW_WD_BOOTH_DIAG().blackCanvasOn`;
- no Booth v27 source is required or promoted;
- the semantic main-scene background discovery remains named `environment` -> `background` and uses no diagnostic child indexes.

### Target files

- `features/booth/Black_Canvas_Display_Replay.js` (new Stable module)
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md` (new Stable record)

### Conflict risks / preservation requirements

- public `tools/Booth.js` must remain byte-unchanged at v24;
- public Witch Dock shell remains v1.2.0 because this is a manifest-delivered module-only update;
- no display update/refresh/change/resource-load call may be suppressed;
- do not force Booth Background component visibility from the replay module;
- wrapper/background state must be restored on dispose;
- no HF-Chat-Bridge or unstable Compatibility runtime dependency may enter Stable;
- Corrected Bound Decal Gizmo, Spinny, High Res, JSON, Utilities, Developer Mode, Decals host, and tab behavior remain unchanged.

### Static gate

Exact public v0.1.1 candidate before branch movement:

- JavaScript syntax: PASS;
- v24-shaped `KW_WD_BOOTH_DIAG().blackCanvasOn` fallback with no newer API present: PASS;
- native display-update passthrough: PASS;
- post-update Black Canvas replay: PASS;
- semantic background hide/restore: PASS;
- public manifest remains valid JSON with one hidden module/registry entry;
- final changed-file whitelist must contain only the six target files above.

### Decision

Advance only the hidden replay module and its registry/docs to public Stable, then require one clean public smoke: visibly black viewport, formerly flash-causing action, Black Canvas OFF restoration, and ordinary character-update sanity.

**Runtime behavior changed:** yes — narrow Stable Black Canvas compatibility module only.

---

## PFC-2026-09-06-024 — Promote validated Decals/Utilities host cleanup to Stable

Date: 2026-09-06

### Scope

Promote the live-validated UI-host relocation that moves the Corrected Bound Decal Gizmo controls from the Decals tab to Utilities and leaves a Decals placeholder for upcoming tools.

### Required material reviewed

- binding HeroForge.Compatibility project contract and current HFC tracking;
- public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`;
- public `tools/Decals.js`, `tools/Utilities.js`;
- public `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` and all five source fragments;
- exact Dev candidate commit `40fa227f13a79c5283f989c23b82485a273a2c53`;
- user live validation that the Decals placeholder, Utilities gizmo controls, persisted checkbox state, and Move/Rotate/Scale controls all work correctly.

### Confirmed findings

- the gizmo service owns its persisted enable state and exposes `enable`, `disable`, `setMode`, `refresh`, and `getState`;
- moving the UI host does not require runtime/service changes;
- Dev live smoke passed with one gizmo control block in Utilities and no gizmo controls in Decals;
- `tools/Decals.js` and `tools/Utilities.js` require canonical version bumps to v1.1.0;
- `Witch_Dock.user.js` does not require a version change because this is a manifest-delivered module-only update.

### Conflict risks

- do not modify the validated corrected-gizmo runtime or fragment sources;
- preserve the existing gizmo enable storage key and current state across the host move;
- do not duplicate controls in Decals and Utilities;
- do not merge unrelated Dev changes into Stable.

### Decision

Promote only the two validated host modules, their canonical registry bumps, and durable documentation. Require syntax/manifest/protected-runtime/static checks before advancing public Stable.

**Runtime behavior changed:** UI host/presentation only. Corrected gizmo runtime behavior is unchanged.

---

## PFC-2026-09-06-023 — Promote validated Witch Dock UI/Developer Mode delta to Stable

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- public v1.1.0 `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `Witch_Dock.user.js`, `manifest.json`, High Res service, Spinny service/UI;
- validated `WITCH_DEV_UI` tab cleanup, High Res v0.8.0/v0.3.0 ownership split, Developer Mode v0.3.0, module registry and Dev loader manifest-source boundary.

### Confirmed live findings

- tab cleanup passed order, Utilities cog tooltip, correct tool routing, and persisted active-tab restoration;
- High Res ownership cleanup passed compact/no-duplicate presentation, developer diagnostics, provider disable/re-enable, TRUE 4K, TRUE 8K, Spinny coexistence, and prior tab behavior;
- Developer Mode public-readiness build passed the requested live gate by final user report that everything works great;
- user explicitly approved public rollout;
- user explicitly removed 4096 animated WebP and Developer Mode hotkey from the active to-do list.

### Target files

- `Witch_Dock.user.js`
- `manifest.json`
- `features/core/Witch_Dock_Developer_Mode.js`
- `features/media/Photo_Booth_True_Resolution.js`
- `features/media/Photo_Booth_True_Resolution_UI.js`
- `MODULE_VERSIONING.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- relevant HISTORY records

### Conflict risks

- do not merge `WITCH_DEV_UI` wholesale;
- do not modify public Spinny service/UI runtime source;
- preserve validated TRUE 4K/8K capture/provider function behavior and readiness adapter;
- Developer Mode must remain optional, default OFF, About-only, and diagnostic-failure isolated;
- public diagnostics must read the active public manifest rather than Dev registry state;
- Utilities-last behavior must be structural rather than manifest-timing-only;
- no HF-Chat-Bridge or unstable HFC runtime dependency may enter Stable.

### Decision

Build a Stable candidate from current v1.1.0, copy only the validated feature modules, port only the tested tab shell delta, create the public module registry, run syntax/manifest/hash/ownership gates, then fast-forward `Witch_Scripts` only on success.

**Runtime behavior changed:** yes — approved Stable UI/diagnostics promotion.

---

## PFC-2026-09-06-022 — Promote validated Spinny Mini WebP to public Stable

Date: 2026-09-06

### Scope

Promote only the accepted `media.spinny-mini-webp` Witch Dock Dev delta into public `Witch_Scripts` after explicit user approval. Do not merge the diverged Dev branch wholesale.

### Required material reviewed

- binding `HeroForge.Compatibility/PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- HFC Spinny feature specification and validated v0.5.0 architecture;
- public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`;
- public `Witch_Dock.user.js`, `manifest.json`, and `features/media/Photo_Booth_True_Resolution.js`;
- public true-resolution history/ownership record;
- exact WITCH_DEV_UI Spinny v0.5.1 service and v0.1.1 UI that received the final integrated smoke.

### Confirmed live evidence

- standalone 1024/2048/TRUE-3K 3072 capture architecture was previously validated;
- full 3072 Standard and Slower production captures passed visual and runtime validation;
- integrated Dev placement, popout, Pause/Resume, cancel, ETA and interaction guards passed;
- final Dev hardening re-smoke: silent wheel/scroll block PASS;
- final Dev hardening re-smoke: WebP download PASS through the privileged userscript host;
- user reports all remaining integrated behavior works perfectly and explicitly approved public rollout;
- optional transient in-panel download-complete flash was not observed, but browser download confirmation and the successful privileged download boundary make it non-gating.

### Target files

- `Witch_Dock.user.js`
- `manifest.json`
- `features/media/Spinny_Mini_WebP.js` (new Stable consumer copy)
- `features/media/Spinny_Mini_WebP_UI.js` (new Stable UI host)
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Material conflict risks checked

- public 4096/8192 true-resolution still provider remains the owner of its existing `BT.maker.takeScreenshot` wrapper;
- Spinny does not replace that owner and 3072 operates below it at the bounded Effects seam;
- public shell change is limited to the tested `GM_download` host plus v1.1.0 metadata;
- Short Test remains hidden because public Stable does not promote Developer Mode;
- compact High Res UI, Developer Mode, module registry and unrelated Dev ordering changes are excluded;
- 4096 animated WebP remains deferred;
- no HF-Chat-Bridge or unstable HFC runtime dependency is introduced.

### Decision

Approved for a narrow Stable promotion candidate. Require syntax/manifest/static ownership checks before advancing `Witch_Scripts`.

**Runtime behavior changed:** yes — public v1.1.0 adds Spinny Mini WebP and the tested privileged download host.

---

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-05-021 — Record public Photo Booth smoke acceptance

Date: 2026-09-05

### Target files

- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- current public `Witch_Scripts` promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`
- current public Photo Booth true-resolution feature record
- current public `MASTER.md`, `PRE_FLIGHT_Check.md`, and `CHANGELOG.md`
- Amanda's clean public smoke result after disabling temporary standalone/Dev test scripts

### Confirmed findings

- The public readiness adapter fixed the initial Dev caveat: Witch Dock's direct TRUE 4K/TRUE 8K buttons became usable without cycling the repair toggle.
- Public HeroForge/Lob 4096 capture through Witch Dock passed perfectly.
- Public HeroForge/Lob 8192 grouped capture through Witch Dock passed perfectly.
- Public Witch Dock direct TRUE 4K capture passed perfectly.
- Public Witch Dock direct TRUE 8K capture passed perfectly.
- Amanda reported the public integration works perfectly.
- No runtime defect was reported in the promoted capture provider or readiness adapter.

### Material conflict risks

- This checkpoint must not change capture code, manifest delivery, Lob/ADP, Persistent Booth, or unrelated Witch Dock modules.
- Do not reintroduce one-shot 8192 Effects rendering.
- Lob-absent injection into HeroForge's own resolution selector remains a separate future adapter and is not required to close the Stable capture gate.

### Recommended action

Record the clean public acceptance as a documentation-only checkpoint. Mark `media.screenshot-resolution` as Witch Dock Stable validated and remove the completed public-smoke item from the near-term queue.

**Runtime behavior changed:** no.

---

Historical pre-flight records through PFC-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.