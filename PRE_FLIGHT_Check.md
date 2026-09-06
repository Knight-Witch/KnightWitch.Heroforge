# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-05-022 — High Res Image Capture UI cleanup and default Decals tab order

Date: 2026-09-05

### Target files

- `features/media/Photo_Booth_True_Resolution_UI.js` (new Dev UI adapter / standalone test)
- `manifest.json`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- current public `Witch_Scripts` head `0398b8c52311b2e0030a08f0504933ef58bc0c77`;
- current Stable `features/media/Photo_Booth_True_Resolution.js` build `0.7.0-witch-dock-dev-provider`;
- current public readiness adapter `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` build `1.0.0-public-readiness`;
- current public `manifest.json` load order;
- current Witch Dock core `registerTool`/same-tool replacement behavior and section host;
- `STYLE_KEYS.md` compact dark UI direction;
- public 4K/8K Stable validation record and current `MASTER.md`.

### Confirmed findings

- The 4K/8K capture engine is Stable-validated and does not need to be edited for the requested presentation cleanup.
- The exposed checkbox currently enables/disables the entire high-resolution repair provider and persists that state. It functions as a troubleshooting/kill switch rather than a normal capture control.
- The existing provider-status and Lob/provider explanatory lines are implementation diagnostics rather than information required for ordinary capture use.
- The public readiness adapter already controls every `.kwPBResBtn` from current Photo Booth readiness, provider ownership, active-capture state, named Effects availability, and 4096 renderer limits.
- Manifest loading is sequential; first tool registration creates each visible tab. Moving the Decals manifest entry immediately after Booth-related entries therefore changes the default tab order to place `Decals` between `Booth` and `JSON` without coordinate/layout logic.
- Witch Dock core already replaces an existing tool container when the same tool ID is registered again. A presentation-only adapter can therefore remount `photo-booth-true-resolution` while leaving the validated capture service untouched.

### Approved UI intent

Normal High Res Image Capture presentation:

- section/tool title: `High Res Image Capture`;
- one compact row: `Capture: [4K] [8K]`;
- clear violet hover highlight on enabled 4K/8K buttons;
- idle status: `Active — click 4K or 8K to begin image capture`;
- repair-provider checkbox hidden from normal mode;
- provider implementation status and Lob/provider explanatory blurb hidden from normal mode.

The underlying service `enable()` / `disable()` kill switch remains intact. User-approved direction is to expose that control later through Witch Dock-wide Developer Mode rather than ordinary UI.

### Implementation boundary

- Do not edit `Photo_Booth_True_Resolution.js` capture math/provider ownership in this change.
- Add a small presentation-only adapter that calls the existing global service API and reuses the existing readiness helper.
- Give the adapter userscript metadata so it can be installed directly over current public Witch Dock for isolated Dev testing; metadata comments remain harmless if the same file is later manifest-loaded.
- Reorder `decals-dev` before `json-tool` in the Dev manifest default order.
- Public `Witch_Scripts` remains untouched until this presentation is tested separately.

### Material conflict risks

- Re-registering the same tool ID removes the old visible container but the Stable service still retains references to its detached legacy UI nodes until reload. This is acceptable for a Dev presentation test but should be cleaned up before final Stable promotion by making the capture service explicitly service-only or otherwise suppressing legacy UI registration.
- If a user previously persisted the provider disabled, the compact UI will correctly report that it is disabled. Do not promote the hidden-switch presentation publicly until the planned Developer Mode control or a deliberate state-migration policy exists.
- The adapter must not duplicate provider wrappers, capture math, readiness rules, or 4K/8K rendering logic.
- The Decals order change is only the default registration order; it must not remove any user-controlled reordering behavior that exists elsewhere.
- Spinny/WebP integration, Pause, and interaction guards are explicitly out of scope while the active 3K Spinny validation run is in progress.

### Recommended action

Commit the new compact UI adapter and Dev manifest order as a separate `WITCH_DEV_UI` candidate, then install only the standalone UI adapter after the active 3K Spinny capture completes. Validate appearance plus direct 4K and 8K capture calls before any Stable promotion. Implement Witch Dock-wide Developer Mode separately in the core shell and use it to expose the provider kill switch and build/version diagnostics.

**Runtime behavior changed:** yes, Dev-only presentation and Dev manifest default order. Stable capture engine, readiness engine, public Witch Dock, and active Spinny runtime are unchanged.

---

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
