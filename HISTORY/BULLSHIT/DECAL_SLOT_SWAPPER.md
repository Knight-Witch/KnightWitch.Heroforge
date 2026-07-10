# Decal Slot Swapper

## Status

Investigating / unresolved.

This file tracks the planned Decal Slot Swapper feature, including HeroForge decal JSON behavior, paint/material linkage, slot-region mapping, probe requirements, and implementation risks.

## Goal

Build a decal slot workflow that can swap, move, copy, and clear decals between slots without forcing users to manually reapply decals, copy coordinates, and repaint them.

Initial desired operations:

- Swap Slot A and Slot B.
- Move Slot A into Slot B and clear Slot A.
- Copy Slot A into Slot B.
- Clear a selected slot.

The operation must preserve the complete decal state, not only placement coordinates.

## Core Requirement

A decal slot must be treated as a compound bundle.

A complete slot bundle likely includes:

- Decal asset/source reference.
- Region/source target, such as face, upper body, lower body, head, torso, clothing, or other decal zones.
- Slot ID or slot index.
- Placement/transform data.
- Scale, rotation, flip/mirror, projection, or depth data if present.
- Visibility/enabled state.
- Paint/material/color assignments linked to that slot.
- Any expanded-slot metadata created by HF Core Tweaks or Witch Dock slot expansion.

The tool should not only swap coordinate payloads. Paints are stored elsewhere in HeroForge JSON, so the swapper must also transfer or rebind the paint/material entries that belong to each decal slot.

## Known HeroForge Behavior

HeroForge uses lazy JSON generation.

If the user has not edited a value, HeroForge may omit that value from the character JSON entirely. Absence does not necessarily mean empty, disabled, or default. It may mean HeroForge is relying on runtime/default state.

Observed implication:

- A decal slot may not have a full explicit JSON record until the user edits that slot.
- A decal paint/material assignment may not exist until the paint is changed.
- A slot can contain transform data while its paint data is still implicit/default.
- A slot can appear empty, partially populated, or fully populated depending on what the user touched.

The swapper must not assume both source and target slots already have complete JSON records.

## Slot States To Handle

The engine should distinguish at least these states:

- No explicit record exists: user never touched the slot.
- Empty explicit record exists: user touched or cleared the slot.
- Partial record exists: some transform/decal data exists, but paint/material data is omitted.
- Full edited record exists: decal, transform, projection, and paint/material data are explicit.

## Planned Implementation Model

Build a JSON-based mutation engine first. Do not rely on DOM click automation.

Proposed internal primitives:

- `extractSlotBundle(json, region, slot)`
  - Finds all data belonging to one decal slot.
  - Returns placement, decal identity, and linked paint/material references.

- `clearSlotBundle(json, region, slot)`
  - Removes or empties a slot and its linked references safely.

- `writeSlotBundle(json, region, slot, bundle)`
  - Writes a full decal bundle into a target slot.
  - Rebinds slot-indexed paint/material references when required.

- `swapSlotBundles(json, regionA, slotA, regionB, slotB)`
  - Extracts both bundles.
  - Clears both targets.
  - Writes B into A and A into B.
  - Reloads through the established CK/HeroForge JSON load path.

The same primitives should support swap, move, copy, and clear.

## Architecture Direction

Build this as a shared decal-slot mutation engine, then expose it through one or more UIs.

Preferred layers:

1. Core JSON mutation engine.
2. Witch Dock UI.
3. Optional native Decals UI injection.

### Witch Dock UI

Preferred initial visible tool location: a new `Decals` tab if the feature expands beyond a utility helper.

Possible section name:

`Decal Slot Tools`

Initial controls:

- Region selector.
- Source slot selector.
- Target slot selector.
- Swap button.
- Move button.
- Copy button.
- Clear button.
- Status/warnings for empty, partial, or unresolved slots.

### Native UI Injection

Native HeroForge Decals UI injection should come after the core engine is proven.

Potential use:

- Add small slot-action controls near the native Decals slot grid.
- Let users operate from the native UI if preferred.
- Use the same shared engine as Witch Dock.

