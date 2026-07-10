# Decals and Textures

HeroForge decal/texture discoveries, slot behavior, and related UI/runtime notes.

## Known Rules

- Expanded decal slots are conditional and must not assume HF Core Tweaks is present.
- Decal UI targeting must distinguish source/object selectors from slot grids.
- Slot expansion and scroll behavior may depend on HeroForge exposing labels, attributes, or reused menu containers.
- If HF Core Tweaks is missing or its expected signature is not present, the expanded slot module must remain a no-op.
- Decals scroll behavior is not purely cosmetic; broken scroll/overflow can hide usable slots or create unusable menus.

## Findings

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
