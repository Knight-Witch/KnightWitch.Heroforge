# Historical Reference Source Manifest

This directory indexes external HeroForge source snapshots used to build durable project notes.

The raw files are intentionally not live-loaded, registered in `manifest.json`, or treated as current HeroForge contracts.

## Storage Decision

For this checkpoint, the repository stores:

- extracted technical findings;
- source filenames;
- source hashes;
- dataset statistics;
- archive inventory and provenance.

The large raw debug bundles and external script archive remain in the GPT project files rather than being copied into the live Witch Dock branch. This avoids placing obsolete executable userscripts beside production code while retaining enough provenance to identify or re-upload the exact source later.

If raw copies are added in a future archival pass, they should remain under `HISTORY/REFERENCES/`, use non-installing `.txt` filenames, and never be referenced by `manifest.json`.

## Debug Bundle Sources

### Enable Debug on HeroForge v0.1

- Project filename: `Enable Debug on HeroForge-0.1.txt`
- SHA-256: `680e26830db47919f981772e9fc9b13d6cc4c3ef9ee24ae7da4b1b1e649be0c8`
- Size: approximately 80 KiB
- Status: archived original / unstable historical diagnostic reference
- Notes: restores an archived HeroForge `DebugLive` webpack bundle and modifies debug/test permissions.

### Enable Debug on HeroForge v0.2

- Project filenames:
  - `Enable Debug on HeroForge-0.2.txt`
  - `Enable Debug on HeroForge-0.2(1).txt`
- The two supplied copies are byte-identical.
- SHA-256: `52c4a4795feca02ffdbc248eb4f90bd88f7bd83ad3003ed3a66d7a702ee77944`
- Size: approximately 81 KiB
- Status: partial compatibility patch / still unstable historical diagnostic reference
- Notes: blocks obsolete `test.ckb` and `grid.jpg` requests and changes one release-data path, but retains unresolved module-reference defects.

Distilled notes:

- `HISTORY/BULLSHIT/DEBUG_UI_AND_INTERNALS.md`

## Slot and Joint Sources

### Numbered Joint IDs

- Project filename: `Numbered_Joint_IDs__21_.txt`
- SHA-256: `eb6423f62af8fa2ebee3667526be2539ba4a97c3bab7ea0be30bb703e94b4459`
- Size: approximately 23 KiB
- Parsed non-separator rows: `641`
- Unique numeric IDs: `639`
- Known duplicate numeric IDs: `1204`, `1425`
- Entries without `_bind_jnt` suffix: `3`

### Sourced Slots

- Project filename: `Sourced_Slots(1).txt`
- SHA-256: `f22023036a4d5eee587e24d50cb5ea0244c87f17ccc74152034beec9cfb107e4`
- Size: approximately 139 KiB
- Parsed entries: `366`
- Unique slot keys: `366`
- Source note in file: `https://pastebin.com/wYGb6n83`

### Free Slots

- Project filename: `Free_Slots(1).txt`
- SHA-256: `655ac0d6bbfc5175c1bf503e8149fe7f3278c2513a1cae177ef4c1b0f51c2db2`
- Size: approximately 18 KiB
- Parsed entries: `121`
- Unique slot keys: `121`
- Relationship: exact-key subset of the sourced-slots snapshot; preserved field values match the corresponding sourced entries.

Distilled notes:

- `HISTORY/BULLSHIT/SLOTS_JOINTS_AND_ATTACHMENTS.md`

## Lob Public Script Archive Snapshot

- Project filename: `hf-scripts-public-master.zip`
- SHA-256: `89653b766a4f293a1a99a9034aaabf7ca790627c2d77b1e779aa54ee4a10d04f`
- Archive source snapshot date: `2026-07-19`
- Archive commit identifier embedded in ZIP comment/path metadata: `76e7cdd94a42ac8e4173682837cc8befa59db460`
- Status: external historical reference archive; not live Witch Dock code.

Archive inventory:

- `2000_kitbash_parts-0.4.user.js`
  - metadata version `0.8.6`
- `Advanced_Decal_Posing-0.2.user.js`
  - metadata version `0.99.1 (Clover Fix)`
- `Camera_Control_Modifier-2025-03-19.user.js`
  - metadata version `2025-03-20`
- `FullResDecals.user.js`
  - metadata version `0.78`
- `HF Core Tweaks.user.js`
  - metadata version `0.3.4.1`
- `I_love_extra_slots-0.2.user.js`
  - metadata version `0.6`
- `Persistent_Booth_Lighting-2025-03-20__1_.user.js`
  - metadata version `2025-03-20`
- `Shader_Fix_for_Photo_Booth-2025-03-20.user.js`
  - metadata version `2025-06-18`
- `Numbered_Joint_IDs__21_.txt`
- `hf_bodyLower_loRez_humanToes_normalMap2.webp`
- source `README.md`

Important filename/version mismatch rule:

- Do not infer script version from the archive filename alone.
- Use the userscript metadata header as the source version, then verify behavior separately.

## Usage Rules

- Historical snapshots are not proof of current runtime behavior.
- Do not run archived scripts alongside Witch Dock unless explicitly performing an isolated compatibility comparison.
- Do not migrate code without first comparing current HeroForge objects, event timing, state lifecycle, and working behavior.
- Preserve exact source hashes when replacing or re-uploading raw files.
- Record any future raw-file addition in `PRE_FLIGHT_Check.md` and `CHANGELOG.md`.
