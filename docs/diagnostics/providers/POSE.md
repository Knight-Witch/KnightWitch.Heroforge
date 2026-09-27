# Pose Diagnostic Provider v1 — Design Specification

**Provider ID:** `pose`  
**Provider schema version:** 1  
**Current tool scope:** Main / Extra figure designation swap  
**Owning runtime:** `tools/Pose.js`  
**Modes:** snapshot, failure  
**Comparison mode:** none in v1

## Scope clarification

The current Witch Dock Pose tab is **not** a generic skeletal-pose editor. Its implemented action swaps the Main character data with `children.baseItem` while preserving a specific set of main-owned/pinned fields.

Provider v1 therefore diagnoses that operation honestly. If the Pose tool later gains real bone-pose operations, add new sections/capabilities without pretending they already exist.

## Current mutation contract

`swapMainExtra()`:

- requires `children.baseItem`;
- swaps top-level keys that exist on both Main and Extra;
- excludes `children`, `config_id`, `usedCollections`, `environment`, `fx`;
- then reapplies Main-owned pinned state:
  - environment;
  - fx;
  - usedCollections;
  - parts: base / baseRim / label;
  - paint: baseRim;
  - paintByIntent: baseRim;
  - slider: initiative_base_width;
  - decals whose filter targets baseRim;
- commits through HeroForge UndoQueue + `tryLoadCharacter`.

## Immediate freeze

At capture T0 preserve only normalized structural evidence:

### Figure structure
- Main present;
- Extra `children.baseItem` present;
- top-level Main key inventory;
- top-level Extra key inventory;
- shared swappable key inventory;
- Main-only/Extra-only key inventories;
- deterministic hashes by relevant domain.

Do not export the raw domain bodies by default.

### Pinned state
For each pinned domain:
- present/absent;
- small normalized identity/scalar descriptor where useful;
- deterministic hash.

Pinned domains:
- environment;
- fx;
- usedCollections;
- parts.base/baseRim/label;
- paints.baseRim;
- paintByIntent.baseRim;
- sliders.initiative_base_width;
- baseRim-filtered decal records.

### Undo
- UndoQueue available;
- length/index;
- canUndo/canRedo;
- current entry present.

## Deterministic summary

- Extra figure present yes/no;
- shared swappable domain count;
- Main-only/Extra-only domain counts;
- pinned domain presence/hash summary;
- baseRim decal count/hash;
- UndoQueue state;
- last swap result;
- warning/error codes.

## Stable sections

### `state`

- tool/provider version/build;
- capability presence:
  - current-character source;
  - `children.baseItem`;
  - UndoQueue;
  - `tryLoadCharacter`;
- provider status/error.

### `figure-roles`

- Main key inventory;
- Extra key inventory;
- shared swappable keys;
- excluded keys;
- per-domain hashes for shared keys;
- structural presence differences.

Large domains are hash/key-summary only by default. This provider is not a disguised full-character export.

### `pinned-main`

Explicit invariants for Main-owned data:
- environment hash/presence;
- fx hash/presence;
- usedCollections hash/presence;
- base/baseRim/label part descriptors/hashes;
- baseRim paint descriptor/hash;
- baseRim paintByIntent descriptor/hash;
- initiative base width value;
- baseRim-filtered decal count/hashes.

### `undo`

- queue length/current index;
- canUndo/canRedo;
- latest swap pre/post index and commit result.

### `last-operation`

Retain for the latest user-initiated swap:
- timestamp;
- extra present;
- shared-key inventory/hash before;
- pinned invariants before;
- candidate generation result;
- load/commit result;
- shared-key inventory/hash after;
- pinned invariants after;
- exact changed-domain list.

No raw Main/Extra JSON.

### `failure-context`

Bounded failure/no-op facts:
- current character unavailable;
- Extra missing;
- no swappable shared keys;
- UndoQueue unavailable;
- `tryLoadCharacter` failed;
- commit failed;
- post-swap pinned invariant mismatch.

### `events`

- swap requested;
- candidate built;
- commit result;
- undo/redo observed.

## Warning/error codes

- `POSE_CURRENT_STATE_UNAVAILABLE`
- `POSE_EXTRA_FIGURE_MISSING`
- `POSE_SWAP_NO_SHARED_DOMAINS`
- `POSE_UNDO_UNAVAILABLE`
- `POSE_LOAD_FAILED`
- `POSE_COMMIT_FAILED`
- `POSE_PINNED_STATE_MISMATCH`

The `POSE_` prefix follows current tool ownership even though v1 functionality is figure swapping.

## Comparison modes

**None in v1.**

The swap itself is a full character mutation. Diagnostic capture does not perform it.

The retained last-operation record is effectively a safe user-triggered before/after audit of the actual action.

## Privacy / bounding

Do not include:
- full Main or Extra JSON;
- config IDs unless General/report evidence independently requires the save identity;
- arbitrary character names;
- whole environment/fx/usedCollections objects;
- unrelated child objects.

Use hashes/key inventories for large domains and exact values only for the narrow pinned fields needed to verify swap invariants.

## Implementation seam needed

Instrument the current tool with a bounded provider state/last-operation record. Prefer provider registration inside the tool once Diagnostics Core exists rather than exporting a raw current-character accessor.

## Acceptance

Pose provider v1 is capture-ready when:

- it truthfully represents Main/Extra swap rather than generic bone pose state;
- capture is read-only;
- swappable-domain structure and pinned invariants are independently visible;
- a failed/no-op swap has a retained reason;
- a successful swap can prove pinned Main state remained invariant without exporting full character JSON.
