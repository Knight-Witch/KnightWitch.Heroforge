# Bullshit Bible

Index of HeroForge engine weirdness, fragile discoveries, and recurring rules.

Use this file for high-level rules and links. Put detailed notes in `HISTORY/BULLSHIT/` topic files.

## Critical Rules

- Preserve known-good event timing.
- Do not replace `pointerup`/state-timing behavior with click-only handlers unless tested.
- Preserve delayed snapshots, retry loops, mutation handling, tolerant DOM detection, and scene-graph probing.
- Do not hard-code one path when working code probes multiple possible DOM or object paths.
- Treat working standalone Tampermonkey probes as canonical until migrated and confirmed.
- Do not treat HeroForge UI layout as stable. The same UI can present as right-side grouped, split side-by-side, or bottom compact layout.
- Do not assume Photo Booth output is normal DOM/CSS. The booth frame/effects can be baked into the WebGL render path.
- Persistent Booth is live/working. Do not put it back on the open PNG-capture todo list.

## High-Risk Current Topics

### Decals Scroll / Three UI Layouts

Detailed notes live in:
- `BULLSHIT/DOM_AND_LAYOUT.md`
- `BULLSHIT/DECALS_AND_TEXTURES.md`
- `BULLSHIT/TIMING_AND_STATE.md`

Current rule:
- Any Decals scroll/resize work must preserve detection for all three observed layouts: right-side grouped, side-by-side split, and bottom compact.
- Styling raw `#menuC` / `#menuD` globally is a known regression path.

### Photo Mode PNG Series Capture

Detailed notes live in:
- `BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `BULLSHIT/TIMING_AND_STATE.md`

Current status:
- Not solved.
- Goal is to mimic HeroForge's official high-quality spinny image-sequence exporter at higher resolution while preserving Photo Booth effects/overlays.
- Intended first target is conservative: 1024x1024, around 72 PNG frames, ZIP output, metadata, explicit arming, and validated frame dimensions.
- Prior probes captured useful signals but not a finished reliable pipeline.

## Topic Files

- `BULLSHIT/TIMING_AND_STATE.md`
- `BULLSHIT/DOM_AND_LAYOUT.md`
- `BULLSHIT/DECALS_AND_TEXTURES.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `BULLSHIT/KITBASHING_AND_BONES.md`
- `BULLSHIT/JSON_AND_LIBRARY.md`
- `BULLSHIT/MANIFEST_AND_LOADING.md`

## Backfill Queue

- Recover prior-chat notes for standalone Tampermonkey probes.
- Backfill any remaining PNG-series capture probes if new details surface.
- Document current bone detection timing/path behavior in deeper detail.
- Document remaining standalone migration candidates and their canonical status.
