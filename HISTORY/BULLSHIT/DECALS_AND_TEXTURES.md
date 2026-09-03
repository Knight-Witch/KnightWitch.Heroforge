# Decals and Textures

HeroForge decal/texture discoveries, slot behavior, and related UI/runtime notes.

## Known Rules

- Expanded decal slots are conditional and must not assume HF Core Tweaks is present.
- Decal UI targeting must distinguish source/object selectors from slot grids.
- Slot expansion and scroll behavior may depend on HeroForge exposing labels, attributes, or reused menu containers.
- If HF Core Tweaks is missing or its expected signature is not present, the expanded slot module must remain a no-op.
- Decals scroll behavior is not purely cosmetic; broken scroll/overflow can hide usable slots or create unusable menus.
- Projected splatter slot letters are not the raw numeric data keys. In the current live schema, `A -> 2` and `F -> 7`; resolve the current mapping instead of treating the alphabetic ordinal as the key.
- Never identify a rendered splatter slot by decal ID alone. The same decal ID can be used in multiple slots on the same figure.
- Do not hard-code `sourceLayer`, `displayDecals` indices, or `bakeMaterials.colorDecals` indices across figures/state changes; resolve the chain from the current runtime each time.

## Findings

### Projected Splatter Slot Mapping, Render Indices, and Project Behavior — 2026-09-03

Context:
- Live HeroForge runtime was inspected through the read-only HF-Chat-Bridge while stabilizing Lob's projected decal `Project` control.
- The tested current creationkit build was `heroforge07.1.9.93`.
- This finding supersedes the earlier test-harness assumption that visible Slot F was raw splatter key `6`.

Observed behavior:
- HeroForge's visible alphabetic projected/splatter labels are offset by one from the raw numeric `splatter` mapping/data key.
- Direct current-runtime spot checks:
  - visible Slot A -> `mapping: "2"` / raw splatter key `2`;
  - visible Slot F -> `mapping: "7"` / raw splatter key `7`.
- For the current schema, the practical conversion is: raw splatter key = Excel-style alphabetic slot ordinal + 1. Do not use the alphabetic ordinal directly.
- The raw character/display record lives at `CK.character.display.data.decals.splatter.<mappingKey>` (with `CK.activeData.decals.splatter` / character data as related state surfaces).
- `CK.character.display.modded.orderedDecals.splatter` is a sorted list of active splatter decals. Each entry preserves its raw `mapping`, but the array index is a different value.
- When projected splatter decals are merged into a rendered part's `displayDecals.<part>` list, that sorted-array index becomes `sourceLayer`.
- `sourceLayer` is therefore **not** the raw splatter key.
- `displayDecals.<part>` also contains that part's own/native decals. The final array index of the matching display entry is the rendered decal/material index used by the tested `bakeMaterials.colorDecals.<index>` path.
- That rendered index is dynamic and must not be assumed stable across figures, slot contents, filters, or ordering changes.
- A decal catalog ID is not a slot identity. The same decal ID can appear in several splatter mappings at once.

Current confirmed example:
- Visible Slot F = raw splatter key/mapping `7`.
- Slot F was changed to Hexagon, decal ID `1185`.
- In the current sorted splatter list it appeared at index `5`; rendered entries therefore identified it as `sourceSlot: "splatter"`, `sourceLayer: 5`.
- Because its filter targeted `bodyUpper`, the current rendered entry was `CK.character.display.modded.displayDecals.bodyUpper[16]`.
- The matching tested material was `CK.character.display.colorMeshes.bodyUpper.bakeMaterials.colorDecals[16]`.
- These `5` and `16` values are examples from that exact figure/state, not reusable constants.

