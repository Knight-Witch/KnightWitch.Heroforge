# Bullshit Bible

Index of HeroForge engine weirdness, fragile discoveries, and recurring rules.

Use this file for high-level rules and links. Put detailed notes in `HISTORY/BULLSHIT/` topic files.

## Critical Rules

- Preserve known-good event timing.
- Do not replace `pointerup`/state-timing behavior with click-only handlers unless tested.
- Preserve delayed snapshots, retry loops, mutation handling, tolerant DOM detection, and scene-graph probing.
- Do not hard-code one path when working code probes multiple possible DOM or object paths.
- Treat working standalone Tampermonkey probes as canonical until migrated and confirmed.

## Topic Files

- `BULLSHIT/TIMING_AND_STATE.md`
- `BULLSHIT/DOM_AND_LAYOUT.md`
- `BULLSHIT/DECALS_AND_TEXTURES.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `BULLSHIT/KITBASHING_AND_BONES.md`
- `BULLSHIT/JSON_AND_LIBRARY.md`
- `BULLSHIT/MANIFEST_AND_LOADING.md`

## Backfill Queue

- Recover prior-chat notes for standalone Tampermonkey probes.
- Document current bone detection timing/path behavior.
- Document Decals scroll/slot layout behavior.
- Document HF Core Tweaks dependency for expanded decal slots.
- Document Booth render/export behaviors after review.
