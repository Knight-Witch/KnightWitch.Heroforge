# Decals and Textures

HeroForge decal/texture discoveries, slot behavior, and related UI/runtime notes.

## Known Rules

- Expanded decal slots are conditional and must not assume HF Core Tweaks is present.
- Decal UI targeting must distinguish source/object selectors from slot grids.
- Slot expansion and scroll behavior may depend on HeroForge exposing labels, attributes, or reused menu containers.
- If HF Core Tweaks is missing or its expected signature is not present, the expanded slot module must remain a no-op.

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