Safe lookup chain:
1. Resolve the visible slot label to the current raw `mapping`/splatter key.
2. Read the actual record from `...decals.splatter.<mappingKey>`.
3. Find the matching entry in `orderedDecals.splatter` by `mapping`; its array index is the projected `sourceLayer`.
4. Determine the rendered target part from the decal filter/state.
5. Find `displayDecals.<part>` where `sourceSlot === "splatter"` and `sourceLayer` matches the sorted index (also validate `mapping`/ID when useful).
6. Use that display-array index for the corresponding current `bakeMaterials.colorDecals.<index>` inspection.
7. Never skip this chain by searching only for the decal ID.

Project/bind behavior in the Lob + Full Res compatibility path:
- `forceProjectedScript` is a compatibility field consumed by the Full Res projected-decal renderer support; it is not being treated here as a stock HeroForge field.
- `forceProjectedScript: true` -> tested material `l0_projectBind = 0` -> normal projected gizmo; the decal remains in projection/pose space when the figure is re-posed instead of following the body.
- `forceProjectedScript: false` -> tested material `l0_projectBind = 1` -> bound-to-figure behavior; the decal follows the body and the gizmo is the non-intuitive/off-decal bound-space gizmo Amanda recognizes from the legacy behavior.
- `forceProjectedScript: undefined` -> preserve the renderer's native/default decision path.
- Legacy/user-facing shorthand sometimes called the `false` state "unprojected," but renderer evidence shows it still uses projection machinery. The more accurate distinction is **bound projection** (`projectBind = 1`) versus **posed/world projection** (`projectBind = 0`).
- The useful uniform inspection path is `CK.character.display.colorMeshes.<part>.bakeMaterials.colorDecals.<displayIndex>.uniforms.l0_projectBind.value` after the correct display index has been resolved.

Current transform storage observed on splatter records:
- `h` / `v` are the planar position pair used by the current decal transform UI path.
- `d` is the third/depth position component.
- `s` / `sy` are the paired planar scale values.
- `sz` is the third/depth scale component.
- Do not infer renderer mode merely from these transform numbers; read the actual projection/bind state when diagnosing Project behavior.

Important correction from the stabilization session:
- The first standalone Project test incorrectly mapped alphabetic slot ordinal directly to the raw key, so panel `F` targeted key `6` while HeroForge's actual F was key `7`.
- That meant part of the early diagnosis changed one splatter record while inspecting another rendered decal.
- The resulting "renderer ignores the flag / creationkit loader race" conclusion is invalidated as a confirmed finding.
- The experimental v0.2.0 `creationkit.js` gate was diagnostic detour code, not canonical behavior, and must not be used as the reference implementation.
- Once the correct Slot F/key `7` was targeted, `forceProjectedScript` changed `false -> true`, the actual Hexagon material changed `projectBind 1 -> 0`, Amanda confirmed the gizmo became normal, and re-posing no longer dragged the decal with the figure.

Working approach:
- Treat visible slot label, raw mapping key, sorted `sourceLayer`, rendered display index, material index, and decal catalog ID as separate identifiers.
- Resolve them from current runtime state instead of caching figure-specific indices.
- Preserve the current working runtime-state approach (`CK.activeTweak` plus the tested decal refresh path) rather than reintroducing brittle compiled HeroForge UI injection merely to restore the Project control.
- Keep the Full Res renderer dependency explicit until that behavior is independently reconstructed/validated.
- If a future probe appears to contradict projection behavior, first verify that the mutation and the material inspection refer to the same raw mapping/sourceLayer/display entry before investigating renderer timing or bundle loading.

Affected tools/references:
- Lob Advanced Decal Posing Project control behavior.
- Full Res Decals/Textures projected-decal renderer support.
- HeroForge.Compatibility standalone projected-decal test work.
- HF-Chat-Bridge read-only runtime diagnostics.

### Expanded Decal Slots Depend on HF Core Tweaks Signature

Context:
- `HeroForge_UI/Expanded_Decal_Slots.js` is loaded by `HeroForge_UI/HF_UI_Slot_Bridge.js`.

Observed behavior:
- The expansion module checks CK and CK.Options, then verifies part `21022`.
- Expected signature includes `displayFilename === "KOMIKA.ttf"`, `splatterzero`, `Splatter 0`, and `Splatter 1`.
- If the signature is absent, the module waits/retries and eventually stops without applying.

