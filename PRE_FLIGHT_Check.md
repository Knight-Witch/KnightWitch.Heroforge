# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-05-023 — Modular Witch Dock Developer Mode

Date: 2026-09-05

### Target files

- `features/core/Witch_Dock_Developer_Mode.js` (new)
- `features/media/Photo_Booth_True_Resolution_UI.js`
- `manifest.json`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md` (new)
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- current `WITCH_DEV_UI` head `210b76d3110ab51ff760d3b37da125a57340bfb7`;
- current public Witch Dock shell `Witch_Dock.user.js` v1.0.8, including `WitchDock.registerTool`, About-modal creation, tool containers, and stable loader behavior;
- current public Stable `media.screenshot-resolution` service and readiness adapter;
- `STYLE_KEYS.md`;
- PFC/CHANGELOG/MASTER state from the first compact High Res UI checkpoint;
- user approval to make Developer Mode a separate module and keep the high-resolution repair kill switch hidden from ordinary users.

### Confirmed findings

- Developer Mode does not need to be hard-wired into the 85 KB Witch Dock shell for its first candidate.
- `WitchDock.registerTool` is a named stable host boundary suitable for a reversible wrapper that records tool metadata without touching HeroForge internals.
- The existing About modal can be augmented after creation; the module does not need to force the modal open or replace core modal code.
- Existing tool definitions do not consistently declare build/version metadata. Accurate global version visibility therefore requires displaying only declared metadata and explicitly marking undeclared tools as `build unreported` until they are annotated.
- The high-resolution capture service already exposes reversible `enable()` / `disable()` methods, so Developer Mode can surface the kill switch without changing provider/capture math.

### Implementation plan

1. Add hidden module `features/core/Witch_Dock_Developer_Mode.js` build `0.1.0-dev-registry-about-toggle`.
2. Persist Developer Mode off/on state in `kw.witchDock.developerMode.v1`, default off.
3. Inject a `Developer Mode` checkbox into the existing `?` / About modal when that modal exists.
4. Reversibly wrap `WitchDock.registerTool` to record tool ID/title/tab and declared build/version metadata.
5. When enabled, add a small developer metadata row to each mounted tool; undeclared builds remain `build unreported` rather than guessed.
6. Update High Res Image Capture UI to build `0.2.0-dev-developer-mode` and reveal its provider kill switch, component builds, provider state, and implementation note only while Developer Mode is enabled.
7. Load Developer Mode before visible tools in the Dev manifest so subsequent registrations can be observed.
8. Keep the Stable capture engine, readiness adapter, public branch, and active Spinny capture untouched.

### Material conflict risks

- Wrapping `WitchDock.registerTool` must be ownership-aware on disposal. If another later module replaces the wrapper, Developer Mode must not overwrite that later owner.
- Developer Mode must not become required for normal tool functionality; if it fails, ordinary Witch Dock tools must continue to work.
- The first candidate can only report builds explicitly declared by tool registrations. Broadening version coverage later must be metadata-only and must not invent values.
- The existing compact High Res UI still uses same-ID re-registration as a Dev migration technique; the Stable service retains detached legacy UI references until reload. That remains a pre-promotion cleanup item.
- No secret hotkey is added yet; About toggle is the sole first-candidate user surface.
- No HeroForge runtime objects (`CK`, `BT`, Webpack/bundles) are modified by Developer Mode.

### Test status before commit

- local `node --check` on `Witch_Dock_Developer_Mode.js`: PASS.
- local `node --check` on High Res UI v0.2.0: PASS.
- live HeroForge/Witch Dock smoke: pending until the active 3072px Spinny capture completes.

### Recommended action

Commit the Developer Mode module, High Res consumer update, manifest wiring, and durable docs as one Dev-only checkpoint. After the active Spinny run finishes, test Developer Mode off/on behavior and the compact High Res UI before any public promotion.

**Runtime behavior changed:** yes, Dev-only Witch Dock diagnostics/presentation. Public Stable, capture engine, readiness engine, and active Spinny runtime are unchanged.

---

## PFC-2026-09-05-022 — High Res Image Capture UI cleanup and default Decals tab order

Date: 2026-09-05

### Target files

- `features/media/Photo_Booth_True_Resolution_UI.js` (new Dev UI adapter / standalone test)
- `manifest.json`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Confirmed findings / decision

- Keep the Stable 4K/8K capture engine untouched.
- Normal UI target: `High Res Image Capture`, `Capture: [4K] [8K]`, clear hover state, compact status.
- Hide repair-provider checkbox and implementation/Lob notes from normal users.
- Preserve underlying service kill switch for later Developer Mode exposure.
- Move `Decals` before `JSON` by Dev manifest registration order rather than coordinate/layout hacks.
- Use a presentation-only adapter that re-registers the existing tool ID and consumes the validated service/readiness APIs.

### Material risks

- Same-ID Dev re-registration leaves detached legacy UI references in the Stable service until reload; clean service/UI ownership before Stable promotion.
- Public `Witch_Scripts` remains untouched.
- Spinny/WebP integration and Pause remain out of scope while the active 3K run is in progress.

**Runtime behavior changed:** yes, Dev-only presentation and Dev manifest default order.

---

## PFC-2026-09-05-021 — Record public Photo Booth smoke acceptance

Date: 2026-09-05

### Confirmed findings

- Public HeroForge/Lob 4096 and 8192 repaired routes passed perfectly.
- Public Witch Dock direct TRUE 4K and TRUE 8K passed perfectly.
- Public readiness adapter worked without cycling the repair toggle.
- No runtime defect was reported in the promoted provider/readiness adapter.

### Recommended action

Record the clean public acceptance as documentation-only and mark `media.screenshot-resolution` Witch Dock Stable validated.

**Runtime behavior changed:** no.

---

Historical pre-flight records through PFC-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