Native injection is more fragile because HeroForge has multiple Decals layouts:

- Right-side grouped menu.
- Right/left split UI.
- Bottom compact/mobile/zoomed layout.

## Probe Strategy

The next step is schema discovery, not implementation.

Because HeroForge lazily omits untouched values, create a sacrificial diagnostic mini that forces decal JSON to materialize.

### Fully Materialized Diagnostic Mini

For every relevant decal region:

- Apply decals to every available slot.
- Use distinct decal assets for at least the first few slots per region if practical.
- Assign a distinct paint/color/material to each slot.
- Slightly modify transform values so slot-specific transform data is explicit.

The actual colors, decals, and coordinates are not important. They are diagnostic markers used to identify how HeroForge nests regions, slots, transforms, decal IDs, and paint references.

### Sparse Diagnostic Mini

Create a second test case with gaps:

- Slot A populated.
- Slot B untouched.
- Slot C populated.
- One populated slot with default paint.
- One populated slot with edited paint.
- One populated slot cleared after being edited.

This exposes the difference between absent/default, explicit empty, partial, and full records.

## Probe Sequence

Recommended capture order:

1. Fresh mini with no decals touched.
2. Apply one decal to Slot A without editing paint.
3. Edit Slot A transform only.
4. Edit Slot A paint only.
5. Apply decals to Slot B and Slot C with different colors/materials.
6. Clear Slot B.
7. Reapply Slot B with default paint.
8. Fully populate all slots in each available region with distinct paint markers.
9. Export/read current JSON after each major state.
10. Diff the JSON paths.

## Schema Questions To Answer

The diffing phase must determine:

- Where decal regions live in JSON.
- Whether regions are keyed by name, numeric ID, item ID, body zone, or internal path.
- Whether slot IDs are array indexes, explicit keys, or predictable labels.
- Where decal source/asset IDs live.
- Where transform values live.
- Where projection/target metadata lives.
- Where paints/materials/colors live.
- Whether paint references point to slots, decal instances, assets, or shared material entries.
- Whether multiple slots can share the same paint/material object.
- How HeroForge represents an untouched slot.
- How HeroForge represents a cleared slot.
- How expanded slots differ from native slots, if at all.

## Paint / Material Linkage Risk

The primary risk is paint/material linkage.

Naive coordinate copying does not carry paints because paints are stored elsewhere in the JSON.

The tool must determine whether paints are linked by:

- Slot index.
- Decal instance ID.
- Decal asset ID.
- Region + slot pair.
- Parallel array position.
- Shared material key.

If paints are shared objects, the swapper should prefer moving/rebinding references rather than mutating shared paint definitions directly. Mutating a shared paint object could unintentionally alter other decals or model parts that reference the same paint.

## Undo / Reload Risk

The mutation should follow existing proven Witch Dock patterns:

- Read current character JSON from CK/current HeroForge state.
- Mutate a cloned JSON object.
- Push/reload through the established CK/HeroForge load path.
- Preserve undo/redo behavior where possible.
- Avoid UI desync from active selected decal caches.

Do not build the first implementation as DOM-click automation.

## Open Implementation Questions

- Should the first release only allow swaps within one region, or should cross-region swaps be allowed if JSON structure supports it?
- Should copy clone paint references or create distinct material entries?
- What should happen if source has implicit/default paint and target has explicit paint?
- What should happen if target is an untouched missing slot?
- Does HeroForge require explicit empty records when clearing populated slots?
- Does the UI need a materialization/normalize operation before swapping?
- How do expanded slots interact with native slots and HF Core Tweaks slot records?

## Initial Recommendation

Build in this order:

1. Generate diagnostic JSON files.
2. Map region/slot/paint paths.
3. Write a private console prototype that swaps two known slots in one region.
4. Confirm paint transfer.
5. Confirm undo/reload behavior.
6. Move the logic into a shared internal engine.
7. Expose a Witch Dock Decals tab.
8. Add optional native UI injection only after the core engine is stable.