Working approach:
- Preserve the signature check.
- Do not make expanded slots unconditional.
- Do not assume Witch Dock alone can create the extra slots without compatible HF Core Tweaks data.

Affected tools:
- `HeroForge_UI/HF_UI_Slot_Bridge.js`
- `HeroForge_UI/Expanded_Decal_Slots.js`
- `tools/Utilities.js`

### Current Expanded Slot Target Is 96

Context:
- `HeroForge_UI/Expanded_Decal_Slots.js` defines the current slot expansion target.

Observed behavior:
- `TARGET` is `96`.
- Primary slots currently expanded: `bodyUpper`, `bodyLower`, and `face`.
- Splatter font part expansion targets part `21022`.
- Egg part expansion targets part IDs `3139` and `20091`.

Working approach:
- Keep slot count, target slots, and egg IDs documented before changing expansion behavior.
- Treat these IDs as fragile HeroForge-specific assumptions.

Affected tools:
- `HeroForge_UI/Expanded_Decal_Slots.js`

### Decal Scroll Guards Separate Source Menus from Slot Grids

Context:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js` scopes Decals UI scroll behavior.

Observed behavior:
- Source menu detection uses visible text and attributes for terms such as projection/projector/splatter/blood/decals.
- Slot grid detection scores visible tokens A through J.
- Menus are paired by layout and relative position before styles are applied.

Working approach:
- Preserve source/slot distinction and pairing logic.
- Do not style source and slot containers globally.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`

### Decal Scroll Must Support Three UI Setups

Context:
- The scroll guard was originally tested against one Decals layout, then had to be hardened after HeroForge presented alternate UI setups.

Observed behavior:
- Right-side grouped layout behaves like a vertical stacked source/slot pair.
- Split layout presents source and slot menus side-by-side. This needed special handling because vertical resize/max-height behavior was unsafe in split mode.
- Bottom compact layout presents the slot grid with large horizontal overflow; one observed log showed `#menuD` around `scrollWidth 5035`, `clientWidth 440`, and `overflowsX true`.
- The bottom layout should not be forced into the vertical-scroll model.

Working approach:
- Preserve vertical/split/bottom classifications.
- Preserve `HF_UI_Scroll_Split_Safe.js` as a narrow split-layout override.
- Bottom compact slot grids should scroll horizontally and avoid vertical resize behavior.
- Do not remove horizontal-overflow detection.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`

### Attribute Text Matters for Decal Source Detection

Context:
- HeroForge sometimes exposes useful source-panel labels outside normal `textContent`.

Observed behavior:
- Source targeting was unreliable when relying only on direct text content.
- Labels/attributes such as `aria-label`, `title`, and `alt` can contain the words needed to identify Decals source menus.

Working approach:
- Preserve attribute scanning.
- Preserve source terms: projection, projector, splatter, blood, decals.
- Do not replace this with a single hard-coded text check.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`

### Expanded Slots and Scroll Guards Are Separate Systems

Context:
- Both features appear in the Utilities tab and both affect decal workflow, but they solve different problems.

Observed behavior:
- Decals Scroll Guards only target UI scroll/resize access.
- Expanded Decal Slots conditionally mutates compatible HF Core Tweaks part data to expose more slots.
- Turning off scroll guards can remove UI classes/styles live.
- Expanded slots may already be applied to HeroForge data for the current session and may require refresh to fully unload.

Working approach:
- Keep the Utilities status messages distinct.
- Do not imply disabling the slot bridge can undo already-applied data mutations live.
- Do not merge scroll guard and slot expansion logic.

Affected tools:
- `tools/Utilities.js`
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Slot_Bridge.js`
- `HeroForge_UI/Expanded_Decal_Slots.js`

## Entry Template

### Finding Title

Context:
- 

Observed behavior:
- 

Working approach:
- 

Affected tools:
- 
