# Slots, Joints, and Attachment Maps

Historical reference notes extracted from the supplied HeroForge slot and numbered-joint datasets.

## Status

- Historical data snapshots, not current authoritative HeroForge catalogs.
- Useful for discovery, comparison, migration planning, slot expansion, attachment targeting, and bone-name lookup.
- Every key must be confirmed against the current runtime before live code depends on it.
- Do not generate unconditional slot mutations from these files.

## Source Snapshot

Files supplied in the GPT project:

- `Sourced_Slots(1).txt`
- `Free_Slots(1).txt`
- `Numbered_Joint_IDs__21_.txt`

Source hashes are recorded in `HISTORY/REFERENCES/README.md`.

## Sourced Slots Dataset

The sourced-slots snapshot contains:

- 366 entries;
- 366 unique slot keys;
- no duplicate slot keys in the supplied JSON;
- a source note pointing to `https://pastebin.com/wYGb6n83`.

Every entry contains:

- `disableFilters`
- `monsterGroup`
- `skel`
- `source`

Frequently used optional fields include:

- `display_name`
- `menu`
- `scheme_group`
- `clear_group`
- `addonJointParent`
- `subMenu`
- `monsterRootJoint`
- `target_slot`
- `partnerSlots`
- `renameJointsOnLoad`
- `anim_priority`
- `detach`
- `detachSkinned`
- `detachKit`
- `noMods`
- `monsterSize`
- `allowMonsters`
- `slotApplyForms`
- `keepTransforms`
- `linkedSlot`

### What the fields imply

- `source` identifies the art/source slot whose assets or behavior are reused.
- `target_slot` identifies the destination/parent slot relationship used for placement or compatibility.
- `skel` and `monsterGroup` constrain the skeleton/runtime family.
- `addonJointParent` and `monsterRootJoint` provide explicit attachment anchors.
- `partnerSlots` identifies paired slot behavior such as upper/lower teeth.
- `clear_group` and `scheme_group` describe replacement/color-group interactions.
- `detach`, `detachSkinned`, and `detachKit` indicate slot behavior that should not be treated as ordinary attached geometry.

These are data-model clues, not a complete specification of HeroForge's slot loader.

## Free Slots Dataset

The free-slots snapshot contains:

- 121 entries;
- 121 unique slot keys;
- no duplicate slot keys;
- every free-slot key is also present in the sourced-slots snapshot.

The free entries preserve only:

- `skel`
- `source`
- optional `target_slot`
- optional `detach`

All preserved field values match the corresponding sourced-slot entries exactly.

Interpretation:

- `Free_Slots` is a filtered subset of the full sourced-slot catalog, not an independent schema.
- The name `free` should not be treated as proof that a slot is safe, unoccupied, unlocked, writable, or currently accepted by HeroForge.
- Before using a candidate, inspect current `CK.Options.slots`, active character data, `doesConfigFit`, source/target compatibility, skeleton ownership, and current UI/catalog visibility.

## Useful Slot Families

The supplied sourced catalog includes substantial groups for:

- horns;
- tails;
- extra limbs;
- wings;
- teeth;
- earrings and facial piercings;
- fingers/rings;
- eyes;
- held and attached items;
- human body/clothing variants;
- creature/companion skeleton families.

This makes the snapshot useful for future:

- extra-slot experiments;
- slot-source remapping;
- decal or part slot swapping;
- creature attachment support;
- generalized attachment selectors;
- compatibility checks between human, alternate body, and creature skeletons.

## Numbered Joint Dataset

The numbered-joint snapshot contains:

- 641 non-separator joint lines;
- 639 unique numeric IDs;
- numeric ranges `0-427`, `1176-1204`, `1240-1260`, `1425/1427-1565`, `5000`, `5022`, `5033-5040`, and `5046-5056`;
- large intentional or historical gaps between those ranges.

The list covers:

- core human bind joints;
- body-shape and proportion joints;
- fingers, hands, arms, legs, feet, and posture helpers;
- item, side-item, base, tail, wing, horn, ear, tongue, and kitbash snap/attach joints;
- digitigrade leg/toe chains;
- clothing/skirt adjustment joints;
- hair chain joints.

### Confirmed data defects

Two numeric IDs are duplicated:

- `1204`
  - `main_legR_02_height_bot_1204_bind_jnt`
  - `main_legR_02_fat_bot_1204_bind_jnt`
- `1425`
  - `main_hornFrontL_offset_1425_bind_jnt`
  - `main_hornFrontL_attach_1425_bind_jnt`

Three entries omit the normal `_bind_jnt` suffix:

- `main_fingerR_01_04_0193`
- `main_armR_posture_0386`
- `main_armL_posture_0387`

Do not silently normalize these values. Preserve the source text and verify the actual runtime node names before using them.

## Cross-Reference Opportunities

The slot and joint datasets can be cross-referenced through fields such as:

- `addonJointParent`
- `monsterRootJoint`
- `monsterRootJointL`
- `source`
- `target_slot`
- `skel`
- `monsterGroup`

For human horn slots, the sourced data directly references numbered joints such as:

- `main_hornBackR_attach_1444_bind_jnt`
- `main_hornBackL_attach_1435_bind_jnt`

This confirms that the two datasets can help build a searchable slot-to-anchor map. It does not prove every slot uses an explicitly listed numbered joint or that the current runtime preserves the same IDs.

## Safe Use Rules

Before implementing slot or attachment behavior:

1. Read the current values from `CK.Options.slots` and the active character/runtime.
2. Compare the current slot record against the historical sourced snapshot.
3. Verify the target skeleton and monster group.
4. Confirm source/target/partner relationships.
5. Confirm the anchor joint exists in the current scene/skeleton.
6. Preserve tolerant lookup paths and delayed runtime readiness.
7. Treat missing JSON fields as normal because HeroForge lazily emits data.
8. Avoid unconditional catalog mutation.
9. Keep experimental slot injection separate from live Witch Dock modules until validated.

## Likely Future Uses

- Searchable developer reference for slot/source/target relationships.
- Runtime probe that compares historical entries against current `CK.Options.slots`.
- Attachment-point browser built on the scene outliner reference.
- Safer extra-slot and `doesConfigFit` experiments.
- Decal Slot Swapper compatibility research.
- Body/kitbash bone selector improvements.
- Creature and companion slot support.

## Related Files

- `HISTORY/BULLSHIT/DEBUG_UI_AND_INTERNALS.md`
- `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/DECAL_SLOT_SWAPPER.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/REFERENCES/README.md`
